import { test, expect } from '@playwright/test';

test.describe('RSS Feed', () => {
  test('GET /feed.xml returns 200 with valid XML', async ({ request }) => {
    const response = await request.get('/feed.xml');
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('xml');
    
    const body = await response.text();
    expect(body).toContain('<?xml');
  });

  test('RSS feed contains channel and items', async ({ request }) => {
    const response = await request.get('/feed.xml');
    const body = await response.text();
    
    expect(body).toContain('<channel>');
    expect(body).toContain('<title>');
    expect(body).toContain('<item>');
  });
});
