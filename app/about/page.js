import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Tentang VyuApp',
  description: 'VyuApp adalah studio rekayasa web premium dari Garut, Jawa Barat. Spesialis Next.js, Supabase, dan produk digital presisi tinggi.',
  alternates: { canonical: 'https://vyuapp.my.id/about' },
};

const SECTIONS = [
  {
    index: '01',
    title: 'Pengalaman & Keahlian',
    body: (
      <>
        <p>Didirikan pada tahun 2024, VyuApp membangun dan mengoperasikan produk digitalnya sendiri, dengan Tafsha Farm sebagai proyek yang sedang berjalan:</p>
        <ul className="mt-4 list-disc pl-5 space-y-1.5 marker:text-clay">
          <li><strong className="text-ink">Tafsha Farm</strong> — Aplikasi manajemen kebun untuk mencatat siklus tanam, rawat, dan panen per petak, dibangun sebagai PWA offline-first.</li>
        </ul>
        <p className="mt-4">Stack teknis kami: <strong className="text-ink">Next.js</strong>, <strong className="text-ink">Supabase</strong> (PostgreSQL), <strong className="text-ink">TypeScript</strong>, <strong className="text-ink">Tailwind CSS</strong>, dan <strong className="text-ink">Python</strong> untuk backend computational.</p>
      </>
    ),
  },
  {
    index: '02',
    title: 'Filosofi Kerja',
    body: (
      <>
        <p>Kami percaya bahwa di era komoditisasi template dan AI generator, premium kembali pada keahlian yang dapat dipertanggungjawabkan. Setiap proyek yang kami bangun memiliki tiga pilar:</p>
        <ul className="mt-4 list-disc pl-5 space-y-1.5 marker:text-clay">
          <li><strong className="text-ink">Kontinuitas kognitif</strong> — Insinyur yang sama membangun, men-deploy, dan memelihara.</li>
          <li><strong className="text-ink">Stack yang dikurasi</strong> — Bukan karena tren, tetapi karena terbukti di produksi.</li>
          <li><strong className="text-ink">Akuntabilitas penuh</strong> — Ketika sistem gagal pukul 02.00, orang yang menjawab adalah orang yang menulis kodenya.</li>
        </ul>
      </>
    ),
  },
  {
    index: '03',
    title: 'Kapasitas & Kontak',
    body: (
      <>
        <p>VyuApp berbasis di <strong className="text-ink">Garut, Jawa Barat</strong> dan menerima 2–3 kolaborasi baru per kuartal. Kami bekerja secara remote-first dengan klien di seluruh Indonesia.</p>
        <dl className="mt-6 border-t border-rule">
          <div className="flex items-baseline justify-between gap-6 border-b border-rule py-3">
            <dt className="eyebrow">Email</dt>
            <dd className="text-sm">
              <a href="mailto:vyuapp@proton.me" className="editorial-link text-clay hover:text-clayStrong transition-colors">vyuapp@proton.me</a>
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b border-rule py-3">
            <dt className="eyebrow">GitHub</dt>
            <dd className="text-sm">
              <a href="https://github.com/avvy-lavoienne" target="_blank" rel="noopener noreferrer" className="editorial-link text-clay hover:text-clayStrong transition-colors">avvy-lavoienne</a>
            </dd>
          </div>
        </dl>
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="paper-canvas" aria-hidden="true" />
      <Navbar />

      <article className="pt-36 md:pt-44 pb-24 md:pb-32">
        <div className="max-w-page mx-auto px-6 md:px-10">
          <div className="grid grid-cols-12 gap-8 md:gap-12">
            <aside className="col-span-12 md:col-span-4 lg:col-span-3 order-2 md:order-none">
              <div className="md:sticky md:top-28">
                <dl className="border-t border-rule">
                  <div className="border-b border-rule py-3">
                    <dt className="eyebrow">Didirikan</dt>
                    <dd className="mt-1 text-sm text-ink2">2024</dd>
                  </div>
                  <div className="border-b border-rule py-3">
                    <dt className="eyebrow">Basis</dt>
                    <dd className="mt-1 text-sm text-ink2">Garut, Jawa Barat</dd>
                  </div>
                  <div className="border-b border-rule py-3">
                    <dt className="eyebrow">Fokus</dt>
                    <dd className="mt-1 text-sm text-ink2">Produk digital & infrastruktur data</dd>
                  </div>
                  <div className="border-b border-rule py-3">
                    <dt className="eyebrow">Kapasitas</dt>
                    <dd className="mt-1 text-sm text-ink2">2–3 kolaborasi per kuartal</dd>
                  </div>
                </dl>
                <a
                  href="mailto:vyuapp@proton.me"
                  className="field-btn mt-8 inline-flex items-center justify-between gap-3 w-full px-4 py-3 bg-ink text-paper text-[0.65rem] font-mono uppercase tracking-[0.16em] hover:bg-clay"
                >
                  Mulai Percakapan <span aria-hidden="true">→</span>
                </a>
              </div>
            </aside>

            <div className="col-span-12 md:col-span-8 lg:col-span-9 order-1 md:order-none">
              <p className="eyebrow text-clay">01 — Tentang Kami</p>
              <h1 className="mt-5 display text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[1.02] text-ink max-w-3xl">
                Studio rekayasa web premium dari Garut.
              </h1>
              <p className="mt-6 text-base md:text-lg text-ink2 leading-relaxed max-w-2xl">
                VyuApp adalah studio independen yang menggabungkan keahlian teknis mendalam dengan presisi desain untuk membangun produk digital yang bertanggung jawab atas operasionalnya sendiri.
              </p>

              <div className="mt-14 space-y-12">
                {SECTIONS.map((section) => (
                  <section key={section.index} className="grid grid-cols-12 gap-x-6 border-t border-rule pt-6">
                    <p className="index-mark col-span-2 lg:col-span-1">{section.index}</p>
                    <div className="col-span-10 lg:col-span-11">
                      <h2 className="display text-2xl md:text-3xl leading-tight text-ink">{section.title}</h2>
                      <div className="mt-4 text-[0.95rem] leading-[1.85] text-ink2 max-w-2xl">
                        {section.body}
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
