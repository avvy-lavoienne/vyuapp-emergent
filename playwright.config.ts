import { defineConfig } from '@playwright/test';
import { resolve } from 'path';

const storageStatePath = resolve(__dirname, 'tests/e2e/.auth/admin-storage-state.json');

export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: './tests/e2e/global-setup',
  fullyParallel: false,
  forbidOnly: true,
  retries: 1,
  workers: 1,
  reporter: 'list',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:3780',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    storageState: storageStatePath,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
  webServer: {
    command: 'npx cross-env NODE_OPTIONS=--max-old-space-size=512 npx next dev --hostname 0.0.0.0 --port 3780',
    url: 'http://localhost:3780',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
