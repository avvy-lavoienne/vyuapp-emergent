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
      <div className="paper-canvas" aria-hidden="true" />

      {/* Client components that need reactive locale context */}
      <LocaleProvider initialLocale={locale}>
        <Navbar />
        <Hero />
      </LocaleProvider>

      {/* Server-rendered static sections */}
      <AboutSection summary={t.summary} />
      <CapabilitiesSection t={t} />
      <CaraKerjaSection />
      <PortfolioSection t={t} />
      <PhilosophySection t={t} />

      {/* Contact section — server wrapper + client form */}
      <section className="py-24 md:py-32 border-t border-rule" id="kontak">
        <div className="max-w-page mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeader
                overline={t.contact.overline}
                title={t.contact.title}
                description={t.contact.description}
                index="06"
              />
              <dl className="mt-10 border-t border-rule">
                <div className="flex items-baseline justify-between gap-6 py-4 border-b border-rule">
                  <dt className="eyebrow">Email</dt>
                  <dd className="text-sm text-ink2">
                    <a href="mailto:vyuapp@proton.me" className="editorial-link">vyuapp@proton.me</a>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 py-4 border-b border-rule">
                  <dt className="eyebrow">Studio</dt>
                  <dd className="text-sm text-ink2 text-right max-w-[16rem]">
                    Jl. Ratu Intan Dewata, Griya Mutiara Rancabango C40, Garut
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 py-4 border-b border-rule">
                  <dt className="eyebrow">Availability</dt>
                  <dd className="text-sm text-ink2">2–3 kolaborasi per kuartal</dd>
                </div>
              </dl>
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
