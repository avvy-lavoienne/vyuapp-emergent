import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { getPublishedArticles } from '@/lib/data';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vyuapp.my.id';

const CATEGORY_META = {
  'AI': { title: 'Artikel AI & Kecerdasan Buatan', description: 'Esai tentang AI, machine learning, dan kecerdasan buatan dari VyuApp Studio.' },
  'Engineering': { title: 'Artikel Engineering & Pengembangan', description: 'Esai tentang rekayasa web, software engineering, dan best practices dari VyuApp.' },
  'DevOps': { title: 'Artikel DevOps & Infrastructure', description: 'Esai tentang DevOps, CI/CD, Docker, dan infrastructure dari VyuApp.' },
  'Cloud': { title: 'Artikel Cloud Computing', description: 'Esai tentang cloud computing, serverless, dan deployment dari VyuApp.' },
  'Security': { title: 'Artikel Security & Keamanan', description: 'Esai tentang keamanan web, authentication, dan best practices dari VyuApp.' },
  'Productivity': { title: 'Artikel Productivity & Efisiensi', description: 'Esai tentang produktivitas developer dan tools efisien dari VyuApp.' },
  'Design': { title: 'Artikel Design & UI/UX', description: 'Esai tentang design system, UI/UX, dan visual design dari VyuApp.' },
  'Mobile': { title: 'Artikel Mobile Development', description: 'Esai tentang pengembangan mobile dan responsive design dari VyuApp.' },
  'Backend': { title: 'Artikel Backend Development', description: 'Esai tentang backend, API, dan server-side development dari VyuApp.' },
  'Database': { title: 'Artikel Database & Data', description: 'Esai tentang database design, SQL, dan data management dari VyuApp.' },
  'Testing': { title: 'Artikel Testing & QA', description: 'Esai tentang testing, quality assurance, dan best practices dari VyuApp.' },
  'Career': { title: 'Artikel Career & Profesi', description: 'Esai tentang karir developer dan profesional teknologi dari VyuApp.' },
  'Web3': { title: 'Artikel Web3 & Blockchain', description: 'Esai tentang Web3, blockchain, dan teknologi terdesentralisasi dari VyuApp.' },
  'Performance': { title: 'Artikel Performance & Optimasi', description: 'Esai tentang optimasi performa web dan best practices dari VyuApp.' },
  'IndoTech': { title: 'Artikel Teknologi Indonesia', description: 'Esai tentang ekosistem teknologi Indonesia dari VyuApp Studio.' },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  const meta = CATEGORY_META[category];
  if (!meta) return { title: 'Kategori tidak ditemukan' };
  
  return {
    title: `${meta.title} — VyuApp Insights`,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/category/${encodeURIComponent(category)}`,
      images: [{ url: `${baseUrl}/opengraph-image.png`, width: 1200, height: 630 }],
    },
    alternates: { canonical: `${baseUrl}/category/${encodeURIComponent(category)}` },
  };
}

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  const meta = CATEGORY_META[category];
  
  if (!meta) notFound();

  const articles = await getPublishedArticles({ category });

  const breadcrumbItems = [
    { name: 'Beranda', url: `${baseUrl}/` },
    { name: 'Insights', url: `${baseUrl}/insights` },
    { name: category, url: `${baseUrl}/category/${encodeURIComponent(category)}` },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Navbar />
      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm text-[#6B6B68] hover:text-[#6D5BA0] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Semua artikel
          </Link>
          <p className="font-mono text-xs text-[#6D5BA0] uppercase tracking-[0.15em] font-medium">
            Kategori
          </p>
          <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-sans font-semibold leading-tight tracking-[-0.025em] text-[#141413]">
            {meta.title}
          </h1>
          <p className="mt-5 text-[#4A4A48] text-base md:text-lg leading-relaxed max-w-2xl">
            {meta.description}
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {articles.length === 0 ? (
            <div className="p-12 rounded-2xl border border-[#E5E4E0] bg-white text-center">
              <p className="font-mono text-xs text-[#636360] uppercase tracking-[0.15em]">
                // Belum ada artikel
              </p>
              <p className="mt-3 text-sm text-[#4A4A48]">
                Belum ada artikel dalam kategori {category}.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {articles.map((a, i) => (
                <Link
                  key={a.id}
                  href={`/insights/${a.slug}`}
                  className={`rounded-2xl border border-[#E5E4E0] bg-white overflow-hidden flex flex-col group transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D0C9] ${i === 0 ? 'lg:col-span-2' : ''}`}
                >
                  <div className={`relative ${i === 0 ? 'h-72' : 'h-52'} overflow-hidden bg-[#F4F3EE]`}>
                    <Image
                      src={a.cover || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=75'}
                      alt={a.title}
                      fill
                      priority={i < 3}
                      quality={80}
                      className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-700"
                      sizes={i === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 25vw'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium text-[#6B6B68] bg-white/80 border border-[#E5E4E0]">
                        {a.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-[#636360] mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> {formatDate(a.published_at || a.updated_at)}
                      </span>
                      <span>·</span>
                      <span>{Math.max(2, Math.round((a.content || '').length / 1000))} min read</span>
                    </div>
                    <h3 className={`font-sans font-semibold text-[#141413] leading-snug ${i === 0 ? 'text-2xl' : 'text-lg'} group-hover:text-[#6D5BA0] transition-colors tracking-[-0.01em]`}>
                      {a.title}
                    </h3>
                    <p className="mt-3 text-sm text-[#4A4A48] leading-relaxed line-clamp-3">{a.excerpt}</p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {(a.tags || []).slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] font-mono tracking-wider text-[#737370] uppercase">#{t}</span>
                      ))}
                    </div>
                    <div className="mt-auto pt-5">
                      <span className="inline-flex items-center gap-2 text-sm text-[#6D5BA0] font-medium group-hover:gap-3 transition-all">
                        Baca artikel <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
