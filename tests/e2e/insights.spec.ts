import { test, expect } from '@playwright/test';

test.describe('Insights', () => {
  test('insights page loads', async ({ page }) => {
    const response = await page.goto('/insights');
    expect(response?.status()).toBe(200);
    await expect(page.locator('text=Insights').first()).toBeVisible();
  });

  test('article cards render', async ({ page }) => {
    await page.goto('/insights');
    const articleLinks = page.locator('a[href^="/insights/"]');
    await expect(articleLinks.first()).toBeVisible({ timeout: 10000 });
    const count = await articleLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('category filter buttons are visible', async ({ page }) => {
    await page.goto('/insights');
    const categoryHeading = page.getByRole('heading', { name: 'Kategori' });
    await expect(categoryHeading).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Engineering")').first()).toBeVisible();
  });

  test('tag filter buttons are visible', async ({ page }) => {
    await page.goto('/insights');
    const tagHeading = page.getByRole('heading', { name: 'Tag' });
    await expect(tagHeading).toBeVisible({ timeout: 10000 });
  });

  test('search input works', async ({ page }) => {
    await page.goto('/insights');
    const searchInput = page.locator('input[placeholder*="Cari"]');
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    // Type character by character to trigger React's onChange properly
    await searchInput.click();
    await page.keyboard.type('test', { delay: 50 });
    // Press Enter to trigger immediate search
    await searchInput.press('Enter');
    // Wait for URL to update with q= parameter
    await expect(page).toHaveURL(/q=/, { timeout: 10000 });
  });

  test('click category filter updates URL', async ({ page }) => {
    await page.goto('/insights');
    const engButton = page.locator('button:has-text("Engineering")').first();
    await expect(engButton).toBeVisible({ timeout: 10000 });
    await engButton.click();
    await expect(page).toHaveURL(/category=/, { timeout: 10000 });
  });

  test('article detail page loads', async ({ page }) => {
    await page.goto('/insights');
    const firstArticle = page.locator('a[href^="/insights/"]').first();
    await expect(firstArticle).toBeVisible({ timeout: 10000 });
    await firstArticle.click();
    await page.waitForURL(/\/insights\//);
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });

  test('related articles section exists on detail page', async ({ page }) => {
    await page.goto('/insights');
    const firstArticle = page.locator('a[href^="/insights/"]').first();
    await expect(firstArticle).toBeVisible({ timeout: 10000 });
    const href = await firstArticle.getAttribute('href');
    await page.goto(href!);
    await expect(page.locator('text=Artikel terkait').first()).toBeVisible({ timeout: 10000 });
  });

  test('prev/next navigation exists on detail page', async ({ page }) => {
    await page.goto('/insights');
    const firstArticle = page.locator('a[href^="/insights/"]').first();
    await expect(firstArticle).toBeVisible({ timeout: 10000 });
    const href = await firstArticle.getAttribute('href');
    await page.goto(href!);
    const nav = page.locator('nav').filter({ has: page.locator('text=Artikel') });
    await expect(nav.first()).toBeVisible({ timeout: 10000 });
  });
});
