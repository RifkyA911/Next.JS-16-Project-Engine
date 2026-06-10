# Multi-Tenancy

## Overview

NovaStack implements a complete multi-tenant architecture supporting organizations, workspaces, teams, and granular access control. This design enables SaaS applications with data isolation, collaboration features, and scalable tenant management.

## Core Concepts

### Organization

The top-level entity representing a company or organization.

**Characteristics:**
- One organization can have multiple workspaces
- Organization-level settings and branding
- Billing and subscription management (future)
- Organization-wide policies

**Use Cases:**
- Company with multiple departments
- Agency managing multiple client projects
- Enterprise with separate business units

### Workspace

The primary tenant unit for data isolation.

**Characteristics:**
- Each workspace has isolated data
- Workspace-specific settings
- Team members belong to workspaces
- Resource scoping per workspace

**Use Cases:**
- Individual projects
- Client projects (for agencies)
- Department-specific workspaces

### Team

Collaborative groups within workspaces.

**Characteristics:**
- Teams organize members within a workspace
- Team-specific permissions
- Team activity feeds
- Team-based resource sharing

**Use Cases:**
- Development team
- Marketing team
- Project team

### Membership

User association with workspaces.

**Characteristics:**
- Users can belong to multiple workspaces
- Membership roles (Owner, Admin, Member, Guest)
- Membership status (Active, Pending, Suspended)
- Invitation workflow

**Use Cases:**
- User invited to join workspace
- User requests access to workspace
- User removed from workspace

### Role

Permission groups for access control.

**Characteristics:**
- System roles (Administrator, User, Guest)
- Custom roles (future)
- Role inheritance (future)
- Role-based permissions

**Use Cases:**
- Administrator with full access
- Member with limited access
- Guest with read-only access

### Permission

Granular access control units.

**Characteristics:**
- Resource-based (users, posts, settings)
- Action-based (read, write, delete, admin)
- Permission assignment to roles
- Permission checks on all operations

**Use Cases:**
- Allow read access to posts
- Allow write access to own posts
- Allow delete access to own posts only

## Architecture

### Data Model

```
Organization
  └── Workspace
        ├── Membership (User + Role)
        ├── Team
        │   └── Membership (User + Role)
        └── Resources (Posts, Media, etc.)
```

### Tenant Isolation

All tenant-specific resources include `workspaceId`:

```typescript
// Example: Post entity
interface Post {
  id: string;
  workspaceId: string;  // Tenant isolation
  title: string;
  content: string;
  // ...
}
```

### Tenant Context

Tenant context is maintained throughout the request lifecycle:

```typescript
interface TenantContext {
  userId: string;
  workspaceId: string;
  organizationId: string;
  role: MembershipRole;
}
```

## Implementation

### Workspace Management

#### Create Workspace

```typescript
// POST /api/workspaces
export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json();
  
  const workspace = await prisma.workspace.create({
    data: {
      organizationId: body.organizationId,
      name: body.name,
      slug: generateSlug(body.name),
    },
  });
  
  // Create owner membership
  await prisma.membership.create({
    data: {
      userId: session.user.id,
      workspaceId: workspace.id,
      role: 'OWNER',
      status: 'ACTIVE',
    },
  });
  
  return Response.json(workspace);
}
```

#### List Workspaces

```typescript
// GET /api/workspaces
export async function GET(req: NextRequest) {
  const session = await auth();
  
  const memberships = await prisma.membership.findMany({
    where: {
      userId: session.user.id,
      status: 'ACTIVE',
    },
    include: {
      workspace: true,
    },
  });
  
  return Response.json(memberships.map(m => m.workspace));
}
```

### Membership Management

#### Invite User

```typescript
// POST /api/workspaces/:id/memberships
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const workspaceId = params.id;
  const body = await req.json();
  
  // Check permissions
  await checkPermission(workspaceId, 'memberships', 'create');
  
  // Create pending membership
  const membership = await prisma.membership.create({
    data: {
      userId: body.userId,
      workspaceId,
      role: body.role,
      status: 'PENDING',
      invitedBy: session.user.id,
    },
  });
  
  // Send invitation email
  await sendInvitationEmail(body.email, workspaceId);
  
  return Response.json(membership);
}
```

#### Accept Invitation

```typescript
// POST /api/memberships/:id/accept
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const membershipId = params.id;
  
  const membership = await prisma.membership.update({
    where: { id: membershipId },
    data: {
      status: 'ACTIVE',
      joinedAt: new Date(),
    },
  });
  
  return Response.json(membership);
}
```

### Team Management

#### Create Team

```typescript
// POST /api/workspaces/:id/teams
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const workspaceId = params.id;
  const body = await req.json();
  
  const team = await prisma.team.create({
    data: {
      workspaceId,
      name: body.name,
    },
  });
  
  return Response.json(team);
}
```

### Workspace Switching

#### Switch Workspace

```typescript
// POST /api/workspaces/switch
export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json();
  const workspaceId = body.workspaceId;
  
  // Verify membership
  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
      workspaceId,
      status: 'ACTIVE',
    },
  });
  
  if (!membership) {
    return Response.json({ error: 'Not a member' }, { status: 403 });
  }
  
  // Update session context
  await updateSessionContext(session.user.id, workspaceId);
  
  return Response.json({ success: true });
}
```

#### Get Current Workspace Context

```typescript
// GET /api/workspace/context
export async function GET(req: NextRequest) {
  const session = await auth();
  const context = await getTenantContext(session.user.id);
  
  return Response.json(context);
}
```

## Tenant Isolation

### Database-Level Isolation

All queries include workspace filtering:

```typescript
// Bad: No tenant isolation
const posts = await prisma.post.findMany();

// Good: Tenant isolation
const posts = await prisma.post.findMany({
  where: {
    workspaceId: currentWorkspaceId,
  },
});
```

### Middleware-Based Isolation

```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const session = await auth();
  const workspaceId = req.headers.get('x-workspace-id');
  
  if (workspaceId) {
    // Verify user has access to workspace
    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        workspaceId,
        status: 'ACTIVE',
      },
    });
    
    if (!membership) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Add workspace context to request
    req.headers.set('x-workspace-context', JSON.stringify({
      workspaceId,
      role: membership.role,
    }));
  }
  
  return NextResponse.next();
}
```

### Service-Level Isolation

```typescript
// services/post.service.ts
export class PostService {
  async getPosts(workspaceId: string) {
    return prisma.post.findMany({
      where: { workspaceId },
    });
  }
  
  async createPost(workspaceId: string, data: CreatePostDto) {
    return prisma.post.create({
      data: {
        ...data,
        workspaceId,
      },
    });
  }
}
```

## Access Control

### Role-Based Access Control (RBAC)

```typescript
// services/rbac.service.ts
export class RBACService {
  async hasPermission(
    userId: string,
    workspaceId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
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
}
```

### Permission Checks

```typescript
// API route example
export async function POST(req: NextRequest) {
  const session = await auth();
  const workspaceId = req.headers.get('x-workspace-id')!;
  
  const hasPermission = await rbacService.hasPermission(
    session.user.id,
    workspaceId,
    'posts',
    'create'
  );
  
  if (!hasPermission) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Proceed with operation
}
```

## Collaboration Features

### Activity Feed

```typescript
// Track user activities
export async function logActivity(
  userId: string,
  workspaceId: string,
  action: string,
  metadata?: any
) {
  await prisma.activityLog.create({
    data: {
      userId,
      workspaceId,
      action,
      metadata,
    },
  });
}
```

### Team Activity

```typescript
// Get team activity feed
export async function getTeamActivity(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      memberships: {
        include: {
          user: true,
        },
      },
    },
  });
  
  const userIds = team.memberships.map(m => m.userId);
  
  return prisma.activityLog.findMany({
    where: {
      userId: { in: userIds },
      workspaceId: team.workspaceId,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}
```

## Security Considerations

### Data Leakage Prevention

- Always filter by workspaceId
- Never expose cross-workspace data
- Validate workspace access on every request
- Use row-level security (future)

### Permission Validation

- Check permissions before every operation
- Use middleware for route protection
- Implement permission caching
- Log permission denials

### Invitation Security

- Validate invitation tokens
- Expire invitations after 7 days
- Limit invitation rate
- Require authentication to accept

## Performance Optimization

### Database Indexing

```prisma
model Membership {
  userId      String
  workspaceId String
  status      MembershipStatus
  
  @@index([userId, workspaceId])
  @@index([workspaceId, status])
}
```

### Caching Strategy

```typescript
// Cache workspace context
export async function getWorkspaceContext(workspaceId: string) {
  const cacheKey = `workspace:${workspaceId}`;
  const cached = await cache.get(cacheKey);
  
  if (cached) return cached;
  
  const context = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  
  await cache.set(cacheKey, context, 3600);
  return context;
}
```

### Query Optimization

```typescript
// Use select to limit fields
const memberships = await prisma.membership.findMany({
  where: { userId },
  select: {
    workspaceId: true,
    role: true,
    workspace: {
      select: {
        name: true,
        slug: true,
      },
    },
  },
});
```

## Future Enhancements

### Billing Integration

- Workspace-level subscriptions
- Usage-based billing
- Payment processing
- Invoice generation

### Advanced Features

- Workspace templates
- Workspace cloning
- Cross-workspace sharing
- Workspace analytics
- Custom branding per workspace

### Enterprise Features

- SSO integration
- LDAP integration
- Advanced audit logging
- Compliance reporting
- Data export

## Best Practices

### 1. Always Include Workspace Context

```typescript
// Bad
const posts = await prisma.post.findMany();

// Good
const posts = await prisma.post.findMany({
  where: { workspaceId: currentWorkspaceId },
});
```

### 2. Validate Tenant Access

```typescript
// Always verify user has access to workspace
const membership = await prisma.membership.findFirst({
  where: {
    userId: session.user.id,
    workspaceId,
    status: 'ACTIVE',
  },
});

if (!membership) {
  throw new Error('Unauthorized');
}
```

### 3. Use Tenant-Aware Services

```typescript
// Create tenant-aware services
export class PostService {
  constructor(private workspaceId: string) {}
  
  async getPosts() {
    return prisma.post.findMany({
      where: { workspaceId: this.workspaceId },
    });
  }
}
```

### 4. Log Tenant Activities

```typescript
// Log all tenant activities
await logActivity(
  session.user.id,
  workspaceId,
  'post.created',
  { postId: post.id }
);
```

## Testing

### Unit Tests

```typescript
describe('MultiTenancy', () => {
  it('should isolate data by workspace', async () => {
    const workspace1 = await createWorkspace();
    const workspace2 = await createWorkspace();
    
    await createPost({ workspaceId: workspace1.id });
    await createPost({ workspaceId: workspace2.id });
    
    const posts1 = await getPosts(workspace1.id);
    const posts2 = await getPosts(workspace2.id);
    
    expect(posts1.length).toBe(1);
    expect(posts2.length).toBe(1);
  });
});
```

### Integration Tests

```typescript
describe('Workspace Switching', () => {
  it('should switch workspace context', async () => {
    const user = await createUser();
    const workspace1 = await createWorkspace({ userId: user.id });
    const workspace2 = await createWorkspace({ userId: user.id });
    
    await switchWorkspace(user.id, workspace2.id);
    const context = await getWorkspaceContext(user.id);
    
    expect(context.workspaceId).toBe(workspace2.id);
  });
});
```

## References

- [Multi-Tenancy Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/multi-tenancy)
- [Row-Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [RBAC Best Practices](https://owasp.org/www-community/Access_Control)
