/**
 * Server-side Cloudflare Turnstile token verification.
 */

export async function verifyTurnstileToken(token) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error('Turnstile: TURNSTILE_SECRET_KEY is not set');
    return { success: false };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return { success: !!data.success };
  } catch (err) {
    console.error('Turnstile verification error:', err);
    return { success: false };
  }
}
