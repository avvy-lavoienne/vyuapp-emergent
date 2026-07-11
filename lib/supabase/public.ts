import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client for PUBLIC data (articles, categories, etc.)
 * Does NOT use cookies — safe for ISR caching.
 * Use getServerSupabase() only for auth-protected routes.
 */
let cachedClient: SupabaseClient | null = null;

export function getPublicSupabase(): SupabaseClient {
  if (cachedClient) return cachedClient;
  cachedClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
  return cachedClient;
}
