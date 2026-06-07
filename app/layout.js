import { Outfit, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import AdSenseScript from '@/components/AdSenseScript';

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
  keywords: ['VyuApp', 'Sellica', 'Avalon', 'web engineering Indonesia', 'data intelligence', 'Next.js studio', 'Garut'],
  authors: [{ name: 'VyuApp Studio' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: baseUrl,
    siteName: 'VyuApp',
    title: 'VyuApp — Bespoke Web Engineering & Market Intelligence',
    description: 'Studio rekayasa web premium dari Garut.',
  },
  twitter: { card: 'summary_large_image' },
  other: adsenseClient ? { 'google-adsense-account': adsenseClient } : {},
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${outfit.variable} ${inter.variable} ${mono.variable}`}>
      <body className="bg-zinc-950 text-zinc-100 antialiased font-sans selection:bg-emerald-400/30 selection:text-emerald-50">
        <AdSenseScript />
        {children}
      </body>
    </html>
  );
}
