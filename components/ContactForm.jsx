'use client';
import { useState } from 'react';
import { CheckCircle2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', projectType: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Terjadi kesalahan.'); setStatus('error'); return; }
      setStatus('sent');
      setForm({ name: '', email: '', company: '', projectType: '', message: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch {
      setError('Gagal mengirim. Periksa koneksi Anda.');
      setStatus('error');
    }
  };
  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const inputCls = 'w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-400/60 transition';
  return (
    <form onSubmit={onSubmit} className="vyu-card p-8 md:p-10 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block vyu-overline mb-2">// Nama</label>
          <input required value={form.name} onChange={onChange('name')} className={inputCls} placeholder="Nama lengkap" />
        </div>
        <div>
          <label className="block vyu-overline mb-2">// Email</label>
          <input required type="email" value={form.email} onChange={onChange('email')} className={inputCls} placeholder="anda@perusahaan.com" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block vyu-overline mb-2">// Perusahaan</label>
          <input value={form.company} onChange={onChange('company')} className={inputCls} placeholder="Nama perusahaan (opsional)" />
        </div>
        <div>
          <label className="block vyu-overline mb-2">// Tipe Proyek</label>
          <select required value={form.projectType} onChange={onChange('projectType')} className={inputCls}>
            <option value="">Pilih kategori…</option>
            <option>Web Application Bespoke</option>
            <option>Data Pipeline / Intelligence</option>
            <option>Design System / Brand Engineering</option>
            <option>Kolaborasi Strategis</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block vyu-overline mb-2">// Brief Singkat</label>
        <textarea required value={form.message} onChange={onChange('message')} className={`${inputCls} min-h-[140px] resize-y`} placeholder="Ceritakan tantangan teknis atau bisnis yang ingin Anda selesaikan." />
      </div>
      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-xs text-zinc-500">Kami merespons brief serius dalam &lt; 48 jam.</p>
        <button type="submit" disabled={status === 'loading'} className="vyu-btn-primary">
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          {status === 'loading' ? 'Mengirim...' : 'Kirim Brief'}
        </button>
      </div>
      {status === 'sent' && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5" /> Terima kasih. Brief Anda telah masuk antrian — kami akan merespons dari vyuapp@proton.me.
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-400/10 border border-red-400/30 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}
    </form>
  );
}
