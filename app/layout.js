import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import AdSenseScript from '@/components/AdSenseScript';
import ChatWidget from '@/components/ChatWidget';
import { OrganizationJsonLd, WebSiteJsonLd, LocalBusinessJsonLd } from '@/components/JsonLd';

const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.vyuapp.my.id';
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
    'theme-color': '#FAFAF8',
  },
  alternates: {
    canonical: baseUrl,
    languages: { 'id-ID': baseUrl, 'en': `${baseUrl}?lang=en` },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${mono.variable}`}>
      <head>
        <meta name="format-detection" content="telephone=no, email=no" />
        <link rel="preload" href="/fonts/satoshi-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/satoshi-medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/satoshi-bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="me" href="https://github.com/avvy-lavoienne" />
        <link rel="me" href="https://www.linkedin.com/in/frmnfird" />
        {adsenseClient && <link rel="preconnect" href="https://pagead2.googlesyndication.com" />}
      </head>
      <body className="bg-[#FAFAF8] text-[#141413] antialiased font-sans selection:bg-[#6D5BA0]/20 selection:text-[#141413]">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <LocalBusinessJsonLd />
        <AdSenseScript />
        <ChatWidget />
        {children}
      </body>
    </html>
  );
}
