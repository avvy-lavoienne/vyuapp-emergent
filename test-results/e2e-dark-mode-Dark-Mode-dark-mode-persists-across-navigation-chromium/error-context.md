# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/dark-mode.spec.ts >> Dark Mode >> dark mode persists across navigation
- Location: tests/e2e/dark-mode.spec.ts:49:7

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('html')
Expected pattern: /dark/
Received string:  "satoshi_3d545b58-module__rbo34q__variable jetbrains_mono_b6826774-module__P1H3iW__variable light"
Timeout: 10000ms

Call log:
  - Expect "toHaveClass" with timeout 10000ms
  - waiting for locator('html')
    22 × locator resolved to <html lang="id" class="satoshi_3d545b58-module__rbo34q__variable jetbrains_mono_b6826774-module__P1H3iW__variable light">…</html>
       - unexpected value "satoshi_3d545b58-module__rbo34q__variable jetbrains_mono_b6826774-module__P1H3iW__variable light"

```

```yaml
- document:
  - button "Open chat"
  - text: Hana — VyuApp Support Online 20/20 pesan tersisa
  - button "Reset"
  - text: 🌸 Selamat datang di VyuApp! Saya Hana, ada yang bisa saya bantu hari ini?
  - textbox "Ketik pesan..."
  - button "Kirim pesan" [disabled]
  - dialog "Cookie consent"
  - main
  - alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Dark Mode', () => {
  4  |   test('toggle dark mode on homepage', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     const toggle = page.locator('button[aria-label*="Switch to"], button[aria-label*="Toggle theme"]').first();
  7  |     await expect(toggle).toBeVisible();
  8  |     await toggle.click();
  9  |     await page.waitForTimeout(500);
  10 |     
  11 |     // Verify html.dark class is added
  12 |     const hasDark = await page.locator('html').evaluate(el => el.classList.contains('dark'));
  13 |     expect(hasDark).toBe(true);
  14 |   });
  15 | 
  16 |   test('background color changes in dark mode', async ({ page }) => {
  17 |     await page.goto('/');
  18 |     const toggle = page.locator('button[aria-label*="Switch to"], button[aria-label*="Toggle theme"]').first();
  19 |     await expect(toggle).toBeVisible();
  20 |     
  21 |     // Enable dark mode
  22 |     await toggle.click();
  23 |     await page.waitForTimeout(500);
  24 |     
  25 |     // Check that the body has dark background
  26 |     const bgColor = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
  27 |     // Dark mode background should be dark (not white)
  28 |     expect(bgColor).not.toBe('rgb(255, 255, 255)');
  29 |   });
  30 | 
  31 |   test('toggle back to light mode', async ({ page }) => {
  32 |     await page.goto('/');
  33 |     const toggle = page.locator('button[aria-label*="Switch to"], button[aria-label*="Toggle theme"]').first();
  34 |     await expect(toggle).toBeVisible();
  35 |     
  36 |     // Toggle to dark
  37 |     await toggle.click();
  38 |     await page.waitForTimeout(500);
  39 |     const isDark = await page.locator('html').evaluate(el => el.classList.contains('dark'));
  40 |     expect(isDark).toBe(true);
  41 |     
  42 |     // Toggle back to light
  43 |     await toggle.click();
  44 |     await page.waitForTimeout(500);
  45 |     const isLight = await page.locator('html').evaluate(el => !el.classList.contains('dark'));
  46 |     expect(isLight).toBe(true);
  47 |   });
  48 | 
  49 |   test('dark mode persists across navigation', async ({ page }) => {
  50 |     await page.goto('/');
  51 |     const toggle = page.locator('button[aria-label*="Switch to"], button[aria-label*="Toggle theme"]').first();
  52 |     await expect(toggle).toBeVisible();
  53 |     
  54 |     // Enable dark mode
  55 |     await toggle.click();
  56 |     await page.waitForTimeout(500);
  57 |     
  58 |     // Navigate to portfolio and wait for full load + theme hydration
  59 |     await page.goto('/portfolio');
  60 |     await page.waitForLoadState('domcontentloaded');
  61 |     // Wait for next-themes to hydrate and apply the dark class
> 62 |     await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 10000 });
     |                                        ^ Error: expect(locator).toHaveClass(expected) failed
  63 |   });
  64 | });
  65 | 
```