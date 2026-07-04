'use client';
import { useLocale } from '@/components/LocaleProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ContactForm from '@/components/ContactForm';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, Globe, Zap } from 'lucide-react';

function Capability({ title, description }) {
  return (
    <div className="p-8 md:p-10 rounded-2xl border border-[#E5E4E0] dark:border-[#2A2A2D] bg-white dark:bg-[#1A1A1D] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D0C9] dark:hover:border-[#3A3A3D]">
      <h3 className="text-lg font-semibold text-[#141413] dark:text-[#F0F0F0] tracking-[-0.01em]">{title}</h3>
      <p className="mt-3 text-sm text-[#4A4A48] dark:text-[#B0B0B0] leading-relaxed">{description}</p>
    </div>
  );
}

function ProductCard({ name, tagline, description, features, href, ctaLabel }) {
  const isExternal = href.startsWith('http');
  const Tag = isExternal ? 'a' : Link;
  const extraProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <div className="p-8 md:p-10 rounded-2xl border border-[#E5E4E0] dark:border-[#2A2A2D] bg-white dark:bg-[#1A1A1D] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D0C9] dark:hover:border-[#3A3A3D] flex flex-col">
      <p className="text-xs text-[#6D5BA0] font-medium uppercase tracking-[0.12em]">{tagline}</p>
      <h3 className="mt-2 text-xl font-semibold text-[#141413] dark:text-[#F0F0F0] tracking-[-0.02em]">{name}</h3>
      <p className="mt-3 text-sm text-[#4A4A48] dark:text-[#B0B0B0] leading-relaxed">{description}</p>
      <ul className="mt-6 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-[#4A4A48] dark:text-[#B0B0B0]">
            <span className="w-1 h-1 rounded-full bg-[#6D5BA0] mt-2 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Tag
          href={href}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6D5BA0] text-white text-sm font-semibold hover:bg-[#574886] transition-all duration-200 hover:-translate-y-0.5"
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
    <div className="p-8 rounded-2xl border border-[#E5E4E0] dark:border-[#2A2A2D] bg-white dark:bg-[#1A1A1D] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D0C9] dark:hover:border-[#3A3A3D]">
      <h3 className="text-base font-semibold text-[#141413] dark:text-[#F0F0F0] tracking-[-0.01em]">{title}</h3>
      <p className="mt-3 text-sm text-[#4A4A48] dark:text-[#B0B0B0] leading-relaxed">{description}</p>
    </div>
  );
}

export default function HomeContent() {
  const { t, locale } = useLocale();

  return (
    <main>
      <Navbar />
      <Hero />

      <section className="py-24 md:py-32" id="tentang">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <p className="text-[#4A4A48] dark:text-[#B0B0B0] text-base md:text-lg leading-relaxed text-center max-w-3xl mx-auto">
            {t.summary}
          </p>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#F8F7F4]" id="kapabilitas">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionHeader
            overline={t.capabilities.overline}
            title={t.capabilities.title}
            description={t.capabilities.description}
            align="center"
          />
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            <Capability title={t.capabilities.frontend.title} description={t.capabilities.frontend.desc} />
            <Capability title={t.capabilities.backend.title} description={t.capabilities.backend.desc} />
            <Capability title={t.capabilities.product.title} description={t.capabilities.product.desc} />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" id="cara-kerja">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionHeader
            overline="Metode Kami"
            title="Cara Kami Bekerja"
            description="Di balik setiap proyek, ada tim AI yang bekerja secara otonom untuk memastikan hasil terbaik."
            align="center"
          />
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-[#E5E4E0] dark:border-[#2A2A2D] bg-white dark:bg-[#1A1A1D] text-center">
              <div className="w-12 h-12 rounded-xl bg-[#6D5BA0]/10 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-[#6D5BA0]" />
              </div>
              <h3 className="font-semibold text-[#141413] dark:text-[#F0F0F0] mb-2">Riset Mendalam</h3>
              <p className="text-sm text-[#6B6B68] dark:text-[#B0B0B0]">AI agent melakukan riset komprehensif untuk setiap konten dan fitur.</p>
            </div>
            <div className="p-6 rounded-2xl border border-[#E5E4E0] dark:border-[#2A2A2D] bg-white dark:bg-[#1A1A1D] text-center">
              <div className="w-12 h-12 rounded-xl bg-[#6D5BA0]/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6 text-[#6D5BA0]" />
              </div>
              <h3 className="font-semibold text-[#141413] dark:text-[#F0F0F0] mb-2">Kode Berkualitas</h3>
              <p className="text-sm text-[#6B6B68] dark:text-[#B0B0B0]">QA agent memastikan setiap baris kode memenuhi standar kualitas.</p>
            </div>
            <div className="p-6 rounded-2xl border border-[#E5E4E0] dark:border-[#2A2A2D] bg-white dark:bg-[#1A1A1D] text-center">
              <div className="w-12 h-12 rounded-xl bg-[#6D5BA0]/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-[#6D5BA0]" />
              </div>
              <h3 className="font-semibold text-[#141413] dark:text-[#F0F0F0] mb-2">SEO Optimization</h3>
              <p className="text-sm text-[#6B6B68] dark:text-[#B0B0B0]">Dioptimasi sejak awal untuk mesin pencari dan performa web.</p>
            </div>
            <div className="p-6 rounded-2xl border border-[#E5E4E0] dark:border-[#2A2A2D] bg-white dark:bg-[#1A1A1D] text-center">
              <div className="w-12 h-12 rounded-xl bg-[#6D5BA0]/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-[#6D5BA0]" />
              </div>
              <h3 className="font-semibold text-[#141413] dark:text-[#F0F0F0] mb-2">Delivery Cepat</h3>
              <p className="text-sm text-[#6B6B68] dark:text-[#B0B0B0]">AI mempercepat proses pengembangan tanpa mengorbankan kualitas.</p>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link href="/portfolio/ai-agents" className="inline-flex items-center gap-2 text-[#6D5BA0] font-semibold text-sm hover:gap-3 transition-all">
              Pelajari lebih lanjut tentang sistem AI kami <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tim Kami */}
      <section className="py-24 md:py-32 bg-[#F8F7F4]" id="tim-kami">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionHeader
            overline="Tim Kami"
            title="15 AI Agent, 1 Visi"
            description="Setiap agent memiliki peran spesifik. Bersama, mereka membentuk tim digital yang bekerja tanpa henti untuk proyek Anda."
            align="center"
          />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              // Tim Artikel (6)
              { emoji: '🌸', name: 'Hikari', role: 'Orchestrator', desc: 'Mengoordinasi semua agent dan mengelola alur kerja multi-agent.' },
              { emoji: '🦅', name: 'Helena', role: 'Research Specialist', desc: 'Riset komprehensif, analisis kompetitor, dan investigasi data.' },
              { emoji: '✍️', name: 'Artoria', role: 'Content Creator', desc: 'Menulis artikel SEO-optimized, dokumentasi teknis, dan panduan.' },
              { emoji: '🛡️', name: 'Jeanne', role: 'Quality Guardian', desc: 'Review konten, fakta-checking, dan quality assurance.' },
              { emoji: '🔧', name: 'Circe', role: 'Infrastructure', desc: 'Deploy, Docker, CI/CD, monitoring, dan server management.' },
              { emoji: '📣', name: 'Reach', role: 'Marketing Strategist', desc: 'Growth strategy, social media, content calendar, dan user retention.' },
              // Tim Dev (6)
              { emoji: '📋', name: 'Artoria', role: 'Project Manager', desc: 'Mengelola alur proyek, sprint planning, dan koordinasi tim development.' },
              { emoji: '🎨', name: 'Nero', role: 'UI/UX Designer', desc: 'Design system, wireframe, prototyping, dan user experience.' },
              { emoji: '⚔️', name: 'Mordred', role: 'Fullstack Developer', desc: 'Spesialis Next.js, Go, Python, Supabase, dan Tailwind CSS.' },
              { emoji: '🌸', name: 'Tamamo', role: 'Frontend Specialist', desc: 'React, Next.js App Router, TypeScript, dan optimasi performa frontend.' },
              { emoji: '📚', name: 'Scheherazade', role: 'Backend Specialist', desc: 'API design, database architecture, Go backend, dan sistem integrasi.' },
              { emoji: '🎯', name: 'Scathach', role: 'QA Code', desc: 'Code review, automated testing, regression testing, dan quality gates.' },
              // Lainnya (3)
              { emoji: '🏛️', name: 'Lotus', role: 'Gov Systems', desc: 'Asisten khusus PNS Disdukcapil untuk surat-menyurat dan birokrasi.' },
              { emoji: '🎓', name: 'Guru', role: 'Learning Mentor', desc: 'Kurikulum personal, accountability belajar, dan quiz interaktif.' },
              { emoji: '🎧', name: 'Hana', role: 'Customer Service', desc: 'Melayani pengunjung website secara real-time dengan kecerdasan dan keanggunan.' },
            ].map((agent) => (
              <div
                key={`${agent.name}-${agent.role}`}
                className="p-6 rounded-2xl border border-[#E5E4E0] dark:border-[#2A2A2D] bg-white dark:bg-[#1A1A1D] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D0C9] dark:hover:border-[#3A3A3D]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{agent.emoji}</span>
                  <h3 className="text-lg font-semibold text-[#141413] dark:text-[#F0F0F0]">{agent.name}</h3>
                </div>
                <p className="font-mono text-[11px] text-[#6D5BA0] uppercase tracking-[0.1em]">{agent.role}</p>
                <p className="mt-3 text-sm text-[#4A4A48] dark:text-[#B0B0B0] leading-relaxed">{agent.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/portfolio/ai-agents" className="inline-flex items-center gap-2 text-[#6D5BA0] font-semibold text-sm hover:gap-3 transition-all">
              Kenali seluruh tim <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" id="portfolio">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <SectionHeader
              overline={t.portfolio.overline}
              title={t.portfolio.title}
              description={t.portfolio.description}
            />
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent text-[#141413] dark:text-[#F0F0F0] font-semibold text-sm border border-[#D1D0C9] hover:border-[#B0AFAA] hover:bg-black/[0.02] transition-all duration-200 hover:-translate-y-0.5 shrink-0 self-start md:self-auto"
            >
              {t.portfolio.view_all} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid lg:grid-cols-2 gap-7">
            <ProductCard
              name="Sellica"
              tagline={t.portfolio.sellica.tagline}
              description={t.portfolio.sellica.desc}
              features={t.portfolio.sellica.features}
              href="/portfolio"
              ctaLabel={t.portfolio.sellica.cta}
            />
            <ProductCard
              name="The Avalon Project"
              tagline={t.portfolio.avalon.tagline}
              description={t.portfolio.avalon.desc}
              features={t.portfolio.avalon.features}
              href="https://avalon.vyuapp.my.id/"
              ctaLabel={t.portfolio.avalon.cta}
            />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#F8F7F4]" id="filosofi">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionHeader
            overline={t.philosophy.overline}
            title={t.philosophy.title}
            align="center"
          />
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {t.philosophy.items.map((item, i) => (
              <PhilosophyItem key={i} title={item.title} description={item.desc} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#F8F7F4]" id="kontak">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <SectionHeader
                overline={t.contact.overline}
                title={t.contact.title}
                description={t.contact.description}
              />
              <div className="mt-8 space-y-4 text-sm">
                <div className="flex items-center gap-3 text-[#4A4A48] dark:text-[#B0B0B0]">
                  <span className="w-9 h-9 rounded-lg bg-white dark:bg-[#1A1A1D] border border-[#E5E4E0] dark:border-[#2A2A2D] flex items-center justify-center text-[#6D5BA0]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </span>
                  <a href="mailto:vyuapp@proton.me" className="hover:text-[#6D5BA0] transition-colors">vyuapp@proton.me</a>
                </div>
                <div className="flex items-center gap-3 text-[#4A4A48] dark:text-[#B0B0B0]">
                  <span className="w-9 h-9 rounded-lg bg-white dark:bg-[#1A1A1D] border border-[#E5E4E0] dark:border-[#2A2A2D] flex items-center justify-center text-[#6D5BA0]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </span>
                  Jl. Ratu Intan Dewata, Perumahan Griya Mutiara Rancabango Blok. C40, Garut
                </div>
                <div className="flex items-center gap-3 text-[#4A4A48] dark:text-[#B0B0B0]">
                  <span className="w-9 h-9 rounded-lg bg-white dark:bg-[#1A1A1D] border border-[#E5E4E0] dark:border-[#2A2A2D] flex items-center justify-center text-[#6D5BA0]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </span>
                  Menerima 2&ndash;3 kolaborasi baru per kuartal
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
