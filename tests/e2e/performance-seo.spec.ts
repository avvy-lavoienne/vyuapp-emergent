import { test, expect } from '@playwright/test';

const PUBLIC_ROUTES = ['/', '/about', '/portfolio', '/insights', '/privacy', '/tos'];

test.describe('Performance & SEO', () => {
  // I1. Meta tags present
  test('I1: meta tags present on homepage', async ({ page }) => {
    await page.goto('/');

    // Title
    const title = await page.title();
    expect(title).toBeTruthy();

    // Description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();

    // Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();

    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDescription).toBeTruthy();
  });

  // I2. Canonical URL
  test('I2: canonical URL is present and correct', async ({ page }) => {
    await page.goto('/');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);

    const href = await canonical.getAttribute('href');
    expect(href).toBeTruthy();
    // Canonical should point to the production domain
    expect(href).toMatch(/^https?:\/\//);
    expect(href).toMatch(/\/?$/);
  });

  // I3. Robots meta
  test('I3: public pages have robots meta index,follow', async ({ page }) => {
    for (const route of PUBLIC_ROUTES) {
      await page.goto(route);

      const robots = page.locator('meta[name="robots"]');
      await expect(robots).toHaveCount(1);
      const content = await robots.getAttribute('content');
      expect(content).toBe('index, follow');
    }
  });

  // I4. No JS errors
  test('I4: no uncaught JS errors on homepage', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', (err) => {
      errors.push(err.message);
    });

    await page.goto('/');
    // Allow pending scripts to settle
    await page.waitForTimeout(2000);

    expect(errors).toEqual([]);
  });

  // I5. Images alt text
  test('I5: all images on homepage have non-empty alt attribute', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt, `Image ${i} missing alt attribute`).not.toBeNull();
      expect(alt, `Image ${i} has empty alt`).not.toBe('');
    }
  });

  // I6. Heading hierarchy
  test('I6: heading hierarchy is correct on public pages', async ({ page }) => {
    const routesToCheck = ['/', '/about', '/portfolio'];

    for (const route of routesToCheck) {
      await page.goto(route);

      // Exactly one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count, `${route}: expected exactly 1 h1, found ${h1Count}`).toBe(1);

      // Check heading hierarchy: no h3 before h2, no h4 before h3, etc.
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      let prevLevel = 0;
      for (const h of headings) {
        const tag = await h.evaluate((el) => el.tagName.toLowerCase());
        const level = parseInt(tag.charAt(1));
        // Each heading should be at most one level deeper than the previous
        if (prevLevel > 0) {
          expect(level, `${route}: heading h${level} too deep after h${prevLevel}`).toBeLessThanOrEqual(prevLevel + 1);
        }
        prevLevel = level;
      }
    }
  });

  // I7. Sitemap valid
  test('I7: sitemap.xml is valid and contains all public routes', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<urlset');

    // Check for all expected public routes — sitemap uses absolute URLs
    const expectedRoutes = [
      ...PUBLIC_ROUTES,
    ];

    for (const route of expectedRoutes) {
      // Match either relative path or absolute URL containing this path
      const pathPattern = route === '/' ? '<loc>[^<]*/</loc>' : `<loc>[^<]*${route.replace(/\//g, '\\/')}</loc>`;
      expect(body, `sitemap missing route: ${route}`).toMatch(new RegExp(pathPattern));
    }
  });
});
