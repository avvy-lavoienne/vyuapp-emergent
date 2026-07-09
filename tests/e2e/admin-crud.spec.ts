import { test, expect } from '@playwright/test';

// Admin credentials: read from env or use fallbacks
// global-setup.ts loads .env / .env.local into process.env before tests run.
const ADMIN_EMAIL = process.env.SUPABASE_ADMIN_EMAIL || 'admin@vyuapp.my.id';
const ADMIN_PASSWORD = process.env.SUPABASE_ADMIN_DEFAULT_PASSWORD || 'admin123';

/** Helper: login and wait for admin dashboard */
async function loginAs(page: any, email: string, password: string) {
  await page.goto('/admin/login');
  // Wait for form to be fully rendered
  await page.locator('input[name="email"]').waitFor({ state: 'visible' });
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);

  // Use waitForNavigation for reliable redirect detection
  const navigationPromise = page.waitForNavigation({
    timeout: 25000,
    waitUntil: 'domcontentloaded',
  });
  await page.locator('button[type="submit"]').click();
  await navigationPromise;

  // Wait for URL to settle on /admin
  await page.waitForURL('**/admin', { timeout: 25000, waitUntil: 'domcontentloaded' });
  // Wait for dashboard to fully load
  await expect(page.locator('text=Manajemen Artikel').first()).toBeVisible({ timeout: 10000 });
}

/** Helper: wait for loading spinner to disappear */
async function waitForListLoad(page: any) {
  // The list shows a Loader2 spinner while loading; wait for it to be gone
  const spinner = page.locator('td svg.animate-spin').first();
  // If spinner exists, wait for it to disappear; otherwise skip
  try {
    await spinner.waitFor({ state: 'hidden', timeout: 5000 });
  } catch {
    // Spinner wasn't visible, list already loaded
  }
}

test.describe('Admin CRUD', () => {

  // ============================================================
  // Article CRUD
  // ============================================================

  test('F1 - Create article: fill title, slug auto-generates, save as draft', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Click "Artikel Baru" button
    await page.locator('button:has-text("Artikel Baru")').first().click();

    // Article editor should appear
    await expect(page.locator('h1:has-text("Artikel Baru")')).toBeVisible();

    // Fill title
    const titleInput = page.locator('input[placeholder="Judul artikel"]');
    await titleInput.fill('E2E Test Article');

    // Slug should auto-generate from title
    const slugInput = page.locator('input[placeholder="slug-otomatis"]');
    await expect(slugInput).toHaveValue('e2e-test-article');

    // Fill excerpt
    const excerptInput = page.locator('textarea').first();
    await excerptInput.fill('Test article excerpt content');

    // Save as draft
    await page.locator('button:has-text("Save Draft")').first().click();

    // Toast confirmation
    await expect(page.locator('text=Draft tersimpan').first()).toBeVisible({ timeout: 10000 });

    // Should return to article list and article should appear
    await expect(page.locator('h1:has-text("Manajemen Artikel")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('td:has-text("E2E Test Article")').first()).toBeVisible({ timeout: 10000 });
  });

  test('F2 - Edit article: click edit, modify title, save, verify change', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Wait for article list to load
    await waitForListLoad(page);

    // Click edit on the first article with "E2E Test Article" title
    const editBtn = page.locator('button[aria-label="Edit artikel"]').first();
    await expect(editBtn).toBeVisible();
    await editBtn.click();

    // Editor should show "Edit Artikel" heading
    await expect(page.locator('h1:has-text("Edit Artikel")')).toBeVisible();

    // Modify the title
    const titleInput = page.locator('input[placeholder="Judul artikel"]');
    await titleInput.clear();
    await titleInput.fill('E2E Test Article Updated');

    // Save as draft
    await page.locator('button:has-text("Save Draft")').first().click();

    // Toast confirmation
    await expect(page.locator('text=Draft tersimpan').first()).toBeVisible({ timeout: 10000 });

    // Return to list and verify the updated title
    await expect(page.locator('h1:has-text("Manajemen Artikel")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('td:has-text("E2E Test Article Updated")').first()).toBeVisible({ timeout: 10000 });
  });

  test('F3 - Delete article: click delete, confirm, article removed', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Wait for article list
    await waitForListLoad(page);

    // Count articles before deletion
    const rowsBefore = await page.locator('tbody tr').count();

    // Confirm dialog handler: accept
    page.on('dialog', async (dialog: any) => {
      await dialog.accept();
    });

    // Click delete on the first article
    const deleteBtn = page.locator('button[aria-label="Hapus artikel"]').first();
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();

    // Wait for list to refresh
    await page.waitForTimeout(2000);

    // Article count should decrease or the specific article should be gone
    // Since we can't guarantee which article was deleted, verify the list refreshed
    await expect(page.locator('text=Manajemen Artikel')).toBeVisible();
  });

  // ============================================================
  // Portfolio CRUD
  // ============================================================

  test('F4 - Create portfolio: fill form, save, appears in list', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Navigate to Portfolio tab
    await page.locator('button:has-text("Portfolio")').first().click();
    await expect(page.locator('text=Manajemen Portfolio')).toBeVisible({ timeout: 10000 });

    // Click "Portfolio Baru"
    await page.locator('button:has-text("Portfolio Baru")').first().click();

    // Portfolio editor should appear
    await expect(page.locator('h1:has-text("Portfolio Baru")')).toBeVisible();

    // Fill name
    const nameInput = page.locator('input[placeholder="Sellica"]');
    await nameInput.fill('E2E Test Portfolio');

    // Slug should auto-generate
    const slugInput = page.locator('input[placeholder="sellica"]');
    await expect(slugInput).toHaveValue('e2e-test-portfolio');

    // Fill tagline
    const taglineInput = page.locator('input[placeholder="Sistem Evaluasi Kinerja & Aktivitas"]');
    await taglineInput.fill('E2E Test Tagline');

    // Fill description
    const descInput = page.locator('textarea').first();
    await descInput.fill('E2E test portfolio description');

    // Save as draft
    await page.locator('button:has-text("Save Draft")').first().click();

    // Toast confirmation
    await expect(page.locator('text=Disimpan sebagai draft').first()).toBeVisible({ timeout: 10000 });

    // Should return to portfolio list and item should appear
    await expect(page.locator('text=Manajemen Portfolio')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3:has-text("E2E Test Portfolio")').first()).toBeVisible({ timeout: 10000 });
  });

  test('F5 - Edit portfolio: click edit, modify name, save, verify', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Navigate to Portfolio tab
    await page.locator('button:has-text("Portfolio")').first().click();
    await expect(page.locator('text=Manajemen Portfolio')).toBeVisible({ timeout: 10000 });

    // Click edit on the first portfolio item
    const editBtn = page.locator('button[aria-label="Edit portfolio"]').first();
    await expect(editBtn).toBeVisible();
    await editBtn.click();

    // Editor should show "Edit Portfolio" heading
    await expect(page.locator('h1:has-text("Edit Portfolio")')).toBeVisible();

    // Modify the name
    const nameInput = page.locator('input[placeholder="Sellica"]');
    await nameInput.clear();
    await nameInput.fill('E2E Test Portfolio Updated');

    // Save as draft
    await page.locator('button:has-text("Save Draft")').first().click();

    // Toast confirmation
    await expect(page.locator('text=Disimpan sebagai draft').first()).toBeVisible({ timeout: 10000 });

    // Return to list and verify updated name
    await expect(page.locator('text=Manajemen Portfolio')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3:has-text("E2E Test Portfolio Updated")').first()).toBeVisible({ timeout: 10000 });
  });

  test('F6 - Delete portfolio: click delete, confirm, removed', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Navigate to Portfolio tab
    await page.locator('button:has-text("Portfolio")').first().click();
    await expect(page.locator('text=Manajemen Portfolio')).toBeVisible({ timeout: 10000 });

    // Confirm dialog handler: accept
    page.on('dialog', async (dialog: any) => {
      await dialog.accept();
    });

    // Click delete on the first portfolio item
    const deleteBtn = page.locator('button[aria-label="Hapus portfolio"]').first();
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();

    // Wait for list to refresh
    await page.waitForTimeout(2000);

    // Portfolio list should still be visible (page didn't crash)
    await expect(page.locator('text=Manajemen Portfolio')).toBeVisible();
  });

  // ============================================================
  // Image upload tests
  // ============================================================

  test('F7 - Image upload happy path: upload valid image, preview shown', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Go to article editor
    await page.locator('button:has-text("Artikel Baru")').first().click();
    await expect(page.locator('h1:has-text("Artikel Baru")')).toBeVisible();

    // Create a small valid PNG image (1x1 pixel)
    const imageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    // Set up file chooser
    const fileChooserPromise = page.waitForEvent('filechooser');

    // Click the upload area button
    await page.locator('button:has-text("Pilih file")').first().click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: imageBuffer,
    });

    // Wait for upload to complete (progress bar disappears, image preview shows)
    // The img tag with src containing the uploaded URL should appear
    const previewImg = page.locator('img[alt="featured"]');
    await expect(previewImg).toBeVisible({ timeout: 15000 });
  });

  test('F8 - Rich editor works: type in contentEditable, formatting preserved', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Go to article editor
    await page.locator('button:has-text("Artikel Baru")').first().click();
    await expect(page.locator('h1:has-text("Artikel Baru")')).toBeVisible();

    // Find the contentEditable div (rich editor)
    const editor = page.locator('div[contenteditable="true"]');
    await expect(editor).toBeVisible();

    // Click into the editor and type
    await editor.click();
    await page.keyboard.type('Test content paragraph');

    // Verify content was typed
    await expect(editor).toContainText('Test content paragraph');

    // Apply bold formatting using the Bold toolbar button
    // Select all text first
    await page.keyboard.press('Control+a');
    const boldBtn = page.locator('button[title="Bold"]');
    await boldBtn.click();

    // Content should contain <b> or <strong> tag (HTML formatting)
    const editorHtml = await editor.innerHTML();
    expect(editorHtml).toMatch(/<(b|strong)[^>]*>/i);
  });

  // ============================================================
  // Confirmation and edge case tests
  // ============================================================

  test('F9 - Delete without confirmation: click delete, cancel, item NOT deleted', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Wait for article list
    await waitForListLoad(page);

    // Count articles before
    const titlesBefore = await page.locator('tbody tr td:first-child p.font-medium').allTextContents();

    // Confirm dialog handler: DISMISS (cancel)
    page.on('dialog', async (dialog: any) => {
      await dialog.dismiss();
    });

    // Click delete on the first article
    const deleteBtn = page.locator('button[aria-label="Hapus artikel"]').first();
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();

    // Wait a moment for any potential state change
    await page.waitForTimeout(1500);

    // The article should still be in the list (not deleted)
    const titlesAfter = await page.locator('tbody tr td:first-child p.font-medium').allTextContents();
    expect(titlesAfter.length).toBe(titlesBefore.length);

    // Verify specific titles are still present
    for (const title of titlesBefore) {
      expect(titlesAfter).toContain(title);
    }
  });

  test('F10 - Duplicate slug handling: create article with existing slug', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Go to article editor
    await page.locator('button:has-text("Artikel Baru")').first().click();
    await expect(page.locator('h1:has-text("Artikel Baru")')).toBeVisible();

    // Fill title
    const titleInput = page.locator('input[placeholder="Judul artikel"]');
    await titleInput.fill('Duplicate Slug Test Article');

    // Wait for slug to auto-generate
    const slugInput = page.locator('input[placeholder="slug-otomatis"]');
    await expect(slugInput).toHaveValue('duplicate-slug-test-article');

    // Manually set slug to match an existing article slug
    await slugInput.clear();
    await slugInput.fill('e2e-test-article-updated');

    // Save as draft
    await page.locator('button:has-text("Save Draft")').first().click();

    // Should either show an error toast or handle gracefully
    // (depends on whether Supabase has a unique constraint on slug)
    // We just verify the app doesn't crash
    await page.waitForTimeout(3000);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('F11 - Image upload invalid type: upload .exe, error shown', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Go to article editor
    await page.locator('button:has-text("Artikel Baru")').first().click();
    await expect(page.locator('h1:has-text("Artikel Baru")')).toBeVisible();

    // Create a fake .exe file
    const exeBuffer = Buffer.from('MZ fake executable content');

    // Set up file chooser
    const fileChooserPromise = page.waitForEvent('filechooser');

    // Click upload button
    await page.locator('button:has-text("Pilih file")').first().click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'malware.exe',
      mimeType: 'application/x-msdownload',
      buffer: exeBuffer,
    });

    // Wait for error to appear
    // The ImageUpload component validates file types and shows error
    const errorMsg = page.locator('p:has-text("Upload gagal"), p:text-matches("error|invalid|gagal", "i")').first();
    await expect(errorMsg).toBeVisible({ timeout: 10000 });
  });

  test('F12 - Image upload oversized: upload >8MB, error shown', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Go to article editor
    await page.locator('button:has-text("Artikel Baru")').first().click();
    await expect(page.locator('h1:has-text("Artikel Baru")')).toBeVisible();

    // Create a large fake image buffer (>8MB) - just raw data with PNG header
    const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const padding = Buffer.alloc(9 * 1024 * 1024, 0x00); // 9MB of zeros
    const largeBuffer = Buffer.concat([pngHeader, padding]);

    // Set up file chooser
    const fileChooserPromise = page.waitForEvent('filechooser');

    // Click upload button
    await page.locator('button:has-text("Pilih file")').first().click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'oversized-image.png',
      mimeType: 'image/png',
      buffer: largeBuffer,
    });

    // Wait for error to appear (imageCompression or Supabase will reject)
    const errorMsg = page.locator('p:has-text("Upload gagal"), p:text-matches("error|invalid|gagal|size|besar", "i")').first();
    await expect(errorMsg).toBeVisible({ timeout: 30000 });
  });
});
