# Database Design

## Overview

NovaStack uses PostgreSQL as the primary database with Prisma ORM for type-safe database access. The schema is designed to support multi-tenancy, CMS functionality, AI integration, and enterprise features.

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Core Entities                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐ │
│  │    User      │───────│   Account    │───────│   Session    │ │
│  │              │       │              │       │              │ │
│  │ id           │       │ id           │       │ id           │ │
│  │ email        │       │ userId       │       │ userId       │ │
│  │ name         │       │ provider     │       │ token        │ │
│  │ role         │       │ providerId   │       │ expires      │ │
│  └──────────────┘       └──────────────┘       └──────────────┘ │
│                                                                  │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐ │
│  │Organization  │───────│  Workspace   │───────│  Membership  │ │
│  │              │       │              │       │              │ │
│  │ id           │       │ id           │       │ id           │ │
│  │ name         │       │ orgId        │       │ userId       │ │
│  │ settings     │       │ name         │       │ workspaceId  │ │
│  └──────────────┘       │ settings     │       │ role         │ │
│                         └──────────────┘       └──────────────┘ │
│                                                                  │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐ │
│  │    Role      │───────│ Permission   │───────│  RolePerm    │ │
│  │              │       │              │       │              │ │
│  │ id           │       │ id           │       │ roleId       │ │
│  │ name         │       │ resource     │       │ permissionId │ │
│  │ description  │       │ action       │       └──────────────┘ │
│  └──────────────┘       └──────────────┘                         │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                        CMS Entities                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐ │
│  │    Post      │───────│  Category    │───────│    Tag       │ │
│  │              │       │              │       │              │ │
│  │ id           │       │ id           │       │ id           │ │
│  │ title        │       │ name         │       │ name         │ │
│  │ slug         │       │ slug         │       │ slug         │ │
│  │ status       │       │ parentId     │       └──────────────┘ │
│  │ workspaceId  │       └──────────────┘                         │
│  └──────────────┘                                                │
│         │                                                         │
│         │                                                         │
│  ┌──────▼───────┐       ┌──────────────┐       ┌──────────────┐ │
│  │  PostTag    │       │   Media      │       │   Author     │ │
│  │              │       │              │       │              │ │
│  │ postId       │       │ id           │       │ id           │ │
│  │ tagId        │       │ filename     │       │ name         │ │
│  └──────────────┘       │ url          │       │ bio          │ │
│                         │ mimeType     │       │ avatar       │ │
│                         │ workspaceId  │       └──────────────┘ │
│                         └──────────────┘                         │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                      System Entities                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐ │
│  │ ActivityLog  │       │  AuditLog    │       │ Notification │ │
│  │              │       │              │       │              │ │
│  │ id           │       │ id           │       │ id           │ │
│  │ userId       │       │ userId       │       │ userId       │ │
│  │ action       │       │ action       │       │ type         │ │
│  │ metadata     │       │ metadata     │       │ read         │ │
│  └──────────────┘       └──────────────┘       └──────────────┘ │
│                                                                  │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐ │
│  │   Setting    │       │  ApiToken    │       │   AiLog      │ │
│  │              │       │              │       │              │ │
│  │ id           │       │ id           │       │ id           │ │
│  │ key          │       │ userId       │       │ userId       │ │
│  │ value        │       │ token        │       │ provider     │ │
│  │ workspaceId  │       │ permissions  │       │ prompt       │ │
│  └──────────────┘       └──────────────┘       └──────────────┘ │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                    Future Entities                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐ │
│  │ Subscription│       │   Payment    │       │   Invoice    │ │
│  │              │       │              │       │              │ │
│  │ id           │       │ id           │       │ id           │ │
│  │ workspaceId  │       │ subscriptionId│     │ paymentId    │ │
│  │ plan         │       │ amount       │       │ amount       │ │
│  │ status       │       │ status       │       │ status       │ │
│  └──────────────┘       └──────────────┘       └──────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Core Entities

### User

Represents application users with authentication and authorization.

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?  // Hashed password
  role      UserRole @default(USER)
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  accounts     Account[]
  sessions     Session[]
  memberships  Membership[]
  activities   ActivityLog[]
  auditLogs    AuditLog[]
  notifications Notification[]
  apiTokens    ApiToken[]
  aiLogs       AiLog[]
  settings     UserSetting[]
  posts        Post[]
  authors      Author[]
}

enum UserRole {
  ADMINISTRATOR
  USER
  GUEST
}
```

### Account

OAuth provider accounts (Google, GitHub, etc.).

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

### Session

User sessions for authentication.

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Multi-Tenancy Entities

### Organization

Top-level organization entity.

```prisma
model Organization {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  settings  Json?    // Organization settings
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  workspaces Workspace[]
}
```

### Workspace

Tenant workspace for multi-tenancy.

```prisma
model Workspace {
  id             String   @id @default(cuid())
  organizationId String
  name           String
  slug           String
  settings       Json?    // Workspace settings
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  memberships  Membership[]
  posts        Post[]
  media        Media[]
  settings     WorkspaceSetting[]
  subscriptions Subscription[]

  @@unique([organizationId, slug])
}
```

### Membership

User membership in workspaces.

```prisma
model Membership {
  id          String      @id @default(cuid())
  userId      String
  workspaceId String
  role        MembershipRole @default(MEMBER)
  status      MembershipStatus @default(ACTIVE)
  invitedBy   String?
  joinedAt    DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relations
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@unique([userId, workspaceId])
}

enum MembershipRole {
  OWNER
  ADMIN
  MEMBER
  GUEST
}

enum MembershipStatus {
  ACTIVE
  PENDING
  SUSPENDED
}
```

## Authorization Entities

### Role

Custom roles for RBAC.

```prisma
model Role {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  isSystem    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  permissions RolePermission[]
  memberships Membership[]
}
```

### Permission

Granular permissions.

```prisma
model Permission {
  id        String   @id @default(cuid())
  resource  String   // e.g., "users", "posts"
  action    String   // e.g., "read", "write", "delete"
  description String?
  createdAt DateTime @default(now())

  // Relations
  roles RolePermission[]

  @@unique([resource, action])
}
```

### RolePermission

Many-to-many relationship between roles and permissions.

```prisma
model RolePermission {
  id           String @id @default(cuid())
  roleId       String
  permissionId String
  createdAt    DateTime @default(now())

  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([roleId, permissionId])
}
```

## CMS Entities

### Post

Blog posts and pages.

```prisma
model Post {
  id          String     @id @default(cuid())
  workspaceId String
  authorId    String?
  title       String
  slug        String
  content     String     @db.Text
  excerpt     String?    @db.Text
  status      PostStatus @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  metadata    Json?      // SEO metadata, custom fields

  // Relations
  workspace  Workspace  @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  author     User?      @relation(fields: [authorId], references: [id])
  categories PostCategory[]
  tags       PostTag[]
  versions   PostVersion[]

  @@unique([workspaceId, slug])
}

enum PostStatus {
  DRAFT
  REVIEW
  PUBLISHED
  ARCHIVED
}
```

### Category

Content categories.

```prisma
model Category {
  id          String   @id @default(cuid())
  workspaceId String
  name        String
  slug        String
  description String?
  parentId    String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  workspace  Workspace      @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  parent     Category?      @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children   Category[]     @relation("CategoryHierarchy")
  posts      PostCategory[]

  @@unique([workspaceId, slug])
}
```

### Tag

Content tags.

```prisma
model Tag {
  id          String   @id @default(cuid())
  workspaceId String
  name        String
  slug        String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  posts     PostTag[]

  @@unique([workspaceId, slug])
}
```

### PostCategory

Many-to-many relationship between posts and categories.

```prisma
model PostCategory {
  postId     String @id @default(cuid())
  categoryId String
  createdAt  DateTime @default(now())

  post     Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([postId, categoryId])
}
```

### PostTag

Many-to-many relationship between posts and tags.

```prisma
model PostTag {
  postId String @id @default(cuid())
  tagId  String
  createdAt DateTime @default(now())

  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
}
```

### Media

Media library files.

```prisma
model Media {
  id          String   @id @default(cuid())
  workspaceId String
  filename    String
  url         String
  mimeType    String
  size        Int
  width       Int?
  height      Int?
  alt         String?
  folder      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
}
```

### Author

Content author profiles.

```prisma
model Author {
  id        String   @id @default(cuid())
  userId    String   @unique
  bio       String?  @db.Text
  avatar    String?
  social    Json?    // Social media links
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user  User  @relation(fields: [userId], references: [id])
  posts Post[]
}
```

### PostVersion

Post version history.

```prisma
model PostVersion {
  id        String   @id @default(cuid())
  postId    String
  content   String   @db.Text
  metadata  Json?
  createdBy String
  createdAt DateTime @default(now())

  // Relations
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
}
```

## System Entities

### ActivityLog

User activity tracking.

```prisma
model ActivityLog {
  id        String   @id @default(cuid())
  userId    String
  action    String
  metadata  Json?
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
}
```

### AuditLog

System audit logging.

```prisma
model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String
  resource  String
  resourceId String?
  metadata  Json?
  ipAddress String?
  createdAt DateTime @default(now())

  // Relations
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([resource, resourceId])
  @@index([createdAt])
}
```

### Notification

User notifications.

```prisma
model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  metadata  Json?
  read      Boolean          @default(false)
  readAt    DateTime?
  createdAt DateTime         @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, read])
}

enum NotificationType {
  INFO
  SUCCESS
  WARNING
  ERROR
}
```

### Setting

Application settings.

```prisma
model Setting {
  id         String   @id @default(cuid())
  key        String   @unique
  value      Json
  workspaceId String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### UserSetting

User-specific settings.

```prisma
model UserSetting {
  id        String   @id @default(cuid())
  userId    String
  key       String
  value     Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, key])
}
```

### WorkspaceSetting

Workspace-specific settings.

```prisma
model WorkspaceSetting {
  id         String   @id @default(cuid())
  workspaceId String
  key        String
  value      Json
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relations
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, key])
}
```

### ApiToken

API tokens for programmatic access.

```prisma
model ApiToken {
  id          String   @id @default(cuid())
  userId      String
  token       String   @unique
  name        String
  permissions String[]
  expiresAt   DateTime?
  lastUsedAt  DateTime?
  createdAt   DateTime @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### AiLog

AI request logging.

```prisma
model AiLog {
  id          String   @id @default(cuid())
  userId      String
  provider    String
  model       String
  prompt      String   @db.Text
  response    String?  @db.Text
  tokens      Int?
  cost        Decimal?
  duration    Int?
  createdAt   DateTime @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
  @@index([provider])
}
```

## Future Entities

### Subscription

Workspace subscriptions.

```prisma
model Subscription {
  id          String           @id @default(cuid())
  workspaceId String
  plan        String
  status      SubscriptionStatus
  startDate   DateTime
  endDate     DateTime?
  cancelAt    DateTime?
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  // Relations
  workspace  Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  payments   Payment[]
  invoices   Invoice[]

  @@unique([workspaceId])
}

enum SubscriptionStatus {
  TRIAL
  ACTIVE
  PAST_DUE
  CANCELLED
  EXPIRED
}
```

### Payment

Payment records.

```prisma
model Payment {
  id             String      @id @default(cuid())
  subscriptionId String
  amount         Decimal
  currency       String      @default("USD")
  status         PaymentStatus
  provider       String      // Stripe, etc.
  providerId     String?
  metadata       Json?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  // Relations
  subscription Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)
  invoices     Invoice[]

  @@index([subscriptionId])
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}
```

### Invoice

Invoice records.

```prisma
model Invoice {
  id          String   @id @default(cuid())
  paymentId   String?
  subscriptionId String
  amount      Decimal
  currency    String   @default("USD")
  status      InvoiceStatus
  dueDate     DateTime
  paidAt      DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  payment      Payment?      @relation(fields: [paymentId], references: [id])
  subscription Subscription @relation(fields: [subscriptionId], references: [id])

  @@index([subscriptionId])
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
  CANCELLED
}
```

## Indexes

### Performance Indexes

```prisma
// User indexes
@@index([email])
@@index([role])

// Membership indexes
@@index([userId])
@@index([workspaceId])
@@index([status])

// Post indexes
@@index([workspaceId, status])
@@index([publishedAt])
@@index([slug])

// ActivityLog indexes
@@index([userId, createdAt])
@@index([action])

// AuditLog indexes
@@index([resource, resourceId])
@@index([createdAt])
```

## Relationships Summary

### One-to-One
- User ↔ Account (via userId)
- User ↔ Session (via userId)
- User ↔ Author (via userId)

### One-to-Many
- Organization → Workspace
- Workspace → Membership
- Workspace → Post
- Workspace → Media
- User → Membership
- User → ActivityLog
- User → AuditLog
- User → Notification
- User → ApiToken
- User → AiLog
- Post → PostVersion
- Category → Category (self-referencing hierarchy)

### Many-to-Many
- Post ↔ Category (via PostCategory)
- Post ↔ Tag (via PostTag)
- Role ↔ Permission (via RolePermission)

## Data Isolation Strategy

### Tenant Isolation

All tenant-specific entities include `workspaceId`:

```prisma
model Post {
  workspaceId String
  // ... other fields
  
  @@unique([workspaceId, slug])
}
```

### Row-Level Security

Queries always filter by workspace context:

```typescript
const posts = await prisma.post.findMany({
  where: {
    workspaceId: currentWorkspaceId,
  },
});
```

## Migration Strategy

### Prisma Migrations

```bash
# Create migration
npx prisma migrate dev --name add_cms_tables

# Apply migration
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

### Migration Best Practices

1. **Never modify existing migrations** - create new ones
2. **Test migrations in staging** before production
3. **Backup before major migrations**
4. **Use transactional migrations** when possible
5. **Document breaking changes**

## Backup Strategy

### Automated Backups

- Daily full backups
- Hourly incremental backups
- 30-day retention
- Cross-region replication

### Backup Commands

```bash
# Full backup
pg_dump -U user -d database > backup.sql

# Restore
psql -U user -d database < backup.sql
```

## Scaling Considerations

### Read Replicas

Future support for read replicas:

```typescript
const readClient = prisma.$extends({
  query: {
    $allOperations: ({ operation, model, args, query }) => {
      if (operation === 'find' || operation === 'findFirst') {
        return query(args, { connection: readReplica });
      }
      return query(args);
    },
  },
});
```

### Connection Pooling

Use connection pooling (PgBouncer):

```env
DATABASE_URL="postgresql://user:pass@pgbouncer:6432/database"
```

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Database Normalization](https://en.wikipedia.org/wiki/Database_normalization)
