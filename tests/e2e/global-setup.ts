/**
 * Playwright global setup — loads .env and .env.local into process.env
 * and performs authentication to save storageState for E2E tests.
 *
 * This ensures authenticated tests don't need to login via UI each time.
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';
import { chromium, type BrowserContext } from '@playwright/test';

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith('#')) continue;
    // Parse KEY=VALUE (handle values with = signs)
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    // Remove surrounding quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // Don't overwrite if already set (shell env takes precedence)
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

/**
 * Perform login via Supabase API and save cookies as storageState.
 * This is faster and more reliable than logging in via UI for each test.
 */
async function performLoginAndSaveStorageState(baseURL: string, storageStatePath: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminEmail = process.env.SUPABASE_ADMIN_EMAIL || 'admin@vyuapp.my.id';
  const adminPassword = process.env.SUPABASE_ADMIN_DEFAULT_PASSWORD || 'admin123';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Ensure .env, .env.local, or .env.test contains Supabase credentials. ' +
      'See .env.test.example for reference.'
    );
  }

  if (!adminEmail || !adminPassword) {
    console.warn('[global-setup] WARNING: SUPABASE_ADMIN_EMAIL or SUPABASE_ADMIN_DEFAULT_PASSWORD not set. Using defaults.');
  }

  console.log(`[global-setup] Authenticating as ${adminEmail}...`);
  console.log(`[global-setup] Supabase URL: ${supabaseUrl}`);

  // Launch browser and perform login
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login page
    console.log(`[global-setup] Navigating to ${baseURL}/admin/login...`);
    await page.goto(`${baseURL}/admin/login`, { waitUntil: 'networkidle', timeout: 30000 });

    // Fill login form
    await page.locator('input[name="email"]').waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('input[name="email"]').fill(adminEmail);
    await page.locator('input[name="password"]').fill(adminPassword);

    // Submit and wait for navigation
    const navigationPromise = page.waitForNavigation({
      timeout: 30000,
      waitUntil: 'domcontentloaded',
    });
    await page.locator('button[type="submit"]').click();
    await navigationPromise;

    // Wait for redirect to /admin
    await page.waitForURL('**/admin', { timeout: 30000, waitUntil: 'domcontentloaded' });
    console.log('[global-setup] Login successful, saving storageState...');

    // Save storageState (cookies + localStorage)
    const storageState = await context.storageState();
    writeFileSync(storageStatePath, JSON.stringify(storageState, null, 2));

    console.log(`[global-setup] StorageState saved to ${storageStatePath}`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[global-setup] Login failed:', message);
    console.error('[global-setup] Possible causes:');
    console.error('  1. Supabase credentials not configured in .env / .env.local / .env.test');
    console.error('  2. Admin user does not exist in Supabase (run /api/admin/setup first)');
    console.error('  3. Supabase project is down or unreachable');
    throw error;
  } finally {
    await browser.close();
  }
}

export default async function globalSetup() {
  const root = resolve(__dirname, '../..');

  console.log('[global-setup] Starting E2E test environment setup...');
  console.log(`[global-setup] Project root: ${root}`);

  // Load in order of precedence: .env first, .env.local overrides, .env.test for test-specific
  loadEnvFile(resolve(root, '.env'));
  loadEnvFile(resolve(root, '.env.local'));
  loadEnvFile(resolve(root, '.env.test'));

  // Log what we loaded (but NOT the values — security)
  const email = process.env.SUPABASE_ADMIN_EMAIL;
  const password = process.env.SUPABASE_ADMIN_DEFAULT_PASSWORD;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  console.log(`[global-setup] NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '(loaded)' : '(missing)'}`);
  console.log(`[global-setup] SUPABASE_ADMIN_EMAIL: ${email ? '(loaded)' : '(missing)'}`);
  console.log(`[global-setup] SUPABASE_ADMIN_DEFAULT_PASSWORD: ${password ? '(loaded)' : '(missing)'}`);

  // Create storageState directory if it doesn't exist
  const storageStateDir = join(root, 'tests', 'e2e', '.auth');
  if (!existsSync(storageStateDir)) {
    mkdirSync(storageStateDir, { recursive: true });
    console.log(`[global-setup] Created .auth directory: ${storageStateDir}`);
  }

  // Perform login and save storageState
  const baseURL = process.env.BASE_URL || 'http://localhost:3780';
  const storageStatePath = join(storageStateDir, 'admin-storage-state.json');

  console.log(`[global-setup] Base URL: ${baseURL}`);
  console.log(`[global-setup] Storage state path: ${storageStatePath}`);

  await performLoginAndSaveStorageState(baseURL, storageStatePath);

  console.log('[global-setup] E2E test environment setup complete!');
}
