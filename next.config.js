const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/**' },
    ],
  },
  serverExternalPackages: ['mongodb'],
  experimental: {
    serverActions: {
      allowedOrigins: [
        'vyuapp-insights.preview.emergentagent.com',
        'vyuapp-insights.cluster-12.preview.emergentcf.cloud',
        '*.preview.emergentagent.com',
        '*.preview.emergentcf.cloud',
        '*.cluster-12.preview.emergentcf.cloud',
        '*.emergentcf.cloud',
        'localhost:3000',
      ],
    },
  },
  turbopack: {},
  onDemandEntries: {
    maxInactiveAge: 10000,
    pagesBufferLength: 2,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *;" },
          { key: "Access-Control-Allow-Origin", value: process.env.CORS_ORIGINS || "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
