# Authentication Flow

## Overview

NovaStack implements a comprehensive authentication system using NextAuth.js with credentials provider, reCAPTCHA integration, rate limiting, and secure session management.

## Architecture

### Authentication Components

```
Authentication System
├── NextAuth.js Configuration
│   ├── Credentials Provider
│   ├── Session Management
│   └── JWT Strategy
├── Security Layers
│   ├── reCAPTCHA (v3/v2)
│   ├── Rate Limiting
│   ├── Password Hashing (bcrypt)
│   └── CSRF Protection
├── Middleware
│   ├── Auth Middleware
│   ├── Session Validation
│   └── Route Protection
└── Features
    ├── Login/Logout
    ├── Registration
    ├── Password Reset
    └── Remember Me
```

## Configuration

### NextAuth.js Setup

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { prisma } from '@/lib/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        recaptchaToken: { label: 'reCAPTCHA Token', type: 'text' },
      },
      async authorize(credentials) {
        // Validate reCAPTCHA
        const recaptchaValid = await validateRecaptcha(credentials.recaptchaToken);
        if (!recaptchaValid) {
          throw new Error('reCAPTCHA validation failed');
        }
        
        // Find user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }
        
        // Verify password
        const valid = await compare(credentials.password, user.password);
        if (!valid) {
          throw new Error('Invalid credentials');
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
```

## reCAPTCHA Integration

### reCAPTCHA v3 (Primary)

```typescript
// src/lib/recaptcha.ts
import { verifyRecaptchaResponse } from '@/lib/recaptcha-utils';

export async function validateRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_V3_SECRET_KEY;
  
  if (!secret) {
    console.warn('reCAPTCHA v3 secret not configured');
    return true; // Allow if not configured
  }
  
  const response = await verifyRecaptchaResponse(token, secret);
  
  // Score threshold (0.5 is recommended)
  return response.success && response.score >= 0.5;
}
```

### reCAPTCHA v2 Fallback

```typescript
// src/lib/recaptcha.ts
export async function validateRecaptchaV2(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_V2_SECRET_KEY;
  
  if (!secret) {
    return false;
  }
  
  const response = await verifyRecaptchaResponse(token, secret);
  return response.success;
}
```

### Automatic Fallback

```typescript
// src/lib/recaptcha.ts
export async function validateRecaptchaWithFallback(token: string): Promise<boolean> {
  try {
    // Try v3 first
    const v3Valid = await validateRecaptcha(token);
    if (v3Valid) return true;
  } catch (error) {
    console.warn('reCAPTCHA v3 failed, trying v2', error);
  }
  
  // Fallback to v2
  try {
    return await validateRecaptchaV2(token);
  } catch (error) {
    console.error('reCAPTCHA v2 also failed', error);
    return false;
  }
}
```

## Rate Limiting

### Auth Rate Limiter

```typescript
// src/lib/rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create rate limiter for auth endpoints
export const authLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 requests per 15 minutes
  analytics: true,
});

export async function checkAuthRateLimit(identifier: string): Promise<boolean> {
  const { success } = await authLimiter.limit(identifier);
  return success;
}
```

### Rate Limit Middleware

```typescript
// src/middlewares/auth-rate-limit.ts
import { checkAuthRateLimit } from '@/lib/rate-limiter';

export async function authRateLimitMiddleware(req: NextRequest) {
  const identifier = req.headers.get('x-forwarded-for') || 'unknown';
  const allowed = await checkAuthRateLimit(identifier);
  
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }
  
  return NextResponse.next();
}
```

## Password Management

### Password Hashing

```typescript
// src/lib/auth-utils.ts
import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash);
}
```

### Password Validation

```typescript
// src/lib/auth-utils.ts
import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export function validatePassword(password: string): boolean {
  return passwordSchema.safeParse(password).success;
}
```

## Session Management

### Session Configuration

```typescript
// src/lib/auth.ts
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // Update session every 24 hours
}
```

### Session Validation

```typescript
// src/lib/auth-utils.ts
export async function validateSession(session: Session | null): Promise<boolean> {
  if (!session) return false;
  
  // Check if session is expired
  if (session.expires && new Date(session.expires) < new Date()) {
    return false;
  }
  
  return true;
}
```

### Session Refresh

```typescript
// src/lib/auth.ts
callbacks: {
  async jwt({ token, user, trigger, session }) {
    if (trigger === 'update') {
      return { ...token, ...session };
    }
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }
    return token;
  },
}
```

## Registration Flow

### Registration Endpoint

```typescript
// src/app/api/auth/register/route.ts
import { hashPassword } from '@/lib/auth-utils';
import { validatePassword } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';
import { validateRecaptchaWithFallback } from '@/lib/recaptcha';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, recaptchaToken } = body;
    
    // Validate reCAPTCHA
    const recaptchaValid = await validateRecaptchaWithFallback(recaptchaToken);
    if (!recaptchaValid) {
      return Response.json({ error: 'reCAPTCHA validation failed' }, { status: 400 });
    }
    
    // Validate password
    if (!validatePassword(password)) {
      return Response.json({ error: 'Password does not meet requirements' }, { status: 400 });
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return Response.json({ error: 'User already exists' }, { status: 400 });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER',
      },
    });
    
    return Response.json({ success: true, userId: user.id });
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ error: 'Registration failed' }, { status: 500 });
  }
}
```

## Login Flow

### Login Sequence Diagram

```
User
  │
  │ 1. Enter credentials
  ▼
Login Form
  │
  │ 2. Get reCAPTCHA token
  ▼
reCAPTCHA Service
  │
  │ 3. Return token
  ▼
Login Form
  │
  │ 4. Submit credentials + token
  ▼
API: /api/auth/callback/credentials
  │
  │ 5. Check rate limit
  ▼
Rate Limiter
  │
  │ 6. Validate reCAPTCHA
  ▼
reCAPTCHA Service
  │
  │ 7. Validate credentials
  ▼
Database
  │
  │ 8. Verify password
  ▼
bcrypt
  │
  │ 9. Create session
  ▼
NextAuth
  │
  │ 10. Set secure cookie
  ▼
Browser
  │
  │ 11. Redirect to dashboard
  ▼
Dashboard
```

### Login Implementation

```typescript
// src/app/auth/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        recaptchaToken,
        redirect: false,
      });
      
      if (result?.error) {
        setError(result.error);
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      setError('Login failed');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <ReCAPTCHA onChange={setRecaptchaToken} />
      {error && <div className="error">{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
}
```

## Logout Flow

### Logout Implementation

```typescript
// src/app/auth/logout/page.tsx
import { signOut } from '@/lib/auth';

export async function GET() {
  await signOut({ redirectTo: '/' });
}
```

## Password Reset Flow

### Password Reset Request

```typescript
// src/app/api/auth/reset-password/request/route.ts
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;
  
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    // Don't reveal if user exists
    return Response.json({ success: true });
  }
  
  // Generate reset token
  const token = generateResetToken();
  const expires = new Date(Date.now() + 3600000); // 1 hour
  
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expires,
    },
  });
  
  // Send email
  await sendPasswordResetEmail(user.email, token);
  
  return Response.json({ success: true });
}
```

### Password Reset Confirmation

```typescript
// src/app/api/auth/reset-password/confirm/route.ts
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token, password } = body;
  
  const reset = await prisma.passwordReset.findUnique({
    where: { token },
    include: { user: true },
  });
  
  if (!reset || reset.expires < new Date()) {
    return Response.json({ error: 'Invalid or expired token' }, { status: 400 });
  }
  
  // Validate new password
  if (!validatePassword(password)) {
    return Response.json({ error: 'Password does not meet requirements' }, { status: 400 });
  }
  
  // Hash new password
  const hashedPassword = await hashPassword(password);
  
  // Update user password
  await prisma.user.update({
    where: { id: reset.user.id },
    data: { password: hashedPassword },
  });
  
  // Delete reset token
  await prisma.passwordReset.delete({
    where: { id: reset.id },
  });
  
  return Response.json({ success: true });
}
```

## Middleware Protection

### Auth Middleware

```typescript
// src/middleware.ts
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard');
  const isOnAuthPage = req.nextUrl.pathname.startsWith('/auth');
  
  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  
  if (isOnAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Security Best Practices

### 1. Always Hash Passwords

```typescript
const hashedPassword = await hashPassword(password);
```

### 2. Use Secure Cookies

```typescript
cookies.set('session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60,
});
```

### 3. Implement Rate Limiting

```typescript
const allowed = await checkAuthRateLimit(identifier);
if (!allowed) {
  return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
}
```

### 4. Validate reCAPTCHA

```typescript
const recaptchaValid = await validateRecaptchaWithFallback(token);
if (!recaptchaValid) {
  throw new Error('reCAPTCHA validation failed');
}
```

### 5. Use Environment Variables for Secrets

```env
NEXTAUTH_SECRET=your-secret-here
RECAPTCHA_V3_SECRET_KEY=your-v3-secret
RECAPTCHA_V2_SECRET_KEY=your-v2-secret
```

## Testing

### E2E Login Test

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/auth/login');
  
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');
  
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
});
```

### Unit Test for Password Hashing

```typescript
// tests/unit/auth-utils.test.ts
import { hashPassword, verifyPassword } from '@/lib/auth-utils';

test('password hashing', async () => {
  const password = 'testPassword123';
  const hash = await hashPassword(password);
  
  expect(hash).not.toBe(password);
  expect(await verifyPassword(password, hash)).toBe(true);
  expect(await verifyPassword('wrong', hash)).toBe(false);
});
```

## References

- [NextAuth.js Documentation](https://next-auth.js.org)
- [reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
