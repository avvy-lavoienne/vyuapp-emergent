'use client';
import { ArrowRight } from 'lucide-react';
import { useLocale } from '@/components/LocaleProvider';
import WordReveal from '@/components/WordReveal';

/**
 * Client Component — reads locale from context for reactive language toggle.
 * Hero headline uses WordReveal for blur + translateY stagger animation.
 */
export default function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative pt-36 pb-28 md:pt-44 md:pb-36 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <WordReveal
            text={t.hero.headline}
            tag="h1"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5.5rem] leading-[1.12] font-sans font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7]"
            highlightLast={true}
            highlightClassName="text-[#2997ff]"
            staggerDelay={100}
            animationDelay={400}
          />

          <p className="mt-5 text-base md:text-lg text-[#6e6e73] dark:text-[#8A8A8A] font-medium tracking-wide">
            {t.hero.tagline}
          </p>

          <p className="mt-8 text-[#4A4A48] dark:text-[#86868b] text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {t.hero.description}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#kapabilitas"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2997ff] text-white text-sm font-semibold hover:bg-[#0066cc] apple-btn-hover"
            >
              {t.hero.cta_primary} <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#kontak"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-transparent text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold text-sm border border-[#D1D0C9] dark:border-[#3A3A3D] hover:border-[#B0AFAA] dark:hover:border-[#4A4A4D] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] apple-btn-hover"
            >
              {t.hero.cta_secondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
