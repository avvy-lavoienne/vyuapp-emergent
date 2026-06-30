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
    tagline: 'Sistem Evaluasi Kinerja & Aktivitas',
    description: 'Platform tata kelola administrasi internal yang dirancang untuk menjembatani standarisasi laporan formal dengan fleksibilitas metodologi kerja modern.',
    long_description: 'Sellica adalah platform tata kelola administrasi internal yang dirancang untuk menjembatani standarisasi laporan formal dengan fleksibilitas metodologi kerja modern. Dibangun khusus untuk instansi dan organisasi yang memiliki volume pelaporan harian yang padat, Sellica memotong rantai birokrasi yang lambat dengan memperkenalkan sistem automasi pengisian draf berbasis AI. Platform ini memastikan setiap aparatur atau anggota tim memiliki akuntabilitas yang tinggi melalui catatan aktivitas yang terverifikasi, sekaligus memberikan visualisasi metrik performa kelayakan kerja langsung kepada pihak manajemen/auditor internal.',
    category: 'Tata Kelola & Kinerja',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Python Backend', 'LLM API'],
    value_props: [
      'Scrum Framework Management: Transformasi beban kerja tim melalui dasbor sprint dan manajemen tugas yang transparan dan terukur secara real-time',
      'Automated Activity Logging: Pendataan laporan lengkap individu dan catatan aktivitas harian yang terstruktur, meminimalisir manipulasi data dokumen',
      'Embedded AI Pre-Auditor: Integrasi asisten AI yang secara cerdas mendeteksi ketidaksinkronan berkas laporan, merangkum capaian kerja, dan memotong waktu koreksi manual hingga 80%',
      'AI-Driven Document Validation: Modul NLP untuk pengecekan kepatuhan teks laporan terhadap aturan formal organisasi secara otomatis',
      'Lightweight Scrum Dashboard: Manajemen tugas berbasis Next.js App Router yang sangat responsif dengan performa instan',
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
