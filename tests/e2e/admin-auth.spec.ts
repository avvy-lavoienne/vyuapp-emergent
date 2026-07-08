import { test, expect } from '@playwright/test';

// Admin credentials: read from env or use fallbacks
const ADMIN_EMAIL = process.env.SUPABASE_ADMIN_EMAIL || 'admin@vyuapp.my.id';
const ADMIN_PASSWORD = process.env.SUPABASE_ADMIN_DEFAULT_PASSWORD || 'admin123';

/** Helper: fill login form and submit, wait for redirect to /admin */
async function loginAs(page: any, email: string, password: string) {
  await page.goto('/admin/login');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('**/admin', { timeout: 15000 });
}

test.describe('Admin Auth', () => {

  test('E2 - Login page renders form with email and password inputs', async ({ page }) => {
    await page.goto('/admin/login');

    // Heading
    await expect(page.locator('h1')).toContainText('Masuk ke Dasbor');

    // Email and password inputs visible
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Submit button
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText('Masuk');

    // Hidden "next" input defaults to /admin
    await expect(page.locator('input[name="next"]')).toHaveAttribute('value', '/admin');
  });

  test('E4 - Login with valid credentials redirects to /admin', async ({ page }) => {
    await page.goto('/admin/login');

    await page.locator('input[name="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[name="password"]').fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').click();

    // Redirects to /admin dashboard
    await page.waitForURL('**/admin', { timeout: 15000 });
    expect(page.url()).toContain('/admin');

    // Dashboard content visible (article management heading)
    await expect(page.locator('text=Manajemen Artikel').first()).toBeVisible({ timeout: 10000 });
  });

  test('E3 - Login with invalid credentials shows error message', async ({ page }) => {
    await page.goto('/admin/login');

    await page.locator('input[name="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[name="password"]').fill('wrongpassword123');
    await page.locator('button[type="submit"]').click();

    // Should remain on login page
    await expect(page).toHaveURL(/\/admin\/login/);

    // Error message with AlertTriangle icon should appear
    const errorArea = page.locator('div').filter({ hasText: /Invalid login|Invalid email|invalid|Incorrect|error|Email dan password/ }).first();
    await expect(errorArea).toBeVisible({ timeout: 10000 });
  });

  test('Client-side validation: empty email and short password', async ({ page }) => {
    await page.goto('/admin/login');

    // Test empty email validation
    await page.locator('input[name="email"]').fill('');
    await page.locator('input[name="password"]').fill('test123');
    await page.locator('button[type="submit"]').click();

    // Client-side shows "Email wajib diisi."
    const emailErr = page.locator('div').filter({ hasText: /Email wajib diisi/ }).first();
    await expect(emailErr).toBeVisible({ timeout: 5000 });

    // Test short password validation
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('123');
    await page.locator('button[type="submit"]').click();

    // Client-side shows "Password minimal 6 karakter."
    const pwErr = page.locator('div').filter({ hasText: /Password minimal 6 karakter/ }).first();
    await expect(pwErr).toBeVisible({ timeout: 5000 });
  });

  test('E6 - Logout redirects to /admin/login', async ({ page }) => {
    // Login first
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Click logout button
    const logoutBtn = page.locator('button:has-text("Logout")').first();
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // Should redirect to /admin/login
    await page.waitForURL('**/admin/login', { timeout: 15000 });
    expect(page.url()).toContain('/admin/login');

    // Login form visible again
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('E1 - Unauthenticated /admin access redirects to /admin/login', async ({ page }) => {
    // Clear cookies to ensure no session
    const context = page.context();
    await context.clearCookies();

    // Navigate to /admin without auth
    await page.goto('/admin');

    // Middleware redirects to /admin/login?next=/admin
    await page.waitForURL('**/admin/login**', { timeout: 15000 });
    expect(page.url()).toContain('/admin/login');

    // Login form should be present
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
