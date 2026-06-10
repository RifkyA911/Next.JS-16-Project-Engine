# Architecture

## Overview

NovaStack follows a **Clean Architecture** pattern with a **feature-first** organization. The architecture is designed to be scalable, maintainable, and testable while leveraging modern Next.js capabilities.

## Architectural Principles

### 1. Server-First Approach

Prefer Server Components over Client Components for optimal performance:

- **Server Components**: Render on the server, reduce client-side JavaScript
- **Client Components**: Only for interactivity (state, effects, browser APIs)
- **Progressive Enhancement**: Start with server, add client where needed

### 2. Feature-First Organization

Code is organized by business features rather than technical layers:

```
src/
  features/
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

### 3. Type Safety

TypeScript strict mode enforced throughout:

- No `any` types
- Explicit return types
- Zod for runtime validation
- Type-safe database access (Prisma)

### 4. Separation of Concerns

Clear boundaries between layers:

- **Presentation**: UI components and pages
- **Application**: Business logic and services
- **Domain**: Core business entities
- **Infrastructure**: External integrations

## Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                         │
│  (Pages, Components, Layouts - Next.js App Router)           │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Application Layer                          │
│  (Services, Hooks, Business Logic, State Management)         │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      Domain Layer                            │
│  (Entities, Value Objects, Domain Services)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   Infrastructure Layer                      │
│  (Database, Cache, External APIs, File Storage)             │
└─────────────────────────────────────────────────────────────┘
```

## Presentation Layer

### Pages (App Router)

Next.js 16 App Router provides file-based routing with Server Components:

```typescript
// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");
  
  return <DashboardView data={await getDashboardData()} />;
}
```

### Components

**Server Components** (default):
- No client-side JavaScript
- Direct database access
- Better performance

**Client Components** (explicit):
- Interactivity (state, effects)
- Browser APIs
- Event handlers

```typescript
// Server Component
export async function UserList() {
  const users = await db.user.findMany();
  return <div>{users.map(user => <UserCard key={user.id} user={user} />)}</div>;
}

// Client Component
"use client";
export function UserCard({ user }: { user: User }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? '❤️' : '🤍'}</button>;
}
```

### Layouts

Shared UI across routes:

```typescript
// src/app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

## Application Layer

### Services

Business logic encapsulation:

```typescript
// src/features/auth/services/auth.service.ts
export class AuthService {
  async login(credentials: LoginDto): Promise<Session> {
    const user = await this.validateCredentials(credentials);
    const session = await this.createSession(user);
    return session;
  }
  
  private async validateCredentials(credentials: LoginDto) {
    // Validation logic
  }
}
```

### Hooks

Custom React hooks for reusable logic:

```typescript
// src/features/dashboard/hooks/use-dashboard-data.ts
export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => fetch('/api/dashboard').then(r => r.json()),
  });
}
```

### State Management

- **Server State**: TanStack Query (React Query)
- **Client State**: Zustand
- **Form State**: React Hook Form

## Domain Layer

### Entities

Core business objects:

```typescript
// src/features/auth/types/user.entity.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
```

### Value Objects

Immutable objects with no identity:

```typescript
export interface Email {
  value: string;
  isValid(): boolean;
}
```

## Infrastructure Layer

### Database (Prisma)

Type-safe database access:

```typescript
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Usage
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
});
```

### Cache (Redis)

Caching layer for performance:

```typescript
// src/lib/cache.service.ts
export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }
  
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await redis.set(key, JSON.stringify(value));
    if (ttl) await redis.expire(key, ttl);
  }
}
```

### External APIs

Abstraction for external services:

```typescript
// src/lib/ai/ai-provider.interface.ts
export interface AIProvider {
  generateText(prompt: string): Promise<string>;
  streamText(prompt: string): AsyncGenerator<string>;
}
```

## Data Flow

### Server Component Data Flow

```
Request → Middleware → Server Component → Service → Database → Response
```

### Client Component Data Flow

```
User Action → Hook → API Route → Service → Database → Response → Hook Update
```

### API Route Data Flow

```
API Request → Middleware → Validation → Service → Database → Response
```

## Security Architecture

### Authentication Flow

```
Client → Credentials → API → Validation → Session Creation → Cookie Set
```

### Authorization Flow

```
Request → Middleware → Session Check → Role Check → Permission Check → Allow/Deny
```

### Security Layers

1. **Network Layer**: TLS, CORS, Security Headers
2. **Application Layer**: Rate Limiting, Input Validation
3. **Authentication Layer**: JWT, Session Management
4. **Authorization Layer**: RBAC, Permission Checks
5. **Data Layer**: Encryption, Access Control

## Caching Strategy

### Cache Hierarchy

```
Browser Cache → CDN Cache → Redis Cache → Database
```

### Cache Patterns

- **Cache-Aside**: Application manages cache
- **Write-Through**: Cache updated on write
- **Write-Behind**: Cache updated asynchronously
- **Refresh-Ahead**: Proactive cache refresh

## Multi-Tenancy Architecture

### Tenant Isolation

- **Data Isolation**: Row-level security
- **Resource Isolation**: Scoped queries
- **Session Isolation**: Tenant context in session

### Tenant Context

```typescript
interface TenantContext {
  tenantId: string;
  workspaceId: string;
  organizationId: string;
}
```

## Error Handling

### Error Boundaries

```typescript
// src/app/error.tsx
export default function Error({ error }: { error: Error }) {
  return <div>Error: {error.message}</div>;
}
```

### Global Error Handler

```typescript
// src/lib/error-handler.ts
export function handleError(error: unknown) {
  logger.error(error);
  // Send to monitoring service
}
```

## Logging Architecture

### Structured Logging

```typescript
// src/lib/logger.ts
import { pino } from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
  },
});
```

### Log Levels

- **error**: Critical errors
- **warn**: Warning conditions
- **info**: Informational messages
- **debug**: Debugging information

## Performance Optimization

### Code Splitting

Automatic with Next.js:
- Route-based splitting
- Dynamic imports
- Component-level splitting

```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
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

### Bundle Optimization

- Tree shaking
- Minification
- Compression

## Testing Architecture

### Test Pyramid

```
E2E Tests (Playwright)
    ↓
Integration Tests
    ↓
Unit Tests
```

### Test Structure

```
tests/
  e2e/
    auth.spec.ts
    dashboard.spec.ts
  unit/
    auth.service.test.ts
    user.utils.test.ts
```

## Deployment Architecture

### Container Strategy

```
Docker/Podman
  ├── Next.js App
  ├── PostgreSQL
  └── Redis
```

### Environment Strategy

- **Local**: Docker Compose
- **Staging**: Container orchestration
- **Production**: Container orchestration with scaling

## Scalability Strategy

### Horizontal Scaling

- Stateless application
- Session storage in Redis
- Load balancer support
- Database connection pooling

### Vertical Scaling

- Efficient resource usage
- Code splitting
- Caching strategy
- Query optimization

## Future Architecture Evolution

### Microservices Migration Path

1. **Modular Monolith**: Clear module boundaries
2. **Service Extraction**: Extract independent services
3. **Event-Driven**: Introduce message queue
4. **Full Microservices**: Independent deployments

### GraphQL Support

Future support for GraphQL:
- Schema-first approach
- Type-safe resolvers
- Federation support

## Technology Stack Rationale

### Next.js 16

- Latest App Router with React 19
- Server Components for performance
- Built-in optimization
- Strong community support

### TypeScript

- Type safety
- Better IDE support
- Catch errors at compile time
- Improved maintainability

### PostgreSQL

- ACID compliance
- Complex queries support
- JSON support
- Strong ecosystem

### Redis

- Fast in-memory storage
- Caching capabilities
- Session storage
- Pub/sub support

## Best Practices

### Code Organization

- Feature-first structure
- Clear naming conventions
- Consistent file structure
- Minimal file depth

### Performance

- Server Components first
- Code splitting
- Caching strategy
- Image optimization

### Security

- Input validation
- Output encoding
- Parameterized queries
- Security headers

### Testing

- Test coverage > 80%
- Test business logic
- Test critical paths
- E2E for user flows

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
