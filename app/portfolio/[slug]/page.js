import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DetailedProduct from '@/components/DetailedProduct';
import { BreadcrumbJsonLd, SoftwareAppJsonLd } from '@/components/JsonLd';
import { getPortfolioBySlug, getPublishedPortfolio, DEFAULT_MAIN } from '@/lib/data';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const dbItems = await getPublishedPortfolio();
    const slugs = [
      ...DEFAULT_MAIN.map(item => ({ slug: item.slug })),
      ...dbItems.map(item => ({ slug: item.slug })),
    ];
    const seen = new Set();
    return slugs.filter(s => { if (seen.has(s.slug)) return false; seen.add(s.slug); return true; });
  } catch {
    return DEFAULT_MAIN.map(item => ({ slug: item.slug }));
  }
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getPortfolioBySlug(slug);
  if (!item) return { title: 'Proyek tidak ditemukan — VyuApp' };
  const url = `${baseUrl}/portfolio/${item.slug}`;
  return {
    title: `${item.name} — VyuApp Portfolio`,
    description: item.description || item.tagline,
    openGraph: {
      title: `${item.name} — VyuApp`,
      description: item.description,
      url,
      images: [{ url: `${baseUrl}/opengraph-image.png`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: `${item.name} — VyuApp`, description: item.description },
    alternates: { canonical: url },
  };
}

export default async function PortfolioDetailPage({ params }) {
  const { slug } = await params;
  const item = await getPortfolioBySlug(slug);
  if (!item) notFound();

  const url = `${baseUrl}/portfolio/${item.slug}`;
  const breadcrumbItems = [
    { name: 'Beranda', url: `${baseUrl}/` },
    { name: 'Portfolio', url: `${baseUrl}/portfolio` },
    { name: item.name, url },
  ];

  const productUrl = item.slug === 'avalon' ? 'https://avalon.vyuapp.my.id' : url;
  const accent = item.slug === 'avalon' ? 'bg-sky-500/10' : 'bg-emerald-500/15';

  return (
    <main className="min-h-screen">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <SoftwareAppJsonLd
        name={item.name}
        description={item.description}
        url={productUrl}
        applicationCategory="BusinessApplication"
      />
      <Navbar />
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 vyu-grid-bg opacity-40" />
        <div aria-hidden className={`absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] ${accent}`} />
        <div className="vyu-container relative">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 mb-8">
            <ArrowLeft className="w-4 h-4" /> Semua proyek
          </Link>
          <DetailedProduct item={item} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
