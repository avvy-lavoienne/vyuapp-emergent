#!/usr/bin/env node
/**
 * Sitemap Generator — runs at build time
 * Generates static sitemap.xml using Supabase REST API (no WebSocket needed)
 * 
 * Usage: node scripts/generate-sitemap.mjs
 */
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from .env file
function loadEnv() {
  try {
    const envFile = readFileSync(join(__dirname, '..', '.env'), 'utf-8');
    const env = {};
    for (const line of envFile.split('\n')) {
      if (line.startsWith('#') || !line.includes('=')) continue;
      const [key, ...valueParts] = line.split('=');
      env[key.trim()] = valueParts.join('=').trim();
    }
    return env;
  } catch (e) {
    console.error('⚠ Could not read .env file:', e.message);
    return {};
  }
}

const env = loadEnv();
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || env.NEXT_PUBLIC_SITE_URL || 'https://www.vyuapp.my.id';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

// Supabase REST API helper
async function supabaseQuery(table, select = '*', params = {}) {
  const url = new URL(`/rest/v1/${table}`, SUPABASE_URL);
  url.searchParams.set('select', select);
  url.searchParams.set('status', 'eq.published');
  
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase error: ${response.status}`);
  }

  return response.json();
}

function generateUrl(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generateSitemap() {
  const now = new Date().toISOString().split('T')[0];
  const urls = [];

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

  for (const route of staticRoutes) {
    urls.push(generateUrl(`${BASE_URL}${route.path}`, now, route.changefreq, route.priority));
  }

  // Category routes
  const categories = ['AI', 'Engineering', 'DevOps', 'Cloud', 'Security', 'Productivity', 'Design', 'Mobile', 'Backend', 'Database', 'Testing', 'Career', 'Web3', 'Performance', 'IndoTech'];
  for (const cat of categories) {
    urls.push(generateUrl(`${BASE_URL}/category/${encodeURIComponent(cat)}`, now, 'weekly', 0.7));
  }

  // Articles from Supabase REST API
  try {
    const articles = await supabaseQuery('articles', 'slug, published_at, updated_at', {
      'order': 'published_at.desc',
    });

    if (articles) {
      for (const a of articles) {
        const daysSincePublished = (new Date() - new Date(a.published_at)) / (1000 * 60 * 60 * 24);
        const priority = daysSincePublished < 7 ? 0.8 : daysSincePublished < 30 ? 0.7 : daysSincePublished < 90 ? 0.65 : 0.6;
        const lastmod = (a.updated_at || a.published_at || now).split('T')[0];
        urls.push(generateUrl(`${BASE_URL}/insights/${a.slug}`, lastmod, 'monthly', priority));
      }
      console.log(`✓ Articles: ${articles.length}`);
    }
  } catch (e) {
    console.error('⚠ Failed to fetch articles:', e.message);
  }

  // Portfolio from Supabase REST API
  try {
    const portfolio = await supabaseQuery('portfolio_items', 'slug, updated_at');

    const defaultPortfolios = ['sellica', 'avalon'];
    const allSlugs = [...defaultPortfolios, ...(portfolio?.map(p => p.slug) || [])];
    const uniqueSlugs = [...new Set(allSlugs)];

    for (const slug of uniqueSlugs) {
      const item = portfolio?.find(p => p.slug === slug);
      const lastmod = item?.updated_at?.split('T')[0] || now;
      urls.push(generateUrl(`${BASE_URL}/portfolio/${slug}`, lastmod, 'monthly', 0.6));
    }
    console.log(`✓ Portfolio: ${uniqueSlugs.length}`);
  } catch (e) {
    console.error('⚠ Failed to fetch portfolio:', e.message);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  // Write to public/sitemap.xml
  const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outputPath, xml, 'utf-8');
  console.log(`✅ Sitemap generated: ${outputPath}`);
  console.log(`   Total URLs: ${urls.length}`);
}

generateSitemap().catch(console.error);
