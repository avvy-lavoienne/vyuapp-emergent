import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookie consent so it shows up
    await page.addInitScript(() => {
      localStorage.removeItem('vyuapp_cookie_consent');
    });
  });

  test('page loads successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('hero section is visible', async ({ page }) => {
    await page.goto('/');
    // Hero contains headline text
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
    // Check for headline h1
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('navbar is visible with links', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header).toBeVisible();
    // Check logo text
    await expect(page.locator('text=VyuApp').first()).toBeVisible();
  });

  test('dark mode toggle works', async ({ page }) => {
    await page.goto('/');
    // Wait for client hydration
    const toggle = page.locator('button[aria-label*="Switch to"], button[aria-label*="Toggle theme"]').first();
    await expect(toggle).toBeVisible();
    
    // Get initial state
    const initialHasDark = await page.locator('html').evaluate(el => el.classList.contains('dark'));
    
    // Click toggle
    await toggle.click();
    
    // Wait for theme change
    await page.waitForTimeout(500);
    
    const afterHasDark = await page.locator('html').evaluate(el => el.classList.contains('dark'));
    expect(afterHasDark).not.toBe(initialHasDark);
  });

  test('cookie consent banner appears', async ({ page }) => {
    await page.goto('/');
    // Cookie consent appears after 1.5s delay
    const consent = page.locator('[role="dialog"][aria-label="Cookie consent"]');
    await expect(consent).toBeVisible({ timeout: 5000 });
    // Check for accept button
    await expect(page.locator('text=Terima Semua')).toBeVisible();
  });

  test('contact form section exists', async ({ page }) => {
    await page.goto('/');
    const contactSection = page.locator('#kontak');
    await expect(contactSection).toBeAttached();
    // Check for form inputs
    await expect(page.locator('form')).toBeVisible();
  });

  test('footer renders', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    // Check footer contains email
    await expect(footer.locator('text=vyuapp@proton.me')).toBeVisible();
  });
});
