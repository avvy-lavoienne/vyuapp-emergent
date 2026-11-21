'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useLocale } from '@/components/LocaleProvider';

const LINKS = [
  { href: '/', localeKey: 'home' },
  { href: '/portfolio', localeKey: 'portfolio' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [, setScrolled] = useState(false);
  const { locale, toggle, t } = useLocale();
  const pathname = usePathname();
  const isLanding = pathname === '/';

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 12);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-[72px] bg-paper border-b border-rule">
      <div className="max-w-page mx-auto px-6 md:px-10 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="w-8 h-8 border border-rule bg-surface flex items-center justify-center overflow-hidden p-1">
            <Image src="/images/vyu-removebg.png" alt="VyuApp logo" width={32} height={32} className="w-full h-full object-contain" priority />
          </span>
          <span className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-ink">
            VyuApp
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="editorial-link text-xs font-mono uppercase tracking-[0.14em] text-ink2 hover:text-ink transition-colors duration-200"
            >
              {isLanding ? t.nav[l.localeKey] : l.localeKey === 'home' ? 'Beranda' : l.localeKey.charAt(0).toUpperCase() + l.localeKey.slice(1)}
            </Link>
          ))}
          {isLanding && (
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-rule text-[0.65rem] font-mono uppercase tracking-[0.14em] text-ink2 hover:border-ink hover:text-ink transition-colors duration-200"
              aria-label="Toggle language"
            >
              <Globe className="w-3 h-3" />
              {locale === 'id' ? 'EN' : 'ID'}
            </button>
          )}
          <a
            href="/#kontak"
            className="field-btn inline-flex items-center gap-2 px-4 py-2.5 bg-ink text-paper text-[0.65rem] font-mono uppercase tracking-[0.16em] hover:bg-clay"
          >
            {isLanding ? t.nav.contact : 'Hubungi Kami'}
          </a>
          <ThemeToggle />
        </nav>

        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          {isLanding && (
            <button
              onClick={toggle}
              className="flex items-center gap-1 px-2 py-1 border border-rule text-[0.6rem] font-mono uppercase tracking-[0.12em] text-ink2"
              aria-label="Toggle language"
            >
              <Globe className="w-3 h-3" />
              {locale === 'id' ? 'EN' : 'ID'}
            </button>
          )}
          <button
            onClick={() => setOpen(v => !v)}
            className="p-2 text-ink2 hover:text-ink transition-colors"
            aria-label="menu"
            data-testid="mobile-menu-toggle"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-rule bg-paper" aria-label="Mobile navigation" data-testid="mobile-nav-panel">
          <div className="px-6 py-6 flex flex-col gap-4">
            {LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-ink2 hover:text-ink text-sm font-mono uppercase tracking-[0.12em] transition-colors"
              >
                {isLanding ? t.nav[l.localeKey] : l.localeKey === 'home' ? 'Beranda' : l.localeKey.charAt(0).toUpperCase() + l.localeKey.slice(1)}
              </Link>
            ))}
            <a
              href="/#kontak"
              onClick={() => setOpen(false)}
              className="field-btn inline-flex items-center justify-center gap-2 px-5 py-3 bg-ink text-paper text-xs font-mono uppercase tracking-[0.16em] hover:bg-clay"
            >
              {isLanding ? t.nav.contact : 'Hubungi Kami'}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
