import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Server Supabase client.
 * During ISR / build-time (no cookies available), falls back to a static client
 * so pages can still fetch data without marking themselves as dynamic.
 */
export async function getServerSupabase(): Promise<SupabaseClient> {
  // Try cookies first (normal SSR request)
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value; },
          set(name: string, value: string, options: Record<string, unknown>) {
            try { cookieStore.set({ name, value, ...options }); } catch {}
          },
          remove(name: string, options: Record<string, unknown>) {
            try { cookieStore.set({ name, value: '', maxAge: 0, ...options }); } catch {}
          },
        },
      }
    );
  } catch {
    // No cookies available (ISR / build-time) — use static client
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );
  }
}
