import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cookies } from 'next/headers';
import { getPublishedPortfolio, DEFAULT_MAIN, FALLBACK_OTHER } from '@/lib/data';
import { BreadcrumbJsonLd, SoftwareAppJsonLd } from '@/components/JsonLd';
import DetailedProduct from '@/components/DetailedProduct';
import { locales } from '@/lib/locales';

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://vyuapp.my.id';

export const metadata = {
  title: 'Portfolio — VyuApp',
  description: 'Produk inti VyuApp: Tafsha Farm — aplikasi manajemen kebun untuk mencatat siklus tanam, rawat, dan panen.',
  openGraph: {
    title: 'Portfolio — VyuApp',
    description: 'Produk inti VyuApp: Tafsha Farm — proyek yang sedang berjalan, dibangun dan dioperasikan oleh tangan yang sama.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio — VyuApp',
    description: 'Produk inti VyuApp: Tafsha Farm — proyek yang sedang berjalan, dibangun dan dioperasikan oleh tangan yang sama.',
  },
  alternates: { canonical: `${baseUrl}/portfolio` },
};

function OtherProject({ item }) {
  return (
    <div className="border-t border-rule pt-5">
      <p className="eyebrow text-clay mb-3">
        {(item.category || 'PROJECT').toUpperCase()}
      </p>
      <h4 className="display text-2xl leading-tight text-ink">{item.name}</h4>
      <p className="mt-2 text-sm text-ink2 leading-relaxed">{item.description}</p>
      {(item.stack || []).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(item.stack || []).slice(0, 4).map(s => (
            <span key={s} className="inline-flex items-center px-2 py-0.5 text-[0.6rem] font-mono uppercase tracking-[0.1em] text-ink2 border border-rule">
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function PortfolioPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('vyu-locale')?.value === 'en' ? 'en' : 'id';
  const t = locales[locale].portfolioPage;

  const [main1] = DEFAULT_MAIN;
  const dbItems = await getPublishedPortfolio();
  const rest = dbItems.length > 0 ? dbItems : FALLBACK_OTHER;

  const breadcrumbItems = [
    { name: t.breadcrumb.home, url: `${baseUrl}/` },
    { name: t.breadcrumb.portfolio, url: `${baseUrl}/portfolio` },
  ];

  const main1Url = main1?.href || `${baseUrl}/portfolio`;

  return (
    <main className="min-h-screen bg-paper">
      <div className="paper-canvas" aria-hidden="true" />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {main1 && <SoftwareAppJsonLd
        name={main1.name}
        description={main1.description}
        url={main1Url}
        applicationCategory="BusinessApplication"
      />}
      <Navbar />

      <section className="pt-36 md:pt-44 pb-12 border-b border-rule">
        <div className="max-w-page mx-auto px-6 md:px-10">
          <SectionHeader
            overline="Portfolio"
            title={t.title}
            description={t.description}
            highlight={t.titleHighlight}
            index="01"
          />
        </div>
      </section>

      {main1 && (
        <section className="py-12 md:py-16 border-b border-rule">
          <div className="max-w-page mx-auto px-6 md:px-10">
            <DetailedProduct item={main1} />
          </div>
        </section>
      )}

      <section className="py-24 md:py-32">
        <div className="max-w-page mx-auto px-6 md:px-10">
          <SectionHeader
            overline={t.otherWork.overline}
            title={t.otherWork.title}
            description={t.otherWork.description}
            index="02"
          />
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {(rest.length ? rest : FALLBACK_OTHER).map(item => <OtherProject key={item.id} item={item} />)}
          </div>
          <div className="mt-16 border-y border-rule py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="display text-3xl text-ink">{t.cta.title}</h3>
              <p className="text-sm text-ink2 mt-2 max-w-xl">{t.cta.description}</p>
            </div>
            <Link
              href="/#kontak"
              className="field-btn inline-flex items-center gap-2 px-5 py-3 bg-ink text-paper text-[0.7rem] font-mono uppercase tracking-[0.16em] hover:bg-clay shrink-0"
            >
              {t.cta.button} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
