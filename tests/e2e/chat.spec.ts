import { test, expect } from '@playwright/test';

test.describe('Chat Widget', () => {
  test.beforeEach(async ({ page }) => {
    // Clear chat history
    await page.addInitScript(() => {
      localStorage.removeItem('vyuapp_chat_history');
    });
  });

  test('chat widget button is visible', async ({ page }) => {
    await page.goto('/');
    const chatButton = page.locator('button[aria-label="Open chat"]');
    await expect(chatButton).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Chat dengan Hana')).toBeVisible();
  });

  test('click to open chat', async ({ page }) => {
    await page.goto('/');
    const chatButton = page.locator('button[aria-label="Open chat"]');
    await expect(chatButton).toBeVisible({ timeout: 10000 });
    await chatButton.click();
    
    // Chat panel should be visible - look for header text
    await expect(page.locator('text=Hana — VyuApp Support')).toBeVisible({ timeout: 5000 });
    // Input should be visible
    await expect(page.locator('input[placeholder="Ketik pesan..."]')).toBeVisible();
  });

  test('type message and send', async ({ page }) => {
    await page.goto('/');
    const chatButton = page.locator('button[aria-label="Open chat"]');
    await expect(chatButton).toBeVisible({ timeout: 10000 });
    await chatButton.click();
    
    const input = page.locator('input[placeholder="Ketik pesan..."]');
    await expect(input).toBeVisible();
    await input.fill('Hello');
    
    // Click send button
    const sendButton = page.locator('button[aria-label="Kirim pesan"]');
    await expect(sendButton).toBeEnabled();
    await sendButton.click();
    
    // Visitor message should appear
    await expect(page.locator('text=Hello').last()).toBeVisible({ timeout: 5000 });
  });

  test('response is received from chat', async ({ page }) => {
    await page.goto('/');
    const chatButton = page.locator('button[aria-label="Open chat"]');
    await expect(chatButton).toBeVisible({ timeout: 10000 });
    await chatButton.click();
    
    const input = page.locator('input[placeholder="Ketik pesan..."]');
    await expect(input).toBeVisible();
    await input.fill('Halo');
    
    const sendButton = page.locator('button[aria-label="Kirim pesan"]');
    await sendButton.click();
    
    // Wait for a response - should get a reply from the agent
    // Wait for the loading state to finish and a second message to appear
    await page.waitForTimeout(5000);
    
    // There should be at least 2 messages (visitor + agent)
    const messages = page.locator('[style*="max-width: 80%"]');
    const count = await messages.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('rate limit info shows remaining count', async ({ page }) => {
    await page.goto('/');
    const chatButton = page.locator('button[aria-label="Open chat"]');
    await expect(chatButton).toBeVisible({ timeout: 10000 });
    await chatButton.click();
    
    // Check for remaining message count in header
    await expect(page.locator('text=/\\d+\\/20 pesan tersisa/').first()).toBeVisible({ timeout: 5000 });
  });
});
