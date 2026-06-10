# Authorization & RBAC

## Overview

NovaStack implements a comprehensive Role-Based Access Control (RBAC) system with granular permissions, role inheritance, and flexible authorization checks. The system is designed to be multi-tenant aware and easily extensible.

## Architecture

### RBAC Components

```
RBAC System
├── Roles
│   ├── System Roles (Administrator, User, Guest)
│   ├── Custom Roles
│   └── Role Hierarchy
├── Permissions
│   ├── Resource-Based (users, posts, settings)
│   ├── Action-Based (read, write, delete, admin)
│   └── Permission Assignment
├── Authorization
│   ├── Permission Checks
│   ├── Route Protection
│   └── API Protection
└── Middleware
    ├── Role Middleware
    ├── Permission Middleware
    └── Tenant Context
```

## Core Concepts

### Roles

Roles are collections of permissions assigned to users.

#### System Roles

- **Administrator**: Full access to all resources
- **User**: Standard access to workspace resources
- **Guest**: Read-only access to public resources

#### Custom Roles

Users can create custom roles with specific permission sets.

### Permissions

Permissions are granular access control units.

#### Permission Structure

```typescript
interface Permission {
  id: string;
  resource: string;  // e.g., 'users', 'posts', 'settings'
  action: string;    // e.g., 'read', 'write', 'delete', 'admin'
  description?: string;
}
```

#### Common Permissions

| Resource | Actions |
|----------|---------|
| users | read, write, delete, admin |
| posts | read, write, delete, publish |
| settings | read, write |
| members | read, write, delete, invite |
| workspace | read, write, admin |

## Implementation

### Permission Service

```typescript
// src/services/permission.service.ts
export class PermissionService {
  async hasPermission(
    userId: string,
    workspaceId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    // Get user membership
    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        workspaceId,
        status: 'ACTIVE',
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
    
    if (!membership) return false;
    
    // Owner has all permissions
    if (membership.role === 'OWNER') return true;
    
    // Check role permissions
    const hasPermission = membership.role.permissions.some(
      p => p.resource === resource && p.action === action
    );
    
    return hasPermission;
  }
  
  async hasAnyPermission(
    userId: string,
    workspaceId: string,
    permissions: { resource: string; action: string }[]
  ): Promise<boolean> {
    for (const perm of permissions) {
      if (await this.hasPermission(userId, workspaceId, perm.resource, perm.action)) {
        return true;
      }
    }
    return false;
  }
  
  async hasAllPermissions(
    userId: string,
    workspaceId: string,
    permissions: { resource: string; action: string }[]
  ): Promise<boolean> {
    for (const perm of permissions) {
      if (!(await this.hasPermission(userId, workspaceId, perm.resource, perm.action))) {
        return false;
      }
    }
    return true;
  }
}
```

### Role Middleware

```typescript
// src/middlewares/role.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const roleForbiddenRoutes = {
  administrator: [], // Full access
  user: ['/dashboard/users', '/dashboard/settings/security'],
  guest: ['/dashboard'],
};

export async function roleMiddleware(req: NextRequest) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  
  const userRole = session.user.role;
  const pathname = req.nextUrl.pathname;
  
  const forbiddenRoutes = roleForbiddenRoutes[userRole as keyof typeof roleForbiddenRoutes] || [];
  
  if (forbiddenRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return NextResponse.next();
}
```

### Permission Middleware

```typescript
// src/middlewares/permission.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PermissionService } from '@/services/permission.service';

const permissionService = new PermissionService();

export async function requirePermission(
  req: NextRequest,
  resource: string,
  action: string
) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const workspaceId = req.headers.get('x-workspace-id');
  
  if (!workspaceId) {
    return NextResponse.json({ error: 'Workspace context required' }, { status: 400 });
  }
  
  const hasPermission = await permissionService.hasPermission(
    session.user.id,
    workspaceId,
    resource,
    action
  );
  
  if (!hasPermission) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  return NextResponse.next();
}
```

### Permission Decorator

```typescript
// src/lib/permissions.ts
export function requirePermission(resource: string, action: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const req = args[0] as NextRequest;
      const session = await auth();
      
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const workspaceId = req.headers.get('x-workspace-id');
      const hasPermission = await permissionService.hasPermission(
        session.user.id,
        workspaceId,
        resource,
        action
      );
      
      if (!hasPermission) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}
```

## Usage

### API Route Protection

```typescript
// src/app/api/users/route.ts
import { requirePermission } from '@/lib/permissions';

export async function GET(req: NextRequest) {
  const permissionCheck = await requirePermission(req, 'users', 'read');
  if (permissionCheck) return permissionCheck;
  
  const users = await prisma.user.findMany();
  return Response.json(users);
}

export async function POST(req: NextRequest) {
  const permissionCheck = await requirePermission(req, 'users', 'write');
  if (permissionCheck) return permissionCheck;
  
  const body = await req.json();
  const user = await prisma.user.create({ data: body });
  return Response.json(user);
}
```

### Server Component Protection

```typescript
// src/app/dashboard/users/page.tsx
import { auth } from '@/lib/auth';
import { PermissionService } from '@/services/permission.service';
import { redirect } from 'next/navigation';

export default async function UsersPage() {
  const session = await auth();
  const workspaceId = session?.user.workspaceId;
  
  const permissionService = new PermissionService();
  const hasPermission = await permissionService.hasPermission(
    session.user.id,
    workspaceId,
    'users',
    'read'
  );
  
  if (!hasPermission) {
    redirect('/dashboard');
  }
  
  return <UsersList />;
}
```

### Client Component Protection

```typescript
// src/components/users/UserActions.tsx
'use client';

import { usePermissions } from '@/hooks/use-permissions';

export function UserActions({ userId }: { userId: string }) {
  const { hasPermission } = usePermissions();
  
  const canDelete = hasPermission('users', 'delete');
  const canEdit = hasPermission('users', 'write');
  
  return (
    <div>
      {canEdit && <button>Edit</button>}
      {canDelete && <button>Delete</button>}
    </div>
  );
}
```

## Permission Hooks

### usePermissions Hook

```typescript
// src/hooks/use-permissions.ts
export function usePermissions() {
  const { data: session } = useSession();
  const workspaceId = session?.user.workspaceId;
  
  const hasPermission = useCallback(
    async (resource: string, action: string): Promise<boolean> => {
      if (!session || !workspaceId) return false;
      
      const response = await fetch('/api/permissions/check', {
        method: 'POST',
        body: JSON.stringify({ resource, action }),
      });
      
      const data = await response.json();
      return data.hasPermission;
    },
    [session, workspaceId]
  );
  
  return { hasPermission };
}
```

## Role Management

### Create Custom Role

```typescript
// src/app/api/roles/route.ts
export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json();
  const { name, description, permissions } = body;
  
  // Check if user can create roles
  const canCreateRoles = await permissionService.hasPermission(
    session.user.id,
    session.user.workspaceId,
    'roles',
    'create'
  );
  
  if (!canCreateRoles) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Create role
  const role = await prisma.role.create({
    data: {
      name,
      description,
      isSystem: false,
      permissions: {
        connect: permissions.map((id: string) => ({ id })),
      },
    },
  });
  
  return Response.json(role);
}
```

### Assign Role to User

```typescript
// src/app/api/memberships/route.ts
export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json();
  const { userId, workspaceId, roleId } = body;
  
  // Check if user can assign roles
  const canAssignRoles = await permissionService.hasPermission(
    session.user.id,
    workspaceId,
    'members',
    'write'
  );
  
  if (!canAssignRoles) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Update membership role
  const membership = await prisma.membership.update({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
    data: { roleId },
  });
  
  return Response.json(membership);
}
```

## Resource-Based Authorization

### Ownership-Based Access

```typescript
// src/services/authorization.service.ts
export class AuthorizationService {
  async canAccessResource(
    userId: string,
    workspaceId: string,
    resourceType: string,
    resourceId: string,
    action: string
  ): Promise<boolean> {
    // Check general permission first
    const hasGeneralPermission = await permissionService.hasPermission(
      userId,
      workspaceId,
      resourceType,
      action
    );
    
    if (hasGeneralPermission) return true;
    
    // Check ownership for write/delete actions
    if (action === 'write' || action === 'delete') {
      const resource = await this.getResource(resourceType, resourceId);
      
      if (resource?.userId === userId) {
        return true;
      }
    }
    
    return false;
  }
  
  private async getResource(type: string, id: string) {
    switch (type) {
      case 'posts':
        return prisma.post.findUnique({ where: { id } });
      case 'media':
        return prisma.media.findUnique({ where: { id } });
      default:
        return null;
    }
  }
}
```

### Attribute-Based Access Control (ABAC)

```typescript
// src/services/abac.service.ts
export class ABACService {
  async evaluatePolicy(
    userId: string,
    workspaceId: string,
    policy: Policy
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const membership = await prisma.membership.findFirst({
      where: { userId, workspaceId },
    });
    
    const context = {
      user,
      membership,
      workspaceId,
    };
    
    return this.evaluateRules(policy.rules, context);
  }
  
  private evaluateRules(rules: Rule[], context: any): boolean {
    return rules.every(rule => {
      return this.evaluateCondition(rule.condition, context);
    });
  }
  
  private evaluateCondition(condition: string, context: any): boolean {
    // Implement condition evaluation logic
    // Example: "user.role == 'ADMIN'"
    return true;
  }
}
```

## Audit Logging

### Permission Denial Logging

```typescript
// src/services/audit.service.ts
export class AuditService {
  async logPermissionDenial(data: {
    userId: string;
    workspaceId: string;
    resource: string;
    action: string;
    ipAddress?: string;
  }) {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: 'permission_denied',
        resource: `${data.resource}:${data.action}`,
        metadata: {
          workspaceId: data.workspaceId,
          ipAddress: data.ipAddress,
        },
      },
    });
  }
}
```

## Best Practices

### 1. Always Check Permissions

```typescript
const hasPermission = await permissionService.hasPermission(
  userId,
  workspaceId,
  'users',
  'delete'
);

if (!hasPermission) {
  throw new Error('Forbidden');
}
```

### 2. Use Middleware for Route Protection

```typescript
export async function GET(req: NextRequest) {
  const permissionCheck = await requirePermission(req, 'users', 'read');
  if (permissionCheck) return permissionCheck;
  
  // Proceed with request
}
```

### 3. Log Permission Denials

```typescript
if (!hasPermission) {
  await auditService.logPermissionDenial({
    userId,
    workspaceId,
    resource,
    action,
    ipAddress: req.headers.get('x-forwarded-for'),
  });
}
```

### 4. Use Principle of Least Privilege

```typescript
// Give users only the permissions they need
const role = await prisma.role.create({
  data: {
    name: 'Content Editor',
    permissions: {
      connect: [
        { resource_action: { resource: 'posts', action: 'write' } },
        { resource_action: { resource: 'media', action: 'write' } },
      ],
    },
  },
});
```

### 5. Cache Permission Checks

```typescript
const cacheKey = `permission:${userId}:${workspaceId}:${resource}:${action}`;
const cached = await cache.get(cacheKey);

if (cached !== null) {
  return cached;
}

const hasPermission = await permissionService.hasPermission(...);
await cache.set(cacheKey, hasPermission, 300); // 5 minutes
```

## Testing

### Unit Test for Permission Check

```typescript
// tests/unit/permission.service.test.ts
describe('PermissionService', () => {
  it('should grant permission to administrator', async () => {
    const hasPermission = await permissionService.hasPermission(
      adminUserId,
      workspaceId,
      'users',
      'delete'
    );
    
    expect(hasPermission).toBe(true);
  });
  
  it('should deny permission to user without permission', async () => {
    const hasPermission = await permissionService.hasPermission(
      regularUserId,
      workspaceId,
      'users',
      'delete'
    );
    
    expect(hasPermission).toBe(false);
  });
});
```

### Integration Test for Route Protection

```typescript
// tests/integration/protected-route.test.ts
describe('Protected Routes', () => {
  it('should deny access without permission', async () => {
    const response = await fetch('/api/users', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${regularUserToken}`,
      },
    });
    
    expect(response.status).toBe(403);
  });
});
```

## Future Enhancements

### Attribute-Based Access Control (ABAC)

Extend RBAC with attribute-based policies:

```typescript
const policy = {
  rules: [
    {
      condition: "user.department == 'Marketing' && resource.type == 'campaign'",
      effect: 'allow',
    },
  ],
};
```

### Time-Based Permissions

Permissions that expire after a certain time:

```typescript
const permission = await prisma.permission.create({
  data: {
    resource: 'reports',
    action: 'read',
    expiresAt: new Date(Date.now() + 86400000), // 24 hours
  },
});
```

### Delegated Permissions

Allow users to delegate their permissions to others:

```typescript
await prisma.delegation.create({
  data: {
    fromUserId: managerId,
    toUserId: employeeId,
    permissions: ['reports:read', 'reports:write'],
    expiresAt: new Date(Date.now() + 604800000), // 7 days
  },
});
```

## References

- [NIST RBAC Standard](https://csrc.nist.gov/projects/role-based-access-control)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [Principle of Least Privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege)
