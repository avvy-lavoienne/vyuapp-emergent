'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getServerSupabase } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { loginLimiter } from '@/lib/rate-limit';

export async function loginAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const next = formData.get('next') || '/admin';

  if (!email || !password) return { error: 'Email dan password wajib diisi.' };

  // Rate limiting by IP (fail-open: if Redis is down, allow login)
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const { success } = await loginLimiter.limit(`login:${ip}`);
    if (!success) {
      return { error: 'Terlalu banyak percobaan login. Coba lagi nanti.' };
    }
  } catch {
    // Rate limiter unavailable (Redis down) — fail-open, allow login
  }

  const supabase = await getServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(email), password: String(password),
  });
  if (error) return { error: error.message };

  revalidatePath('/admin', 'layout');
  redirect(typeof next === 'string' && next.startsWith('/admin') ? next : '/admin');
}

export async function logoutAction() {
  const supabase = await getServerSupabase();
  await supabase.auth.signOut();
  revalidatePath('/admin', 'layout');
  redirect('/admin/login');
}
