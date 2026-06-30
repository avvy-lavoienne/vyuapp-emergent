import { getPublishedArticles, getPublishedPortfolio, DEFAULT_MAIN } from '@/lib/data';

export const revalidate = 3600;

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.vyuapp.my.id';
  const now = new Date();

  const staticRoutes = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/portfolio`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/insights`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/tos`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/portfolio/ai-agents`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  let articleRoutes = [];
  try {
    const articles = await getPublishedArticles({ limit: 1000 });
    articleRoutes = articles.map(a => {
      const daysSincePublished = (now - new Date(a.published_at)) / (1000 * 60 * 60 * 24);
      const priority = daysSincePublished < 7 ? 0.8 : daysSincePublished < 30 ? 0.7 : daysSincePublished < 90 ? 0.65 : 0.6;
      return {
        url: `${base}/insights/${a.slug}`,
        lastModified: new Date(a.updated_at || a.published_at || now),
        changeFrequency: 'monthly',
        priority,
      };
    });
  } catch (e) {
    console.error('Sitemap: failed to fetch articles:', e.message);
  }

  let portfolioRoutes = [];
  try {
    const dbItems = await getPublishedPortfolio();
    const seen = new Set();
    const allItems = [
      ...DEFAULT_MAIN.filter(item => item.slug),
      ...dbItems.filter(item => item.slug),
    ];
    portfolioRoutes = allItems
      .filter(item => { if (seen.has(item.slug)) return false; seen.add(item.slug); return true; })
      .map(item => ({
        url: `${base}/portfolio/${item.slug}`,
        lastModified: new Date(item.updated_at || now),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
  } catch (e) {
    console.error('Sitemap: failed to fetch portfolio:', e.message);
  }

  return [...staticRoutes, ...articleRoutes, ...portfolioRoutes];
}
