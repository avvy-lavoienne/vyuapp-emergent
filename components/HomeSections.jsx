import Link from 'next/link';
import { ArrowUpRight, Search, ShieldCheck, Globe, Zap } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import StaggerGroup from '@/components/StaggerGroup';

/* ─── Shared small components (server-only, no 'use client') ─── */

function Capability({ index, title, description }) {
  return (
    <div className="group border-t border-rule pt-6">
      <p className="index-mark">{index}</p>
      <h3 className="mt-6 display text-2xl leading-tight text-ink group-hover:text-clay transition-colors duration-200">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink2">{description}</p>
    </div>
  );
}

function ProductCard({ name, tagline, description, features, href, ctaLabel }) {
  const isExternal = href.startsWith('http');
  const Tag = isExternal ? 'a' : Link;
  const extraProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <article className="border-y border-rule grid lg:grid-cols-12">
      <div className="lg:col-span-4 py-8 lg:pr-8 lg:border-r border-rule">
        <p className="eyebrow">01 — Produk Live</p>
        <p className="mt-4 eyebrow text-clay">{tagline}</p>
        <h3 className="mt-4 display text-4xl md:text-5xl leading-[0.95] text-ink">{name}</h3>
        <Tag
          href={href}
          className="mt-8 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-ink border-b border-ink pb-1 hover:text-clay hover:border-clay transition-colors"
          {...extraProps}
        >
          {ctaLabel} <ArrowUpRight className="w-3.5 h-3.5" />
        </Tag>
      </div>
      <div className="lg:col-span-8 py-8 lg:pl-10 lg:border-t-0 border-t border-rule">
        <p className="text-base leading-relaxed text-ink2 max-w-2xl">{description}</p>
        <ul className="mt-8 grid sm:grid-cols-2 gap-x-8">
          {features.map((f) => (
            <li key={f} className="border-t border-rule py-3.5 text-sm leading-relaxed text-ink2">
              {f}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function PhilosophyItem({ index, title, description }) {
  return (
    <div className="border-t border-rule pt-6">
      <p className="index-mark">{index}</p>
      <h3 className="mt-6 display text-2xl leading-tight text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink2">{description}</p>
    </div>
  );
}

/* ─── Server-rendered static sections ─── */

export function AboutSection({ summary, className = '' }) {
  return (
    <section className={`py-24 md:py-32 border-t border-rule ${className}`} id="tentang">
      <div className="max-w-page mx-auto px-6 md:px-10 grid grid-cols-12 gap-8 md:gap-12">
        <p className="eyebrow col-span-12 md:col-span-3">00 — Ringkasan</p>
        <p className="col-span-12 md:col-span-9 display text-[clamp(1.4rem,2.6vw,2.1rem)] leading-[1.35] text-ink2">
          {summary}
        </p>
      </div>
    </section>
  );
}

export function CapabilitiesSection({ t, className = '' }) {
  const items = [
    t.capabilities.frontend,
    t.capabilities.backend,
    t.capabilities.product,
    t.capabilities.ai_agents,
  ];

  return (
    <section className={`py-24 md:py-32 border-t border-rule ${className}`} id="kapabilitas">
      <div className="max-w-page mx-auto px-6 md:px-10">
        <SectionHeader
          overline={t.capabilities.overline}
          title={t.capabilities.title}
          description={t.capabilities.description}
          index="02"
        />
        <StaggerGroup className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {items.map((item, i) => (
            <Capability
              key={item.title}
              index={String(i + 1).padStart(2, '0')}
              title={item.title}
              description={item.desc}
            />
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

export function CaraKerjaSection({ className = '' }) {
  const steps = [
    { icon: Search, title: 'Riset Mendalam', desc: 'Riset komprehensif untuk setiap konten dan fitur sebelum dikerjakan.' },
    { icon: ShieldCheck, title: 'Kode Berkualitas', desc: 'Setiap baris kode melewati review dan pengujian sebelum dirilis.' },
    { icon: Globe, title: 'SEO Optimization', desc: 'Dioptimasi sejak awal untuk mesin pencari dan performa web.' },
    { icon: Zap, title: 'Delivery Cepat', desc: 'Proses pengembangan yang cepat tanpa mengorbankan kualitas.' },
  ];

  return (
    <section className={`py-24 md:py-32 border-t border-rule ${className}`} id="cara-kerja">
      <div className="max-w-page mx-auto px-6 md:px-10">
        <SectionHeader
          overline="Metode Kami"
          title="Cara Kami Bekerja"
          description="Di balik setiap proyek, ada proses yang terukur — dari riset hingga rilis."
          index="03"
        />
        <StaggerGroup className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="border-t border-rule pt-6">
              <div className="flex items-baseline justify-between">
                <span className="display text-4xl text-clay leading-none">0{i + 1}</span>
                <Icon className="w-4 h-4 text-muted" strokeWidth={1.5} />
              </div>
              <h3 className="mt-8 text-base font-semibold text-ink tracking-[-0.01em]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink2">{desc}</p>
            </div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

export function PortfolioSection({ t, className = '' }) {
  return (
    <section className={`py-24 md:py-32 border-t border-rule ${className}`} id="portfolio">
      <div className="max-w-page mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <SectionHeader
            overline={t.portfolio.overline}
            title={t.portfolio.title}
            description={t.portfolio.description}
            index="04"
          />
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-ink border-b border-ink pb-1 hover:text-clay hover:border-clay transition-colors shrink-0 self-start md:self-auto"
          >
            {t.portfolio.view_all} <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <StaggerGroup>
          <ProductCard
            name="Tafsha Farm"
            tagline={t.portfolio.tafsha.tagline}
            description={t.portfolio.tafsha.desc}
            features={t.portfolio.tafsha.features}
            href="https://tafsha.vyuapp.my.id/"
            ctaLabel={t.portfolio.tafsha.cta}
          />
        </StaggerGroup>
      </div>
    </section>
  );
}

export function PhilosophySection({ t, className = '' }) {
  return (
    <section className={`py-24 md:py-32 border-t border-rule ${className}`} id="filosofi">
      <div className="max-w-page mx-auto px-6 md:px-10">
        <SectionHeader
          overline={t.philosophy.overline}
          title={t.philosophy.title}
          index="05"
        />
        <StaggerGroup className="mt-16 grid md:grid-cols-3 gap-x-8 gap-y-12">
          {t.philosophy.items.map((item, i) => (
            <PhilosophyItem
              key={i}
              index={String(i + 1).padStart(2, '0')}
              title={item.title}
              description={item.desc}
            />
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
