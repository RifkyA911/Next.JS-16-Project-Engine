# Development Guide

## Overview

This guide covers the development workflow for NovaStack, including setup, coding standards, testing, and contribution guidelines.

## Prerequisites

- Node.js 18+ or Bun latest
- Git
- PostgreSQL 15+
- Redis 7+ (optional, for caching)
- Docker/Podman (optional, for containerized development)

## Getting Started

### Clone Repository

```bash
git clone <repository-url>
cd novastack
```

### Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Using npm
npm install
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Set required variables:
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
# - DATABASE_URL
# - REDIS_URL (optional)
```

### Database Setup

```bash
# Run migrations
bunx prisma migrate dev

# Seed database (optional)
bunx prisma db seed
```

### Start Development Server

```bash
# Start development server
bun dev

# Or with npm
npm run dev
```

Open http://localhost:3000 in your browser.

## Development Workflow

### Branch Strategy

```
main
  ├── develop
  │   ├── feature/*
  │   ├── bugfix/*
  │   └── hotfix/*
```

### Creating a Feature Branch

```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Make changes
git add .
git commit -m "feat: add your feature"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: maintenance
```

### Code Review Process

1. Create pull request to `develop`
2. Ensure all tests pass
3. Request review from team
4. Address feedback
5. Merge after approval

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- No `any` types
- Explicit return types for functions
- Use interfaces for object shapes
- Use type aliases for unions

```typescript
// Good
interface User {
  id: string;
  email: string;
  name: string | null;
}

function getUser(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

// Bad
function getUser(id: any): any {
  return prisma.user.findUnique({ where: { id } });
}
```

### Component Structure

```typescript
// src/components/features/users/UserCard.tsx
'use client';

import { User } from '@/types/user';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <div className="p-4 border rounded">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && <button onClick={() => onEdit(user)}>Edit</button>}
      {onDelete && <button onClick={() => onDelete(user)}>Delete</button>}
    </div>
  );
}
```

### File Naming

- Components: PascalCase (`UserCard.tsx`)
- Utilities: kebab-case (`auth-utils.ts`)
- Hooks: camelCase with use prefix (`useAuth.ts`)
- Types: kebab-case (`user.types.ts`)

### Import Order

```typescript
// 1. External libraries
import { useState } from 'react';
import { z } from 'zod';

// 2. Internal imports (absolute)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

// 3. Relative imports
import { formatDate } from '../utils/format';
```

## Testing

### Running Tests

```bash
# Run all tests
bun test

# Run unit tests
bun run test:unit

# Run integration tests
bun run test:integration

# Run E2E tests
bun run test:e2e

# Run with coverage
bun run test:coverage
```

### Writing Tests

```typescript
// tests/unit/user.service.test.ts
import { describe, it, expect } from 'vitest';
import { UserService } from '@/services/user.service';

describe('UserService', () => {
  it('should create user', async () => {
    const service = new UserService();
    const user = await service.create({
      email: 'test@example.com',
      name: 'Test User',
    });
    
    expect(user.email).toBe('test@example.com');
  });
});
```

## Database Operations

### Using Prisma

```typescript
import { prisma } from '@/lib/db';

// Create
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'User Name',
  },
});

// Read
const user = await prisma.user.findUnique({
  where: { id: userId },
});

// Update
const user = await prisma.user.update({
  where: { id: userId },
  data: { name: 'Updated Name' },
});

// Delete
await prisma.user.delete({
  where: { id: userId },
});
```

### Migrations

```bash
# Create migration
bunx prisma migrate dev --name add_new_field

# Apply migration
bunx prisma migrate deploy

# Reset database (dev only)
bunx prisma migrate reset
```

## API Development

### Creating API Routes

```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CreateUserDto } from '@/types/user';

export async function GET(req: NextRequest) {
  const users = await prisma.user.findMany();
  return NextResponse.json({ data: users });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validated = CreateUserDto.parse(body);
  
  const user = await prisma.user.create({ data: validated });
  return NextResponse.json({ data: user }, { status: 201 });
}
```

### Adding Rate Limiting

```typescript
import { createRateLimitMiddleware, apiLimiter } from '@/lib/rate-limiter';

export async function POST(req: NextRequest) {
  const rateLimit = await createRateLimitMiddleware(apiLimiter)(req);
  if (rateLimit) return rateLimit;
  
  // Proceed with request
}
```

## Component Development

### Server Components

```typescript
// src/app/dashboard/users/page.tsx
import { prisma } from '@/lib/db';
import { UserList } from '@/components/features/users/UserList';

export default async function UsersPage() {
  const users = await prisma.user.findMany();
  return <UserList users={users} />;
}
```

### Client Components

```typescript
'use client';

import { useState } from 'react';

export function UserForm() {
  const [name, setName] = useState('');
  
  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </form>
  );
}
```

## Debugging

### Using VS Code Debugger

1. Set breakpoints in code
2. Press F5 or click "Run and Debug"
3. Select "Next.js: debug server-side"
4. Navigate to trigger breakpoint

### Console Logging

```typescript
import { logger } from '@/lib/logger';

logger.info('User created', { userId: user.id });
logger.error('Failed to create user', error);
logger.debug('Request data', data);
```

## Performance Optimization

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false,
});
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/profile.jpg"
  alt="Profile"
  width={500}
  height={500}
  priority
/>
```

### Caching

```typescript
import { cache } from '@/lib/cache';

export async function getUsers() {
  const cached = await cache.get('users');
  if (cached) return cached;
  
  const users = await prisma.user.findMany();
  await cache.set('users', users, 300);
  
  return users;
}
```

## Common Tasks

### Adding a New Page

```bash
# Create page file
touch src/app/dashboard/new-page/page.tsx

# Add content
export default async function NewPage() {
  return <div>New Page</div>;
}
```

### Adding a New API Route

```bash
# Create API route
touch src/app/api/new-route/route.ts

# Add handler
export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Hello' });
}
```

### Adding a New Component

```bash
# Create component
touch src/components/features/new-feature/NewComponent.tsx

# Add component
export function NewComponent() {
  return <div>New Component</div>;
}
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check PostgreSQL status
pg_isready

# Restart PostgreSQL
brew services restart postgresql
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
bun install
```

## Best Practices

### 1. Read Documentation First

Before making changes, read:
- README.md
- docs/architecture.md
- docs/engineering-principles.md

### 2. Write Tests

Write tests for new features:
- Unit tests for business logic
- Integration tests for API routes
- E2E tests for critical user flows

### 3. Follow Patterns

Follow existing patterns in the codebase:
- Use existing component structure
- Follow naming conventions
- Use established utilities

### 4. Keep It Simple

Avoid over-engineering:
- Start simple, refactor if needed
- Don't add abstractions prematurely
- Follow YAGNI principle

### 5. Document Changes

Update documentation when:
- Adding new features
- Changing architecture
- Modifying database schema

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
