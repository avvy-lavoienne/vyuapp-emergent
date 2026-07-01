import { test, expect } from '@playwright/test';

test.describe('Sitemap', () => {
  test('GET /sitemap.xml returns 200 with valid XML', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('xml');
    
    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<urlset');
  });

  test('sitemap contains expected URLs', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const body = await response.text();
    
    // Should contain main pages
    expect(body).toContain('https://www.vyuapp.my.id/');
    expect(body).toContain('https://www.vyuapp.my.id/portfolio');
    expect(body).toContain('https://www.vyuapp.my.id/insights');
  });
});
