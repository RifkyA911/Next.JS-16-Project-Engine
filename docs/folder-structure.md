# Folder Structure

## Overview

NovaStack follows a **feature-first** organization with clear separation of concerns. The structure is designed to be intuitive, scalable, and maintainable.

## Root Structure

```
novastack/
├── .env                      # Environment variables (local)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── .github/                  # GitHub configuration
│   └── workflows/            # CI/CD workflows
├── components.json           # Shadcn/ui configuration
├── docs/                     # Documentation
├── eslint.config.mjs         # ESLint configuration
├── logs/                     # Application logs
├── next.config.ts            # Next.js configuration
├── node_modules/            # Dependencies
├── package.json              # Project dependencies
├── playwright.config.ts      # Playwright E2E test configuration
├── postcss.config.mjs        # PostCSS configuration
├── prisma/                   # Prisma ORM
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── public/                   # Static assets
│   ├── images/              # Images
│   ├── fonts/               # Fonts
│   └── icons/               # Icons
├── src/                      # Source code
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── tests/                    # Test files
```

## Source Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth route group
│   │   ├── login/           # Login page
│   │   ├── register/        # Register page
│   │   └── layout.tsx       # Auth layout
│   ├── (dashboard)/        # Dashboard route group
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── users/          # User management
│   │   ├── settings/       # Settings pages
│   │   └── layout.tsx      # Dashboard layout
│   ├── api/                # API routes
│   │   ├── auth/           # Auth endpoints
│   │   ├── users/          # User endpoints
│   │   └── trpc/           # tRPC (future)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── error.tsx           # Error boundary
│   ├── not-found.tsx       # 404 page
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── ui/                # Base UI components (Shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── organisms/         # Complex composed components
│   │   ├── sidebar.tsx
│   │   ├── navbar.tsx
│   │   └── ...
│   ├── features/         # Feature-specific components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── cms/
│   └── examples/         # Example/demo components
├── lib/                   # Core utilities and services
│   ├── auth.ts           # NextAuth configuration
│   ├── auth-utils.ts     # Auth helper functions
│   ├── db.ts             # Database client (Prisma)
│   ├── logger.ts         # Logging system
│   ├── rate-limiter.ts   # Rate limiting
│   ├── jwt.ts            # JWT utilities
│   ├── cache.ts          # Cache service
│   ├── ai/               # AI integration
│   │   ├── provider.ts   # AI provider interface
│   │   └── openai.ts     # OpenAI implementation
│   └── utils.ts          # General utilities
├── middlewares/          # Next.js middleware
│   ├── auth.ts          # Authentication middleware
│   ├── role.ts          # RBAC middleware
│   └── logger.ts        # Request logging
├── types/               # TypeScript type definitions
│   ├── auth.ts          # Auth types
│   ├── user.ts          # User types
│   ├── cms.ts           # CMS types
│   └── index.ts         # Type exports
├── hooks/               # Custom React hooks
│   ├── use-auth.ts      # Auth hook
│   ├── use-user.ts      # User hook
│   └── ...
├── store/               # State management (Zustand)
│   ├── auth.store.ts    # Auth state
│   ├── ui.store.ts      # UI state
│   └── ...
├── config/              # Configuration files
│   ├── constants.ts     # Application constants
│   ├── features.ts      # Feature flags
│   └── ...
├── services/            # Business logic services
│   ├── auth.service.ts  # Auth service
│   ├── user.service.ts  # User service
│   └── ...
└── utils/              # Helper functions
    ├── validation.ts    # Validation schemas
    ├── formatting.ts    # Formatting utilities
    └── ...
```

## Documentation Structure

```
docs/
├── product-overview.md              # Product overview
├── product-requirement-document.md  # PRD
├── system-design-description.md     # SDD
├── architecture.md                  # Architecture overview
├── folder-structure.md              # This file
├── development-guide.md             # Development workflow
├── deployment.md                    # Deployment strategies
├── docker-podman.md                 # Container runtime
├── authentication-flow.md          # Auth flow details
├── authorization-rbac.md            # RBAC details
├── multi-tenancy.md                 # Multi-tenant design
├── cms-module.md                    # CMS architecture
├── ai-integration.md                # AI integration
├── caching-strategy.md              # Caching strategy
├── database-design.md               # Database design
├── api-design-guidelines.md         # API guidelines
├── testing-strategy.md              # Testing strategy
├── engineering-principles.md         # Engineering principles
├── roadmap.md                       # Product roadmap
└── environment-variables.md         # Environment variables
```

## Test Structure

```
tests/
├── e2e/                    # E2E tests (Playwright)
│   ├── auth.spec.ts       # Auth flow tests
│   ├── dashboard.spec.ts  # Dashboard tests
│   └── ...
├── unit/                  # Unit tests
│   ├── auth.test.ts      # Auth unit tests
│   ├── utils.test.ts      # Utility tests
│   └── ...
└── integration/          # Integration tests
    ├── api.test.ts       # API integration tests
    └── ...
```

## Folder Philosophy

### Feature-First Organization

Code is organized by business features rather than technical layers:

**Benefits:**
- Easier to find related code
- Better context for developers
- Supports feature flags
- Easier to extract to microservices

**Example:**
```
src/features/
  auth/
    components/
    hooks/
    services/
    types/
  dashboard/
    components/
    hooks/
    services/
    types/
```

### Shared Utilities

Common utilities are kept in `src/lib/`:

- Database client
- Authentication helpers
- Logging system
- Cache service
- AI integration

### Component Organization

**UI Components** (`src/components/ui/`):
- Base, reusable components
- No business logic
- Styled with Tailwind CSS
- From Shadcn/ui

**Organisms** (`src/components/organisms/`):
- Complex composed components
- Multiple UI components combined
- Business logic included

**Feature Components** (`src/components/features/`):
- Feature-specific components
- Organized by feature
- Co-located with feature logic

### API Routes

API routes are organized by domain:

```
src/app/api/
  auth/          # Authentication endpoints
  users/         # User management
  dashboard/     # Dashboard data
  cms/           # CMS endpoints
  ai/            # AI endpoints
```

### Types

Type definitions are organized by domain:

```
src/types/
  auth.ts        # Auth-related types
  user.ts        # User-related types
  cms.ts         # CMS-related types
  index.ts       # Type exports
```

## File Naming Conventions

### Components

- **PascalCase**: `UserProfile.tsx`, `DashboardLayout.tsx`
- **Client components**: Explicit `"use client"` directive
- **Server components**: Default (no directive)

### Utilities

- **kebab-case**: `auth-utils.ts`, `rate-limiter.ts`
- **camelCase for exports**: `getUserById`, `formatDate`

### API Routes

- **kebab-case**: `/api/auth/login`, `/api/users/list`
- **Route files**: `route.ts` for standard API routes

### Types

- **kebab-case files**: `user.types.ts`, `auth.types.ts`
- **PascalCase interfaces**: `UserProfile`, `AuthSession`

### Hooks

- **camelCase with use prefix**: `useAuth`, `useUserData`
- **kebab-case files**: `use-auth.ts`, `use-user-data.ts`

## Route Organization

### Route Groups

Route groups use parentheses to organize without affecting URL:

```
app/
  (auth)/           # /login, /register
    login/
    register/
  (dashboard)/      # /dashboard/users, /dashboard/settings
    dashboard/
      users/
      settings/
```

### Layouts

Layouts provide shared UI:

- `layout.tsx` - Root layout (HTML, body, global styles)
- `(auth)/layout.tsx` - Auth-specific layout
- `(dashboard)/layout.tsx` - Dashboard layout with sidebar

## Best Practices

### 1. Co-location

Keep related files together:

```
src/features/auth/
  components/
    LoginForm.tsx
    RegisterForm.tsx
  hooks/
    useAuth.ts
  services/
    auth.service.ts
  types/
    auth.types.ts
```

### 2. Index Files

Use index files for clean imports:

```typescript
// src/features/auth/index.ts
export * from './components';
export * from './hooks';
export * from './services';
export * from './types';

// Usage
import { LoginForm, useAuth } from '@/features/auth';
```

### 3. Barrel Exports

Export from central locations:

```typescript
// src/types/index.ts
export * from './auth';
export * from './user';
export * from './cms';
```

### 4. Absolute Imports

Use path aliases configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

### 5. Minimal Depth

Avoid deep nesting:

```
❌ Bad:
src/features/auth/components/forms/login/form.tsx

✅ Good:
src/features/auth/components/LoginForm.tsx
```

## Adding New Features

### Step 1: Create Feature Folder

```bash
mkdir -p src/features/your-feature/{components,hooks,services,types}
```

### Step 2: Add Components

```typescript
// src/features/your-feature/components/YourComponent.tsx
export function YourComponent() {
  return <div>Your feature</div>;
}
```

### Step 3: Add Hooks

```typescript
// src/features/your-feature/hooks/use-your-feature.ts
export function useYourFeature() {
  // Hook logic
}
```

### Step 4: Add Services

```typescript
// src/features/your-feature/services/your-feature.service.ts
export class YourFeatureService {
  async getData() {
    // Service logic
  }
}
```

### Step 5: Add Types

```typescript
// src/features/your-feature/types/your-feature.types.ts
export interface YourFeatureData {
  id: string;
  name: string;
}
```

### Step 6: Add API Routes

```typescript
// src/app/api/your-feature/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ data: [] });
}
```

### Step 7: Add Pages

```typescript
// src/app/your-feature/page.tsx
export default async function YourFeaturePage() {
  return <YourComponent />;
}
```

## Migration Path

As the application grows, the structure supports:

1. **Feature Extraction**: Extract features to separate packages
2. **Microservices**: Move features to independent services
3. **Monorepo**: Organize features in a monorepo structure

## References

- [Next.js File Structure](https://nextjs.org/docs/app/building-your-application/routing)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
