import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
  alternates: { canonical: `${baseUrl}/portfolio` },
};

function OtherProject({ item }) {
  return (
    <div className="p-6 rounded-2xl border border-[#E5E4E0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D0C9]">
      <p className="font-mono text-[10px] text-[#6D5BA0] uppercase tracking-[0.18em] font-medium mb-3">
        {(item.category || 'PROJECT').toUpperCase()}
      </p>
      <h4 className="text-base font-semibold text-[#141413] tracking-[-0.01em]">{item.name}</h4>
      <p className="mt-2 text-sm text-[#4A4A48] leading-relaxed">{item.description}</p>
      {(item.stack || []).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(item.stack || []).slice(0, 4).map(s => (
            <span key={s} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium text-[#6B6B68] bg-[#F4F3EE] border border-[#E5E4E0]">
              {s}
            </span>
          ))}
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
    <main className="min-h-screen bg-[#FAFAF8]">
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

      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionHeader
            overline="Portfolio"
            title="Produk hidup, dijaga oleh tangan yang sama."
            description="Kami mempublikasikan portfolio yang dapat kami pertanggungjawabkan di produksi — bukan mockup, bukan konsep."
            highlight="yang sama"
          />
        </div>
      </section>

      {main1 && (
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <DetailedProduct item={main1} />
          </div>
        </section>
      )}

      {main2 && (
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <DetailedProduct item={main2} />
          </div>
        </section>
      )}

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionHeader
            overline="Other Work"
            title="Proyek lain yang sedang berkembang."
            description="Slot ini akan terisi seiring kami merilis case study."
          />
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(rest.length ? rest : FALLBACK_OTHER).map(item => <OtherProject key={item.id} item={item} />)}
          </div>
          <div className="mt-12 p-8 md:p-10 rounded-2xl border border-[#E5E4E0] bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-[#141413]">Punya proyek yang layak masuk kanon ini?</h3>
              <p className="text-sm text-[#4A4A48] mt-2 max-w-xl">Kami menerima 2–3 kolaborasi baru per kuartal. Hubungi kami dengan brief yang spesifik.</p>
            </div>
            <Link
              href="/#kontak"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6D5BA0] text-white text-sm font-semibold hover:bg-[#574886] transition-all duration-200 hover:-translate-y-0.5 shrink-0"
            >
              Request Collaboration <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
