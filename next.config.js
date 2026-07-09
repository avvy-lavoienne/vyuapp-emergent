const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'fgldahwpzklkybkprwmo.supabase.co', pathname: '/**' },
    ],
  },
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-tooltip',
      'lucide-react',
      'date-fns',
    ],
    serverActions: {
      allowedOrigins: [
        'vyuapp.my.id',
        'localhost:3000',
        'localhost:3780',
      ],
    },
  },
  async redirects() {
    return [
      {
        source: '/insights/tren-web-development-2026-bagaimana-ai-mengubah-cara-kita-membangun-website',
        destination: '/insights/tren-web-development-2026-ai-mengubah-cara-membangun-website',
        permanent: true,
      },
      {
        source: '/insights/hana-ai-customer-service-agent-vyuapp',
        destination: '/insights/hana-ai-customer-service-bukan-sekadar-chatbot-biasa',
        permanent: true,
      },
      {
        source: '/insights/redis-caching-patterns-untuk-web-apps-skala-besar',
        destination: '/insights/redis-caching-patterns-for-scalable-web-apps-dari-dasar-hingga',
        permanent: true,
      },
      {
        source: '/insights/vyuapp-platform-documentation-membangun-sistem-ai-powered-content-creation-denga',
        destination: '/insights/vyuapp-platform-documentation',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Access-Control-Allow-Origin", value: "https://vyuapp.my.id" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.google.com https://ep2.adtrafficquality.google; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com https://*.supabase.co https://pagead2.googlesyndication.com https://www.google.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co http://localhost:* https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://pagead2.googlesyndication.com; frame-src 'self' https://googleads.g.doubleclick.net https://www.google.com; frame-ancestors 'self'; object-src 'none';" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
      {
        source: "/favicon/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
