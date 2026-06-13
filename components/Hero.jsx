'use client';
import { ArrowRight } from 'lucide-react';
import { useLocale } from '@/components/LocaleProvider';

export default function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative pt-36 pb-28 md:pt-44 md:pb-36 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5.5rem] leading-[1.04] font-sans font-semibold tracking-[-0.03em] text-[#141413]">
            build systems that{' '}
            <span className="relative text-[#6D5BA0]">
              last
              <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-gradient-to-r from-[#6D5BA0]/60 to-[#6D5BA0]/10 rounded-full" />
            </span>
            .
          </h1>

          <p className="mt-5 text-base md:text-lg text-[#8F8E8A] font-medium tracking-wide">
            {t.hero.tagline}
          </p>

          <p className="mt-8 text-[#4A4A48] text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {t.hero.description}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#kapabilitas"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#6D5BA0] text-white text-sm font-semibold hover:bg-[#574886] transition-all duration-200 hover:-translate-y-0.5"
            >
              {t.hero.cta_primary} <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#kontak"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-transparent text-[#141413] font-semibold text-sm border border-[#D1D0C9] hover:border-[#B0AFAA] hover:bg-black/[0.02] transition-all duration-200 hover:-translate-y-0.5"
            >
              {t.hero.cta_secondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
