import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { getPublishedArticles } from '@/lib/data';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
  alternates: {
    canonical: `${baseUrl}/insights`,
  },
};

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}

function ArticleCard({ a, featured = false }) {
  return (
    <Link href={`/insights/${a.slug}`} className={`vyu-card overflow-hidden flex flex-col group ${featured ? 'lg:col-span-2' : ''}`}>
      <div className={`relative ${featured ? 'h-72' : 'h-52'} overflow-hidden bg-zinc-900`}>
        {a.cover && (
          <Image src={a.cover} alt={a.title} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-700" sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="vyu-chip">{a.category}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-zinc-500 font-[var(--font-mono)] mb-3">
          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {formatDate(a.published_at || a.updated_at)}</span>
          <span>·</span>
          <span>{Math.max(2, Math.round((a.content || '').length / 1000))} min read</span>
        </div>
        <h3 className={`font-semibold text-zinc-50 leading-snug ${featured ? 'text-2xl' : 'text-lg'} group-hover:text-emerald-300 transition-colors`}>
          {a.title}
        </h3>
        <p className="mt-3 text-sm text-zinc-400 leading-relaxed line-clamp-3">{a.excerpt}</p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {(a.tags || []).slice(0, 3).map(t => (
            <span key={t} className="text-[10px] font-[var(--font-mono)] tracking-wider text-zinc-500 uppercase">#{t}</span>
          ))}
        </div>
        <div className="mt-auto pt-5">
          <span className="inline-flex items-center gap-2 text-sm text-emerald-400 group-hover:gap-3 transition-all">Baca artikel <ArrowRight className="w-4 h-4" /></span>
        </div>
      </div>
    </Link>
  );
}

export default async function InsightsPage() {
  const articles = await getPublishedArticles();
  const breadcrumbItems = [
    { name: 'Beranda', url: `${baseUrl}/` },
    { name: 'Insights', url: `${baseUrl}/insights` },
  ];

  return (
    <main className="min-h-screen">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Navbar />
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 vyu-grid-bg" />
        <div aria-hidden className="absolute -top-20 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="vyu-container relative">
          <SectionHeader overline="INSIGHTS" title="Catatan teknis," gradientWord="opini operasional."
            description="Esai panjang tentang rekayasa web bespoke, intelijen data, dan filosofi studio. Ditulis oleh insinyur yang menulis kode hari itu juga." />
        </div>
      </section>
      <section className="vyu-section !pt-6">
        <div className="vyu-container">
          {articles.length === 0 ? (
            <div className="vyu-card p-12 text-center text-zinc-400">
              <p className="vyu-overline">// 0 ARTICLES</p>
              <p className="mt-3">Belum ada artikel dipublikasikan. Buka <code className="text-emerald-400">/admin</code> untuk mulai menulis, atau pastikan SUPABASE_SETUP.sql sudah dijalankan.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {articles.map((a, i) => <ArticleCard key={a.id} a={a} featured={i === 0} />)}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
