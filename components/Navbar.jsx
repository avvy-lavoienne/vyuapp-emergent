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
  { href: '/insights', localeKey: 'insights' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    <header
      className={`fixed top-0 inset-x-0 z-50 h-[72px] transition-all duration-500 backdrop-blur-xl backdrop-saturate-[1.8] ${
        scrolled
          ? 'bg-white/80 dark:bg-black/80 border-b border-[#d2d2d7]/70 dark:border-[#333336]/70 shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
          : 'bg-white/65 dark:bg-black/65 border-b border-[#d2d2d7]/30 dark:border-[#333336]/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="w-9 h-9 rounded-lg bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#333336] flex items-center justify-center overflow-hidden p-1">
            <Image src="/images/vyu-removebg.png" alt="VyuApp logo" width={36} height={36} className="w-full h-full object-contain" priority />
          </span>
          <span className="font-sans font-bold text-lg tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
            Vyu<span className="text-[#2997ff]">App</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors duration-200"
            >
              {isLanding ? t.nav[l.localeKey] : l.localeKey === 'home' ? 'Beranda' : l.localeKey.charAt(0).toUpperCase() + l.localeKey.slice(1)}
            </Link>
          ))}
          {isLanding && (
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#6e6e73] dark:text-[#86868b] border border-[#d2d2d7] dark:border-[#333336] hover:border-[#D1D0C9] dark:hover:border-[#3A3A3D] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-all duration-200"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              {locale === 'id' ? 'EN' : 'ID'}
            </button>
          )}
          <a
            href="/#kontak"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2997ff] text-white text-sm font-semibold hover:bg-[#0066cc] transition-all duration-200 hover:-translate-y-0.5"
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
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium text-[#6e6e73] dark:text-[#86868b] border border-[#d2d2d7] dark:border-[#333336] transition-all duration-200"
              aria-label="Toggle language"
            >
              <Globe className="w-3 h-3" />
              {locale === 'id' ? 'EN' : 'ID'}
            </button>
          )}
          <button
            onClick={() => setOpen(v => !v)}
            className="p-2 text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
            aria-label="menu"
            data-testid="mobile-menu-toggle"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-[#d2d2d7] dark:border-[#333336] bg-white/95 dark:bg-[#000000]/95 backdrop-blur-xl" aria-label="Mobile navigation" data-testid="mobile-nav-panel">
          <div className="px-6 py-6 flex flex-col gap-4">
            {LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-[#4A4A48] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] text-sm font-medium transition-colors"
              >
                {isLanding ? t.nav[l.localeKey] : l.localeKey === 'home' ? 'Beranda' : l.localeKey.charAt(0).toUpperCase() + l.localeKey.slice(1)}
              </Link>
            ))}
            <a
              href="/#kontak"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#2997ff] text-white text-sm font-semibold hover:bg-[#0066cc] transition-all duration-200"
            >
              {isLanding ? t.nav.contact : 'Hubungi Kami'}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
