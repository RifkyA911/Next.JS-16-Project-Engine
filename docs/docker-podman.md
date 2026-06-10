# Docker & Podman

## Overview

NovaStack is designed to be container-native, with primary support for Podman and full compatibility with Docker. This guide covers container runtime setup, configuration, and best practices.

## Container Runtime Selection

### Podman (Primary)

**Why Podman?**
- Daemonless architecture
- Rootless containers
- Better security
- Compatible with Docker commands

### Docker (Compatible)

**Why Docker?**
- Industry standard
- Larger ecosystem
- Widespread tooling support

## Prerequisites

### Podman Installation

#### Linux (Ubuntu/Debian)

```bash
# Install Podman
sudo apt-get update
sudo apt-get install -y podman

# Enable user namespaces
echo "user.max_user_namespaces=15000" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

#### macOS

```bash
# Install via Homebrew
brew install podman

# Initialize Podman machine
podman machine init
podman machine start
```

#### Windows

```bash
# Install via Chocolatey
choco install podman

# Initialize Podman machine
podman machine init
podman machine start
```

### Docker Installation

#### Linux

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### macOS/Windows

Download and install from [Docker Desktop](https://www.docker.com/products/docker-desktop).

## Container Architecture

### Services

```
Container Architecture
├── Next.js Application (Port 3000)
├── PostgreSQL (Port 5432)
├── Redis (Port 6379)
└── Optional: Reverse Proxy (Port 80/443)
```

## Dockerfile

### Multi-Stage Build

```dockerfile
# Base image
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json bun.lockb* ./
RUN npm install -g bun && bun install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Runner
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

### Build Configuration

```typescript
// next.config.ts
export default {
  output: 'standalone',
};
```

## Docker Compose

### Development Compose

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: base
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/app
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_SECRET=dev-secret
      - NEXTAUTH_URL=http://localhost:3000
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    command: bun dev
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=app
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Production Compose

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

## Podman Compose

### Installation

```bash
# Install podman-compose
pip install podman-compose
```

### Usage

```bash
# Start services
podman-compose up -d

# View logs
podman-compose logs -f app

# Stop services
podman-compose down
```

## Container Commands

### Build Image

```bash
# Docker
docker build -t nextjs-app .

# Podman
podman build -t nextjs-app .
```

### Run Container

```bash
# Docker
docker run -d \
  --name nextjs-app \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  nextjs-app

# Podman
podman run -d \
  --name nextjs-app \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  nextjs-app
```

### View Logs

```bash
# Docker
docker logs -f nextjs-app

# Podman
podman logs -f nextjs-app
```

### Stop Container

```bash
# Docker
docker stop nextjs-app

# Podman
podman stop nextjs-app
```

### Remove Container

```bash
# Docker
docker rm nextjs-app

# Podman
podman rm nextjs-app
```

## Volume Management

### Create Volume

```bash
# Docker
docker volume create postgres_data

# Podman
podman volume create postgres_data
```

### List Volumes

```bash
# Docker
docker volume ls

# Podman
podman volume ls
```

### Remove Volume

```bash
# Docker
docker volume rm postgres_data

# Podman
podman volume rm postgres_data
```

## Network Management

### Create Network

```bash
# Docker
docker network create app-network

# Podman
podman network create app-network
```

### Connect Container to Network

```bash
# Docker
docker network connect app-network nextjs-app

# Podman
podman network connect app-network nextjs-app
```

## Health Checks

### Docker Compose Health Check

```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
```

## Resource Limits

### CPU and Memory Limits

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Security

### Rootless Containers

Podman supports rootless containers by default:

```bash
# Run as non-root user
podman run -d --user nextjs nextjs-app
```

### Read-Only Root Filesystem

```yaml
services:
  app:
    read_only: true
    tmpfs:
      - /tmp
```

### Drop Capabilities

```yaml
services:
  app:
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

## Optimization

### Image Size Reduction

```dockerfile
# Use alpine base
FROM node:18-alpine

# Multi-stage build
FROM base AS builder
# ... build steps ...

FROM base AS runner
# Only copy necessary files
COPY --from=builder /app/.next/standalone ./
```

### Layer Caching

```dockerfile
# Copy package files first
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs nextjs-app

# Check container status
docker ps -a

# Inspect container
docker inspect nextjs-app
```

### Database Connection Issues

```bash
# Check if database is running
docker ps

# Test database connection
docker exec -it db psql -U postgres -d app -c "SELECT 1"
```

### Port Conflicts

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Best Practices

### 1. Use Specific Image Tags

```yaml
# Bad
image: postgres

# Good
image: postgres:15-alpine
```

### 2. Don't Run as Root

```dockerfile
# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
```

### 3. Use .dockerignore

```
node_modules
.next
.git
.env
*.log
```

### 4. Scan Images for Vulnerabilities

```bash
# Trivy
trivy image nextjs-app

# Docker Scout
docker scout quickstart nextjs-app
```

### 5. Use Health Checks

Always implement health checks for all services.

## References

- [Podman Documentation](https://docs.podman.io)
- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose)
- [Container Security Best Practices](https://snyk.io/blog/10-docker-image-security-best-practices/)
