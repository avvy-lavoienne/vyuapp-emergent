export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || '';
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/admin'] },
      // Google AdsBot must access pages to render ads
      { userAgent: 'Mediapartners-Google', allow: '/' },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
