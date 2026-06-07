'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getServerSupabase } from '@/lib/supabase/server';

export async function loginAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const next = formData.get('next') || '/admin';

  if (!email || !password) return { error: 'Email dan password wajib diisi.' };

  const supabase = getServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(email), password: String(password),
  });
  if (error) return { error: error.message };

  revalidatePath('/admin', 'layout');
  redirect(typeof next === 'string' && next.startsWith('/admin') ? next : '/admin');
}

export async function logoutAction() {
  const supabase = getServerSupabase();
  await supabase.auth.signOut();
  revalidatePath('/admin', 'layout');
  redirect('/admin/login');
}
