import { test, expect } from '@playwright/test';

test.describe('Dark Mode', () => {
  test('toggle dark mode on homepage', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label*="Switch to"], button[aria-label*="Toggle theme"]').first();
    await expect(toggle).toBeVisible();
    await toggle.click();

    // Wait for html.dark class to be reliably applied
    await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 5000 });
  });

  test('background color changes in dark mode', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label*="Switch to"], button[aria-label*="Toggle theme"]').first();
    await expect(toggle).toBeVisible();
    
    // Enable dark mode
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 5000 });
    
    // Check that the body has dark background
    const bgColor = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
    // Dark mode background should be dark (not white)
    expect(bgColor).not.toBe('rgb(255, 255, 255)');
  });

  test('toggle back to light mode', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label*="Switch to"], button[aria-label*="Toggle theme"]').first();
    await expect(toggle).toBeVisible();
    
    // Toggle to dark
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 5000 });
    
    // Toggle back to light — wait for class to change via auto-retry
    await toggle.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/, { timeout: 5000 });
  });

  test('dark mode persists across navigation', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label*="Switch to"], button[aria-label*="Toggle theme"]').first();
    await expect(toggle).toBeVisible();
    
    // Enable dark mode
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 5000 });
    
    // Navigate to portfolio and wait for full load + theme hydration
    await page.goto('/portfolio');
    await page.waitForLoadState('domcontentloaded');
    // Wait for next-themes to hydrate and apply the dark class
    await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 10000 });
  });
});
