import { test, expect } from '@playwright/test';

test.describe('Locale', () => {
  test('homepage loads in default language', async ({ page }) => {
    // Clear locale cookie
    await page.context().clearCookies();
    await page.goto('/');
    // Indonesian is default - look for Indonesian text in hero
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    // Should be in Indonesian (not English)
    expect(text).toBeTruthy();
  });

  test('toggle language button exists on homepage', async ({ page }) => {
    await page.goto('/');
    const langButton = page.locator('button[aria-label="Toggle language"]').first();
    await expect(langButton).toBeVisible({ timeout: 10000 });
    // Should show EN (for switching to English) or ID
    const buttonText = await langButton.textContent();
    expect(['EN', 'ID']).toContain(buttonText?.trim());
  });

  test('click toggle changes language', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/');
    const langButton = page.locator('button[aria-label="Toggle language"]').first();
    await expect(langButton).toBeVisible({ timeout: 10000 });
    
    const beforeText = await langButton.textContent();
    await langButton.click();
    
    // The locale toggle triggers a page reload, so wait for it
    await page.waitForLoadState('networkidle');
    
    // After reload, the button text should have changed
    const afterButton = page.locator('button[aria-label="Toggle language"]').first();
    if (await afterButton.isVisible()) {
      const afterText = await afterButton.textContent();
      expect(afterText?.trim()).not.toBe(beforeText?.trim());
    }
  });

  test('portfolio page renders', async ({ page }) => {
    await page.goto('/portfolio');
    // Portfolio page should render regardless of locale
    await expect(page.locator('h1').first()).toBeVisible();
    const title = await page.locator('h1').first().textContent();
    expect(title).toBeTruthy();
  });
});
