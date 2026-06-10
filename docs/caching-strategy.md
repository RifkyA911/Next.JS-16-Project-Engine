# Caching Strategy

## Overview

NovaStack implements a comprehensive caching strategy using Redis for performance optimization. The system supports multiple caching patterns, automatic invalidation, and cache warming to ensure optimal response times.

## Architecture

### Caching Layers

```
Caching Architecture
├── Browser Cache
│   ├── Static Assets
│   └── API Responses (Cache-Control)
├── CDN Cache (Future)
│   ├── Static Assets
│   └── Edge Caching
├── Redis Cache
│   ├── API Responses
│   ├── Database Queries
│   ├── Sessions
│   └── Computed Data
└── Database
    └── Source of Truth
```

## Cache Patterns

### 1. Cache-Aside (Lazy Loading)

Application manages cache explicitly:

```typescript
// src/services/cache.service.ts
export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }
  
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await redis.set(key, JSON.stringify(value));
    if (ttl) await redis.expire(key, ttl);
  }
  
  async invalidate(key: string): Promise<void> {
    await redis.del(key);
  }
}

// Usage
export async function getUser(userId: string) {
  const cacheKey = `user:${userId}`;
  const cached = await cache.get<User>(cacheKey);
  
  if (cached) return cached;
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  await cache.set(cacheKey, user, 3600); // 1 hour
  
  return user;
}
```

### 2. Write-Through

Cache updated on write:

```typescript
export async function updateUser(userId: string, data: UpdateUserDto) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
  
  // Update cache immediately
  await cache.set(`user:${userId}`, user, 3600);
  
  return user;
}
```

### 3. Write-Behind (Write-Back)

Cache updated asynchronously:

```typescript
export async function updateUserAsync(userId: string, data: UpdateUserDto) {
  // Update cache immediately
  await cache.set(`user:${userId}`, { ...data, id: userId }, 3600);
  
  // Update database asynchronously
  setImmediate(async () => {
    await prisma.user.update({
      where: { id: userId },
      data,
    });
  });
  
  return data;
}
```

### 4. Refresh-Ahead

Proactive cache refresh:

```typescript
export async function getUserWithRefresh(userId: string) {
  const cacheKey = `user:${userId}`;
  const cached = await cache.get<User>(cacheKey);
  
  if (cached) {
    // Check if cache is about to expire
    const ttl = await redis.ttl(cacheKey);
    if (ttl < 300) { // Less than 5 minutes
      // Refresh in background
      setImmediate(async () => {
        const fresh = await prisma.user.findUnique({ where: { id: userId } });
        await cache.set(cacheKey, fresh, 3600);
      });
    }
    
    return cached;
  }
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  await cache.set(cacheKey, user, 3600);
  
  return user;
}
```

## Cache Key Strategy

### Key Naming Convention

```typescript
// Format: {resource}:{identifier}:{optional-context}
const keys = {
  user: (id: string) => `user:${id}`,
  users: (workspaceId: string) => `users:${workspaceId}`,
  post: (id: string) => `post:${id}`,
  posts: (workspaceId: string, status?: string) => 
    status ? `posts:${workspaceId}:${status}` : `posts:${workspaceId}`,
  permission: (userId: string, workspaceId: string, resource: string, action: string) =>
    `permission:${userId}:${workspaceId}:${resource}:${action}`,
};
```

### Key Generation

```typescript
export function generateCacheKey(prefix: string, identifier: string, context?: Record<string, any>): string {
  const parts = [prefix, identifier];
  
  if (context) {
    const contextStr = Object.entries(context)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    parts.push(contextStr);
  }
  
  return parts.join(':');
}

// Usage
const key = generateCacheKey('posts', workspaceId, { status: 'published', page: 1 });
// Result: posts:workspace123:page=1&status=published
```

## Cache Invalidation

### Manual Invalidation

```typescript
export async function invalidateUserCache(userId: string) {
  await cache.invalidate(`user:${userId}`);
  await cache.invalidate(`users:*`); // Pattern matching (if supported)
}
```

### Tag-Based Invalidation

```typescript
export class TaggedCacheService {
  async set(key: string, value: any, tags: string[], ttl?: number): Promise<void> {
    await redis.set(key, JSON.stringify(value));
    if (ttl) await redis.expire(key, ttl);
    
    // Add key to tag sets
    for (const tag of tags) {
      await redis.sadd(`tag:${tag}`, key);
    }
  }
  
  async invalidateByTag(tag: string): Promise<void> {
    const keys = await redis.smembers(`tag:${tag}`);
    if (keys.length > 0) {
      await redis.del(...keys);
      await redis.del(`tag:${tag}`);
    }
  }
}

// Usage
await taggedCache.set('post:123', postData, ['posts', 'workspace:456'], 3600);
await taggedCache.invalidateByTag('workspace:456'); // Invalidates all workspace 456 posts
```

### Automatic Invalidation

```typescript
// Prisma middleware for automatic cache invalidation
prisma.$use(async (params, next) => {
  const result = await next(params);
  
  // Invalidate relevant caches based on operation
  if (params.model === 'User') {
    if (params.action === 'update' || params.action === 'delete') {
      await cache.invalidate(`user:${params.args.where.id}`);
      await cache.invalidate(`users:*`);
    }
  }
  
  if (params.model === 'Post') {
    if (params.action === 'create' || params.action === 'update' || params.action === 'delete') {
      const workspaceId = result.workspaceId;
      await cache.invalidate(`posts:${workspaceId}:*`);
      await cache.invalidate(`post:${result.id}`);
    }
  }
  
  return result;
});
```

## Cache Warming

### Preload Common Data

```typescript
export async function warmCache(workspaceId: string) {
  // Warm frequently accessed data
  const users = await prisma.user.findMany({
    where: { memberships: { some: { workspaceId } } },
  });
  
  for (const user of users) {
    await cache.set(`user:${user.id}`, user, 3600);
  }
  
  const posts = await prisma.post.findMany({
    where: { workspaceId, status: 'PUBLISHED' },
  });
  
  for (const post of posts) {
    await cache.set(`post:${post.id}`, post, 3600);
  }
}
```

### Scheduled Cache Warming

```typescript
// Cron job to warm cache
export async function scheduledCacheWarming() {
  const workspaces = await prisma.workspace.findMany({
    where: { status: 'ACTIVE' },
  });
  
  for (const workspace of workspaces) {
    await warmCache(workspace.id);
  }
}
```

## Cache Statistics

### Monitor Cache Performance

```typescript
export class CacheMonitor {
  private hits = 0;
  private misses = 0;
  
  async getWithStats<T>(key: string): Promise<T | null> {
    const data = await cache.get<T>(key);
    
    if (data) {
      this.hits++;
    } else {
      this.misses++;
    }
    
    return data;
  }
  
  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total) * 100 : 0;
    
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: `${hitRate.toFixed(2)}%`,
    };
  }
  
  reset() {
    this.hits = 0;
    this.misses = 0;
  }
}
```

## Redis Configuration

### Connection Setup

```typescript
// src/lib/redis.ts
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});
```

### Local Redis (Development)

```typescript
// src/lib/redis.ts
import { createClient } from 'redis';

export const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

await redis.connect();
```

## Cache Strategies by Data Type

### Static Data

Long TTL, rare invalidation:

```typescript
await cache.set('settings:global', globalSettings, 86400); // 24 hours
```

### User Data

Medium TTL, invalidate on update:

```typescript
await cache.set(`user:${userId}`, userData, 3600); // 1 hour
```

### Dynamic Data

Short TTL, frequent invalidation:

```typescript
await cache.set(`posts:${workspaceId}`, posts, 300); // 5 minutes
```

### Computed Data

Medium TTL, invalidate on source change:

```typescript
await cache.set(`analytics:${workspaceId}`, analytics, 1800); // 30 minutes
```

## Best Practices

### 1. Always Set TTL

```typescript
// Bad: No TTL
await cache.set('key', value);

// Good: With TTL
await cache.set('key', value, 3600);
```

### 2. Use Descriptive Keys

```typescript
// Bad: Vague key
await cache.set('data', value);

// Good: Descriptive key
await cache.set('user:123:profile', value);
```

### 3. Invalidate on Write

```typescript
// Update data
await prisma.user.update({ where: { id }, data });

// Invalidate cache
await cache.invalidate(`user:${id}`);
```

### 4. Handle Cache Failures

```typescript
try {
  const cached = await cache.get(key);
  if (cached) return cached;
} catch (error) {
  console.warn('Cache error, falling back to database', error);
}

// Always fetch from database as fallback
return await prisma.user.findUnique({ where: { id } });
```

### 5. Monitor Cache Performance

```typescript
const stats = cacheMonitor.getStats();
logger.info(`Cache stats: ${JSON.stringify(stats)}`);
```

## Cache Implementation Examples

### API Response Caching

```typescript
// src/app/api/users/route.ts
export async function GET(req: NextRequest) {
  const workspaceId = req.headers.get('x-workspace-id')!;
  const cacheKey = `users:${workspaceId}`;
  
  // Check cache
  const cached = await cache.get(cacheKey);
  if (cached) {
    return Response.json(cached);
  }
  
  // Fetch from database
  const users = await prisma.user.findMany({
    where: { memberships: { some: { workspaceId } } },
  });
  
  // Set cache
  await cache.set(cacheKey, users, 300);
  
  return Response.json(users);
}
```

### Database Query Caching

```typescript
// src/services/user.service.ts
export class UserService {
  async getUsersByWorkspace(workspaceId: string): Promise<User[]> {
    const cacheKey = `users:${workspaceId}`;
    const cached = await cache.get<User[]>(cacheKey);
    
    if (cached) return cached;
    
    const users = await prisma.user.findMany({
      where: { memberships: { some: { workspaceId } } },
    });
    
    await cache.set(cacheKey, users, 300);
    
    return users;
  }
}
```

### Session Caching

```typescript
// src/lib/session-cache.ts
export class SessionCache {
  async setSession(sessionId: string, session: Session): Promise<void> {
    await cache.set(`session:${sessionId}`, session, 1800); // 30 minutes
  }
  
  async getSession(sessionId: string): Promise<Session | null> {
    return cache.get(`session:${sessionId}`);
  }
  
  async deleteSession(sessionId: string): Promise<void> {
    await cache.invalidate(`session:${sessionId}`);
  }
}
```

## Testing

### Cache Test

```typescript
describe('CacheService', () => {
  it('should cache and retrieve data', async () => {
    const key = 'test:key';
    const value = { id: 1, name: 'Test' };
    
    await cache.set(key, value, 60);
    const retrieved = await cache.get(key);
    
    expect(retrieved).toEqual(value);
  });
  
  it('should return null for non-existent key', async () => {
    const retrieved = await cache.get('non-existent');
    expect(retrieved).toBeNull();
  });
  
  it('should respect TTL', async () => {
    const key = 'test:ttl';
    await cache.set(key, 'value', 1); // 1 second
    
    await new Promise(resolve => setTimeout(resolve, 1100));
    const retrieved = await cache.get(key);
    
    expect(retrieved).toBeNull();
  });
});
```

## Future Enhancements

### Distributed Caching

Support for Redis Cluster:

```typescript
export const redisCluster = createCluster({
  rootNodes: [
    { url: process.env.REDIS_NODE_1 },
    { url: process.env.REDIS_NODE_2 },
    { url: process.env.REDIS_NODE_3 },
  ],
});
```

### Cache Compression

Compress large cached values:

```typescript
import { compress, decompress } from 'lz4';

export async function setCompressed(key: string, value: any, ttl?: number): Promise<void> {
  const compressed = compress(JSON.stringify(value));
  await redis.set(key, compressed);
  if (ttl) await redis.expire(key, ttl);
}

export async function getDecompressed<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  if (!data) return null;
  
  const decompressed = decompress(data);
  return JSON.parse(decompressed.toString());
}
```

### Cache Analytics

Detailed cache analytics dashboard:

```typescript
export class CacheAnalytics {
  async getTopKeys(limit = 10): Promise<{ key: string; hits: number }[]> {
    // Get most accessed keys
  }
  
  async getMemoryUsage(): Promise<{ used: number; total: number }> {
    const info = await redis.info('memory');
    // Parse memory info
  }
}
```

## References

- [Redis Documentation](https://redis.io/docs)
- [Caching Patterns](https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/)
- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
