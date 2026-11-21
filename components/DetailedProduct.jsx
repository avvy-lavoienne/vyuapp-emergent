import { ArrowUpRight } from 'lucide-react';
import ParallaxImage from '@/components/ParallaxImage';

export default function DetailedProduct({ item }) {
  return (
    <article className="border border-rule overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </ParallaxImage>
      )}

      <div className="p-8 md:p-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-clay">{(item.category || 'Produk').toUpperCase()}</p>
            <h1 className="mt-4 display text-4xl md:text-6xl leading-[0.95] text-ink">
              {item.name}
            </h1>
            <p className="mt-4 eyebrow">{item.tagline}</p>
            <p className="mt-6 text-base leading-relaxed text-ink2 max-w-2xl">{item.long_description || item.description}</p>
            {(item.stack || []).length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {(item.stack || []).map(s => (
                  <span key={s} className="inline-flex items-center px-2.5 py-1 text-[0.65rem] font-mono uppercase tracking-[0.1em] text-ink2 border border-rule">
                    {s}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/#kontak"
                className="field-btn inline-flex items-center gap-2 px-5 py-3 bg-ink text-paper text-[0.7rem] font-mono uppercase tracking-[0.16em] hover:bg-clay"
              >
                Request Collaboration <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="/portfolio"
                className="field-btn inline-flex items-center gap-2 px-5 py-3 border border-ink text-ink text-[0.7rem] font-mono uppercase tracking-[0.16em] hover:bg-ink hover:text-paper"
              >
                Lihat semua proyek
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 lg:pl-8 lg:border-l border-rule">
            <div className="border-t border-rule pt-6">
              <p className="eyebrow mb-4">Value Proposition</p>
              <ul>
                {(item.value_props || item.features || []).map(v => (
                  <li key={v} className="border-t border-rule py-3 text-sm leading-relaxed text-ink2">
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
