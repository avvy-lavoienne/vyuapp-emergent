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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.vyuapp.my.id';

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

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <SoftwareAppJsonLd
        name={item.name}
        description={item.description}
        url={productUrl}
        applicationCategory="BusinessApplication"
      />
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-[#6B6B68] hover:text-[#6D5BA0] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Semua proyek
          </Link>
          <DetailedProduct item={item} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
