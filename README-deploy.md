#  Deployment Guide
### *Production Deployment for Next.js 16 Project Engine*

This guide covers all deployment options and configurations for taking your Next.js 16 application to production.

---

##  Prerequisites

###  **Required**
- Node.js 18+ or Bun latest
- Git repository
- Domain name (optional but recommended)

###  **Environment Variables**
Ensure you have these configured:
```env
# Authentication (Required)
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-domain.com

# Application (Required)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-key

# Optional
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_SERVER_HOST=0.0.0.0
NEXT_PUBLIC_SERVER_PORT=3000
```

---

##  Vercel Deployment (Recommended)

###  **Step 1: Connect Repository**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Connect your Git repository
4. Import the project

###  **Step 2: Configure Environment**
1. In project settings, go to "Environment Variables"
2. Add all required environment variables:
   ```
   NEXTAUTH_SECRET=your-super-secret-key-here
   NEXTAUTH_URL=https://your-project-name.vercel.app
   NEXT_PUBLIC_BASE_URL=https://your-project-name.vercel.app
   NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-key
   ```

###  **Step 3: Deploy**
1. Click "Deploy"
2. Vercel will automatically detect Next.js and configure build settings
3. Deployment completes in 2-3 minutes

###  **Step 4: Custom Domain (Optional)**
1. Go to project settings > Domains
2. Add your custom domain
3. Update environment variables to use your domain:
   ```
   NEXTAUTH_URL=https://your-domain.com
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   ```

###  **Automatic Deployments**
- Push to `main`/`master` branch triggers production deployment
- Pull requests trigger preview deployments
- Environment variables are automatically applied

---

##  Docker Deployment

###  **Create Dockerfile**
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install Bun
RUN npm install -g bun

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN bun run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

###  **Build and Run**
```bash
# Build Docker image
docker build -t nextjs-16-engine .

# Run container
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXT_PUBLIC_BASE_URL=http://localhost:3000 \
  -e NEXT_PUBLIC_JWT_SECRET=your-jwt-secret \
  nextjs-16-engine
```

###  **Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXTAUTH_SECRET=your-secret
      - NEXTAUTH_URL=http://localhost:3000
      - NEXT_PUBLIC_BASE_URL=http://localhost:3000
      - NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
    restart: unless-stopped
```

---

##  AWS Deployment

###  **Option 1: AWS Amplify**
1. Connect repository to AWS Amplify
2. Configure build settings:
   ```yaml
   build:
     commands:
       - bun install
       - bun run build
   artifacts:
     baseDirectory: .next
     files:
       - '**/*'
   ```
3. Add environment variables in Amplify console
4. Deploy automatically on push

###  **Option 2: EC2 Instance**
```bash
# Connect to EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Install Node.js and Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Clone repository
git clone your-repo-url
cd next-js-16-project-engine

# Install dependencies
bun install

# Build application
bun run build

# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start bun --name "nextjs-app" -- start

# Setup PM2 to start on boot
pm2 startup
pm2 save
```

###  **Option 3: ECS with Fargate**
1. Create Dockerfile (see above)
2. Push to ECR repository
3. Create ECS task definition
4. Deploy to Fargate cluster

---

##  Google Cloud Platform

###  **Option 1: Cloud Run**
```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/nextjs-app

# Deploy to Cloud Run
gcloud run deploy nextjs-app \
  --image gcr.io/PROJECT_ID/nextjs-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXTAUTH_SECRET=your-secret
```

###  **Option 2: App Engine**
```yaml
# app.yaml
runtime: nodejs18
instance_class: F2

env_variables:
  NEXTAUTH_SECRET: your-secret
  NEXTAUTH_URL: https://your-project.appspot.com
  NEXT_PUBLIC_BASE_URL: https://your-project.appspot.com
  NEXT_PUBLIC_JWT_SECRET: your-jwt-secret

automatic_scaling:
  min_instances: 1
  max_instances: 10
  target_cpu_utilization: 0.65
```

---

##  DigitalOcean Deployment

###  **App Platform**
1. Connect repository to DigitalOcean App Platform
2. Configure build command: `bun run build`
3. Configure run command: `bun start`
4. Add environment variables
5. Deploy

###  **Droplet (VPS)**
```bash
# Connect to Droplet
ssh root@your-droplet-ip

# Install dependencies
apt update && apt install -y nodejs npm

# Install Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Setup application
git clone your-repo-url
cd next-js-16-project-engine
bun install
bun run build

# Setup PM2
npm install -g pm2
pm2 start bun --name "nextjs-app" -- start
pm2 startup
pm2 save

# Setup Nginx (optional)
apt install nginx
# Configure nginx reverse proxy
```

---

##  Railway Deployment

###  **Quick Deploy**
1. Connect repository to Railway
2. Railway auto-detects Next.js
3. Add environment variables in Railway dashboard
4. Deploy automatically

###  **Configuration**
```toml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "bun start"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10
```

---

##  Traditional Server Deployment

###  **Setup Process**
```bash
# 1. Install Node.js and Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# 2. Clone and build
git clone your-repo-url
cd next-js-16-project-engine
bun install
bun run build

# 3. Setup process manager
npm install -g pm2
pm2 start bun --name "nextjs-app" -- start

# 4. Setup reverse proxy (Nginx example)
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

###  **SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

##  Environment-Specific Configurations

###  **Development**
```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_DEBUG_MODE=true
```

###  **Staging**
```env
NODE_ENV=production
NEXTAUTH_URL=https://staging.your-domain.com
NEXT_PUBLIC_BASE_URL=https://staging.your-domain.com
NEXT_PUBLIC_DEBUG_MODE=false
```

###  **Production**
```env
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_DEBUG_MODE=false
```

---

##  Performance Optimization

###  **Build Optimization**
```json
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons']
  },
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif']
  }
};
```

###  **Caching Strategy**
```typescript
// lib/cache.ts
export const cacheConfig = {
  // Static assets: 1 year
  static: { maxAge: 31536000, immutable: true },
  
  // API responses: 5 minutes
  api: { maxAge: 300 },
  
  // Pages: 1 hour
  pages: { maxAge: 3600 },
  
  // Images: 30 days
  images: { maxAge: 2592000 }
};
```

---

##  Monitoring and Logging

###  **Health Check Endpoint**
```typescript
// src/app/api/health/route.ts
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV
  });
}
```

###  **Error Monitoring Integration**
```typescript
// lib/error-monitoring.ts
export function logError(error: Error, context?: string) {
  // Send to your monitoring service
  console.error(`[${context}] ${error.message}`, error.stack);
  
  // Example integrations:
  // - Sentry
  // - LogRocket
  // - DataDog
}
```

---

##  Security Considerations

###  **Production Checklist**
- [ ] All secrets in environment variables
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Dependencies updated
- [ ] Error handling doesn't leak information
- [ ] Database connections encrypted

###  **Security Headers**
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
  );
  
  return response;
}
```

---

##  Troubleshooting

###  **Common Issues**

#### **Build Failures**
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
bun install
bun run build
```

#### **Authentication Issues**
1. Check NEXTAUTH_SECRET is set
2. Verify NEXTAUTH_URL matches deployment URL
3. Ensure cookies domain is correct

#### **Performance Issues**
1. Enable image optimization
2. Implement proper caching
3. Monitor bundle size
4. Use CDN for static assets

#### **Memory Leaks**
1. Monitor with PM2
2. Check for infinite loops
3. Verify proper cleanup in useEffect

###  **Debug Commands**
```bash
# Check application logs
pm2 logs nextjs-app

# Monitor performance
pm2 monit

# Restart application
pm2 restart nextjs-app

# Check environment variables
pm2 env 0
```

---

##  CI/CD Integration

###  **GitHub Actions**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        
      - name: Install dependencies
        run: bun install --frozen-lockfile
        
      - name: Run tests
        run: bun run test:e2e
        
      - name: Build application
        run: bun run build
        
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

##  Scaling Considerations

###  **Horizontal Scaling**
- Use load balancer
- Deploy multiple instances
- Implement session storage (Redis)
- Use CDN for static assets

###  **Vertical Scaling**
- Increase server resources
- Optimize database queries
- Implement caching layers
- Monitor performance metrics

---

##  Backup and Recovery

###  **Data Backup**
```bash
# Backup application data
tar -czf backup-$(date +%Y%m%d).tar.gz \
  .env \
  logs/ \
  uploads/

# Backup to cloud storage
aws s3 cp backup-$(date +%Y%m%d).tar.gz s3://your-backup-bucket/
```

###  **Recovery Plan**
1. Restore from latest backup
2. Update environment variables
3. Restart services
4. Verify functionality
5. Update DNS if needed

---

##  Support

###  **Getting Help**
- Check [GitHub Issues](../../issues)
- Review [Next.js Documentation](https://nextjs.org/docs)
- Consult [Vercel Docs](https://vercel.com/docs)
- Join community discussions

###  **Emergency Contacts**
- DevOps team: devops@your-company.com
- Security team: security@your-company.com
- Support portal: support.your-domain.com

---

**Happy Deploying!  Deploy with confidence using this production-ready template.**
