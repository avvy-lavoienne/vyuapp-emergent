import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Hexagon, Sparkles, LineChart, ShieldCheck, Cpu, Layers } from 'lucide-react';
import { getPublishedPortfolio } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Portfolio',
  description: 'Dua produk hidup yang dipelihara oleh tangan yang sama — Sellica dan The Avalon Project.',
};

function DetailedProduct({ item }) {
  return (
    <div className="vyu-card p-8 md:p-12">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="vyu-icon-container"><Hexagon className="w-5 h-5" /></span>
            <p className="vyu-overline">// PRODUK · {(item.category || 'Produk').toUpperCase()}</p>
          </div>
          <h3 className="text-3xl md:text-4xl font-semibold text-zinc-50 tracking-tight">{item.name}</h3>
          <p className="mt-3 text-emerald-400 font-[var(--font-mono)] text-xs uppercase tracking-widest">{item.tagline}</p>
          <p className="mt-6 text-zinc-400 text-base leading-relaxed">{item.long_description || item.description}</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {(item.stack || []).map(s => <span key={s} className="vyu-chip">{s}</span>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/#kontak" className="vyu-btn-primary">Request Collaboration <ArrowRight className="w-4 h-4" /></a>
            <a href="/#kapabilitas" className="vyu-btn-secondary">Lihat stack penuh</a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="h-full rounded-2xl border border-emerald-400/30 p-7 bg-zinc-950/40">
            <p className="vyu-overline mb-4">// VALUE PROPOSITION</p>
            <ul className="space-y-3">
              {(item.value_props || item.features || []).map(v => (
                <li key={v} className="flex items-start gap-2 text-sm text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function OtherProject({ item }) {
  return (
    <div className="vyu-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="vyu-icon-container" style={{ width: 36, height: 36 }}><Hexagon className="w-4 h-4" /></span>
        <p className="vyu-overline">// {(item.category || 'PROJECT').toUpperCase()}</p>
      </div>
      <h4 className="text-lg font-semibold text-zinc-50">{item.name}</h4>
      <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{item.description}</p>
      {(item.stack || []).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(item.stack || []).slice(0, 4).map(s => <span key={s} className="vyu-chip text-[10px]">{s}</span>)}
        </div>
      )}
    </div>
  );
}

const FALLBACK_OTHER = [
  { id: 'f1', name: 'Ingestion Service — NDA Client A', category: 'DATA PIPELINE', description: 'Pipeline data 24/7 multi-sumber untuk klien fintech regional. Idempotent worker, dead-letter queue, dan dashboard observability internal.' },
  { id: 'f2', name: 'Custom SSO — NDA Client B', category: 'AUTH PLATFORM', description: 'Layer otentikasi bespoke untuk B2B SaaS, mengintegrasikan SAML, OIDC, dan session management dengan kebijakan keamanan kustom.' },
  { id: 'f3', name: 'Editorial Platform — Stealth', category: 'BRAND ENGINEERING', description: 'Platform editorial untuk publikasi premium, menggabungkan headless CMS, RSC, dan typography engine kustom.' },
];

export default async function PortfolioPage() {
  const items = await getPublishedPortfolio();
  const [main1, main2, ...rest] = items;

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 vyu-grid-bg" />
        <div aria-hidden className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[120px]" />
        <div aria-hidden className="absolute top-10 right-1/4 w-[400px] h-[400px] rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="vyu-container relative">
          <SectionHeader overline="PORTFOLIO" title="Produk hidup," gradientWord="dijaga oleh tangan yang sama."
            description="Kami mempublikasikan portfolio yang dapat kami pertanggungjawabkan di produksi — bukan mockup, bukan konsep." />
        </div>
      </section>

      {main1 && (
        <section className="vyu-section">
          <div className="vyu-container"><DetailedProduct item={main1} /></div>
        </section>
      )}
      {main2 && (
        <section className="vyu-section">
          <div className="vyu-container"><DetailedProduct item={main2} /></div>
        </section>
      )}

      <section className="vyu-section">
        <div className="vyu-container">
          <SectionHeader overline="OTHER WORK" title="Proyek lain yang" gradientWord="sedang berkembang."
            description="Slot ini akan terisi seiring kami merilis case study klien. Tambah / edit dari admin → Portfolio Management." />
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(rest.length ? rest : FALLBACK_OTHER).map(item => <OtherProject key={item.id} item={item} />)}
          </div>
          <div className="mt-12 vyu-card p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="vyu-overline mb-2">// KOLABORASI</p>
              <h3 className="text-2xl font-semibold text-zinc-50">Punya proyek yang layak masuk kanon ini?</h3>
              <p className="text-sm text-zinc-400 mt-2 max-w-xl">Kami menerima 2–3 kolaborasi baru per kuartal. Hubungi kami dengan brief yang spesifik.</p>
            </div>
            <Link href="/#kontak" className="vyu-btn-primary">Request Collaboration <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
