import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getPublishedArticles } from '@/lib/data';
import AdSenseSlot from '@/components/AdSenseSlot';
import ShareButton from '@/components/ShareButton';
import { BreadcrumbJsonLd, ArticleJsonLd } from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Artikel tidak ditemukan' };
  const url = `${baseUrl}/insights/${article.slug}`;
  return {
    title: `${article.title} — VyuApp Insights`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url,
      publishedTime: article.published_at,
      images: article.cover ? [{ url: article.cover, width: 1200, height: 630 }] : [{ url: `${baseUrl}/opengraph-image.png`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: article.title, description: article.excerpt, images: article.cover ? [article.cover] : [`${baseUrl}/opengraph-image.png`] },
    alternates: { canonical: url },
  };
}

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}

function splitHTMLByParagraphs(html) {
  if (!html) return ['', '', ''];
  const parts = html.split(/(?=<h2|<h3)/);
  if (parts.length < 3) {
    const pSplit = html.split(/(<\/p>)/i);
    const recombined = [];
    for (let i = 0; i < pSplit.length; i += 2) recombined.push((pSplit[i] || '') + (pSplit[i+1] || ''));
    const t = recombined.length;
    const a = Math.floor(t / 3);
    return [recombined.slice(0, a).join(''), recombined.slice(a, a*2).join(''), recombined.slice(a*2).join('')];
  }
  const a = Math.floor(parts.length / 3);
  return [parts.slice(0, a).join(''), parts.slice(a, a*2).join(''), parts.slice(a*2).join('')];
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || article.status !== 'published') notFound();
  const all = await getPublishedArticles({ limit: 8 });
  const related = all.filter(a => a.id !== article.id).slice(0, 3);

  const [c1, c2, c3] = splitHTMLByParagraphs(article.content);
  const readMin = Math.max(2, Math.round((article.content || '').length / 1000));
  const SLOT_TOP = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP;
  const SLOT_MID = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID;
  const SLOT_END = process.env.NEXT_PUBLIC_ADSENSE_SLOT_END;

  const articleUrl = `${baseUrl}/insights/${article.slug}`;
  const breadcrumbItems = [
    { name: 'Beranda', url: `${baseUrl}/` },
    { name: 'Insights', url: `${baseUrl}/insights` },
    { name: article.title, url: articleUrl },
  ];

  return (
    <main className="min-h-screen">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt}
        url={articleUrl}
        image={article.cover}
        datePublished={article.published_at}
        dateModified={article.updated_at}
        authorName="VyuApp Studio"
      />
      <Navbar />
      <article className="relative pt-32 pb-20">
        <div className="absolute inset-0 vyu-grid-bg opacity-40" />
        <div aria-hidden className="absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="relative max-w-4xl mx-auto px-6 md:px-10">
          <Link href="/insights" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 mb-8">
            <ArrowLeft className="w-4 h-4" /> Semua artikel
          </Link>
          <p className="vyu-overline">// {article.category}</p>
          <h1 className="mt-4 text-3xl md:text-5xl font-semibold leading-tight tracking-tight text-zinc-50">{article.title}</h1>
          <p className="mt-5 text-lg text-zinc-400 leading-relaxed">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-[var(--font-mono)]">
            <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {formatDate(article.published_at || article.updated_at)}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {readMin} min read</span>
            {(article.tags || []).slice(0, 4).map(t => <span key={t}>#{t}</span>)}
          </div>
          {article.cover && (
            <div className="mt-10 rounded-2xl overflow-hidden border border-zinc-800 relative aspect-video">
              <Image src={article.cover} alt={article.title} fill className="object-cover" priority />
            </div>
          )}
          <div className="mt-12 vyu-prose" dangerouslySetInnerHTML={{ __html: c1 }} />
          <AdSenseSlot slot={SLOT_TOP} format="auto" />
          <div className="vyu-prose" dangerouslySetInnerHTML={{ __html: c2 }} />
          <AdSenseSlot slot={SLOT_MID} format="rectangle" style={{ display: 'block', minHeight: 250, maxWidth: 336, margin: '0 auto' }} />
          <div className="vyu-prose" dangerouslySetInnerHTML={{ __html: c3 }} />
          <AdSenseSlot slot={SLOT_END} format="auto" />
          <div className="mt-12 vyu-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 rounded-full bg-emerald-400/10 ring-1 ring-emerald-400/40 flex items-center justify-center text-emerald-400 font-semibold">V</span>
              <div>
                <p className="text-sm text-zinc-200 font-medium">VyuApp Studio</p>
                <p className="text-xs text-zinc-500">Bespoke web engineering — Garut, ID</p>
              </div>
            </div>
            <ShareButton title={article.title} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="vyu-section">
          <div className="vyu-container">
            <p className="vyu-overline">// RELATED</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold">Artikel lain yang mungkin <span className="text-gradient-emerald">relevan</span></h2>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {related.map(r => (
                <Link key={r.id} href={`/insights/${r.slug}`} className="vyu-card p-6 group">
                  <p className="vyu-overline">// {r.category}</p>
                  <h3 className="mt-3 text-base font-semibold text-zinc-50 group-hover:text-emerald-300 transition leading-snug">{r.title}</h3>
                  <p className="mt-3 text-xs text-zinc-500 line-clamp-2">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </main>
  );
}
