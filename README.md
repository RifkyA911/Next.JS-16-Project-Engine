#  Next.JS 16 Project Engine
### *Production-Ready Template for Modern Web Applications*

A comprehensive **Next.js 16 template** engineered for enterprise-grade applications. Built with React 19, TypeScript, and modern best practices for rapid development and deployment.

---

##  Core Features

###  **Modern Stack** ⚡
-  **Next.js 16** with App Router & React 19
-  **TypeScript** with strict mode and path aliases
-  **Bun** runtime for optimal performance
-  **Tailwind CSS 4** with custom design system

###  **Authentication & Security** 🔐
-  **NextAuth.js** with credentials provider
-  **Bcrypt** password hashing (12 salt rounds)
-  **reCAPTCHA v3/v2** with automatic fallback
-  **Rate limiting** (API: 30/min, Auth: 5/15min)
-  **Middleware chain** with RBAC protection
-  **JWT tokens** with secure cookie management
-  **CSRF protection** and session management

###  **Data Management** 📊
-  **TanStack Query v5** for server state
-  **Zustand** for client state management
-  **Hybrid DataTable** (client/server pagination)
-  **Zod** schemas for type validation
-  **React Hook Form** with resolver integration

###  **UI Components** Palette
-  **Shadcn/ui** component library
-  **Tailwind CSS 4** with custom design
-  **Lucide React** icons
-  **Responsive Design** mobile-first
-  **Dark Mode** with theme toggle
-  **Component Variants** and theming
-  **Professional Footer** with social links
-  **Glassmorphism** effects and gradientsteractions
-  **Dark mode** with theme persistence

###  **Developer Experience** 🛠️
-  **ESLint** with Next.js config
-  **Playwright** E2E testing
-  **GitHub Actions** CI/CD pipeline
-  **Structured logging** (Winston + Pino)
-  **Hot reload** and fast refresh
-  **Error boundaries** and handling

###  **New Features** 🚀
-  **reCAPTCHA** v3/v2 with automatic fallback
-  **Theme Toggle** with dark/light mode persistence
-  **Professional Footer** with social media links
-  **SEO Optimization** with dynamic sitemap and metadata
-  **Enhanced Login UI** with modern design patterns
-  **Responsive Navbar** with mobile menu support
-  **Password Visibility** toggle for better UX
-  **Auth Pages** (login, register, forgot password)
-  **200 Mock Users** for demonstration (20 pages)
-  **Public/Internal** deployment modes
-  **Product Inventory** page with 150 dummy products
-  **Standalone Profile** page with comprehensive user info
-  **Settings General** page with preferences and security
-  **Mobile Sidebar** fixes with proper menu closing
-  **Data Table** fixes for tab switching stability
-  **Sidebar Grouping** into Application, Master Data, and Settings sections
-  **Professional Dashboard** with charts, stats, and activity feeds
-  **Mail-like Inbox** interface with categories and email management
-  **Shimmer Loading** components for better UX during data loading
-  **Mobile Navbar** improvements with avatar-only display and popup menus
-  **Enhanced Charts** using CSS-based visualizations for dashboard
-  **Company Logo & Switcher** in sidebar header for multi-company support
-  **Fixed Dashboard Charts** with proper colors and 3/4 chart, 1/4 category layout
-  **Settings Sub-Menus** with nested structure (General, Security, Appearance)
- **Navbar Profile Navigation** with proper Next.js Link integration
- **Users Page Overhaul** with new UI, search, filtering, and dummy data API
- **Mobile Sidebar Auto-Close** when menu items are clicked
- **Black/White Login Theme** matching Shadcn UI design principles
- **Dynamic Footer Year** using JavaScript Date for automatic updates

---

##  Project Structure  📁

```
src/
  app/                 #  Next.js App Router
    api/              #  API routes
    auth/             #  Authentication pages
    dashboard/        #  Protected dashboard
    errors/           #  Error pages
  components/         #  Reusable components
    ui/              #  Base UI components
    organisms/       #  Complex components
    examples/        #  Demo components
  lib/               #  Core utilities
    auth-utils.ts    #  Authentication helpers
    logger.ts        #  Logging system
    rate-limiter.ts  #  Rate limiting
    jwt.ts          #  JWT utilities
  middlewares/       #  Next.js middleware
    auth.ts         #  Authentication middleware
    role.ts         #  RBAC middleware
    logger.ts       #  Request logging
  types/            #  TypeScript definitions
  utils/            #  Helper functions
  hooks/            #  Custom React hooks
  store/            #  Zustand stores
```

---

##  Quick Start  🚀

###  **Prerequisites**  ✅
-  Node.js 18+ or Bun latest
-  Git installed

###  **Installation**  📦
```bash
# Clone the repository
git clone <repository-url>
cd next-js-16-project-engine

# Install dependencies
bun install

# Setup environment variables
cp .env.example .env
```

###  **Environment Variables**  🔑
```env
# Authentication
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret

# Development (optional)
NEXT_PUBLIC_DEBUG_MODE=true
```

###  **Run Development**  ▶️
```bash
# Start development server
bun dev

# Open http://localhost:3000
```

---

##  Authentication Guide  🔐

###  **reCAPTCHA Integration**  🤖
-  **Primary**: reCAPTCHA v3 (invisible, score-based)
-  **Fallback**: reCAPTCHA v2 (invisible, checkbox)  
-  **Automatic**: Seamless fallback when v3 fails
-  **Environment**: Separate keys for v3 and v2

###  **Demo Credentials**  👤
-  **Admin**: `admin@example.com` / `123456`
-  **User**: `user@example.com` / `123456`

###  **Protected Routes**  🛡️
-  `/dashboard` - Authenticated users only
-  `/dashboard/users` - Admin only
-  `/api/*` - Rate limited endpoints

###  **Role-Based Access**  👑
```typescript
// Role permissions in src/middlewares/role.ts
const userForbiddenRoutes = {
  administrator: ["!"], // Full access
  user: ["/dashboard/users"], // Restricted
  guest: ["/dashboard"], // No access
};
```

---

##  Testing  🧪

###  **E2E Testing**  🤖
```bash
# Install Playwright browsers
bun run test:e2e:install

# Run all tests
bun run test:e2e

# Run with UI
bun run test:e2e:ui

# Debug mode
bun run test:e2e:debug
```

###  **Test Coverage**  ✅
-  Authentication flow
-  Login/logout functionality
-  Rate limiting behavior
-  Dashboard access
-  Error page handling

---

##  Deployment  ☁️

###  **Vercel (Recommended)**  🚀
1. Connect repository to Vercel
2. Add environment variables
3. Deploy automatically on push to main

###  **Manual Deployment**  🖥️
```bash
# Build for production
bun run build

# Start production server
bun start
```

###  **Docker Support**  🐳
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json bun.lockb ./
RUN npm install -g bun && bun install
COPY . .
RUN bun run build
EXPOSE 3000
CMD ["bun", "start"]
```

---

##  API Documentation  🔌

###  **Authentication Endpoints**  🔑
-  `POST /api/auth/callback/credentials` - Login
-  `GET /api/auth/session` - Get session
-  `POST /api/auth/signout` - Logout

###  **Example API**  💻
-  `POST /api/example/auth/login` - Demo login endpoint
-  `GET /api/example/dashboard/sidebar-menu` - Menu data

###  **Rate Limiting Headers**  ⏱️
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

##  Customization Guide  🔧

###  **Adding New Pages**  ➕
```typescript
// src/app/dashboard/new-page/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");
  
  return <div>Your protected content</div>;
}
```

###  **Adding API Routes**  🔌
```typescript
// src/app/api/your-route/route.ts
import { createRateLimitMiddleware, apiLimiter } from "@/lib/rate-limiter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const rateLimit = await createRateLimitMiddleware(apiLimiter)(req);
  if (rateLimit) return rateLimit;
  
  // Your API logic
  return NextResponse.json({ message: "Success" });
}
```

###  **Custom Components**  🧩
```typescript
// src/components/ui/your-component.tsx
import { cn } from "@/lib/utils";

interface YourComponentProps {
  className?: string;
  children: React.ReactNode;
}

export function YourComponent({ className, children }: YourComponentProps) {
  return (
    <div className={cn("p-4 rounded-lg", className)}>
      {children}
    </div>
  );
}
```

---

##  Performance Features  ⚡

###  **Optimizations**  📈
-  **Image optimization** with Next.js Image
-  **Code splitting** automatic
-  **Tree shaking** enabled
-  **Bundle analyzer** ready
-  **Caching strategies** implemented

###  **Monitoring**  📊
-  **Request logging** with performance metrics
-  **Error tracking** with detailed logs
-  **Rate limiting** metrics
-  **User activity** tracking

---

##  Security Features  🔒

###  **Implemented**  ✅
-  **Password hashing** with bcrypt
-  **Rate limiting** on all endpoints
-  **CSRF protection** via NextAuth
-  **Secure cookies** (httpOnly, secure, sameSite)
-  **Input validation** with Zod
-  **SQL injection** prevention (no direct DB access)

###  **Best Practices**  ⭐
-  **Environment variables** for secrets
-  **Error handling** without information leakage
-  **CORS** configuration ready
-  **Content Security Policy** headers

---

##  Contributing  🤝

###  **Development Workflow**  🔄
1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests: `bun run test:e2e`
5. Submit pull request

###  **Code Standards**  📚
-  Use TypeScript strictly
-  Follow ESLint rules
-  Add tests for new features
-  Update documentation

---

##  Support & License  ℹ️

###  **Getting Help**  ❓
-  Check the [Issues](../../issues) page
-  Read the [Wiki](../../wiki) documentation
-  Join our community discussions

###  **License**  📄
MIT License - feel free to use in commercial projects

---

**Built with ❤️ by the Engineering Team**
