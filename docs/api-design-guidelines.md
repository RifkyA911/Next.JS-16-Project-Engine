# API Design Guidelines

## Overview

NovaStack follows RESTful API design principles with consistent naming conventions, standardized response formats, and comprehensive error handling. These guidelines ensure API consistency, developer experience, and maintainability.

## REST Naming Conventions

### Resource Naming

**Use plural nouns for resources:**

```
✅ Good:
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id

❌ Bad:
GET    /api/user
GET    /api/getUsers
GET    /api/user/:id
```

### URL Structure

**Use kebab-case for URLs:**

```
✅ Good:
/api/user-settings
/api/workspaces/:id/members

❌ Bad:
/api/userSettings
/api/workspaces/:id/Members
```

### Nested Resources

**Nest resources logically:**

```
✅ Good:
/api/workspaces/:workspaceId/posts
/api/workspaces/:workspaceId/members/:memberId

❌ Bad:
/api/posts?workspaceId=:id
/api/members?workspaceId=:id&memberId=:id
```

## HTTP Methods

### Standard Methods

| Method | Usage | Idempotent | Safe |
|--------|-------|-----------|------|
| GET | Retrieve resource | Yes | Yes |
| POST | Create resource | No | No |
| PUT | Replace resource | Yes | No |
| PATCH | Update resource | No | No |
| DELETE | Delete resource | Yes | No |

### Method Guidelines

**GET** - Retrieve data:
```typescript
export async function GET(req: NextRequest) {
  const users = await prisma.user.findMany();
  return Response.json(users);
}
```

**POST** - Create resource:
```typescript
export async function POST(req: NextRequest) {
  const body = await req.json();
  const user = await prisma.user.create({ data: body });
  return Response.json(user, { status: 201 });
}
```

**PUT** - Replace resource:
```typescript
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const user = await prisma.user.update({
    where: { id: params.id },
    data: body,
  });
  return Response.json(user);
}
```

**PATCH** - Partial update:
```typescript
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const user = await prisma.user.update({
    where: { id: params.id },
    data: body,
  });
  return Response.json(user);
}
```

**DELETE** - Remove resource:
```typescript
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.user.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
```

## DTO Rules

### Request DTOs

**Use Zod schemas for validation:**

```typescript
import { z } from 'zod';

export const CreateUserDto = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});

export type CreateUserInput = z.infer<typeof CreateUserDto>;
```

**Validate in API route:**

```typescript
export async function POST(req: NextRequest) {
  const body = await req.json();
  const validated = CreateUserDto.parse(body);
  
  const user = await prisma.user.create({ data: validated });
  return Response.json(user, { status: 201 });
}
```

### Response DTOs

**Define response shapes:**

```typescript
export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**Transform database models:**

```typescript
function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
```

## Validation Rules

### Input Validation

**Always validate input:**

```typescript
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateUserDto.parse(body);
    // Process validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

### Common Validations

```typescript
export const validationRules = {
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
  name: z.string().min(2).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  url: z.string().url('Invalid URL'),
};
```

## Pagination Standard

### Query Parameters

```typescript
interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}
```

### Implementation

```typescript
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { [sort]: order },
    }),
    prisma.user.count(),
  ]);
  
  return Response.json({
    data: users.map(toUserResponse),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
```

## Error Format

### Standard Error Response

```typescript
interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
  code?: string;
}
```

### HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |

### Error Examples

```typescript
// Validation Error
return Response.json(
  {
    error: 'Validation failed',
    message: 'Invalid input data',
    details: zodError.errors,
    code: 'VALIDATION_ERROR',
  },
  { status: 400 }
);

// Not Found
return Response.json(
  {
    error: 'Resource not found',
    message: `User with id ${id} does not exist`,
    code: 'NOT_FOUND',
  },
  { status: 404 }
);

// Forbidden
return Response.json(
  {
    error: 'Access denied',
    message: 'You do not have permission to access this resource',
    code: 'FORBIDDEN',
  },
  { status: 403 }
);
```

## Success Format

### Standard Success Response

```typescript
interface SuccessResponse<T> {
  data: T;
  message?: string;
}
```

### Examples

```typescript
// Single resource
return Response.json({
  data: toUserResponse(user),
  message: 'User created successfully',
});

// Multiple resources
return Response.json({
  data: users.map(toUserResponse),
  pagination: { /* ... */ },
});

// No data (success message only)
return Response.json({
  message: 'Operation completed successfully',
});
```

## Authentication Header

### Bearer Token

```typescript
// Request
GET /api/users
Authorization: Bearer <token>

// Implementation
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const token = authHeader.substring(7);
  const session = await verifyToken(token);
  
  if (!session) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }
  
  // Proceed with request
}
```

### Session Cookie

```typescript
// Session-based auth (NextAuth)
export async function GET(req: NextRequest) {
  const session = await auth();
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Proceed with request
}
```

## Versioning Strategy

### URL Versioning

```
/api/v1/users
/api/v2/users
```

### Header Versioning

```
GET /api/users
Accept: application/vnd.api+json; version=1
```

### Implementation

```typescript
// URL versioning
export async function GET(req: NextRequest, { params }: { params: { version: string } }) {
  const version = params.version;
  
  if (version === 'v1') {
    return handleV1Request(req);
  } else if (version === 'v2') {
    return handleV2Request(req);
  }
  
  return Response.json({ error: 'Unsupported version' }, { status: 400 });
}
```

## Rate Limiting

### Rate Limit Headers

```typescript
export async function GET(req: NextRequest) {
  const identifier = req.headers.get('x-forwarded-for') || 'unknown';
  const { success, limit, remaining, reset } = await rateLimiter.limit(identifier);
  
  if (!success) {
    return Response.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }
  
  // Proceed with request
  return Response.json(data, {
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
  });
}
```

## CORS Configuration

### CORS Headers

```typescript
export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
```

## Filtering and Sorting

### Filtering

```typescript
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const role = searchParams.get('role');
  
  const where: any = {};
  if (status) where.status = status;
  if (role) where.role = role;
  
  const users = await prisma.user.findMany({ where });
  return Response.json({ data: users });
}
```

### Sorting

```typescript
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  
  const users = await prisma.user.findMany({
    orderBy: { [sort]: order },
  });
  
  return Response.json({ data: users });
}
```

## Future GraphQL Compatibility

### Schema-First Approach

Design APIs with GraphQL in mind:

```typescript
// Current REST
GET /api/users/:id/posts

// Future GraphQL
query {
  user(id: "123") {
    posts {
      id
      title
    }
  }
}
```

### Resource Relationships

Include relationship data:

```typescript
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      memberships: {
        include: {
          workspace: true,
        },
      },
    },
  });
  
  return Response.json({ data: user });
}
```

## Best Practices

### 1. Use Proper HTTP Status Codes

```typescript
// Bad: Always return 200
return Response.json({ error: 'Not found' }, { status: 200 });

// Good: Use appropriate status
return Response.json({ error: 'Not found' }, { status: 404 });
```

### 2. Validate All Input

```typescript
// Bad: No validation
const user = await prisma.user.create({ data: body });

// Good: Validate input
const validated = CreateUserDto.parse(body);
const user = await prisma.user.create({ data: validated });
```

### 3. Use Consistent Response Format

```typescript
// Bad: Inconsistent formats
return Response.json(user);
return Response.json({ success: true, user });
return Response.json({ data: user, status: 'ok' });

// Good: Consistent format
return Response.json({ data: toUserResponse(user) });
```

### 4. Handle Errors Gracefully

```typescript
// Bad: Throw raw errors
throw new Error('Database error');

// Good: Handle and format errors
try {
  const user = await prisma.user.create({ data });
  return Response.json({ data: user });
} catch (error) {
  logger.error('User creation failed', error);
  return Response.json(
    { error: 'Failed to create user' },
    { status: 500 }
  );
}
```

### 5. Include Metadata for Paginated Responses

```typescript
return Response.json({
  data: users,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
});
```

## References

- [REST API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [OpenAPI Specification](https://swagger.io/specification/)
- [GraphQL](https://graphql.org/)
