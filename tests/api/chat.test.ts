import { test, expect } from '@playwright/test';

test.describe('Chat API', () => {
  test('POST with valid message returns 200 with reply', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: {
        message: 'Hello, what is VyuApp?',
        history: [],
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.reply).toBeTruthy();
    expect(typeof body.reply).toBe('string');
    expect(body.reply.length).toBeGreaterThan(0);
    // Should include remaining count
    expect(body.remaining).toBeDefined();
    expect(typeof body.remaining).toBe('number');
  });

  test('POST with empty message returns 400', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: {
        message: '',
        history: [],
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  test('POST with message over 500 chars returns 400', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: {
        message: 'a'.repeat(501),
        history: [],
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  test('POST with admin password activates admin mode', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: {
        message: 'AkuWibuGanteng',
        history: [],
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.admin).toBe(true);
  });

  test('rate limit remaining count is included in response', async ({ request }) => {
    // Send a message and verify remaining count is in the response
    const res = await request.post('/api/chat', {
      data: { message: 'Test rate limit counter', history: [] },
    });
    const body = await res.json();
    expect(body.remaining).toBeDefined();
    expect(typeof body.remaining).toBe('number');
    expect(body.remaining).toBeGreaterThanOrEqual(0);
    expect(body.remaining).toBeLessThanOrEqual(20);
  });
});
