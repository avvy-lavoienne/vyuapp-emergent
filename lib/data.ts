// Server-side data helpers. Uses public client (no cookies) for ISR caching.
import { getPublicSupabase } from '@/lib/supabase/public';
import { sanitizeSearchTerm } from '@/lib/sanitize';

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
  page?: number;
  offset?: number;
  category?: string;
  tags?: string;
  search?: string;
}

export async function getPublishedArticles({ limit = 100, page = 1, offset, category = '', tags = '', search = '' }: GetArticlesOptions = {}): Promise<Article[]> {
  const supabase = getPublicSupabase();
  const computedOffset = offset ?? (page - 1) * limit;
  let query = supabase
    .from('articles')
    .select('id, slug, title, excerpt, cover, category, tags, published_at, updated_at, content')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(computedOffset, computedOffset + limit - 1)
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
    const term = sanitizeSearchTerm(search.trim());
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
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from('articles').select('*').eq('slug', slug).maybeSingle();
  if (error) { console.error('getArticleBySlug:', error.message); return null; }
  return data as Article | null;
}

export async function getRelatedArticles(currentSlug: string, category: string, tags: string[], limit: number = 3): Promise<Article[]> {
  const supabase = getPublicSupabase();

  // Fetch articles with same category OR overlapping tags (but not the current one)
  // Use a single query with or() filter for efficiency
  let query = supabase
    .from('articles')
    .select('id, slug, title, excerpt, cover, category, tags, published_at, updated_at')
    .eq('status', 'published')
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(50); // reasonable upper bound

  if (category && tags.length > 0) {
    // Match same category OR any shared tag
    query = query.or(`category.eq.${category},tags.overlaps.{${tags.join(',')}}`);
  } else if (category) {
    query = query.eq('category', category);
  } else if (tags.length > 0) {
    query = query.overlaps('tags', tags);
  }

  const { data: candidates } = await query;
  const others = (candidates as Article[]) || [];

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
  const supabase = getPublicSupabase();

  // Fetch prev and next articles in parallel
  const [prevResult, nextResult] = await Promise.all([
    supabase
      .from('articles')
      .select('id, slug, title, excerpt, cover, category, tags, published_at, updated_at')
      .eq('status', 'published')
      .lt('published_at', publishedAt)
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('articles')
      .select('id, slug, title, excerpt, cover, category, tags, published_at, updated_at')
      .eq('status', 'published')
      .gt('published_at', publishedAt)
      .order('published_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    prev: (prevResult.data as Article) || null,
    next: (nextResult.data as Article) || null,
  };
}

export async function getArticlesWithAutoLinks(slug: string): Promise<Article | null> {
  const { autoLinkContent } = await import('@/lib/auto-link');
  const supabase = getPublicSupabase();

  // Fetch article AND all other article titles in parallel
  const [articleResult, allArticlesResult] = await Promise.all([
    supabase.from('articles').select('*').eq('slug', slug).maybeSingle(),
    supabase
      .from('articles')
      .select('title, slug')
      .eq('status', 'published')
      .neq('slug', slug),
  ]);

  const article = articleResult.data as Article | null;
  if (!article) return null;

  const allArticles = allArticlesResult.data;
  if (!allArticles || allArticles.length === 0) return article;

  const linkedContent = autoLinkContent(article.content, allArticles as { title: string; slug: string }[]);
  return { ...article, content: linkedContent };
}

export async function getPublishedPortfolio(): Promise<PortfolioItem[]> {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from('portfolio_items').select('*').eq('status', 'published')
    .order('position', { ascending: true });
  if (error) { console.error('getPublishedPortfolio:', error.message); return []; }
  return (data as PortfolioItem[]) || [];
}

export async function getPortfolioBySlug(slug: string): Promise<PortfolioItem | null> {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from('portfolio_items').select('*').eq('slug', slug).eq('status', 'published').maybeSingle();
  if (data) return data as PortfolioItem;
  if (error) console.error('getPortfolioBySlug:', error.message);
  return DEFAULT_MAIN.find(item => item.slug === slug) || null;
}

export const DEFAULT_MAIN: PortfolioItem[] = [
  {
    id: 'default-tafsha',
    name: 'Tafsha Farm',
    slug: 'tafsha-farm',
    tagline: 'Manajemen Kebun & Pencatatan Budidaya',
    description: 'Aplikasi web untuk mencatat siklus tanam, rawat, dan panen di tiap petak kebun. Dibangun sebagai PWA offline-first dengan alur kerja mobile-first.',
    long_description: 'Tafsha Farm adalah aplikasi manajemen kebun untuk mencatat seluruh siklus budidaya — dari tanam, rawat, hingga panen — pada beberapa petak lahan. Setiap batch tanaman memiliki jadwal perawatan yang diturunkan otomatis menjadi tugas dan entri kalender, sehingga pekerjaan harian tidak bergantung pada ingatan. Aplikasi juga mencatat hasil panen, penjualan bibit, dan stok sarana produksi, dengan ringkasan komoditas per petak. Dibangun sebagai PWA yang dapat dipasang di perangkat dan tetap berfungsi saat koneksi terbatas. Proyek ini masih berjalan dan terus dikembangkan secara aktif.',
    category: 'Agritech',
    stack: ['Next.js', 'TypeScript', 'Supabase Postgres', 'Tailwind CSS', 'PWA'],
    value_props: [
      'Batch budidaya — catat tanam, jadwal rawat, dan siklus panen per petak',
      'Otomasi tugas & kalender — pengingat perawatan dibuat otomatis dari siklus tanaman',
      'Pencatatan hasil & sarana — log panen, bibit/penjualan, dan stok sarana',
      'PWA terpasang — bisa dipakai offline, mobile-first, pengalaman seperti aplikasi',
    ],
    features: [],
    cover: '',
    href: 'https://tafsha.vyuapp.my.id/',
    cta_label: 'Buka Tafsha Farm',
    position: 1,
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
