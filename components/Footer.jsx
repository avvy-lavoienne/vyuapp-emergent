'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/components/LocaleProvider';

/**
 * Footer — client component.
 * When `isLanding` is true, uses locale context for translated text.
 * Otherwise falls back to static Indonesian text.
 * useLocale() always returns a valid value (fallback context when no provider).
 */
export default function Footer({ isLanding = false }) {
  const { t } = useLocale();
  const text = isLanding ? t : null;

  return (
    <footer className="border-t border-[#E5E4E0] dark:border-[#2A2A2D] bg-[#FAFAF8] dark:bg-[#0F0F10]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 flex flex-col md:flex-row items-start justify-between gap-10">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-white dark:bg-[#1A1A1D] border border-[#E5E4E0] dark:border-[#2A2A2D] flex items-center justify-center overflow-hidden p-1">
              <Image src="/images/vyu-removebg.png" alt="VyuApp" width={36} height={36} className="w-full h-full object-contain" />
            </span>
            <span className="font-sans font-bold text-lg tracking-tight text-[#141413] dark:text-[#F0F0F0]">
              Vyu<span className="text-[#6D5BA0]">App</span>
            </span>
          </Link>
          <p className="text-sm text-[#636360] dark:text-[#8A8A88] mt-4 max-w-xs leading-relaxed">
            {text ? text.footer.desc : 'Studio rekayasa web bespoke berbasis di Garut, Jawa Barat.'}
          </p>
        </div>

        <div className="flex items-start gap-10">
          <div>
            <p className="text-xs font-medium text-[#636360] dark:text-[#8A8A88] uppercase tracking-widest mb-4">
              {text ? text.footer.nav : 'Navigasi'}
            </p>
            <ul className="space-y-2.5 text-sm text-[#6B6B68] dark:text-[#B0B0B0]">
              <li><Link href="/" className="hover:text-[#141413] dark:hover:text-[#F0F0F0] transition-colors">{text ? text.nav.home : 'Beranda'}</Link></li>
              <li><Link href="/portfolio" className="hover:text-[#141413] dark:hover:text-[#F0F0F0] transition-colors">{text ? text.nav.portfolio : 'Portfolio'}</Link></li>
              <li><Link href="/insights" className="hover:text-[#141413] dark:hover:text-[#F0F0F0] transition-colors">{text ? text.nav.insights : 'Insights'}</Link></li>
              <li><a href="/#kontak" className="hover:text-[#141413] dark:hover:text-[#F0F0F0] transition-colors">{text ? text.nav.contact : 'Kontak'}</a></li>
              <li><Link href="/about" className="hover:text-[#141413] dark:hover:text-[#F0F0F0] transition-colors">Tentang Kami</Link></li>
              <li><Link href="/privacy" className="hover:text-[#141413] dark:hover:text-[#F0F0F0] transition-colors">Kebijakan Privasi</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-[#636360] dark:text-[#8A8A88] uppercase tracking-widest mb-4">
              {text ? text.footer.contact : 'Kontak'}
            </p>
            <ul className="space-y-2.5 text-sm text-[#6B6B68] dark:text-[#B0B0B0]">
              <li>
                <a href="mailto:vyuapp@proton.me" className="hover:text-[#141413] dark:hover:text-[#F0F0F0] transition-colors">
                  vyuapp@proton.me
                </a>
              </li>
              <li className="text-[#636360] dark:text-[#8A8A88]">Garut, Jawa Barat</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#E5E4E0] dark:border-[#2A2A2D]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[#737370] dark:text-[#8A8A88]">
          <p>&copy; {new Date().getFullYear()} {text ? text.footer.copyright : 'VyuApp.'}</p>
          <p className="font-mono text-[#737370] dark:text-[#8A8A88]">{text ? text.footer.tagline : 'crafted with precision in Garut'}</p>
        </div>
      </div>
    </footer>
  );
}
