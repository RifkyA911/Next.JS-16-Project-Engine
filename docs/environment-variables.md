# Environment Variables

## Overview

NovaStack uses environment variables for configuration across different environments. This document lists all required and optional environment variables.

## Required Variables

### Application

```env
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters
NEXTAUTH_URL=http://localhost:3000
```

### Database

```env
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
```

## Optional Variables

### Authentication

```env
# reCAPTCHA v3 (Primary)
RECAPTCHA_V3_SECRET_KEY=your-recaptcha-v3-secret
RECAPTCHA_V3_SITE_KEY=your-recaptcha-v3-site-key

# reCAPTCHA v2 (Fallback)
RECAPTCHA_V2_SECRET_KEY=your-recaptcha-v2-secret
RECAPTCHA_V2_SITE_KEY=your-recaptcha-v2-site-key
```

### Cache

```env
# Redis (Upstash or self-hosted)
REDIS_URL=redis://localhost:6379
REDIS_TOKEN=your-redis-token
```

### AI Integration

```env
# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Anthropic
ANTHROPIC_API_KEY=your-anthropic-api-key

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key

# Groq
GROQ_API_KEY=your-groq-api-key

# Ollama (Local)
OLLAMA_BASE_URL=http://localhost:11434
```

### Email Service

```env
# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# AWS SES
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY_ID=your-access-key
AWS_SES_SECRET_ACCESS_KEY=your-secret-key
```

### Storage

```env
# AWS S3
AWS_S3_BUCKET=your-bucket-name
AWS_S3_REGION=us-east-1
AWS_S3_ACCESS_KEY_ID=your-access-key
AWS_S3_SECRET_ACCESS_KEY=your-secret-key

# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET=your-bucket-name
```

### Application

```env
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# JWT Secret (if using custom JWT)
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret

# Debug Mode
NEXT_PUBLIC_DEBUG_MODE=true

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX
```

### Deployment

```env
# Node Environment
NODE_ENV=production

# Port
PORT=3000
```

## Environment Files

### Local Development

Create `.env` file in project root:

```env
# Copy from .env.example
cp .env.example .env
```

### Production

Set environment variables in your deployment platform:

- **Vercel**: Project Settings → Environment Variables
- **Docker**: Pass via `-e` flag or docker-compose.yml
- **Kubernetes**: Use Secrets or ConfigMaps

## Security Best Practices

### 1. Never Commit .env Files

```gitignore
# .gitignore
.env
.env.local
.env.*.local
```

### 2. Use Strong Secrets

```bash
# Generate secure secret
openssl rand -base64 32
```

### 3. Rotate Secrets Regularly

- Change secrets periodically
- Use secret management services
- Implement secret rotation policies

### 4. Use Environment-Specific Secrets

- Development: Local .env
- Staging: Staging secrets
- Production: Production secrets

### 5. Limit Secret Access

- Use principle of least privilege
- Audit secret access logs
- Revoke compromised secrets immediately

## Secret Management

### Local Development

Use `.env` file (never commit):

```env
NEXTAUTH_SECRET=local-dev-secret
DATABASE_URL=postgresql://localhost:5432/dev
```

### Production

Use secret management services:

#### AWS Secrets Manager

```bash
# Store secret
aws secretsmanager create-secret \
  --name nextjs/nextauth-secret \
  --secret-string "your-secret"

# Retrieve in application
const secret = await getSecret('nextjs/nextauth-secret');
```

#### HashiCorp Vault

```bash
# Store secret
vault kv put secret/nextjs nextauth-secret="your-secret"

# Retrieve in application
const secret = await vault.read('secret/data/nextjs');
```

#### Vercel Environment Variables

Set in Vercel dashboard:
1. Go to Project Settings
2. Environment Variables
3. Add variable
4. Select environment(s)

## Validation

### Runtime Validation

```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);
```

### Startup Validation

```typescript
// src/lib/env.ts
try {
  envSchema.parse(process.env);
} catch (error) {
  console.error('Invalid environment variables:', error);
  process.exit(1);
}
```

## Example Configurations

### Development

```env
NEXTAUTH_SECRET=dev-secret-min-32-characters-long
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/dev
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_DEBUG_MODE=true
```

### Staging

```env
NEXTAUTH_SECRET=staging-secret-min-32-characters-long
NEXTAUTH_URL=https://staging.yourdomain.com
DATABASE_URL=postgresql://user:password@staging-db.example.com:5432/staging
REDIS_URL=redis://staging-redis.example.com:6379
NODE_ENV=production
```

### Production

```env
NEXTAUTH_SECRET=production-secret-min-32-characters-long
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:password@prod-db.example.com:5432/production
REDIS_URL=redis://prod-redis.example.com:6379
SENDGRID_API_KEY=your-sendgrid-api-key
AWS_S3_BUCKET=your-production-bucket
NODE_ENV=production
```

## Troubleshooting

### Missing Required Variables

```bash
# Error: NEXTAUTH_SECRET is required
# Solution: Set NEXTAUTH_SECRET in .env file
```

### Invalid Database URL

```bash
# Error: Invalid connection string
# Solution: Check DATABASE_URL format
# Format: postgresql://user:password@host:port/database
```

### Redis Connection Failed

```bash
# Error: Redis connection failed
# Solution: Check REDIS_URL and ensure Redis is running
```

## References

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [OWASP Secret Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12-Factor App](https://12factor.net/config)
