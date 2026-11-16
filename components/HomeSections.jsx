import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, Globe, Zap } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import StaggerGroup from '@/components/StaggerGroup';
import ParallaxCard from '@/components/ParallaxCard';

/* ─── Shared small components (server-only, no 'use client') ─── */

function Capability({ title, description }) {
  return (
    <div className="p-8 md:p-10 rounded-2xl border border-[#d2d2d7] dark:border-[#333336] bg-white dark:bg-[#1d1d1f] apple-card-hover hover:border-[#D1D0C9] dark:hover:border-[#3A3A3D]">
      <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.01em]">{title}</h3>
      <p className="mt-3 text-sm text-[#4A4A48] dark:text-[#86868b] leading-relaxed">{description}</p>
    </div>
  );
}

function ProductCard({ name, tagline, description, features, href, ctaLabel }) {
  const isExternal = href.startsWith('http');
  const Tag = isExternal ? 'a' : Link;
  const extraProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <div className="p-8 md:p-10 rounded-2xl border border-[#d2d2d7] dark:border-[#333336] bg-white dark:bg-[#1d1d1f] apple-card-hover hover:border-[#D1D0C9] dark:hover:border-[#3A3A3D] flex flex-col">
      <p className="text-xs text-[#2997ff] font-medium uppercase tracking-[0.12em]">{tagline}</p>
      <h3 className="mt-2 text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.02em]">{name}</h3>
      <p className="mt-3 text-sm text-[#4A4A48] dark:text-[#86868b] leading-relaxed">{description}</p>
      <ul className="mt-6 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-[#4A4A48] dark:text-[#86868b]">
            <span className="w-1 h-1 rounded-full bg-[#2997ff] mt-2 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Tag
          href={href}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2997ff] text-white text-sm font-semibold hover:bg-[#0066cc] apple-btn-hover"
          {...extraProps}
        >
          {ctaLabel} <ArrowRight className="w-4 h-4" />
        </Tag>
      </div>
    </div>
  );
}

function PhilosophyItem({ title, description }) {
  return (
    <div className="p-8 rounded-2xl border border-[#d2d2d7] dark:border-[#333336] bg-white dark:bg-[#1d1d1f] apple-card-hover hover:border-[#D1D0C9] dark:hover:border-[#3A3A3D]">
      <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.01em]">{title}</h3>
      <p className="mt-3 text-sm text-[#4A4A48] dark:text-[#86868b] leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── Server-rendered static sections ─── */

export function AboutSection({ summary, className = '' }) {
  return (
    <section className={`py-24 md:py-32 dark:bg-[#000000] ${className}`} id="tentang">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <p className="text-[#4A4A48] dark:text-[#86868b] text-base md:text-lg leading-relaxed text-center max-w-3xl mx-auto">
          {summary}
        </p>
      </div>
    </section>
  );
}

export function CapabilitiesSection({ t, className = '' }) {
  return (
    <section className={`py-24 md:py-32 bg-[#f5f5f7] dark:bg-[#1d1d1f] ${className}`} id="kapabilitas">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeader
          overline={t.capabilities.overline}
          title={t.capabilities.title}
          description={t.capabilities.description}
          align="center"
        />
        <StaggerGroup className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Capability title={t.capabilities.frontend.title} description={t.capabilities.frontend.desc} />
          <Capability title={t.capabilities.backend.title} description={t.capabilities.backend.desc} />
          <Capability title={t.capabilities.product.title} description={t.capabilities.product.desc} />
          <Capability title={t.capabilities.ai_agents.title} description={t.capabilities.ai_agents.desc} />
        </StaggerGroup>
      </div>
    </section>
  );
}

export function CaraKerjaSection({ className = '' }) {
  return (
    <section className={`py-24 md:py-32 dark:bg-[#000000] ${className}`} id="cara-kerja">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeader
          overline="Metode Kami"
          title="Cara Kami Bekerja"
          description="Di balik setiap proyek, ada proses yang terukur — dari riset hingga rilis."
          align="center"
        />
        <StaggerGroup className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-[#d2d2d7] dark:border-[#333336] bg-white dark:bg-[#1d1d1f] text-center apple-card-hover">
            <div className="w-12 h-12 rounded-xl bg-[#2997ff]/10 dark:bg-[#5BA3FF]/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-[#2997ff]" />
            </div>
            <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Riset Mendalam</h3>
            <p className="text-sm text-[#6e6e73] dark:text-[#86868b]">Riset komprehensif untuk setiap konten dan fitur sebelum dikerjakan.</p>
          </div>
          <div className="p-6 rounded-2xl border border-[#d2d2d7] dark:border-[#333336] bg-white dark:bg-[#1d1d1f] text-center apple-card-hover">
            <div className="w-12 h-12 rounded-xl bg-[#2997ff]/10 dark:bg-[#5BA3FF]/10 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-[#2997ff]" />
            </div>
            <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Kode Berkualitas</h3>
            <p className="text-sm text-[#6e6e73] dark:text-[#86868b]">Setiap baris kode melewati review dan pengujian sebelum dirilis.</p>
          </div>
          <div className="p-6 rounded-2xl border border-[#d2d2d7] dark:border-[#333336] bg-white dark:bg-[#1d1d1f] text-center apple-card-hover">
            <div className="w-12 h-12 rounded-xl bg-[#2997ff]/10 dark:bg-[#5BA3FF]/10 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-[#2997ff]" />
            </div>
            <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">SEO Optimization</h3>
            <p className="text-sm text-[#6e6e73] dark:text-[#86868b]">Dioptimasi sejak awal untuk mesin pencari dan performa web.</p>
          </div>
          <div className="p-6 rounded-2xl border border-[#d2d2d7] dark:border-[#333336] bg-white dark:bg-[#1d1d1f] text-center apple-card-hover">
            <div className="w-12 h-12 rounded-xl bg-[#2997ff]/10 dark:bg-[#5BA3FF]/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-[#2997ff]" />
            </div>
            <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Delivery Cepat</h3>
            <p className="text-sm text-[#6e6e73] dark:text-[#86868b]">Proses pengembangan yang cepat tanpa mengorbankan kualitas.</p>
          </div>
        </StaggerGroup>
      </div>
    </section>
  );
}

export function PortfolioSection({ t, className = '' }) {
  return (
    <section className={`py-24 md:py-32 dark:bg-[#000000] ${className}`} id="portfolio">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <SectionHeader
            overline={t.portfolio.overline}
            title={t.portfolio.title}
            description={t.portfolio.description}
          />
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold text-sm border border-[#D1D0C9] dark:border-[#3A3A3D] hover:border-[#B0AFAA] dark:hover:border-[#4A4A4D] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] apple-btn-hover shrink-0 self-start md:self-auto"
          >
            {t.portfolio.view_all} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <StaggerGroup className="max-w-3xl mx-auto">
          <ParallaxCard>
            <ProductCard
              name="Tafsha Farm"
              tagline={t.portfolio.tafsha.tagline}
              description={t.portfolio.tafsha.desc}
              features={t.portfolio.tafsha.features}
              href="https://tafsha.vyuapp.my.id/"
              ctaLabel={t.portfolio.tafsha.cta}
            />
          </ParallaxCard>
        </StaggerGroup>
      </div>
    </section>
  );
}

export function PhilosophySection({ t, className = '' }) {
  return (
    <section className={`py-24 md:py-32 bg-[#f5f5f7] dark:bg-[#1d1d1f] ${className}`} id="filosofi">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeader
          overline={t.philosophy.overline}
          title={t.philosophy.title}
          align="center"
        />
        <StaggerGroup className="mt-14 grid md:grid-cols-3 gap-6">
          {t.philosophy.items.map((item, i) => (
            <PhilosophyItem key={i} title={item.title} description={item.desc} />
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
