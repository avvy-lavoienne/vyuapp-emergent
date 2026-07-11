import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getRelatedArticles, getAdjacentArticles, getArticlesWithAutoLinks } from '@/lib/data';
import AdSenseSlot from '@/components/AdSenseSlot';
import ShareButton from '@/components/ShareButton';
import TableOfContents from '@/components/TableOfContents';
import ArticleNav from '@/components/ArticleNav';

import { BreadcrumbJsonLd, ArticleJsonLd, FAQPageJsonLd } from '@/components/JsonLd';
import sanitizeHtml from 'sanitize-html';

// ISR: cache rendered pages for 1 hour, serve stale while revalidating
export const revalidate = 3600;

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

function sanitizeHtmlContent(html) {
  if (!html) return '';
  return sanitizeHtml(html, {
    allowedTags: ['p','br','strong','em','h2','h3','h4','h5','h6','ul','ol','li','a','blockquote','code','pre','img','figure','figcaption','table','thead','tbody','tr','td','th','span','div'],
    allowedAttributes: {
      'a': ['href','target','rel'],
      'img': ['src','alt','width','height'],
      '*': ['class','id','style'],
    },
    allowedSchemes: ['http','https','data'],
  });
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
      images: article.cover ? [{ url: article.cover, width: 1200, height: 630, alt: article.title }] : [],
    },
    twitter: { card: 'summary_large_image', title: article.title, description: article.excerpt, images: article.cover ? [article.cover] : [] },
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
  
  // Fetch article with auto-links injected (Feature 3)
  const article = await getArticlesWithAutoLinks(slug);
  if (!article || article.status !== 'published') notFound();

  // Fetch related articles AND adjacent articles in parallel
  const [related, { prev: prevArticle, next: nextArticle }] = await Promise.all([
    getRelatedArticles(slug, article.category, article.tags || [], 3),
    getAdjacentArticles(article.published_at),
  ]);

  const linkedContent = article.content; // already auto-linked
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
    <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000]">
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
      {/* Preload cover image for LCP */}
      {article.cover && (
        <link
          rel="preload"
          as="image"
          href={`/_next/image?url=${encodeURIComponent(article.cover)}&w=1200&q=75`}
          imagesrcset={`/_next/image?url=${encodeURIComponent(article.cover)}&w=640&q=75 640w, /_next/image?url=${encodeURIComponent(article.cover)}&w=828&q=75 828w, /_next/image?url=${encodeURIComponent(article.cover)}&w=1200&q=75 1200w`}
          imagesizes="(max-width: 768px) 100vw, 896px"
          fetchpriority="high"
        />
      )}
      <article className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm text-[#6e6e73] dark:text-[#86868b] hover:text-[#2997ff] dark:hover:text-[#5BA3FF] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Semua artikel
          </Link>
          <p className="font-mono text-xs text-[#2997ff] dark:text-[#5BA3FF] uppercase tracking-[0.15em] font-medium">
            {article.category}
          </p>
          <h1 className="mt-4 text-3xl md:text-5xl font-sans font-semibold leading-tight tracking-[-0.025em] text-[#1d1d1f] dark:text-[#f5f5f7]">
            {article.title}
          </h1>
          <p className="mt-5 text-lg text-[#4A4A48] dark:text-[#86868b] leading-relaxed">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#6e6e73] dark:text-[#8A8A8A] font-mono">
            <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {formatDate(article.published_at || article.updated_at)}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {readMin} min read</span>
            {(article.tags || []).slice(0, 4).map(t => <span key={t}>#{t}</span>)}
          </div>
          <TableOfContents html={linkedContent} />
          <div className="mt-10 rounded-2xl overflow-hidden border border-[#d2d2d7] dark:border-[#333336] relative aspect-video bg-[#F4F3EE] dark:bg-[#1d1d1f]">
            <Image src={article.cover || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80'} alt={article.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 896px" />
          </div>
          <div className="mt-12 prose-light" dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(c1) }} />
          <AdSenseSlot slot={SLOT_TOP} format="auto" />
          <div className="prose-light" dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(c2) }} />
          <AdSenseSlot slot={SLOT_MID} format="rectangle" style={{ display: 'block', minHeight: 250, maxWidth: 336, margin: '0 auto' }} />
          <div className="prose-light" dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(c3) }} />
          <AdSenseSlot slot={SLOT_END} format="auto" />
          <div className="mt-12 p-6 rounded-2xl border border-[#d2d2d7] dark:border-[#333336] bg-white dark:bg-[#1d1d1f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 rounded-full bg-[#2997ff]/10 dark:bg-[#5BA3FF]/10 border border-[#2997ff]/20 dark:border-[#5BA3FF]/20 flex items-center justify-center text-[#2997ff] dark:text-[#5BA3FF] font-semibold">V</span>
              <div>
                <p className="text-sm text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">VyuApp Studio</p>
                <p className="text-xs text-[#6e6e73] dark:text-[#86868b]">Bespoke web engineering — Garut, ID</p>
              </div>
            </div>
            <ShareButton title={article.title} />
          </div>
        </div>
      </article>

      <ArticleNav prev={prevArticle} next={nextArticle} />

      {related.length > 0 && (
        <section className="py-24 md:py-32 border-t border-[#d2d2d7] dark:border-[#333336]">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <p className="font-mono text-xs text-[#6e6e73] dark:text-[#8A8A8A] uppercase tracking-[0.15em] font-medium">Artikel terkait</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-sans font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.02em]">
              Lanjutkan membaca
            </h2>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {related.map(r => (
                <Link
                  key={r.id}
                  href={`/insights/${r.slug}`}
                  className="p-6 rounded-2xl border border-[#d2d2d7] dark:border-[#333336] bg-white dark:bg-[#1d1d1f] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D0C9] dark:hover:border-[#3A3A3D] group"
                >
                  <p className="font-mono text-[10px] text-[#2997ff] dark:text-[#5BA3FF] uppercase tracking-[0.15em] font-medium">
                    {r.category}
                  </p>
                  <h3 className="mt-3 text-base font-sans font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-[#2997ff] dark:group-hover:text-[#5BA3FF] transition leading-snug tracking-[-0.01em]">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-xs text-[#6e6e73] dark:text-[#86868b] line-clamp-2 leading-relaxed">{r.excerpt}</p>
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
