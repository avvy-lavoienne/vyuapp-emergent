import { getServerSupabase } from '@/lib/supabase/server';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard Admin' };

export default async function AdminPage() {
  // Middleware already guarantees user is authenticated here, but we still
  // fetch user details for display + double-defense.
  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return <AdminClient user={{ id: user?.id, email: user?.email }} />;
}
