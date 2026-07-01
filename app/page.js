import { cookies } from 'next/headers';
import dynamic from 'next/dynamic';
import { locales } from '@/lib/locales';
import { LocaleProvider } from '@/components/LocaleProvider';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import {
  AboutSection,
  CapabilitiesSection,
  CaraKerjaSection,
  TimKamiSection,
  PortfolioSection,
  PhilosophySection,
} from '@/components/HomeSections';
import SectionHeader from '@/components/SectionHeader';

// ContactForm is client-only — dynamic import keeps it out of the SSR HTML
const ContactForm = dynamic(() => import('@/components/ContactForm'));

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('vyu-locale')?.value === 'en' ? 'en' : 'id';
  const t = locales[locale];

  return (
    <main>
      {/* Client components that need reactive locale context */}
      <LocaleProvider initialLocale={locale}>
        <Navbar />
        <Hero />
      </LocaleProvider>

      {/* Server-rendered static sections — zero client JS */}
      <AboutSection summary={t.summary} />
      <CapabilitiesSection t={t} />
      <CaraKerjaSection />
      <TimKamiSection />
      <PortfolioSection t={t} />
      <PhilosophySection t={t} />

      {/* Contact section — server wrapper + client form */}
      <section className="py-24 md:py-32 bg-[#F8F7F4] dark:bg-[#0F0F10]" id="kontak">
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

      <Footer isLanding />
    </main>
  );
}
