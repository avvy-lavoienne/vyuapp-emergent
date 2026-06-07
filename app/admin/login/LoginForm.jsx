'use client';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import Link from 'next/link';
import { LogIn, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { loginAction } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="vyu-btn-primary w-full justify-center">
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
      {pending ? 'Memverifikasi…' : 'Masuk'}
    </button>
  );
}

export default function LoginForm({ next = '/admin' }) {
  const [state, formAction] = useActionState(loginAction, { error: null });

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 vyu-grid-bg" />
      <div aria-hidden className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[120px] animate-vyu-glow-orb" />

      <div className="vyu-card p-8 md:p-10 w-full max-w-md relative">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <span className="w-7 h-7 rounded-md bg-emerald-400/10 ring-1 ring-emerald-400/40 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-vyu-pulse" />
          </span>
          <span className="font-[var(--font-outfit)] font-bold text-lg">Vyu<span className="text-emerald-400">App</span></span>
        </Link>

        <div className="flex items-center gap-2 mb-1">
          <p className="vyu-overline">// ADMIN AREA</p>
          <span className="inline-flex items-center gap-1 text-[10px] font-[var(--font-mono)] text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-2 py-0.5">
            <ShieldCheck className="w-3 h-3" /> SSR GUARD
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-50">Masuk ke Dasbor</h1>
        <p className="mt-2 text-sm text-zinc-500">Otentikasi diverifikasi server-side via Supabase Auth.</p>

        <form action={formAction} className="mt-7 space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="block vyu-overline mb-2">// Email</label>
            <input name="email" type="email" required autoComplete="email"
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:border-emerald-400/60"
              placeholder="admin@vyuapp.com" />
          </div>
          <div>
            <label className="block vyu-overline mb-2">// Password</label>
            <input name="password" type="password" required autoComplete="current-password"
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:border-emerald-400/60"
              placeholder="••••••••" />
          </div>
          {state?.error && (
            <div className="flex items-center gap-2 text-xs text-red-400">
              <AlertTriangle className="w-4 h-4" /> {state.error}
            </div>
          )}
          <SubmitButton />
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-800/80 text-[11px] text-zinc-500 font-[var(--font-mono)] space-y-1">
          <p>// SETUP</p>
          <p className="text-zinc-400">Auth via Supabase. Middleware menjaga session di server. Logout = full server invalidation.</p>
        </div>
      </div>
    </div>
  );
}
