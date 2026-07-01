import { test, expect } from '@playwright/test';

test.describe('Portfolio', () => {
  test('portfolio page loads', async ({ page }) => {
    const response = await page.goto('/portfolio');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Sellica product is visible', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page.locator('text=Sellica').first()).toBeVisible({ timeout: 10000 });
  });

  test('Avalon product is visible', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page.locator('text=Avalon').first()).toBeVisible({ timeout: 10000 });
  });

  test('dark mode toggle works on portfolio', async ({ page }) => {
    await page.goto('/portfolio');
    const toggle = page.locator('button[aria-label*="Switch to"], button[aria-label*="Toggle theme"]').first();
    await expect(toggle).toBeVisible();
    
    const initialHasDark = await page.locator('html').evaluate(el => el.classList.contains('dark'));
    await toggle.click();
    await page.waitForTimeout(500);
    
    const afterHasDark = await page.locator('html').evaluate(el => el.classList.contains('dark'));
    expect(afterHasDark).not.toBe(initialHasDark);
  });

  test('product detail links work', async ({ page }) => {
    await page.goto('/portfolio');
    // Check for Request Collaboration links (/#kontak)
    const collabLinks = page.locator('a[href="/#kontak"]');
    const count = await collabLinks.count();
    expect(count).toBeGreaterThan(0);
    
    // Check for navigation back to /portfolio links
    const portfolioLinks = page.locator('a[href="/portfolio"]');
    const pCount = await portfolioLinks.count();
    expect(pCount).toBeGreaterThan(0);
  });

  test('other work section is visible', async ({ page }) => {
    await page.goto('/portfolio');
    // The section header has overline "Proyek Lain" (ID) or "Other Work" (EN)
    await expect(page.locator('text=/Proyek Lain|Other Work/').first()).toBeVisible({ timeout: 10000 });
  });
});
