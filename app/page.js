'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import {
  Code2, Database, Cloud, Cpu, GitBranch, Layers, Shield, Zap,
  CheckCircle2, ArrowRight, LineChart, Palette, Mail, Building2,
  Sparkles, Compass, Target, Hexagon
} from 'lucide-react';

function Capability({ icon: Icon, title, items }) {
  return (
    <div className="vyu-card p-7 group">
      <div className="flex items-center gap-3 mb-5">
        <span className="vyu-icon-container"><Icon className="w-5 h-5" /></span>
        <h3 className="text-lg font-semibold text-zinc-50">{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm text-zinc-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductCard({ name, tagline, description, features, stack, href, ctaLabel, accent }) {
  return (
    <div className="vyu-card p-8 md:p-10 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="vyu-icon-container"><Hexagon className="w-5 h-5" /></span>
          <div>
            <p className="vyu-overline">// PRODUK</p>
            <h3 className="text-2xl font-semibold text-zinc-50 mt-1">{name}</h3>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-[var(--font-mono)] tracking-widest border ${accent}`}>LIVE</span>
      </div>
      <p className="text-emerald-400/90 font-[var(--font-mono)] text-xs uppercase tracking-widest mb-3">{tagline}</p>
      <p className="text-zinc-400 text-sm leading-relaxed mb-6">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> {f}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 mb-7">
        {stack.map((s) => <span key={s} className="vyu-chip">{s}</span>)}
      </div>
      <div className="mt-auto">
        <Link href={href} className="vyu-btn-primary text-sm">{ctaLabel} <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );
}

function PhilosophyItem({ icon: Icon, title, description }) {
  return (
    <div className="vyu-card p-7">
      <div className="flex items-center gap-3 mb-4">
        <span className="vyu-icon-container"><Icon className="w-5 h-5" /></span>
        <h3 className="text-base font-semibold text-zinc-50">{title}</h3>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', projectType: '', message: '' });
  const [sent, setSent] = useState(false);
  const onSubmit = (e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 5000); setForm({ name: '', email: '', company: '', projectType: '', message: '' }); };
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
        <button type="submit" className="vyu-btn-primary">Kirim Brief <ArrowRight className="w-4 h-4" /></button>
      </div>
      {sent && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5" /> Terima kasih. Brief Anda telah masuk antrian — kami akan merespons dari vyuapp@proton.me.
        </div>
      )}
    </form>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Executive Summary */}
      <section className="vyu-section" id="tentang">
        <div className="absolute inset-0 vyu-grid-bg opacity-40" />
        <div className="vyu-container grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <SectionHeader
              overline="EXECUTIVE SUMMARY"
              title="Studio rekayasa untuk"
              gradientWord="hasil yang dapat diaudit."
            />
          </div>
          <div className="lg:col-span-7 space-y-5 text-zinc-400 text-base leading-relaxed">
            <p>VyuApp adalah studio independen yang berbasis di Garut, Jawa Barat. Kami melayani klien yang sistem digitalnya harus berfungsi sebagai infrastruktur — bukan brosur online. Setiap proyek kami diperlakukan sebagai produk yang harus bertanggung jawab atas keberlangsungan operasionalnya sendiri.</p>
            <p>Kami tidak menjual jam. Kami menjual sistem yang dapat dipertanggungjawabkan dalam produksi. Insinyur yang mendesain arsitektur adalah orang yang sama yang mendeploy, memonitor, dan memelihara. Tidak ada handoff yang merusak konteks. Tidak ada layer manajer akun antara Anda dan keputusan teknis.</p>
            <p>Dua produk inti kami — <span className="text-emerald-400">Sellica</span> (mesin intelijen pasar untuk trader aset digital) dan <span className="text-emerald-400">The Avalon Project</span> (design system bespoke yang juga menjadi bahasa visual studio) — adalah demonstrasi praktis bagaimana kami bekerja: presisi tinggi, observabilitas penuh, estetika sebagai strategi.</p>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="vyu-section" id="kapabilitas">
        <div aria-hidden className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="vyu-container">
          <SectionHeader overline="CORE CAPABILITIES" title="Stack yang dikurasi," gradientWord="bukan dikumpulkan."
            description="Setiap teknologi yang kami gunakan harus lulus kriteria yang sama: terbukti di produksi nyata, didukung ekosistem matang, dan menghasilkan keuntungan teknis yang dapat dijelaskan kepada klien." />
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            <Capability icon={Code2} title="Frontend Engineering" items={[
              'Next.js 14/15 App Router + RSC',
              'TypeScript strict mode',
              'Tailwind + design tokens custom',
              'Accessibility & performance budget',
              'Animasi CSS murni, tanpa bloat',
            ]} />
            <Capability icon={Database} title="Backend & Data" items={[
              'Node.js / Bun edge workers',
              'PostgreSQL + TimescaleDB',
              'Pipeline data 24/7 idempoten',
              'Supabase, Prisma, Drizzle ORM',
              'API kontrak dengan Zod schema',
            ]} />
            <Capability icon={Cloud} title="Cloud & Infra" items={[
              'Cloudflare Workers & R2',
              'Hetzner / Fly.io untuk compute',
              'Vercel untuk edge frontend',
              'Observability: Prometheus + Grafana',
              'CI/CD GitHub Actions + preview',
            ]} />
          </div>

          {/* secondary capabilities */}
          <div className="mt-10 grid md:grid-cols-4 gap-4">
            {[
              { icon: Layers, label: 'Design Systems' },
              { icon: LineChart, label: 'Data Intelligence' },
              { icon: Shield, label: 'Security & Auth' },
              { icon: Zap, label: 'Performance Tuning' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="vyu-card px-5 py-4 flex items-center gap-3">
                <span className="vyu-icon-container" style={{ width: 36, height: 36 }}><Icon className="w-4 h-4" /></span>
                <span className="text-sm text-zinc-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio teaser */}
      <section className="vyu-section" id="portfolio">
        <div className="vyu-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <SectionHeader overline="PORTFOLIO" title="Produk yang kami bangun" gradientWord="dan operasikan."
              description="Bukan studi kasus pemasaran — ini adalah produk hidup yang kami jaga uptime-nya hari ini." />
            <Link href="/portfolio" className="vyu-btn-secondary self-start md:self-auto">Lihat semua proyek <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid lg:grid-cols-2 gap-7">
            <ProductCard
              name="Sellica"
              tagline="// FINANCIAL INTELLIGENCE ENGINE"
              description="Platform intelijen pasar untuk trader aset digital serius. Menyatukan data on-chain, sentimen, dan model harga ke dalam satu lapisan analitis yang dapat dipertanggungjawabkan."
              features={[
                'Pipeline data real-time multi-exchange',
                'Model statistik divergensi harga / volume',
                'UI tenang — sinyal sudah difilter berlapis',
                'Observability penuh, uptime 99.9%+',
              ]}
              stack={['Next.js 14', 'PostgreSQL', 'TimescaleDB', 'Cloudflare Workers', 'Bun']}
              href="/portfolio"
              ctaLabel="Pelajari Sellica"
              accent="border-emerald-400/40 text-emerald-300 bg-emerald-400/10"
            />
            <ProductCard
              name="The Avalon Project"
              tagline="// BESPOKE DESIGN SYSTEM"
              description="Design system internal VyuApp — Swiss minimalism bertemu cyberpunk utility. Bahasa visual yang kami terapkan pada setiap produk, landing page, dan dokumen klien."
              features={[
                'Token-based color, typography, spacing',
                'Animasi CSS murni — tanpa framer-motion',
                'Molekul reusable: vyu-card, overline, chips',
                'Sinyal kualitas teknis sebelum kode pertama',
              ]}
              stack={['Tailwind v3', 'Design Tokens', 'Outfit + Inter + JetBrains', 'CSS-only animation']}
              href="/portfolio"
              ctaLabel="Jelajahi Avalon"
              accent="border-sky-400/40 text-sky-300 bg-sky-400/10"
            />
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="vyu-section" id="filosofi">
        <div aria-hidden className="absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[140px]" />
        <div className="vyu-container">
          <SectionHeader overline="PHILOSOPHY" title="Kami tidak menjual kode mentah." gradientWord="Kami menjual sistem."
            description="Tiga prinsip operasional yang membentuk setiap keputusan teknis dan komersial kami." />
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            <PhilosophyItem icon={Compass} title="Kontinuitas Kognitif" description="Insinyur yang sama membangun, men-deploy, dan memelihara. Konteks tidak hilang di handoff antar tim, dan akuntabilitas tetap jelas dari hari pertama hingga tahun ketiga." />
            <PhilosophyItem icon={Target} title="Hasil Sebagai Kontrak" description="Kami menyepakati hasil yang dapat diaudit, bukan jam yang dapat ditagih. Sukses didefinisikan sebelum kode pertama ditulis, dan diverifikasi di metrik produksi nyata." />
            <PhilosophyItem icon={Sparkles} title="Estetika Sebagai Strategi" description="Kualitas visual yang terkurasi adalah sinyal tercepat tentang kualitas teknis di baliknya. Kami menghabiskan jam yang sama pada design system dan pada arsitektur backend." />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="vyu-section" id="kontak">
        <div aria-hidden className="absolute inset-0 vyu-grid-bg opacity-30" />
        <div className="vyu-container grid lg:grid-cols-12 gap-12 relative">
          <div className="lg:col-span-5">
            <SectionHeader overline="KONTAK" title="Mulai dari brief." gradientWord="Bukan dari estimasi."
              description="Ceritakan masalahnya. Kami akan menjawab apakah ini sesuai dengan studio kami, dan jika ya, bagaimana kami akan mendekatinya." />
            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-center gap-3 text-zinc-300"><span className="vyu-icon-container" style={{ width: 36, height: 36 }}><Mail className="w-4 h-4" /></span><a href="mailto:vyuapp@proton.me" className="hover:text-emerald-400">vyuapp@proton.me</a></div>
              <div className="flex items-center gap-3 text-zinc-300"><span className="vyu-icon-container" style={{ width: 36, height: 36 }}><Building2 className="w-4 h-4" /></span> Garut, Jawa Barat, Indonesia</div>
              <div className="flex items-center gap-3 text-zinc-300"><span className="vyu-icon-container" style={{ width: 36, height: 36 }}><Palette className="w-4 h-4" /></span> Menerima 2–3 kolaborasi baru per kuartal</div>
            </div>
          </div>
          <div className="lg:col-span-7"><ContactForm /></div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
