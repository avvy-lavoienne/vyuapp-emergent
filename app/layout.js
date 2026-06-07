import { Outfit, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import AdSenseScript from '@/components/AdSenseScript';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/JsonLd';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'VyuApp — Bespoke Web Engineering & Market Intelligence',
    template: '%s — VyuApp',
  },
  description: 'Studio rekayasa web premium dari Garut. Kami membangun produk digital presisi tinggi: Sellica (financial intelligence) dan The Avalon Project.',
  keywords: ['VyuApp', 'Sellica', 'Avalon', 'web engineering Indonesia', 'data intelligence', 'Next.js studio', 'Garut', 'bespoke web development'],
  authors: [{ name: 'VyuApp Studio' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: baseUrl,
    siteName: 'VyuApp',
    title: 'VyuApp — Bespoke Web Engineering & Market Intelligence',
    description: 'Studio rekayasa web premium dari Garut. Kami membangun produk digital presisi tinggi: Sellica (financial intelligence) dan The Avalon Project.',
    images: [{ url: `${baseUrl}/opengraph-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VyuApp — Bespoke Web Engineering & Market Intelligence',
    description: 'Studio rekayasa web premium dari Garut.',
    images: [`${baseUrl}/opengraph-image.png`],
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: { url: '/favicon/favicon.ico', type: 'image/x-icon' },
  },
  manifest: '/favicon/site.webmanifest',
  other: {
    ...(adsenseClient ? { 'google-adsense-account': adsenseClient } : {}),
    'theme-color': '#09090b',
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'id-ID': baseUrl,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${outfit.variable} ${inter.variable} ${mono.variable}`}>
      <head>
        <meta name="theme-color" content="#09090b" />
        <meta name="format-detection" content="telephone=no, email=no" />
        <link rel="canonical" href={baseUrl} />
        {adsenseClient && <link rel="preconnect" href="https://pagead2.googlesyndication.com" />}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-zinc-950 text-zinc-100 antialiased font-sans selection:bg-emerald-400/30 selection:text-emerald-50">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <AdSenseScript />
        {children}
      </body>
    </html>
  );
}
