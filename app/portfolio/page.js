import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import { ArrowRight, Hexagon, Sparkles, LineChart, ShieldCheck, Cpu, Layers } from 'lucide-react';
import { getPublishedPortfolio, DEFAULT_MAIN, FALLBACK_OTHER } from '@/lib/data';
import { BreadcrumbJsonLd, SoftwareAppJsonLd } from '@/components/JsonLd';
import DetailedProduct from '@/components/DetailedProduct';

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata = {
  title: 'Portfolio — VyuApp',
  description: 'Produk inti VyuApp: Sellica (financial intelligence untuk trader aset digital) dan The Avalon Project (enterprise market intelligence & price surveillance untuk e-commerce).',
  openGraph: {
    title: 'Portfolio — VyuApp',
    description: 'Produk inti VyuApp: Sellica dan The Avalon Project — dua produk hidup yang dipelihara oleh tangan yang sama.',
    images: [{ url: `${baseUrl}/opengraph-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio — VyuApp',
    description: 'Produk inti VyuApp: Sellica dan The Avalon Project — dua produk hidup yang dipelihara oleh tangan yang sama.',
  },
  alternates: {
    canonical: `${baseUrl}/portfolio`,
  },
};

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

export default async function PortfolioPage() {
  const [main1, main2] = DEFAULT_MAIN;
  const dbItems = await getPublishedPortfolio();
  const rest = dbItems.length > 0 ? dbItems : FALLBACK_OTHER;

  const breadcrumbItems = [
    { name: 'Beranda', url: `${baseUrl}/` },
    { name: 'Portfolio', url: `${baseUrl}/portfolio` },
  ];

  const sellicaUrl = `${baseUrl}/portfolio/sellica`;
  const avalonUrl = 'https://avalon.vyuapp.my.id';

  return (
    <main className="min-h-screen">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {main1 && <SoftwareAppJsonLd
        name={main1.name}
        description={main1.description}
        url={sellicaUrl}
        applicationCategory="BusinessApplication"
      />}
      {main2 && <SoftwareAppJsonLd
        name={main2.name}
        description={main2.description}
        url={avalonUrl}
        applicationCategory="BusinessApplication"
      />}
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
