import { test, expect } from '@playwright/test';

test.describe('Dark Mode', () => {
  test('toggle dark mode on homepage', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label*="Switch to"], button[aria-label*="Toggle theme"]').first();
    await expect(toggle).toBeVisible();
    await toggle.click();
    await page.waitForTimeout(500);
    
    // Verify html.dark class is added
    const hasDark = await page.locator('html').evaluate(el => el.classList.contains('dark'));
    expect(hasDark).toBe(true);
  });

  test('background color changes in dark mode', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label*="Switch to"], button[aria-label*="Toggle theme"]').first();
    await expect(toggle).toBeVisible();
    
    // Enable dark mode
    await toggle.click();
    await page.waitForTimeout(500);
    
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
    await page.waitForTimeout(500);
    const isDark = await page.locator('html').evaluate(el => el.classList.contains('dark'));
    expect(isDark).toBe(true);
    
    // Toggle back to light
    await toggle.click();
    await page.waitForTimeout(500);
    const isLight = await page.locator('html').evaluate(el => !el.classList.contains('dark'));
    expect(isLight).toBe(true);
  });

  test('dark mode persists across navigation', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label*="Switch to"], button[aria-label*="Toggle theme"]').first();
    await expect(toggle).toBeVisible();
    
    // Enable dark mode
    await toggle.click();
    await page.waitForTimeout(500);
    
    // Navigate to portfolio and wait for full load + theme hydration
    await page.goto('/portfolio');
    await page.waitForLoadState('domcontentloaded');
    // Wait for next-themes to hydrate and apply the dark class
    await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 10000 });
  });
});
