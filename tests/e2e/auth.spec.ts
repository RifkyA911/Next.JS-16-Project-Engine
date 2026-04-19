import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Login to your account');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('[role="alert"]')).toBeVisible();
    await expect(page.locator('[role="alert"]')).toContainText('Email atau password salah');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Should show dashboard content
    await expect(page.locator('h1, h2, .dashboard-title').first()).toBeVisible();
  });

  test('should handle rate limiting', async ({ page }) => {
    // Try multiple failed login attempts
    for (let i = 0; i < 6; i++) {
      await page.fill('input[type="email"]', 'admin@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      // Wait a bit between attempts
      await page.waitForTimeout(100);
    }

    // Should show rate limit error
    await expect(page.locator('text=/too many requests|rate limit/i')).toBeVisible();
  });

  test('should redirect authenticated users away from login', async ({ page }) => {
    // First login
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // Try to access login again
    await page.goto('/auth/login');
    
    // Should redirect back to dashboard
    await expect(page).toHaveURL('/dashboard');
  });
});

test.describe('Dashboard Access', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should access dashboard when authenticated', async ({ page }) => {
    await expect(page.locator('h1, h2, .dashboard-title').first()).toBeVisible();
  });

  test('should prevent access to protected routes when not authenticated', async ({ context }) => {
    // Create new context (no auth)
    const newPage = await context.newPage();
    
    // Try to access dashboard directly
    await newPage.goto('/dashboard');
    
    // Should redirect to login
    await expect(newPage).toHaveURL('/auth/login');
  });
});
