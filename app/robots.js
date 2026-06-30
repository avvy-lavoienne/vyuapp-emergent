export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.vyuapp.my.id';
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
      { userAgent: 'Mediapartners-Google', allow: '/' },
    ],
    sitemap: [`${base}/sitemap.xml`, `${base}/feed.xml`],
  };
}
