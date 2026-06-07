// Server-side data helpers. Reads via the anon-key server client (RLS-protected).
import { getServerSupabase } from '@/lib/supabase/server';

export async function getPublishedArticles({ limit = 100 } = {}) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, cover, category, tags, published_at, updated_at, content')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) { console.error('getPublishedArticles:', error.message); return []; }
  return data || [];
}

export async function getArticleBySlug(slug) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from('articles').select('*').eq('slug', slug).maybeSingle();
  if (error) { console.error('getArticleBySlug:', error.message); return null; }
  return data;
}

export async function getPublishedPortfolio() {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from('portfolio_items').select('*').eq('status', 'published')
    .order('position', { ascending: true });
  if (error) { console.error('getPublishedPortfolio:', error.message); return []; }
  return data || [];
}

export function slugify(s) {
  return (s || '').toString().toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 80);
}
