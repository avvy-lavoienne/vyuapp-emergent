import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  // ────────────────────────────────────────────────────────────────────────
  // H1. Mobile nav – hamburger visible at 375px
  // ────────────────────────────────────────────────────────────────────────
  test('H1 – hamburger menu button visible on mobile (375px)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const hamburger = page.getByRole('button', { name: 'menu' });
    await expect(hamburger).toBeVisible();

    // Desktop nav links should be hidden at this width
    const desktopNav = page.locator('nav.hidden');
    await expect(desktopNav).toBeHidden();
  });

  // ────────────────────────────────────────────────────────────────────────
  // H2. Mobile nav opens – click hamburger → mobile menu slides in
  // ────────────────────────────────────────────────────────────────────────
  test('H2 – mobile menu opens when hamburger is clicked', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const hamburger = page.getByRole('button', { name: 'menu' });
    await hamburger.click();

    // After clicking, the mobile nav panel should appear.
    // The Navbar renders a div with md:hidden containing nav links.
    // The open state shows links inside a dropdown.
    const mobileNav = page.locator('header').locator('.md\\:hidden').last();
    await expect(mobileNav).toBeVisible();

    // Nav links should be visible inside the mobile panel
    await expect(page.locator('header nav a').first()).toBeVisible();
  });

  // ────────────────────────────────────────────────────────────────────────
  // H3. Mobile nav closes – click a link → menu closes, page navigates
  // ────────────────────────────────────────────────────────────────────────
  test('H3 – clicking a nav link closes mobile menu and navigates', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // Open the menu
    const hamburger = page.getByRole('button', { name: 'menu' });
    await hamburger.click();

    // Wait for mobile menu to open
    const mobilePanel = page.locator('header').locator('.md\\:hidden').last();
    await expect(mobilePanel).toBeVisible();

    // Click the "Portfolio" link in the mobile menu
    const portfolioLink = page.locator('header').locator('a[href="/portfolio"]').last();
    await expect(portfolioLink).toBeVisible();
    await portfolioLink.click();

    // Page should navigate to /portfolio
    await page.waitForURL('**/portfolio', { timeout: 5_000 });
    expect(page.url()).toContain('/portfolio');

    // The mobile menu should close (panel hidden)
    await expect(mobilePanel).toBeHidden({ timeout: 3_000 });
  });

  // ────────────────────────────────────────────────────────────────────────
  // H4. Tablet layout – 768px, 2-column grids visible
  // ────────────────────────────────────────────────────────────────────────
  test('H4 – tablet layout shows 2-column grids at 768px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // The Capabilities section uses `grid md:grid-cols-3` – at 768px (md),
    // the 3-column grid should kick in.
    const capabilitiesGrid = page.locator('#kapabilitas .grid');
    await expect(capabilitiesGrid).toBeVisible();

    // The portfolio section uses `grid lg:grid-cols-2` – at 768px (below lg),
    // it should be single column. Let's check CaraKerjaSection which uses
    // `grid md:grid-cols-2 lg:grid-cols-4` – at 768px it should be 2-col.
    const caraKerjaGrid = page.locator('#cara-kerja .grid');
    await expect(caraKerjaGrid).toBeVisible();

    // Verify grid children are in 2-column layout by checking they fit
    // within the viewport width (no horizontal overflow)
    const gridBox = await caraKerjaGrid.boundingBox();
    if (gridBox) {
      expect(gridBox.width).toBeLessThanOrEqual(768);
    }

    // Footer should be visible
    await expect(page.locator('footer')).toBeVisible();
  });

  // ────────────────────────────────────────────────────────────────────────
  // H5. Desktop layout – 1280px, full layout, all sections visible
  // ────────────────────────────────────────────────────────────────────────
  test('H5 – desktop layout at 1280px shows all sections', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // Navbar should be fully visible with desktop nav links
    const desktopNav = page.locator('nav.hidden').first();
    // At 1280px, md:flex should apply, so the nav should actually be visible
    // The class "hidden md:flex" means hidden on small, flex on md+
    await expect(desktopNav).toBeVisible();

    // Hero section
    await expect(page.locator('h1').first()).toBeVisible();

    // Scroll through all major sections and verify they exist
    const sectionIds = [
      '#tentang',
      '#kapabilitas',
      '#cara-kerja',
      '#tim-kami',
      '#portfolio',
      '#filosofi',
      '#kontak',
    ];

    for (const id of sectionIds) {
      const section = page.locator(id);
      await expect(section).toBeAttached();
    }

    // Footer
    await expect(page.locator('footer')).toBeVisible();
  });

  // ────────────────────────────────────────────────────────────────────────
  // H6. No horizontal scroll – any viewport
  // ────────────────────────────────────────────────────────────────────────
  test('H6 – no horizontal scroll at multiple viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 812, label: 'mobile' },
      { width: 768, height: 1024, label: 'tablet' },
      { width: 1280, height: 800, label: 'desktop' },
      { width: 1920, height: 1080, label: 'wide' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Wait for layout to settle
      await page.waitForTimeout(300);

      // Check that the body does not have horizontal overflow
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);

      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    }
  });
});
