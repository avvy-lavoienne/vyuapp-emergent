'use client';
import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { locales } from '@/lib/locales';

/**
 * Standalone client component for the contact form.
 * Receives locale string, imports translations directly (no context needed).
 */
export default function ContactForm({ locale = 'id' }) {
  const t = locales[locale] || locales.id;
  const [form, setForm] = useState({ name: '', email: '', company: '', projectType: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [err, setErr] = useState('');

  const onChange = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErr('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || t.contact.form.error); setStatus('error'); return; }
      setStatus('sent');
      setForm({ name: '', email: '', company: '', projectType: '', message: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch {
      setErr(t.contact.form.error);
      setStatus('error');
    }
  };

  const inputCls = 'w-full bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#333336] rounded-lg px-4 py-3 text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#737370] dark:placeholder:text-[#8A8A8A] focus:border-[#2997ff] focus:ring-[3px] focus:ring-[#2997ff]/10 outline-none transition-all';

  return (
    <div className="p-8 md:p-10 rounded-2xl border border-[#d2d2d7] dark:border-[#333336] bg-white dark:bg-[#1d1d1f]">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-mono text-[10px] text-[#2997ff] uppercase tracking-[0.15em] font-medium mb-2">{t.contact.form.name_label}</label>
            <input required value={form.name} onChange={onChange('name')} className={inputCls} placeholder={t.contact.form.name_placeholder} />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#2997ff] uppercase tracking-[0.15em] font-medium mb-2">{t.contact.form.email_label}</label>
            <input required type="email" value={form.email} onChange={onChange('email')} className={inputCls} placeholder={t.contact.form.email_placeholder} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-mono text-[10px] text-[#2997ff] uppercase tracking-[0.15em] font-medium mb-2">{t.contact.form.company_label}</label>
            <input value={form.company} onChange={onChange('company')} className={inputCls} placeholder={t.contact.form.company_placeholder} />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#2997ff] uppercase tracking-[0.15em] font-medium mb-2">{t.contact.form.type_label}</label>
            <select required value={form.projectType} onChange={onChange('projectType')} className={inputCls}>
              <option value="">Pilih...</option>
              {t.contact.form.types.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block font-mono text-[10px] text-[#2997ff] uppercase tracking-[0.15em] font-medium mb-2">{t.contact.form.message_label}</label>
          <textarea required value={form.message} onChange={onChange('message')} rows={4} placeholder={t.contact.form.message_placeholder}
            className="w-full bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#333336] rounded-lg px-4 py-3 text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#737370] dark:placeholder:text-[#8A8A8A] focus:border-[#2997ff] focus:ring-[3px] focus:ring-[#2997ff]/10 outline-none transition-all resize-y min-h-[100px]" />
        </div>
        <button type="submit" disabled={status === 'loading'}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2997ff] text-white text-sm font-semibold hover:bg-[#0066cc] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60">
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {status === 'loading' ? t.contact.form.sending : t.contact.form.submit}
        </button>
        {status === 'sent' && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#2997ff]/10 dark:bg-[#5BA3FF]/10 border border-[#2997ff]/30 dark:border-[#5BA3FF]/20 text-[#2997ff] text-sm">
            <CheckCircle2 className="w-5 h-5" /> {t.contact.form.sent}
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            <AlertCircle className="w-5 h-5" /> {err}
          </div>
        )}
        <p className="text-xs text-[#737370] dark:text-[#8A8A8A] text-center">
          {t.contact.form.or_email}{' '}
          <a href="mailto:vyuapp@proton.me" className="text-[#2997ff] hover:text-[#0066cc] transition-colors">vyuapp@proton.me</a>
        </p>
      </form>
    </div>
  );
}
