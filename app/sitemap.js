import { getPublishedArticles, getPublishedPortfolio } from '@/lib/data';

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000';
  const now = new Date();

  const staticRoutes = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/portfolio`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/insights`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
  ];

  let articleRoutes = [];
  try {
    const articles = await getPublishedArticles({ limit: 1000 });
    articleRoutes = articles.map(a => ({
      url: `${base}/insights/${a.slug}`,
      lastModified: new Date(a.updated_at || a.published_at || now),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch {}

  let portfolioRoutes = [];
  try {
    const items = await getPublishedPortfolio();
    portfolioRoutes = items.map(item => ({
      url: `${base}/portfolio#${item.slug || item.id}`,
      lastModified: new Date(item.updated_at || now),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch {}

  return [...staticRoutes, ...articleRoutes, ...portfolioRoutes];
}
