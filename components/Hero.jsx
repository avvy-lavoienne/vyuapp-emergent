'use client';
import { ArrowUpRight } from 'lucide-react';
import { useLocale } from '@/components/LocaleProvider';

/**
 * Client Component — reads locale from context for reactive language toggle.
 * Editorial hero: asymmetric 12-column grid, serif display headline,
 * one clay accent phrase, hairline meta strip. No rotating text.
 */
export default function Hero() {
  const { t } = useLocale();
  const accent = (t.hero.rotatingHeadlines?.[0] || '').trim();

  return (
    <section className="relative pt-36 md:pt-44 pb-10 border-b border-rule overflow-hidden">
      <div className="max-w-page mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between gap-6">
          <p className="eyebrow">01 — Studio Rekayasa Web</p>
          <p className="eyebrow hidden sm:block">Garut, Jawa Barat — 7.21°S</p>
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-12 gap-y-12 gap-x-6 md:gap-x-10">
          <div className="col-span-12 lg:col-span-8">
            <h1 className="display text-[clamp(2.75rem,7.4vw,6rem)] leading-[0.94] text-ink">
              <span className="block first-letter:uppercase">{t.hero.staticHeadline}</span>
              <span className="block italic text-clay mt-1">{accent}</span>
            </h1>
          </div>

          <aside className="col-span-12 lg:col-span-4 flex flex-col justify-end lg:pl-8 lg:border-l border-rule">
            <p className="eyebrow text-clay">{t.hero.tagline}</p>
            <p className="mt-5 text-base leading-relaxed text-ink2">
              {t.hero.description}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="#kapabilitas"
                className="field-btn inline-flex items-center justify-between gap-3 px-5 py-3 rounded-sm bg-ink text-paper text-[0.7rem] font-mono uppercase tracking-[0.16em] hover:bg-clay"
              >
                {t.hero.cta_primary} <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="#kontak"
                className="field-btn inline-flex items-center justify-between gap-3 px-5 py-3 rounded-sm border border-ink text-ink text-[0.7rem] font-mono uppercase tracking-[0.16em] hover:bg-ink hover:text-paper"
              >
                {t.hero.cta_secondary}
              </a>
            </div>
          </aside>
        </div>
      </div>

      <div className="max-w-page mx-auto px-6 md:px-10 mt-20 md:mt-28">
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-rule">
          {[
            ['Disiplin', 'Next.js · TypeScript'],
            ['Data', 'Supabase · Observability'],
            ['Otomasi', 'AI Agent Systems'],
            ['Produk', 'Tafsha Farm · Live'],
          ].map(([label, value], i) => (
            <div
              key={label}
              className={`py-4 pr-4 ${i > 0 ? 'md:border-l md:border-rule md:pl-6' : ''} ${i % 2 === 1 ? 'border-l border-rule pl-6 md:pl-6' : ''}`}
            >
              <p className="eyebrow">{label}</p>
              <p className="mt-2 text-xs text-ink2 font-mono">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
