/**
 * Validates required environment variables.
 * Import this early in API routes to fail fast on misconfiguration.
 *
 * Required vars:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - RESEND_API_KEY
 *   - SETUP_TOKEN
 *
 * NOTE: validation is deferred to first request — it does NOT throw at
 * module-load or build time so that `next build` can succeed without
 * every env var being present (e.g. SETUP_TOKEN).
 */

const REQUIRED_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
  'SETUP_TOKEN',
];

let validated = false;

export function validateEnv() {
  if (validated) return;
  // Skip during static build — env vars may not be available
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    validated = true;
    return;
  }
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    const msg = `[env] Missing required environment variables:\n  ${missing.join('\n  ')}\nPlease add them to your .env file. See .env.example for reference.`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(msg);
    }
    // In development, warn but don't crash
    console.warn(msg);
  }
  validated = true;
}
