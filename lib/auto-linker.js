// Auto-internal linking for VyuApp articles
// Converts mentions of article topics into internal links

const ARTICLE_MAP = [
  { slug: 'studio-kecil-mengalahkan-agensi-besar', keywords: ['studio kecil', 'agensi besar', 'studio independen'] },
  { slug: 'sellica-mesin-intelijen-pasar', keywords: ['sellica', 'intelijen pasar', 'market intelligence'] },
  { slug: 'avalon-estetika-sebagai-strategi', keywords: ['avalon project', 'design system', 'avalon'] },
  { slug: 'membangun-data-pipeline-yang-tidak-pernah-tidur', keywords: ['data pipeline', 'pipeline 24/7', 'idempoten'] },
  { slug: 'menembus-kebisingan-pasar-data-sanitization-ecommerce', keywords: ['data sanitization', 'kebisingan pasar'] },
  { slug: 'panduan-lengkap-nextjs-16-app-router-best-practices-2026', keywords: ['next.js 16', 'app router', 'nextjs 16'] },
];

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function autoLink(html, currentSlug) {
  if (!html) return html;
  let result = html;

  for (const article of ARTICLE_MAP) {
    if (article.slug === currentSlug) continue;

    for (const keyword of article.keywords) {
      // Split HTML into tags and text parts
      const parts = result.split(/(<[^>]+>)/);
      for (let i = 0; i < parts.length; i++) {
        // Skip HTML tags
        if (parts[i].startsWith('<')) continue;
        // Skip if looks like it's inside an anchor context
        const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'gi');
        if (regex.test(parts[i])) {
          parts[i] = parts[i].replace(regex, `<a href="/insights/${article.slug}" class="text-[#6D5BA0] hover:text-[#574886] underline decoration-[#6D5BA0]/30 hover:decoration-[#6D5BA0] transition">$&</a>`);
        }
      }
      result = parts.join('');
    }
  }
  return result;
}
