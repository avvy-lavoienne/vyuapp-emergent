'use client';
import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
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

  const labelCls = 'block eyebrow mb-2';
  const inputCls = 'w-full bg-transparent border-0 border-b border-rule px-0 py-3 text-sm text-ink placeholder:text-muted focus:border-clay outline-none transition-colors rounded-none';

  return (
    <div className="border-t border-rule pt-8">
      <form onSubmit={onSubmit} className="space-y-7">
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
          <div>
            <label className={labelCls} htmlFor="cf-name">{t.contact.form.name_label}</label>
            <input id="cf-name" required value={form.name} onChange={onChange('name')} className={inputCls} placeholder={t.contact.form.name_placeholder} />
          </div>
          <div>
            <label className={labelCls} htmlFor="cf-email">{t.contact.form.email_label}</label>
            <input id="cf-email" required type="email" value={form.email} onChange={onChange('email')} className={inputCls} placeholder={t.contact.form.email_placeholder} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
          <div>
            <label className={labelCls} htmlFor="cf-company">{t.contact.form.company_label}</label>
            <input id="cf-company" value={form.company} onChange={onChange('company')} className={inputCls} placeholder={t.contact.form.company_placeholder} />
          </div>
          <div>
            <label className={labelCls} htmlFor="cf-type">{t.contact.form.type_label}</label>
            <div className="relative">
              <select id="cf-type" required value={form.projectType} onChange={onChange('projectType')} className={`${inputCls} appearance-none pr-6`}>
                <option value="">Pilih...</option>
                {t.contact.form.types.map(type => <option key={type}>{type}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 bottom-3 w-4 h-4 text-muted" strokeWidth={1.5} />
            </div>
          </div>
        </div>
        <div>
          <label className={labelCls} htmlFor="cf-message">{t.contact.form.message_label}</label>
          <textarea id="cf-message" required value={form.message} onChange={onChange('message')} rows={4} placeholder={t.contact.form.message_placeholder}
            className="w-full bg-transparent border-0 border-b border-rule px-0 py-3 text-sm text-ink placeholder:text-muted focus:border-clay outline-none transition-colors rounded-none resize-y min-h-[110px]" />
        </div>
        <button type="submit" disabled={status === 'loading'}
          className="field-btn w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-ink text-paper text-xs font-mono uppercase tracking-[0.16em] hover:bg-clay disabled:opacity-60">
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {status === 'loading' ? t.contact.form.sending : t.contact.form.submit}
        </button>
        {status === 'sent' && (
          <div className="flex items-center gap-3 px-4 py-3 border border-moss bg-paper2 text-moss text-sm">
            <CheckCircle2 className="w-5 h-5" /> {t.contact.form.sent}
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-3 px-4 py-3 border border-red-300 bg-red-50 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5" /> {err}
          </div>
        )}
        <p className="text-xs text-muted">
          {t.contact.form.or_email}{' '}
          <a href="mailto:vyuapp@proton.me" className="editorial-link text-ink hover:text-clay transition-colors">vyuapp@proton.me</a>
        </p>
      </form>
    </div>
  );
}
