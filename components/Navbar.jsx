'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/insights', label: 'Insights' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900' : 'bg-transparent border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/images/vyu-removebg.png" alt="VyuApp" className="h-8 w-auto" />
          <span className="font-[var(--font-outfit)] font-bold text-lg tracking-tight">Vyu<span className="text-emerald-400">App</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map(l => {
            const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href} className={`text-sm transition-colors ${active ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-100'}`}>
                {l.label}
              </Link>
            );
          })}
          <a href="/#kontak" className="vyu-btn-primary text-sm">
            Hubungi Kami <ArrowRight className="w-4 h-4" />
          </a>
        </nav>

        <button onClick={() => setOpen(v => !v)} className="md:hidden p-2 text-zinc-300 hover:text-emerald-400" aria-label="menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-zinc-900 bg-zinc-950/95 backdrop-blur-xl">
          <div className="px-6 py-6 flex flex-col gap-4">
            {LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-zinc-300 hover:text-emerald-400 text-sm">
                {l.label}
              </Link>
            ))}
            <a href="/#kontak" onClick={() => setOpen(false)} className="vyu-btn-primary justify-center text-sm">
              Hubungi Kami <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
