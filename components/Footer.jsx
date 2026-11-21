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
    <footer className="border-t border-rule">
      <div className="max-w-page mx-auto px-6 md:px-10 py-14 grid grid-cols-12 gap-10">
        <div className="col-span-12 md:col-span-6">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="w-8 h-8 border border-rule bg-surface flex items-center justify-center overflow-hidden p-1">
              <Image src="/images/vyu-removebg.png" alt="VyuApp" width={32} height={32} className="w-full h-full object-contain" />
            </span>
            <span className="font-mono text-sm uppercase tracking-[0.14em] text-ink">VyuApp</span>
          </Link>
          <p className="mt-5 text-sm text-ink2 max-w-xs leading-relaxed">
            {text ? text.footer.desc : 'Studio rekayasa web bespoke berbasis di Garut, Jawa Barat.'}
          </p>
        </div>

        <div className="col-span-6 md:col-span-3">
          <p className="eyebrow mb-4">{text ? text.footer.nav : 'Navigasi'}</p>
          <ul className="space-y-2.5 text-sm text-ink2">
            <li><Link href="/" className="editorial-link hover:text-ink transition-colors">{text ? text.nav.home : 'Beranda'}</Link></li>
            <li><Link href="/portfolio" className="editorial-link hover:text-ink transition-colors">{text ? text.nav.portfolio : 'Portfolio'}</Link></li>
            <li><a href="/#kontak" className="editorial-link hover:text-ink transition-colors">{text ? text.nav.contact : 'Kontak'}</a></li>
            <li><Link href="/about" className="editorial-link hover:text-ink transition-colors">Tentang Kami</Link></li>
            <li><Link href="/privacy" className="editorial-link hover:text-ink transition-colors">Kebijakan Privasi</Link></li>
          </ul>
        </div>

        <div className="col-span-6 md:col-span-3">
          <p className="eyebrow mb-4">{text ? text.footer.contact : 'Kontak'}</p>
          <ul className="space-y-2.5 text-sm text-ink2">
            <li>
              <a href="mailto:vyuapp@proton.me" className="editorial-link hover:text-ink transition-colors">
                vyuapp@proton.me
              </a>
            </li>
            <li>Garut, Jawa Barat</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="max-w-page mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-[0.65rem] font-mono uppercase tracking-[0.14em] text-muted">
          <p>&copy; {new Date().getFullYear()} {text ? text.footer.copyright : 'VyuApp.'}</p>
          <p>{text ? text.footer.tagline : 'crafted with precision in Garut'}</p>
        </div>
      </div>
    </footer>
  );
}
