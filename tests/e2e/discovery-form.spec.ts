import { test, expect } from '@playwright/test';

test.describe('Discovery Form', () => {
  /**
   * Helper: navigate to the test page that mounts the DiscoveryForm and wait
   * for it to be visible. The form renders an "anth-card" div as its root.
   */
  async function openDiscoveryForm(page: import('@playwright/test').Page) {
    await page.goto('/discovery-test');
    // The DiscoveryForm renders an "anth-card" div as its root element.
    const formCard = page.locator('.anth-card').first();
    await expect(formCard).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Helper: fill step 1 fields and proceed to step 2.
   */
  async function fillStep1AndNext(page: import('@playwright/test').Page) {
    await page.getByPlaceholder('Budi Santoso').fill('John Doe');
    await page.getByPlaceholder('PT. Maju Jaya').fill('Acme Corp');
    await page.getByPlaceholder('budi@majujaya.com').fill('john@acme.com');
    // Click the "Lanjut" (Next) button
    await page.getByRole('button', { name: /Lanjut/i }).click();
  }

  /**
   * Helper: fill step 2 fields and proceed to step 3.
   */
  async function fillStep2AndNext(page: import('@playwright/test').Page) {
    await page
      .getByPlaceholder(/Ceritakan tujuan utama/i)
      .fill('Build a SaaS platform for inventory management');
    await page
      .getByPlaceholder(/Siapa pengguna utama/i)
      .fill('SMEs in Indonesia');
    await page.getByRole('button', { name: /Lanjut/i }).click();
  }

  /**
   * Helper: fill step 3 fields and proceed to step 4 (Review & Submit).
   */
  async function fillStep3AndNext(page: import('@playwright/test').Page) {
    await page
      .getByPlaceholder(/Apa yang membedakan/i)
      .fill('AI-powered automation');
    await page
      .getByPlaceholder(/Ceritakan stack teknologi/i)
      .fill('Next.js, Supabase, Tailwind');

    // Select budget
    await page.locator('select').first().selectOption({ index: 1 });

    // Select timeline
    await page.locator('select').last().selectOption({ index: 1 });

    await page.getByRole('button', { name: /Lanjut/i }).click();
  }

  // ────────────────────────────────────────────────────────────────────────
  // G1. Form renders
  // ────────────────────────────────────────────────────────────────────────
  test('G1 – form renders on the homepage', async ({ page }) => {
    await openDiscoveryForm(page);

    // The step circle indicators should be visible (4 steps)
    const stepCircles = page.locator('.anth-card .rounded-full').first();
    await expect(stepCircles).toBeVisible();

    // Step 1 heading should be visible
    await expect(page.getByText('Corporate Identity')).toBeVisible();

    // First step input fields should be present
    await expect(page.getByPlaceholder('Budi Santoso')).toBeVisible();
    await expect(page.getByPlaceholder('PT. Maju Jaya')).toBeVisible();
    await expect(page.getByPlaceholder('budi@majujaya.com')).toBeVisible();
  });

  // ────────────────────────────────────────────────────────────────────────
  // G2. Step navigation – fill step 1, click next, step 2 appears
  // ────────────────────────────────────────────────────────────────────────
  test('G2 – step navigation advances correctly', async ({ page }) => {
    await openDiscoveryForm(page);

    // Fill step 1
    await fillStep1AndNext(page);

    // Step 2 heading should now be visible
    await expect(page.getByText('Project Core Goals & Audience')).toBeVisible();

    // Step 2 fields should be visible
    await expect(
      page.getByPlaceholder(/Ceritakan tujuan utama/i)
    ).toBeVisible();
    await expect(
      page.getByPlaceholder(/Siapa pengguna utama/i)
    ).toBeVisible();

    // Progress bar (Radix Progress) should have updated
    const progressIndicator = page.locator(
      '[role="progressbar"], [data-state="complete"], .bg-terracotta-500'
    ).first();
    await expect(progressIndicator).toBeVisible();

    // Step 2 → Step 3
    await fillStep2AndNext(page);
    await expect(page.getByText('UVP, Tech & Investment')).toBeVisible();
  });

  // ────────────────────────────────────────────────────────────────────────
  // G3. Step validation – try next with empty required fields
  // ────────────────────────────────────────────────────────────────────────
  test('G3 – step validation shows errors for empty fields', async ({
    page,
  }) => {
    await openDiscoveryForm(page);

    // Step 1: click Next without filling anything
    await page.getByRole('button', { name: /Lanjut/i }).click();

    // Validation error messages should appear (Indonesian text)
    await expect(page.getByText('Nama lengkap wajib diisi.')).toBeVisible();
    await expect(
      page.getByText('Nama perusahaan wajib diisi.')
    ).toBeVisible();
    await expect(page.getByText('Email wajib diisi.')).toBeVisible();

    // Still on step 1 – Corporate Identity should still be shown
    await expect(page.getByText('Corporate Identity')).toBeVisible();

    // Fill only fullName, try again → companyName and email errors remain
    await page.getByPlaceholder('Budi Santoso').fill('Jane');
    await page.getByRole('button', { name: /Lanjut/i }).click();
    await expect(page.getByText('Nama lengkap wajib diisi.')).not.toBeVisible();
    await expect(
      page.getByText('Nama perusahaan wajib diisi.')
    ).toBeVisible();
  });

  // ────────────────────────────────────────────────────────────────────────
  // G4. Successful submit – complete all steps & submit (mock Turnstile)
  // ────────────────────────────────────────────────────────────────────────
  test('G4 – successful submission with mocked Turnstile', async ({
    page,
  }) => {
    // Mock Turnstile BEFORE page load so the component picks it up
    await page.addInitScript(() => {
      (window as any).turnstile = {
        render: (_el: HTMLElement, opts: Record<string, any>) => {
          // Auto-invoke the verify callback with a test token
          setTimeout(() => opts.callback?.('TEST_TOKEN_E2E'), 100);
          return 'mock-widget-id';
        },
        remove: () => {},
      };
    });

    // Intercept the API — accept any payload with a turnstileToken
    await page.route('**/api/discovery', async (route) => {
      const body = route.request().postDataJSON();
      if (!body?.turnstileToken) {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Security verification required.' }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await openDiscoveryForm(page);
    await fillStep1AndNext(page);
    await fillStep2AndNext(page);
    await fillStep3AndNext(page);

    // Wait for the mocked Turnstile callback to fire
    await page.waitForTimeout(500);

    // Submit
    await page.getByRole('button', { name: /Submit Discovery Brief/i }).click();

    // Success message
    await expect(page.getByText('Discovery Brief Terkirim')).toBeVisible({
      timeout: 10_000,
    });
  });

  // ────────────────────────────────────────────────────────────────────────
  // G5. Turnstile required – submit without token → 403
  // ────────────────────────────────────────────────────────────────────────
  test('G5 – submit without Turnstile token returns 403', async ({ page }) => {
    // Intercept the API and verify the token is missing
    let interceptedBody: Record<string, unknown> | null = null;
    await page.route('**/api/discovery', async (route) => {
      interceptedBody = route.request().postDataJSON();
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Security verification required.' }),
      });
    });

    await openDiscoveryForm(page);
    await fillStep1AndNext(page);
    await fillStep2AndNext(page);
    await fillStep3AndNext(page);

    // Do NOT mock Turnstile – the token will be empty string or undefined.
    // The form checks `if (!turnstileToken)` before submitting and shows an error.
    // Click submit – the form should show an error banner, not call the API.
    await page.getByRole('button', { name: /Submit Discovery Brief/i }).click();

    // The error message "Please complete the security check." should appear
    await expect(
      page.getByText('Please complete the security check.')
    ).toBeVisible();

    // The API should NOT have been called (form blocked client-side)
    expect(interceptedBody).toBeNull();
  });

  // ────────────────────────────────────────────────────────────────────────
  // G6. Rate limit – multiple rapid submissions → 429
  // ────────────────────────────────────────────────────────────────────────
  test('G6 – rapid submissions trigger 429 rate limit', async ({ page }) => {
    let requestCount = 0;

    // Mock Turnstile so it auto-verifies
    await page.addInitScript(() => {
      (window as any).turnstile = {
        render: (_el: HTMLElement, opts: Record<string, any>) => {
          setTimeout(() => opts.callback?.('TEST_TOKEN'), 50);
          return 'mock-id';
        },
        remove: () => {},
      };
    });

    await page.route('**/api/discovery', async (route) => {
      requestCount++;
      if (requestCount >= 3) {
        // Simulate rate limit after 2 successful submissions
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Terlalu banyak percobaan. Coba lagi nanti.',
          }),
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Date.now() + 3600_000),
          },
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true }),
        });
      }
    });

    // Submit the form 3 times rapidly
    for (let i = 0; i < 3; i++) {
      await page.goto('/discovery-test');
      await openDiscoveryForm(page);
      await fillStep1AndNext(page);
      await fillStep2AndNext(page);
      await fillStep3AndNext(page);
      await page.waitForTimeout(100);
      await page.getByRole('button', { name: /Submit Discovery Brief/i }).click();
      await page.waitForTimeout(300);
    }

    // The last submission should show a rate-limit / error message
    // Either the API error or the client-side error banner
    const errorBanner = page.locator(
      'text=Terlalu banyak percobaan'
    );
    const generalError = page.locator(
      'text=Gagal mengirim'
    );
    // One of these should be visible
    await expect(errorBanner.or(generalError)).toBeVisible({ timeout: 5_000 });
  });
});
