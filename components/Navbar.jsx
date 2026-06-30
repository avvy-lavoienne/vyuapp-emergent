'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';
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
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-[72px] transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-[#E5E4E0]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="w-9 h-9 rounded-lg bg-white border border-[#E5E4E0] flex items-center justify-center overflow-hidden p-1">
            <Image src="/images/vyu-removebg.png" alt="VyuApp" width={36} height={36} className="w-full h-full object-contain" priority />
          </span>
          <span className="font-sans font-bold text-lg tracking-tight text-[#141413]">
            Vyu<span className="text-[#6D5BA0]">App</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[#6B6B68] hover:text-[#141413] transition-colors duration-200"
            >
              {isLanding ? t.nav[l.localeKey] : l.localeKey === 'home' ? 'Beranda' : l.localeKey.charAt(0).toUpperCase() + l.localeKey.slice(1)}
            </Link>
          ))}
          {isLanding && (
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#6B6B68] border border-[#E5E4E0] hover:border-[#D1D0C9] hover:text-[#141413] transition-all duration-200"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              {locale === 'id' ? 'EN' : 'ID'}
            </button>
          )}
          <a
            href="/#kontak"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6D5BA0] text-white text-sm font-semibold hover:bg-[#574886] transition-all duration-200 hover:-translate-y-0.5"
          >
            {isLanding ? t.nav.contact : 'Hubungi Kami'}
          </a>
        </nav>

        <div className="md:hidden flex items-center gap-3">
          {isLanding && (
            <button
              onClick={toggle}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium text-[#6B6B68] border border-[#E5E4E0] transition-all duration-200"
              aria-label="Toggle language"
            >
              <Globe className="w-3 h-3" />
              {locale === 'id' ? 'EN' : 'ID'}
            </button>
          )}
          <button
            onClick={() => setOpen(v => !v)}
            className="p-2 text-[#6B6B68] hover:text-[#141413] transition-colors"
            aria-label="menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#E5E4E0] bg-white/95 backdrop-blur-xl">
          <div className="px-6 py-6 flex flex-col gap-4">
            {LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-[#4A4A48] hover:text-[#141413] text-sm font-medium transition-colors"
              >
                {isLanding ? t.nav[l.localeKey] : l.localeKey === 'home' ? 'Beranda' : l.localeKey.charAt(0).toUpperCase() + l.localeKey.slice(1)}
              </Link>
            ))}
            <a
              href="/#kontak"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#6D5BA0] text-white text-sm font-semibold hover:bg-[#574886] transition-all duration-200"
            >
              {isLanding ? t.nav.contact : 'Hubungi Kami'}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
