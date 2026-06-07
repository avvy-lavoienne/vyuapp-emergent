// Service-role client — SERVER ONLY. Bypasses RLS. Never import in client code.
import { createClient } from '@supabase/supabase-js';

let _admin = null;
export function getAdminSupabase() {
  if (_admin) return _admin;
  _admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  return _admin;
}
