'use client';
import { useFormStatus } from 'react-dom';
import { useActionState, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, Loader2, AlertTriangle } from 'lucide-react';
import { loginAction } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2997ff] text-white text-sm font-semibold hover:bg-[#0066cc] transition-all duration-200 disabled:opacity-50"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
      {pending ? 'Memverifikasi…' : 'Masuk'}
    </button>
  );
}

function validate(email, password) {
  if (!email.trim()) return 'Email wajib diisi.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Format email tidak valid.';
  if (!password) return 'Password wajib diisi.';
  if (password.length < 6) return 'Password minimal 6 karakter.';
  return null;
}

export default function LoginForm({ next = '/admin' }) {
  const [state, formAction] = useActionState(loginAction, { error: null });
  const [clientError, setClientError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    const err = validate(email, password);
    if (err) { e.preventDefault(); setClientError(err); return; }
    setClientError('');
    // Let the form action={formAction} handle submission natively.
    // Don't call formAction() manually — that causes double server action calls.
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#f5f5f7]">
      <div className="p-8 md:p-10 w-full max-w-md rounded-2xl border border-[#d2d2d7] bg-white">
        <Link href="/" className="flex items-center gap-3 mb-6">
          <span className="w-9 h-9 rounded-lg bg-white border border-[#d2d2d7] flex items-center justify-center overflow-hidden p-1">
            <Image src="/images/vyu-removebg.png" alt="VyuApp" width={36} height={36} className="w-full h-full object-contain" />
          </span>
          <span className="font-sans font-bold text-lg tracking-tight text-[#1d1d1f]">
            Vyu<span className="text-[#2997ff]">App</span>
          </span>
        </Link>

        <p className="font-mono text-xs text-[#2997ff] uppercase tracking-[0.18em] font-medium">Admin Area</p>
        <h1 className="mt-3 text-2xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.02em]">Masuk ke Dasbor</h1>
        <p className="mt-2 text-sm text-[#6e6e73]">Otentikasi diverifikasi server-side via Supabase Auth.</p>

        <form action={formAction} onSubmit={onSubmit} className="mt-7 space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="block font-mono text-[10px] text-[#2997ff] uppercase tracking-[0.18em] font-medium mb-2">Email</label>
            <input name="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-[#d2d2d7] rounded-lg px-4 py-3 text-sm text-[#1d1d1f] placeholder:text-[#737370] focus:border-[#2997ff] focus:ring-[3px] focus:ring-[#2997ff]/10 outline-none transition-all"
              placeholder="admin@vyuapp.com" />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#2997ff] uppercase tracking-[0.18em] font-medium mb-2">Password</label>
            <input name="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-[#d2d2d7] rounded-lg px-4 py-3 text-sm text-[#1d1d1f] placeholder:text-[#737370] focus:border-[#2997ff] focus:ring-[3px] focus:ring-[#2997ff]/10 outline-none transition-all"
              placeholder="••••••••" />
          </div>
          {(clientError || state?.error) && (
            <div className="flex items-center gap-2 text-xs text-red-500">
              <AlertTriangle className="w-4 h-4" /> {clientError || state.error}
            </div>
          )}
          <SubmitButton />
        </form>

        <div className="mt-6 pt-6 border-t border-[#d2d2d7] text-[11px] text-[#737370] font-mono space-y-1">
          <p>Auth via Supabase. Middleware menjaga session di server.</p>
        </div>
      </div>
    </div>
  );
}
