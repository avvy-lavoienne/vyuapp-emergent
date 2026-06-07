import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-zinc-900 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-emerald-400/10 ring-1 ring-emerald-400/40 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-[var(--font-outfit)] font-bold text-lg">Vyu<span className="text-emerald-400">App</span></span>
          </Link>
          <p className="text-sm text-zinc-500 mt-4 max-w-md leading-relaxed">
            Studio rekayasa web bespoke berbasis di Garut, Jawa Barat. Membangun produk digital presisi tinggi untuk klien yang menghargai kualitas teknis di atas template.
          </p>
          <div className="mt-6 flex items-center gap-3 text-xs text-zinc-500">
            <span className="vyu-overline">// STATUS</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-vyu-pulse" /> Menerima proyek baru</span>
          </div>
        </div>

        <div>
          <p className="vyu-overline mb-4">// Navigasi</p>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><Link href="/" className="hover:text-emerald-400">Beranda</Link></li>
            <li><Link href="/portfolio" className="hover:text-emerald-400">Portfolio</Link></li>
            <li><Link href="/insights" className="hover:text-emerald-400">Insights</Link></li>
            <li><a href="/#kontak" className="hover:text-emerald-400">Kontak</a></li>
          </ul>
        </div>

        <div>
          <p className="vyu-overline mb-4">// Kontak</p>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-emerald-400" /> <a href="mailto:vyuapp@proton.me" className="hover:text-emerald-400">vyuapp@proton.me</a></li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-emerald-400" /> Garut, Jawa Barat — Indonesia</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} VyuApp. Bespoke web engineering & market intelligence.</p>
          <p className="font-[var(--font-mono)]">// crafted with precision in Garut</p>
        </div>
      </div>
    </footer>
  );
}
