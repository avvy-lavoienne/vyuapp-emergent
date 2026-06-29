import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getPublishedArticles } from '@/lib/data';
import AdSenseSlot from '@/components/AdSenseSlot';
import ShareButton from '@/components/ShareButton';
import TableOfContents from '@/components/TableOfContents';

import { autoLink } from '@/lib/auto-linker';
import { BreadcrumbJsonLd, ArticleJsonLd, FAQPageJsonLd } from '@/components/JsonLd';

function extractFAQs(html) {
  if (!html) return [];
  const faqs = [];
  // Find FAQ section
  const faqIdx = html.toLowerCase().indexOf('pertanyaan yang sering diajukan');
  if (faqIdx === -1) return faqs;
  
  const faqSection = html.substring(faqIdx);
  // Extract Q&A pairs
  const regex = /<h3[^>]*>(.*?)<\/h3>\s*<p>(.*?)<\/p>/gs;
  let match;
  while ((match = regex.exec(faqSection)) !== null) {
    const question = match[1].replace(/<[^>]+>/g, '').replace(/^Q:\s*/i, '').trim();
    const answer = match[2].replace(/<[^>]+>/g, '').trim();
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }
  return faqs;
}

export const revalidate = 3600;

function sanitizeHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.vyuapp.my.id';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || article.status !== 'published') return { title: 'Artikel tidak ditemukan', robots: { index: false, follow: false } };
  const url = `${baseUrl}/insights/${article.slug}`;
  return {
    title: `${article.title} — VyuApp Insights`,
    description: article.excerpt,
    robots: { index: true, follow: true },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url,
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
      authors: ['VyuApp Studio'],
      section: article.category,
      tags: article.tags || [],
      images: article.cover ? [{ url: article.cover, width: 1200, height: 630, alt: article.title }] : [{ url: `${baseUrl}/opengraph-image.png`, width: 1200, height: 630 }],
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
  const all = await getPublishedArticles({ limit: 100 });
  const others = all.filter(a => a.id !== article.id);
  
  // Semantic matching: same category first, then shared tags
  const withScore = others.map(a => {
    let score = 0;
    if (a.category === article.category) score += 10;
    const sharedTags = (a.tags || []).filter(t => (article.tags || []).includes(t));
    score += sharedTags.length * 3;
    return { ...a, score };
  }).sort((a, b) => b.score - a.score);
  const related = withScore.slice(0, 3);

  // Previous/Next navigation
  const currentIndex = all.findIndex(a => a.id === article.id);
  const prevArticle = currentIndex < all.length - 1 ? all[currentIndex + 1] : null;
  const nextArticle = currentIndex > 0 ? all[currentIndex - 1] : null;

  const linkedContent = autoLink(article.content, article.slug);
  const [c1, c2, c3] = splitHTMLByParagraphs(linkedContent);
  const readMin = Math.max(2, Math.round((article.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length / 200));
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
    <main className="min-h-screen bg-[#FAFAF8]">
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
      <FAQPageJsonLd faqs={extractFAQs(article.content)} />
      <Navbar />
      <article className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm text-[#6B6B68] hover:text-[#6D5BA0] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Semua artikel
          </Link>
          <p className="font-mono text-xs text-[#6D5BA0] uppercase tracking-[0.15em] font-medium">
            {article.category}
          </p>
          <h1 className="mt-4 text-3xl md:text-5xl font-sans font-semibold leading-tight tracking-[-0.025em] text-[#141413]">
            {article.title}
          </h1>
          <p className="mt-5 text-lg text-[#4A4A48] leading-relaxed">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#8F8E8A] font-mono">
            <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {formatDate(article.published_at || article.updated_at)}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {readMin} min read</span>
            {(article.tags || []).slice(0, 4).map(t => <span key={t}>#{t}</span>)}
          </div>
          <TableOfContents html={linkedContent} />
          <div className="mt-10 rounded-2xl overflow-hidden border border-[#E5E4E0] relative aspect-video bg-[#F4F3EE]">
            <Image src={article.cover || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80'} alt={article.title} fill className="object-cover" priority />
          </div>
          <div className="mt-12 prose-light" dangerouslySetInnerHTML={{ __html: sanitizeHtml(c1) }} />
          <AdSenseSlot slot={SLOT_TOP} format="auto" />
          <div className="prose-light" dangerouslySetInnerHTML={{ __html: sanitizeHtml(c2) }} />
          <AdSenseSlot slot={SLOT_MID} format="rectangle" style={{ display: 'block', minHeight: 250, maxWidth: 336, margin: '0 auto' }} />
          <div className="prose-light" dangerouslySetInnerHTML={{ __html: sanitizeHtml(c3) }} />
          <AdSenseSlot slot={SLOT_END} format="auto" />
          <div className="mt-12 p-6 rounded-2xl border border-[#E5E4E0] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 rounded-full bg-[#6D5BA0]/10 border border-[#6D5BA0]/20 flex items-center justify-center text-[#6D5BA0] font-semibold">V</span>
              <div>
                <p className="text-sm text-[#141413] font-medium">VyuApp Studio</p>
                <p className="text-xs text-[#6B6B68]">Bespoke web engineering — Garut, ID</p>
              </div>
            </div>
            <ShareButton title={article.title} />
          </div>
        </div>
      </article>

      {(prevArticle || nextArticle) && (
        <section className="border-t border-[#E5E4E0]">
          <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 flex flex-col sm:flex-row gap-4">
            {prevArticle ? (
              <Link href={`/insights/${prevArticle.slug}`} className="flex-1 p-5 rounded-2xl border border-[#E5E4E0] bg-white hover:border-[#D1D0C9] transition group">
                <span className="text-xs text-[#8F8E8A] font-mono">← Sebelumnya</span>
                <p className="mt-2 text-sm font-semibold text-[#141413] group-hover:text-[#6D5BA0] transition line-clamp-2">{prevArticle.title}</p>
              </Link>
            ) : <div className="flex-1" />}
            {nextArticle ? (
              <Link href={`/insights/${nextArticle.slug}`} className="flex-1 p-5 rounded-2xl border border-[#E5E4E0] bg-white hover:border-[#D1D0C9] transition group text-right">
                <span className="text-xs text-[#8F8E8A] font-mono">Selanjutnya →</span>
                <p className="mt-2 text-sm font-semibold text-[#141413] group-hover:text-[#6D5BA0] transition line-clamp-2">{nextArticle.title}</p>
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-24 md:py-32 border-t border-[#E5E4E0]">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <p className="font-mono text-xs text-[#8F8E8A] uppercase tracking-[0.15em] font-medium">Artikel terkait</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-sans font-semibold text-[#141413] tracking-[-0.02em]">
              Lanjutkan membaca
            </h2>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {related.map(r => (
                <Link
                  key={r.id}
                  href={`/insights/${r.slug}`}
                  className="p-6 rounded-2xl border border-[#E5E4E0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D0C9] group"
                >
                  <p className="font-mono text-[10px] text-[#6D5BA0] uppercase tracking-[0.15em] font-medium">
                    {r.category}
                  </p>
                  <h3 className="mt-3 text-base font-sans font-semibold text-[#141413] group-hover:text-[#6D5BA0] transition leading-snug tracking-[-0.01em]">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-xs text-[#6B6B68] line-clamp-2 leading-relaxed">{r.excerpt}</p>
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
