# NovaStack

<div align="center">

**Production-ready Next.js SaaS Starter Kit engineered for scalable systems beyond the limits of the universe**

A battle-tested, scalable foundation for building enterprise-grade SaaS applications, internal business platforms, and AI-powered dashboards.

[Documentation](docs/) · [Report Issue](../../issues) · [Contributing](#contributing)

</div>

---

## Value Proposition

**NovaStack** is not just another boilerplate—it's a comprehensive architectural foundation designed to eliminate months of foundational engineering work. Unlike traditional templates that provide only UI components, this platform delivers a complete production-ready system with:

- **Multi-tenant architecture** with workspace isolation
- **Enterprise-grade authentication** with RBAC
- **CMS-ready foundation** for content management
- **AI integration layer** with provider abstraction
- **Container-native deployment** with Podman/Docker support
- **World-class documentation** for immediate team onboarding

Built for teams who need to ship fast without compromising on quality, security, or scalability.

---

## Screenshots

<!-- Screenshots will be added here -->

---

## What You Can Build

With NovaStack, you can build:

- **SaaS Applications** - Multi-tenant SaaS products with subscription management
- **Internal Business Platforms** - Enterprise dashboards and business intelligence tools
- **Content Management Systems** - Headless CMS with rich editing capabilities
- **AI-Powered Applications** - Applications with integrated AI features
- **Multi-Organization Systems** - Platforms supporting multiple organizations and workspaces
- **API-First Services** - RESTful APIs with comprehensive documentation

---

## Core Features

### Authentication & Security
- NextAuth.js with credentials provider
- reCAPTCHA v3/v2 with automatic fallback
- Rate limiting (API: 30/min, Auth: 5/15min)
- Role-Based Access Control (RBAC)
- Bcrypt password hashing (12 salt rounds)
- JWT tokens with secure cookie management
- CSRF protection and session management

### Multi-Tenancy
- Workspace-based data isolation
- Organization management
- Team collaboration features
- Membership management with roles
- Tenant context propagation

### Data Management
- TanStack Query v5 for server state
- Zustand for client state management
- Zod schemas for type validation
- React Hook Form with resolver integration
- Hybrid DataTable (client/server pagination)

### UI Components
- Shadcn/ui component library
- Tailwind CSS 4 with custom design system
- Lucide React icons
- Responsive design (mobile-first)
- Dark mode with theme persistence
- Glassmorphism effects and gradients

### Developer Experience
- TypeScript strict mode
- ESLint with Next.js config
- Playwright E2E testing
- GitHub Actions CI/CD pipeline
- Structured logging (Winston + Pino)
- Hot reload and fast refresh

---

## Architecture Overview

NovaStack follows **Clean Architecture** principles with a **feature-first** organization:

```
┌─────────────────────────────────────────┐
│         Presentation Layer             │
│  (Next.js App Router, React Components) │
├─────────────────────────────────────────┤
│         Application Layer              │
│  (Business Logic, Services, Hooks)      │
├─────────────────────────────────────────┤
│            Domain Layer                │
│  (Entities, Value Objects, Types)       │
├─────────────────────────────────────────┤
│       Infrastructure Layer             │
│  (Database, Cache, External APIs)       │
└─────────────────────────────────────────┘
```

**Key Architectural Principles:**
- Clean Architecture with clear separation of concerns
- Feature-first folder organization
- Server-first approach with Next.js Server Components
- Type safety with TypeScript strict mode
- SOLID principles throughout

For detailed architecture documentation, see [docs/architecture.md](docs/architecture.md).

---

## Technology Stack

### Core Framework
- **Next.js 16** with App Router & React 19
- **TypeScript** with strict mode
- **Bun** runtime for optimal performance

### Styling & UI
- **Tailwind CSS 4** with custom design system
- **Shadcn/ui** component library
- **Lucide React** icons

### Data & State
- **Prisma ORM** with PostgreSQL
- **TanStack Query v5** for server state
- **Zustand** for client state
- **Zod** for validation

### Authentication
- **NextAuth.js** for authentication
- **Bcrypt** for password hashing
- **reCAPTCHA** for bot protection

### Testing
- **Playwright** for E2E testing
- **Vitest** for unit testing
- **Testing Library** for component testing

### Deployment
- **Podman** (primary container runtime)
- **Docker** (compatible)
- **Vercel** (recommended for Next.js)

---

## CMS Module

The platform includes a CMS-ready foundation for content management:

**Current Features:**
- Page and post management
- Category and tag organization
- Media library
- Author profiles
- SEO metadata
- Version history

**Planned Features:**
- Rich text editor integration
- Page builder
- Multi-site CMS
- Localization support

For detailed CMS documentation, see [docs/cms-module.md](docs/cms-module.md).

---

## AI Layer

Built-in AI integration with provider abstraction:

**Supported Providers:**
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Google Gemini
- Groq
- Ollama (local models)

**Features:**
- Provider switching and fallback
- Streaming responses
- Structured output
- Rate limiting per provider
- Request logging and cost tracking

For detailed AI documentation, see [docs/ai-integration.md](docs/ai-integration.md).

---

## Multi-Tenant Support

Complete multi-tenant architecture:

**Entities:**
- Organizations (top-level)
- Workspaces (tenant units)
- Teams (collaboration groups)
- Memberships (user associations)
- Roles and Permissions

**Features:**
- Data isolation per workspace
- Workspace switching
- Team collaboration
- Granular permissions
- Audit logging

For detailed multi-tenancy documentation, see [docs/multi-tenancy.md](docs/multi-tenancy.md).

---

## Folder Structure

```
src/
  app/                    # Next.js App Router
    api/                 # API routes
    auth/                # Authentication pages
    dashboard/           # Protected dashboard
  components/            # Reusable components
    ui/                 # Base UI components (shadcn/ui)
    features/           # Feature-specific components
  lib/                  # Core utilities
    auth.ts            # Authentication configuration
    db.ts              # Database client (Prisma)
    logger.ts          # Logging system
    rate-limiter.ts    # Rate limiting
  services/             # Business logic services
    user.service.ts
    permission.service.ts
  middlewares/          # Next.js middleware
    auth.ts
    role.ts
  types/               # TypeScript definitions
  hooks/               # Custom React hooks
  store/               # Zustand stores
docs/                  # Comprehensive documentation
tests/                 # Test files
```

For detailed folder structure documentation, see [docs/folder-structure.md](docs/folder-structure.md).

---

## Documentation

This project includes comprehensive documentation:

- **[Product Overview](docs/product-overview.md)** - Product positioning and value proposition
- **[Product Requirements (PRD)](docs/product-requirement-document.md)** - Detailed requirements
- **[System Design (SDD)](docs/system-design-description.md)** - System architecture and design
- **[Architecture](docs/architecture.md)** - Technical architecture details
- **[Engineering Principles](docs/engineering-principles.md)** - Coding standards and principles
- **[Database Design](docs/database-design.md)** - Database schema and design
- **[Multi-Tenancy](docs/multi-tenancy.md)** - Multi-tenant architecture
- **[CMS Module](docs/cms-module.md)** - Content management system
- **[AI Integration](docs/ai-integration.md)** - AI provider abstraction
- **[Authentication Flow](docs/authentication-flow.md)** - Authentication implementation
- **[Authorization & RBAC](docs/authorization-rbac.md)** - Access control system
- **[Caching Strategy](docs/caching-strategy.md)** - Redis caching implementation
- **[API Design Guidelines](docs/api-design-guidelines.md)** - API standards
- **[Testing Strategy](docs/testing-strategy.md)** - Testing approach
- **[Development Guide](docs/development-guide.md)** - Development workflow
- **[Deployment](docs/deployment.md)** - Deployment strategies
- **[Docker & Podman](docs/docker-podman.md)** - Container deployment
- **[Environment Variables](docs/environment-variables.md)** - Configuration reference
- **[Roadmap](docs/roadmap.md)** - Future development plans

---

## Local Development

### Prerequisites

- Node.js 18+ or Bun latest
- PostgreSQL 15+
- Redis 7+ (optional, for caching)
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd novastack

# Install dependencies
bun install

# Setup environment variables
cp .env.example .env

# Run database migrations
bunx prisma migrate dev

# Start development server
bun dev
```

Open http://localhost:3000 in your browser.

### Environment Variables

Required variables:
```env
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/database
```

For complete environment variable reference, see [docs/environment-variables.md](docs/environment-variables.md).

---

## Production Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Docker/Podman

```bash
# Build image
podman build -t nextjs-app .

# Run container
podman run -d -p 3000:3000 nextjs-app
```

### Kubernetes

See [docs/deployment.md](docs/deployment.md) for detailed deployment strategies.

---

## Roadmap

### Phase 1: Foundation ✅
- Core authentication and authorization
- Multi-tenant architecture
- Basic dashboard UI
- Database schema

### Phase 2: CMS Module 🚧
- Page and post management
- Media library
- Rich text editor
- SEO features

### Phase 3: Multi-Tenant Complete 🚧
- Workspace management
- Team collaboration
- Advanced permissions

### Phase 4: AI Layer 🚧
- Provider abstraction
- Streaming responses
- Cost tracking

For detailed roadmap, see [docs/roadmap.md](docs/roadmap.md).

---

## Contributing

We welcome contributions! Please follow these guidelines:

1. Read the [Development Guide](docs/development-guide.md)
2. Read [Engineering Principles](docs/engineering-principles.md)
3. Create a feature branch
4. Follow commit conventions
5. Write tests for new features
6. Update documentation
7. Submit a pull request

### Code Standards

- TypeScript strict mode (no `any` types)
- Follow existing patterns
- No code duplication
- Feature-first organization
- Server-first approach

---

## License

MIT License - feel free to use in commercial projects.

---

<div align="center">

**Built with ❤️ for enterprise teams**

[Documentation](docs/) · [GitHub](../../) · [Issues](../../issues)

</div>
