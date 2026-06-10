# Testing Strategy

## Overview

NovaStack implements a comprehensive testing strategy covering unit tests, integration tests, and E2E tests using Playwright. The testing pyramid ensures code quality, reliability, and confidence in deployments.

## Testing Pyramid

```
          E2E Tests (10%)
              ↓
        Integration Tests (30%)
              ↓
          Unit Tests (60%)
```

### Test Distribution

- **Unit Tests**: 60% - Fast, isolated tests for individual functions/components
- **Integration Tests**: 30% - Tests for API routes, database interactions
- **E2E Tests**: 10% - Full user journey tests

## Unit Testing

### Framework

**Vitest** for unit testing with TypeScript support.

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/'],
    },
  },
});
```

### Unit Test Examples

#### Function Testing

```typescript
// tests/unit/auth-utils.test.ts
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth-utils';

describe('Password Hashing', () => {
  it('should hash password', async () => {
    const password = 'testPassword123';
    const hash = await hashPassword(password);
    
    expect(hash).not.toBe(password);
    expect(hash).toHaveLength(60); // bcrypt hash length
  });
  
  it('should verify correct password', async () => {
    const password = 'testPassword123';
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });
  
  it('should reject incorrect password', async () => {
    const password = 'testPassword123';
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword('wrong', hash);
    expect(isValid).toBe(false);
  });
});
```

#### Component Testing

```typescript
// tests/unit/button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('should render button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('should call onClick handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Service Testing

```typescript
// tests/unit/permission.service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { PermissionService } from '@/services/permission.service';

describe('PermissionService', () => {
  let permissionService: PermissionService;
  
  beforeEach(() => {
    permissionService = new PermissionService();
  });
  
  it('should grant permission to administrator', async () => {
    const hasPermission = await permissionService.hasPermission(
      'admin-user-id',
      'workspace-id',
      'users',
      'delete'
    );
    
    expect(hasPermission).toBe(true);
  });
  
  it('should deny permission to user without permission', async () => {
    const hasPermission = await permissionService.hasPermission(
      'regular-user-id',
      'workspace-id',
      'users',
      'delete'
    );
    
    expect(hasPermission).toBe(false);
  });
});
```

## Integration Testing

### API Route Testing

```typescript
// tests/integration/api/users.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { POST } from '@/app/api/users/route';
import { prisma } from '@/lib/db';

describe('User API', () => {
  beforeAll(async () => {
    // Setup test database
    await prisma.user.deleteMany();
  });
  
  afterAll(async () => {
    // Cleanup
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
  
  it('should create user', async () => {
    const request = new Request('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.email).toBe('test@example.com');
  });
  
  it('should validate email', async () => {
    const request = new Request('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        name: 'Test User',
        password: 'password123',
      }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });
});
```

### Database Integration Testing

```typescript
// tests/integration/database/user.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/db';

describe('User Database Integration', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });
  
  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
  
  it('should create and retrieve user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed-password',
      },
    });
    
    const retrieved = await prisma.user.findUnique({
      where: { id: user.id },
    });
    
    expect(retrieved).not.toBeNull();
    expect(retrieved?.email).toBe('test@example.com');
  });
});
```

## E2E Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

#### Authentication Flow

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can login', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });
  
  test('user cannot login with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'wrong-password');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
  
  test('user can logout', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.click('button[aria-label="Logout"]');
    
    await expect(page).toHaveURL('/auth/login');
  });
});
```

#### Dashboard Flow

```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });
  
  test('displays dashboard overview', async ({ page }) => {
    await expect(page.locator('h1').toContainText('Dashboard')).toBeVisible();
    await expect(page.locator('text=Total Users')).toBeVisible();
    await expect(page.locator('text=Active Sessions')).toBeVisible();
  });
  
  test('navigates to users page', async ({ page }) => {
    await page.click('text=Users');
    await expect(page).toHaveURL('/dashboard/users');
    await expect(page.locator('text=User Management')).toBeVisible();
  });
});
```

#### API Testing

```typescript
// tests/e2e/api.spec.ts
import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('GET /api/users returns users', async ({ request }) => {
    const response = await request.get('/api/users');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBe(true);
  });
  
  test('POST /api/users creates user', async ({ request }) => {
    const response = await request.post('/api/users', {
      data: {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      },
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.email).toBe('new@example.com');
  });
});
```

## Test Coverage

### Coverage Goals

- **Overall Coverage**: > 80%
- **Critical Path Coverage**: 100%
- **Business Logic Coverage**: > 90%
- **UI Component Coverage**: > 70%

### Coverage Report

```bash
# Run tests with coverage
bun run test:coverage

# View coverage report
open coverage/index.html
```

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

## Testing Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// Bad: Testing implementation
it('should call prisma.user.create', async () => {
  const spy = vi.spyOn(prisma.user, 'create');
  await createUser(data);
  expect(spy).toHaveBeenCalled();
});

// Good: Testing behavior
it('should create user in database', async () => {
  const user = await createUser(data);
  const retrieved = await prisma.user.findUnique({ where: { id: user.id } });
  expect(retrieved).not.toBeNull();
});
```

### 2. Use Descriptive Test Names

```typescript
// Bad
it('works', () => {});

// Good
it('should hash password with bcrypt', () => {});
it('should reject invalid email format', () => {});
it('should redirect to dashboard after successful login', () => {});
```

### 3. Isolate Tests

```typescript
// Bad: Tests depend on each other
it('creates user', async () => {
  global.userId = await createUser();
});

it('updates user', async () => {
  await updateUser(global.userId);
});

// Good: Each test is independent
it('creates user', async () => {
  const user = await createUser();
  expect(user).toBeDefined();
});

it('updates user', async () => {
  const user = await createUser();
  const updated = await updateUser(user.id);
  expect(updated.name).toBe('Updated');
});
```

### 4. Use Test Data Builders

```typescript
// tests/builders/user.builder.ts
export class UserBuilder {
  private user: Partial<User> = {
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
  };
  
  withEmail(email: string) {
    this.user.email = email;
    return this;
  }
  
  withName(name: string) {
    this.user.name = name;
    return this;
  }
  
  withRole(role: UserRole) {
    this.user.role = role;
    return this;
  }
  
  build() {
    return this.user as User;
  }
}

// Usage
const user = new UserBuilder()
  .withEmail('admin@example.com')
  .withRole('ADMINISTRATOR')
  .build();
```

### 5. Mock External Dependencies

```typescript
// tests/mocks/email.service.mock.ts
import { vi } from 'vitest';

export const emailService = {
  sendEmail: vi.fn().mockResolvedValue(undefined),
};

// tests/unit/auth.service.test.ts
import { emailService } from '@/services/email.service';

vi.mock('@/services/email.service', () => ({
  emailService,
}));

it('should send welcome email', async () => {
  await authService.register(userData);
  expect(emailService.sendEmail).toHaveBeenCalledWith(
    userData.email,
    'Welcome'
  );
});
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - run: bun install
      
      - run: bun run test:unit
      
      - run: bun run test:integration
      
      - run: bun run test:e2e:install
      
      - run: bun run test:e2e
      
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## Test Data Management

### Database Seeding

```typescript
// tests/seed.ts
import { prisma } from '@/lib/db';

export async function seedDatabase() {
  await prisma.user.deleteMany();
  
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@example.com',
        name: 'Admin User',
        password: await hashPassword('password123'),
        role: 'ADMINISTRATOR',
      },
      {
        email: 'user@example.com',
        name: 'Regular User',
        password: await hashPassword('password123'),
        role: 'USER',
      },
    ],
  });
}
```

### Test Fixtures

```typescript
// tests/fixtures.ts
export const fixtures = {
  users: {
    admin: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'password123',
      role: 'ADMINISTRATOR',
    },
    user: {
      email: 'user@example.com',
      name: 'Regular User',
      password: 'password123',
      role: 'USER',
    },
  },
  workspaces: {
    default: {
      name: 'Test Workspace',
      slug: 'test-workspace',
    },
  },
};
```

## Future Enhancements

### Load Testing

Use k6 or Artillery for load testing:

```javascript
// load-test.js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  let res = http.get('http://localhost:3000/api/users');
  check(res, { 'status was 200': (r) => r.status == 200 });
}
```

### Security Testing

Use OWASP ZAP or similar tools:

```bash
# Run OWASP ZAP
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000
```

### Visual Regression Testing

Use Percy or similar:

```typescript
// tests/e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test('dashboard visual regression', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('dashboard.png');
});
```

## References

- [Playwright Documentation](https://playwright.dev)
- [Vitest Documentation](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
