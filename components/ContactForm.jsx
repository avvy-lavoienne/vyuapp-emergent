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

  const inputCls = 'w-full bg-white border border-[#E5E4E0] rounded-lg px-4 py-3 text-sm text-[#141413] placeholder:text-[#B0AFAA] focus:border-[#6D5BA0] focus:ring-[3px] focus:ring-[#6D5BA0]/10 outline-none transition-all';

  return (
    <div className="p-8 md:p-10 rounded-2xl border border-[#E5E4E0] bg-white">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-mono text-[10px] text-[#6D5BA0] uppercase tracking-[0.15em] font-medium mb-2">{t.contact.form.name_label}</label>
            <input required value={form.name} onChange={onChange('name')} className={inputCls} placeholder={t.contact.form.name_placeholder} />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#6D5BA0] uppercase tracking-[0.15em] font-medium mb-2">{t.contact.form.email_label}</label>
            <input required type="email" value={form.email} onChange={onChange('email')} className={inputCls} placeholder={t.contact.form.email_placeholder} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-mono text-[10px] text-[#6D5BA0] uppercase tracking-[0.15em] font-medium mb-2">{t.contact.form.company_label}</label>
            <input value={form.company} onChange={onChange('company')} className={inputCls} placeholder={t.contact.form.company_placeholder} />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#6D5BA0] uppercase tracking-[0.15em] font-medium mb-2">{t.contact.form.type_label}</label>
            <select required value={form.projectType} onChange={onChange('projectType')} className={inputCls}>
              <option value="">Pilih...</option>
              {t.contact.form.types.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block font-mono text-[10px] text-[#6D5BA0] uppercase tracking-[0.15em] font-medium mb-2">{t.contact.form.message_label}</label>
          <textarea required value={form.message} onChange={onChange('message')} rows={4} placeholder={t.contact.form.message_placeholder}
            className="w-full bg-white border border-[#E5E4E0] rounded-lg px-4 py-3 text-sm text-[#141413] placeholder:text-[#B0AFAA] focus:border-[#6D5BA0] focus:ring-[3px] focus:ring-[#6D5BA0]/10 outline-none transition-all resize-y min-h-[100px]" />
        </div>
        <button type="submit" disabled={status === 'loading'}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#6D5BA0] text-white text-sm font-semibold hover:bg-[#574886] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60">
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {status === 'loading' ? t.contact.form.sending : t.contact.form.submit}
        </button>
        {status === 'sent' && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#6D5BA0]/10 border border-[#6D5BA0]/30 text-[#6D5BA0] text-sm">
            <CheckCircle2 className="w-5 h-5" /> {t.contact.form.sent}
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            <AlertCircle className="w-5 h-5" /> {err}
          </div>
        )}
        <p className="text-xs text-[#B0AFAA] text-center">
          {t.contact.form.or_email}{' '}
          <a href="mailto:vyuapp@proton.me" className="text-[#6D5BA0] hover:text-[#574886] transition-colors">vyuapp@proton.me</a>
        </p>
      </form>
    </div>
  );
}
