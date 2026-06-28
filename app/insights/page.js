import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import ArticleFilters from '@/components/ArticleFilters';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { getPublishedArticles } from '@/lib/data';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.vyuapp.my.id';

export const metadata = {
  title: 'Insights — VyuApp',
  description: 'Esai panjang tentang rekayasa web bespoke, intelijen data, dan filosofi studio dari tim VyuApp.',
  openGraph: {
    title: 'Insights — VyuApp',
    description: 'Esai panjang tentang rekayasa web bespoke, intelijen data, dan filosofi studio dari tim VyuApp.',
    images: [{ url: `${baseUrl}/opengraph-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insights — VyuApp',
    description: 'Esai panjang tentang rekayasa web bespoke, intelijen data, dan filosofi studio dari tim VyuApp.',
  },
  alternates: { canonical: `${baseUrl}/insights` },
};

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}

function ArticleCard({ a, featured = false, index = 0 }) {
  return (
    <Link
      href={`/insights/${a.slug}`}
      className={`rounded-2xl border border-[#E5E4E0] bg-white overflow-hidden flex flex-col group transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D0C9] ${featured ? 'lg:col-span-2' : ''}`}
    >
      <div className={`relative ${featured ? 'h-72' : 'h-52'} overflow-hidden bg-[#F4F3EE]`}>
        {a.cover && (
          <Image
            src={a.cover}
            alt={a.title}
            fill
            priority={index === 0}
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-700"
            sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium text-[#6B6B68] bg-white/80 border border-[#E5E4E0]">
            {a.category}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-[#8F8E8A] mb-3">
          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {formatDate(a.published_at || a.updated_at)}</span>
          <span>·</span>
          <span>{Math.max(2, Math.round((a.content || '').length / 1000))} min read</span>
        </div>
        <h3 className={`font-sans font-semibold text-[#141413] leading-snug ${featured ? 'text-2xl' : 'text-lg'} group-hover:text-[#6D5BA0] transition-colors tracking-[-0.01em]`}>
          {a.title}
        </h3>
        <p className="mt-3 text-sm text-[#4A4A48] leading-relaxed line-clamp-3">{a.excerpt}</p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {(a.tags || []).slice(0, 3).map(t => (
            <span key={t} className="text-[10px] font-mono tracking-wider text-[#B0AFAA] uppercase">#{t}</span>
          ))}
        </div>
        <div className="mt-auto pt-5">
          <span className="inline-flex items-center gap-2 text-sm text-[#6D5BA0] font-medium group-hover:gap-3 transition-all">Baca artikel <ArrowRight className="w-4 h-4" /></span>
        </div>
      </div>
    </Link>
  );
}

export default async function InsightsPage({ searchParams }) {
  const params = await searchParams;
  const category = params?.category || '';
  const tags = params?.tags || '';

  const [articles, allArticles] = await Promise.all([
    getPublishedArticles({ category, tags }),
    getPublishedArticles(),
  ]);

  const availableTags = [...new Set(allArticles.flatMap(a => a.tags || []))].sort();

  const breadcrumbItems = [
    { name: 'Beranda', url: `${baseUrl}/` },
    { name: 'Insights', url: `${baseUrl}/insights` },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Navbar />
      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionHeader
            overline="Insights"
            title="Catatan teknis, opini operasional."
            description="Esai panjang tentang rekayasa web bespoke, intelijen data, dan filosofi studio. Ditulis oleh insinyur yang menulis kode hari itu juga."
          />
        </div>
      </section>

      <section className="pb-4">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <ArticleFilters availableTags={availableTags} />
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {articles.length === 0 ? (
            <div className="p-12 rounded-2xl border border-[#E5E4E0] bg-white text-center">
              <p className="font-mono text-xs text-[#8F8E8A] uppercase tracking-[0.15em]">// Belum ada artikel</p>
              <p className="mt-3 text-sm text-[#4A4A48]">
                {(category || tags) 
                  ? 'Tidak ditemukan artikel yang cocok dengan filter. Coba filter lain.'
                  : 'Buka panel admin untuk mulai menulis.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7" key={`${category}-${tags}`}>
              {articles.map((a, i) => <ArticleCard key={a.id} a={a} featured={i === 0} index={i} />)}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
