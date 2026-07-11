import { ArrowRight } from 'lucide-react';
import ParallaxImage from '@/components/ParallaxImage';

export default function DetailedProduct({ item }) {
  return (
    <div className="rounded-2xl border border-[#d2d2d7] dark:border-[#333336] bg-white dark:bg-[#1d1d1f] overflow-hidden">
      {/* Hero image with parallax scroll-linked scale */}
      {item.cover && (
        <ParallaxImage
          scale={1.06}
          className="relative aspect-[16/7] md:aspect-[16/6]"
        >
          <img
            src={item.cover}
            alt={`${item.name} — ${item.tagline}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </ParallaxImage>
      )}

      <div className="p-8 md:p-12">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs text-[#2997ff] uppercase tracking-[0.12em] font-medium">
              {(item.category || 'Produk').toUpperCase()}
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.025em]">
              {item.name}
            </h1>
            <p className="mt-3 text-xs text-[#2997ff] font-medium uppercase tracking-[0.12em]">{item.tagline}</p>
            <p className="mt-6 text-[#4A4A48] text-base leading-relaxed">{item.long_description || item.description}</p>
            {(item.stack || []).length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {(item.stack || []).map(s => (
                  <span key={s} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-[#6e6e73] dark:text-[#86868b] bg-[#F4F3EE] dark:bg-[#333336] border border-[#d2d2d7] dark:border-[#333336]">
                    {s}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/#kontak"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2997ff] text-white text-sm font-semibold hover:bg-[#0066cc] transition-all duration-200 hover:-translate-y-0.5"
              >
                Request Collaboration <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/portfolio"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent text-[#1d1d1f] font-semibold text-sm border border-[#D1D0C9] hover:border-[#B0AFAA] hover:bg-black/[0.02] transition-all duration-200 hover:-translate-y-0.5"
              >
                Lihat semua proyek
              </a>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="h-full rounded-2xl border border-[#d2d2d7] dark:border-[#333336] p-7 bg-[#F8F7F4] dark:bg-[#1d1d1f]">
              <p className="font-mono text-xs text-[#6e6e73] uppercase tracking-[0.15em] font-medium mb-4">
                Value Proposition
              </p>
              <ul className="space-y-3">
                {(item.value_props || item.features || []).map(v => (
                  <li key={v} className="flex items-start gap-2 text-sm text-[#4A4A48] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff] mt-2 flex-shrink-0" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
