'use client';
import { useState } from 'react';
import { LocaleProvider, useLocale } from '@/components/LocaleProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

function Capability({ title, description }) {
  return (
    <div className="p-8 md:p-10 rounded-2xl border border-[#E5E4E0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D0C9]">
      <h3 className="text-lg font-semibold text-[#141413] tracking-[-0.01em]">{title}</h3>
      <p className="mt-3 text-sm text-[#4A4A48] leading-relaxed">{description}</p>
    </div>
  );
}

function ProductCard({ name, tagline, description, features, href, ctaLabel }) {
  const isExternal = href.startsWith('http');
  const Tag = isExternal ? 'a' : Link;
  const extraProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <div className="p-8 md:p-10 rounded-2xl border border-[#E5E4E0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D0C9] flex flex-col">
      <p className="text-xs text-[#6D5BA0] font-medium uppercase tracking-[0.12em]">{tagline}</p>
      <h3 className="mt-2 text-xl font-semibold text-[#141413] tracking-[-0.02em]">{name}</h3>
      <p className="mt-3 text-sm text-[#4A4A48] leading-relaxed">{description}</p>
      <ul className="mt-6 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-[#4A4A48]">
            <span className="w-1 h-1 rounded-full bg-[#6D5BA0] mt-2 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Tag
          href={href}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6D5BA0] text-white text-sm font-semibold hover:bg-[#574886] transition-all duration-200 hover:-translate-y-0.5"
          {...extraProps}
        >
          {ctaLabel} <ArrowRight className="w-4 h-4" />
        </Tag>
      </div>
    </div>
  );
}

function PhilosophyItem({ title, description }) {
  return (
    <div className="p-8 rounded-2xl border border-[#E5E4E0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D0C9]">
      <h3 className="text-base font-semibold text-[#141413] tracking-[-0.01em]">{title}</h3>
      <p className="mt-3 text-sm text-[#4A4A48] leading-relaxed">{description}</p>
    </div>
  );
}

function SimpleContactForm({ t }) {
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

function HomeContent() {
  const { t } = useLocale();

  return (
    <main>
      <Navbar />
      <Hero />

      <section className="py-24 md:py-32" id="tentang">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <p className="text-[#4A4A48] text-base md:text-lg leading-relaxed text-center max-w-3xl mx-auto">
            {t.summary}
          </p>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#F8F7F4]" id="kapabilitas">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionHeader
            overline={t.capabilities.overline}
            title={t.capabilities.title}
            description={t.capabilities.description}
            align="center"
          />
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            <Capability title={t.capabilities.frontend.title} description={t.capabilities.frontend.desc} />
            <Capability title={t.capabilities.backend.title} description={t.capabilities.backend.desc} />
            <Capability title={t.capabilities.product.title} description={t.capabilities.product.desc} />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" id="portfolio">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <SectionHeader
              overline={t.portfolio.overline}
              title={t.portfolio.title}
              description={t.portfolio.description}
            />
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent text-[#141413] font-semibold text-sm border border-[#D1D0C9] hover:border-[#B0AFAA] hover:bg-black/[0.02] transition-all duration-200 hover:-translate-y-0.5 shrink-0 self-start md:self-auto"
            >
              {t.portfolio.view_all} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid lg:grid-cols-2 gap-7">
            <ProductCard
              name="Sellica"
              tagline={t.portfolio.sellica.tagline}
              description={t.portfolio.sellica.desc}
              features={t.portfolio.sellica.features}
              href="/portfolio"
              ctaLabel={t.portfolio.sellica.cta}
            />
            <ProductCard
              name="The Avalon Project"
              tagline={t.portfolio.avalon.tagline}
              description={t.portfolio.avalon.desc}
              features={t.portfolio.avalon.features}
              href="https://avalon.vyuapp.my.id/"
              ctaLabel={t.portfolio.avalon.cta}
            />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#F8F7F4]" id="filosofi">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionHeader
            overline={t.philosophy.overline}
            title={t.philosophy.title}
            align="center"
          />
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {t.philosophy.items.map((item, i) => (
              <PhilosophyItem key={i} title={item.title} description={item.desc} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#F8F7F4]" id="kontak">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <SectionHeader
                overline={t.contact.overline}
                title={t.contact.title}
                description={t.contact.description}
              />
              <div className="mt-8 space-y-4 text-sm">
                <div className="flex items-center gap-3 text-[#4A4A48]">
                  <span className="w-9 h-9 rounded-lg bg-white border border-[#E5E4E0] flex items-center justify-center text-[#6D5BA0]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </span>
                  <a href="mailto:vyuapp@proton.me" className="hover:text-[#6D5BA0] transition-colors">vyuapp@proton.me</a>
                </div>
                <div className="flex items-center gap-3 text-[#4A4A48]">
                  <span className="w-9 h-9 rounded-lg bg-white border border-[#E5E4E0] flex items-center justify-center text-[#6D5BA0]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </span>
                  Jl. Ratu Intan Dewata, Perumahan Griya Mutiara Rancabango Blok. C40, Garut
                </div>
                <div className="flex items-center gap-3 text-[#4A4A48]">
                  <span className="w-9 h-9 rounded-lg bg-white border border-[#E5E4E0] flex items-center justify-center text-[#6D5BA0]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </span>
                  Menerima 2&ndash;3 kolaborasi baru per kuartal
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <SimpleContactForm t={t} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function HomePage() {
  return (
    <LocaleProvider>
      <HomeContent />
    </LocaleProvider>
  );
}
