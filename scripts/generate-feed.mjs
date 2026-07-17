#!/usr/bin/env node
/**
 * Feed Generator — runs at build time
 * Generates static feed.xml (RSS) using Supabase REST API
 * 
 * Usage: node scripts/generate-feed.mjs
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
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || env.NEXT_PUBLIC_SITE_URL || 'https://vyuapp.my.id';

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

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function generateFeed() {
  try {
    const articles = await supabaseQuery('articles', 'title, slug, excerpt, category, published_at', {
      'order': 'published_at.desc',
      'limit': '20',
    });

    const now = new Date().toUTCString();
    
    const items = articles.map(a => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${BASE_URL}/insights/${a.slug}</link>
      <description>${escapeXml(a.excerpt)}</description>
      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>
      <category>${escapeXml(a.category)}</category>
      <guid isPermaLink="true">${BASE_URL}/insights/${a.slug}</guid>
      <author>vyuapp@proton.me (VyuApp Studio)</author>
    </item>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>VyuApp Insights</title>
    <link>${BASE_URL}/insights</link>
    <description>Esai teknis tentang rekayasa web, data intelligence, dan filosofi studio dari VyuApp.</description>
    <language>id</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>${items}
  </channel>
</rss>`;

    // Write to public/feed.xml
    const outputPath = join(__dirname, '..', 'public', 'feed.xml');
    writeFileSync(outputPath, xml, 'utf-8');
    console.log(`✅ Feed generated: ${outputPath}`);
    console.log(`   Total items: ${articles.length}`);
  } catch (e) {
    console.error('❌ Failed to generate feed:', e.message);
    process.exit(1);
  }
}

generateFeed();
