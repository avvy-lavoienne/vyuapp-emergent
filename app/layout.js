import { JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import AdSenseScript from '@/components/AdSenseScript';
import ChatWidget from '@/components/ChatWidget';
import CookieConsent from '@/components/CookieConsent';
import NavigationLoader from '@/components/NavigationLoader';
import { OrganizationJsonLd, WebSiteJsonLd, LocalBusinessJsonLd } from '@/components/JsonLd';

const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const satoshi = localFont({
  src: [
    { path: '../public/fonts/satoshi-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/satoshi-medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/satoshi-bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

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
    <html lang="id" className={`${satoshi.variable} ${mono.variable}`}>
      <head>
        <meta name="format-detection" content="telephone=no, email=no" />
        <link rel="me" href="https://github.com/avvy-lavoienne" />
        <link rel="me" href="https://www.linkedin.com/in/frmnfird" />
        <link rel="alternate" type="application/rss+xml" title="VyuApp Insights" href="/feed.xml" />
        {adsenseClient && <link rel="preconnect" href="https://pagead2.googlesyndication.com" />}
      </head>
      <body className="bg-[#FAFAF8] dark:bg-[#0F0F10] text-[#141413] dark:text-[#F0F0F0] antialiased font-sans selection:bg-[#6D5BA0]/20 selection:text-[#141413] dark:selection:bg-[#8B7BC4]/30 dark:selection:text-[#F0F0F0]">
        <ThemeProvider>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <LocalBusinessJsonLd />
        <AdSenseScript />
        <NavigationLoader />
        <ChatWidget />
        <CookieConsent />
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
