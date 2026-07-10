#!/usr/bin/env node
/**
 * Sitemap Generator — runs at build time
 * Generates static sitemap.xml to avoid 4-second Supabase latency
 */
import { writeFileSync } from 'fs';
import { join } from 'path';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.vyuapp.my.id';
const TODAY = new Date().toISOString().split('T')[0];

// Static routes
const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/portfolio', changefreq: 'weekly', priority: 0.9 },
  { path: '/insights', changefreq: 'daily', priority: 0.9 },
  { path: '/about', changefreq: 'monthly', priority: 0.8 },
  { path: '/privacy', changefreq: 'yearly', priority: 0.3 },
  { path: '/tos', changefreq: 'yearly', priority: 0.3 },
  { path: '/portfolio/hikari-os', changefreq: 'weekly', priority: 0.6 },
];

// Category routes
const categories = ['AI', 'Engineering', 'DevOps', 'Cloud', 'Security', 'Productivity', 'Design', 'Mobile', 'Backend', 'Database', 'Testing', 'Career', 'Web3', 'Performance', 'IndoTech'];
const categoryRoutes = categories.map(cat => ({
  path: `/category/${encodeURIComponent(cat)}`,
  changefreq: 'weekly',
  priority: 0.7,
}));

function generateUrl(path, changefreq, priority, lastmod = TODAY) {
  return `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function generateSitemap() {
  const urls = [];
  
  // Static routes
  for (const route of staticRoutes) {
    urls.push(generateUrl(route.path, route.changefreq, route.priority));
  }
  
  // Category routes
  for (const route of categoryRoutes) {
    urls.push(generateUrl(route.path, route.changefreq, route.priority));
  }
  
  // Note: Dynamic routes (articles, portfolio) will be added by ISR
  // This static sitemap covers all indexable pages
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

// Write to public/sitemap.xml
const sitemap = generateSitemap();
const outputPath = join(process.cwd(), 'public', 'sitemap.xml');
writeFileSync(outputPath, sitemap, 'utf-8');
console.log(`✅ Sitemap generated: ${outputPath}`);
console.log(`   URLs: ${staticRoutes.length + categoryRoutes.length} static routes`);
