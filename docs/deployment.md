# Deployment

## Overview

This guide covers deployment strategies for NovaStack across different environments: local development, staging, and production.

## Environments

### Local Development

**Purpose**: Local development and testing

**Characteristics**:
- Hot reload enabled
- Debug logging enabled
- Local database
- No SSL required

### Staging

**Purpose**: Pre-production testing

**Characteristics**:
- Production-like configuration
- Staging database
- SSL enabled
- Monitoring enabled

### Production

**Purpose**: Live production environment

**Characteristics**:
- Optimized build
- Production database
- SSL required
- Full monitoring
- Auto-scaling enabled

## Deployment Strategies

### Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Setup

1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

#### Environment Variables

```env
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

#### Custom Domain

1. Add domain in Vercel dashboard
2. Configure DNS records
3. SSL certificate auto-provisioned

### Docker Deployment

#### Build Image

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/app
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=app
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

#### Run with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

### Podman Deployment

Podman is a daemonless container engine, recommended for production.

#### Build with Podman

```bash
podman build -t nextjs-app .
```

#### Run with Podman

```bash
podman run -d \
  --name nextjs-app \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  nextjs-app
```

#### Podman Compose

```bash
# Install podman-compose
pip install podman-compose

# Run
podman-compose up -d
```

### Kubernetes Deployment

#### Deployment Manifest

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nextjs-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nextjs-app
  template:
    metadata:
      labels:
        app: nextjs-app
    spec:
      containers:
      - name: nextjs-app
        image: your-registry/nextjs-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: redis-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: nextjs-app
spec:
  selector:
    app: nextjs-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

#### Apply to Cluster

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## Environment Promotion

### Promotion Strategy

```
Feature Branch → Staging → Production
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - run: bun run test
      - name: Deploy to Staging
        run: # Deploy to staging environment

  deploy-production:
    runs-on: ubuntu-latest
    needs: deploy-staging
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - name: Deploy to Production
        run: # Deploy to production environment
```

## Rollback Strategy

### Blue-Green Deployment

Maintain two production environments:

```
Blue (Current) ← Traffic
Green (New) ← Deploy
```

Switch traffic when green is healthy.

### Rollback Steps

1. Identify last working version
2. Revert code changes
3. Deploy previous version
4. Verify health
5. Switch traffic

### Automated Rollback

```yaml
# Kubernetes deployment with rollback
kubectl rollout undo deployment/nextjs-app
```

## Health Checks

### Health Check Endpoint

```typescript
// src/app/api/health/route.ts
export async function GET() {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis
    await redis.ping();
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok',
        redis: 'ok',
      },
    });
  } catch (error) {
    return Response.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 503 }
    );
  }
}
```

### Kubernetes Health Check

```yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Backup Strategy

### Database Backups

#### Automated Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump -U postgres -d app > /backups/app_$DATE.sql
```

#### Backup Retention

- Daily backups: 7 days
- Weekly backups: 4 weeks
- Monthly backups: 12 months

### Restore Procedure

```bash
# Restore from backup
psql -U postgres -d app < /backups/app_20240607.sql
```

## Monitoring

### Application Monitoring

#### Logging

```typescript
import { logger } from '@/lib/logger';

logger.info('Application started');
logger.error('Database connection failed', error);
```

#### Metrics

- Response times
- Error rates
- Request counts
- Memory usage
- CPU usage

### Infrastructure Monitoring

#### Tools

- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **Loki**: Log aggregation
- **Alertmanager**: Alerting

### Alerting

#### Critical Alerts

- Application down
- Database connection failed
- High error rate (> 5%)
- High response time (> 1s)

## Security

### SSL/TLS

#### Let's Encrypt (Certbot)

```bash
# Install certbot
apt-get install certbot

# Generate certificate
certbot certonly --standalone -d your-domain.com

# Auto-renewal
certbot renew --quiet
```

#### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Firewall

```bash
# Allow only necessary ports
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

## Performance Optimization

### Build Optimization

```typescript
// next.config.ts
export default {
  swcMinify: true,
  compress: true,
  generateEtags: true,
  poweredByHeader: false,
};
```

### CDN Configuration

- Static assets served from CDN
- API responses cached at edge
- Image optimization

### Database Optimization

- Connection pooling
- Query optimization
- Index optimization
- Read replicas

## Troubleshooting

### Build Failures

```bash
# Clear cache
rm -rf .next
rm -rf node_modules
bun install
bun run build
```

### Runtime Errors

```bash
# Check logs
docker-compose logs app

# Check database connection
psql -U postgres -d app -c "SELECT 1"
```

### Performance Issues

```bash
# Profile application
bun run build --profile

# Check memory usage
docker stats
```

## Best Practices

### 1. Use Environment-Specific Config

```typescript
const config = {
  development: {
    databaseUrl: process.env.DATABASE_URL,
    debug: true,
  },
  production: {
    databaseUrl: process.env.DATABASE_URL,
    debug: false,
  },
}[process.env.NODE_ENV];
```

### 2. Enable Health Checks

Always implement health check endpoints for monitoring.

### 3. Use Secrets Management

Never commit secrets to repository. Use environment variables or secret managers.

### 4. Implement Graceful Shutdown

```typescript
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});
```

### 5. Monitor Everything

Monitor application, database, cache, and infrastructure.

## References

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Documentation](https://docs.docker.com)
- [Kubernetes Documentation](https://kubernetes.io/docs)
- [Vercel Documentation](https://vercel.com/docs)
