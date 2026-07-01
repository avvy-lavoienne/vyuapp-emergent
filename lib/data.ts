// Server-side data helpers. Reads via the anon-key server client (RLS-protected).
import { getServerSupabase } from '@/lib/supabase/server';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string | null;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  published_at: string | null;
  updated_at: string;
  content: string;
  author_id?: string | null;
}

export interface PortfolioItem {
  id?: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  long_description: string;
  features: string[];
  value_props: string[];
  stack: string[];
  category: string;
  cover: string;
  href: string;
  cta_label: string;
  position: number;
  status: 'draft' | 'published';
}

interface GetArticlesOptions {
  limit?: number;
  category?: string;
  tags?: string;
  search?: string;
}

export async function getPublishedArticles({ limit = 100, category = '', tags = '', search = '' }: GetArticlesOptions = {}): Promise<Article[]> {
  const supabase = await getServerSupabase();
  let query = supabase
    .from('articles')
    .select('id, slug, title, excerpt, cover, category, tags, published_at, updated_at, content')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq('category', category);
  }

  if (tags) {
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    if (tagList.length === 1) {
      query = query.contains('tags', [tagList[0]]);
    } else if (tagList.length > 1) {
      query = query.overlaps('tags', tagList);
    }
  }

  if (search && search.trim()) {
    const term = search.trim();
    // Use ilike across title, excerpt, and content for broad compatibility
    query = query.or(
      `title.ilike.%${term}%,excerpt.ilike.%${term}%,content.ilike.%${term}%`
    );
  }

  const { data, error } = await query;
  if (error) { console.error('getPublishedArticles:', error.message); return []; }
  return (data as Article[]) || [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from('articles').select('*').eq('slug', slug).maybeSingle();
  if (error) { console.error('getArticleBySlug:', error.message); return null; }
  return data as Article | null;
}

export async function getRelatedArticles(currentSlug: string, category: string, tags: string[], limit: number = 3): Promise<Article[]> {
  const all = await getPublishedArticles({ limit: 100 });
  const others = all.filter(a => a.slug !== currentSlug);

  // Score: same category +10, each shared tag +3
  const scored = others.map(a => {
    let score = 0;
    if (a.category === category) score += 10;
    const shared = (a.tags || []).filter(t => (tags || []).includes(t));
    score += shared.length * 3;
    return { ...a, score };
  });

  // Sort by score desc, then by published_at desc for ties
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
  });

  return scored.slice(0, limit);
}

export async function getAdjacentArticles(publishedAt: string | null): Promise<{ prev: Article | null; next: Article | null }> {
  if (!publishedAt) return { prev: null, next: null };
  const supabase = await getServerSupabase();

  // Article published just BEFORE this one (older)
  const { data: prevData } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, cover, category, tags, published_at, updated_at')
    .eq('status', 'published')
    .lt('published_at', publishedAt)
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // Article published just AFTER this one (newer)
  const { data: nextData } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, cover, category, tags, published_at, updated_at')
    .eq('status', 'published')
    .gt('published_at', publishedAt)
    .order('published_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  return {
    prev: (prevData as Article) || null,
    next: (nextData as Article) || null,
  };
}

export async function getArticlesWithAutoLinks(slug: string): Promise<Article | null> {
  const { autoLinkContent } = await import('@/lib/auto-link');
  const article = await getArticleBySlug(slug);
  if (!article) return null;

  // Fetch all other published articles (just title + slug for efficiency)
  const supabase = await getServerSupabase();
  const { data: allArticles } = await supabase
    .from('articles')
    .select('title, slug')
    .eq('status', 'published')
    .neq('slug', slug);

  if (!allArticles || allArticles.length === 0) return article;

  const linkedContent = autoLinkContent(article.content, allArticles as { title: string; slug: string }[]);
  return { ...article, content: linkedContent };
}

export async function getPublishedPortfolio(): Promise<PortfolioItem[]> {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from('portfolio_items').select('*').eq('status', 'published')
    .order('position', { ascending: true });
  if (error) { console.error('getPublishedPortfolio:', error.message); return []; }
  return (data as PortfolioItem[]) || [];
}

export async function getPortfolioBySlug(slug: string): Promise<PortfolioItem | null> {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from('portfolio_items').select('*').eq('slug', slug).eq('status', 'published').maybeSingle();
  if (data) return data as PortfolioItem;
  if (error) console.error('getPortfolioBySlug:', error.message);
  return DEFAULT_MAIN.find(item => item.slug === slug) || null;
}

export const DEFAULT_MAIN: PortfolioItem[] = [
  {
    id: 'default-sellica',
    name: 'Sellica',
    slug: 'sellica',
    tagline: 'Sistem Administrasi Kependudukan & Evaluasi Kinerja',
    description: 'Platform tata kelola administrasi internal untuk instansi pemerintah (Disdukcapil), dibangun dengan Go backend berkinerja tinggi dan Next.js TypeScript frontend.',
    long_description: 'Sellica adalah platform tata kelola administrasi internal yang dirancang khusus untuk instansi pemerintah seperti Disdukcapil. Dibangun dengan Go (Gin) backend yang menangani 14+ layanan mikro dan Next.js 15 TypeScript frontend, Sellica mengintegrasikan SIAK (Sistem Informasi Administrasi Kependudukan), SILPANA (Sistem Informasi Pelaporan), deteksi operator duplikat, dan RAG pipeline untuk pencarian dokumen cerdas. Platform ini menggunakan WebSocket dan Event Bus untuk komunikasi real-time antar layanan, dengan performa teruji: 49 tests 100% passing, 1.5ms per operasi, dan 100+ ops/sec throughput. Fitur unggulan termasuk AI Pre-Auditor yang mendeteksi ketidaksinkronan laporan secara otomatis (mengurangi waktu koreksi hingga 80%), Duplicate Operator Detection untuk database kependudukan, dan Document Validation berbasis NLP.',
    category: 'Tata Kelola & Kinerja',
    stack: ['Go (Gin)', 'Next.js 15', 'TypeScript', 'Supabase Postgres', 'WebSocket', 'RAG'],
    value_props: [
      'AI Pre-Auditor — deteksi otomatis ketidaksinkronan laporan, kurangi waktu koreksi hingga 80%',
      'Duplicate Operator Detection — algoritma canggih deteksi entri duplikat di database kependudukan',
      'SIAK & SILPANA Integration — terintegrasi langsung dengan sistem informasi pemerintah',
      'WebSocket + Event Bus — komunikasi real-time antar 14 layanan backend',
      'Performa: 49 tests 100% passing, 1.5ms/op, 100+ ops/sec throughput, <100ms p99 latency',
    ],
    features: [],
    cover: '',
    href: '/portfolio',
    cta_label: 'Pelajari lebih lanjut',
    position: 99,
    status: 'published',
  },
  {
    id: 'default-avalon',
    name: 'The Avalon Project',
    slug: 'avalon',
    tagline: 'Enterprise Market Intelligence & Price Surveillance',
    description: 'Platform Market Intelligence berskala enterprise yang dirancang untuk mengatasi masalah manipulasi data dan pelanggaran harga di pasar e-commerce Indonesia.',
    long_description: 'The Avalon Project adalah platform Market Intelligence berskala perusahaan (Enterprise) yang dirancang khusus untuk mengatasi masalah manipulasi data dan pelanggaran harga (price dumping) di pasar e-commerce Indonesia (Shopee). Banyak perusahaan besar mengambil keputusan bisnis berdasarkan data mentah yang kotor akibat polusi produk aksesoris yang salah kategori, produk iklan manipulatif berharga Rp 0, dan judul kosmetik pedagang. Avalon hadir sebagai solusi hibrida: menggabungkan kekuatan mesin ekstraksi data otonom yang tangguh di backend dengan dasbor kokpit visual yang sangat minimalis dan elegan di frontend untuk jajaran eksekutif C-Level.',
    category: 'Market Intelligence',
    stack: ['FastAPI (Python)', 'Supabase (PostgreSQL)', 'Next.js', 'Tailwind CSS', 'Docker'],
    value_props: [
      'HET Guard (Reseller Watchdog): Perlindungan 24/7 yang melacak dan memberi sinyal darurat (Red Alert) jika ada reseller tidak resmi yang membanting harga produk Anda di bawah kesepakatan pasar',
      'Merlin Data Purification: Algoritma Semantic Regex canggih yang secara agresif membersihkan polusi data iklan, merek palsu, dan teks kosmetik pasar untuk menyajikan kebenaran pasar yang murni',
      'Excalibur Engine: Inovasi pipa data yang mampu menembus enkripsi platform e-commerce guna menyelamatkan metrik-metrik krusial yang tersembunyi menjadi estimasi total omset pasar (GMV) yang akurat',
      'Arsitektur ETL kebal blokir dengan akurasi data hingga 99.8%',
    ],
    features: [],
    cover: '',
    href: '/portfolio',
    cta_label: 'Pelajari lebih lanjut',
    position: 99,
    status: 'published',
  },
];

interface FallbackOtherItem {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const FALLBACK_OTHER: FallbackOtherItem[] = [
  { id: 'f1', name: 'Ingestion Service — NDA Client A', category: 'DATA PIPELINE', description: 'Pipeline data 24/7 multi-sumber untuk klien fintech regional. Idempotent worker, dead-letter queue, dan dashboard observability internal.' },
  { id: 'f2', name: 'Custom SSO — NDA Client B', category: 'AUTH PLATFORM', description: 'Layer otentikasi bespoke untuk B2B SaaS, mengintegrasikan SAML, OIDC, dan session management dengan kebijakan keamanan kustom.' },
  { id: 'f3', name: 'Editorial Platform — Stealth', category: 'BRAND ENGINEERING', description: 'Platform editorial untuk publikasi premium, menggabungkan headless CMS, RSC, dan typography engine kustom.' },
];

export function slugify(s: string): string {
  return (s || '').toString().toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 80);
}
