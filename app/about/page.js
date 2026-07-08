import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Code, Globe, Mail } from 'lucide-react';

export const metadata = {
  title: 'Tentang VyuApp',
  description: 'VyuApp adalah studio rekayasa web premium dari Garut, Jawa Barat. Spesialis Next.js, Supabase, dan produk digital presisi tinggi.',
  alternates: { canonical: 'https://www.vyuapp.my.id/about' },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000]">
      <Navbar />
      <article className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <p className="font-mono text-xs text-[#2997ff] dark:text-[#5BA3FF] uppercase tracking-[0.15em] font-medium">Tentang Kami</p>
          <h1 className="mt-4 text-3xl md:text-5xl font-sans font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.02em]">
            Studio Rekayasa Web Premium dari Garut
          </h1>
          <p className="mt-5 text-lg text-[#4A4A48] dark:text-[#86868b] leading-relaxed max-w-3xl">
            VyuApp adalah studio independen yang menggabungkan keahlian teknis mendalam dengan presisi desain untuk membangun produk digital yang bertanggung jawab atas operasionalnya sendiri.
          </p>

          <div className="mt-16 space-y-16">
            {/* E-E-A-T: Experience */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-lg bg-[#2997ff]/10 dark:bg-[#5BA3FF]/10 flex items-center justify-center text-[#2997ff] dark:text-[#5BA3FF]">
                  <Code className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Pengalaman & Keahlian</h2>
              </div>
              <div className="text-[#4A4A48] dark:text-[#86868b] text-sm leading-relaxed space-y-3">
                <p>Didirikan pada tahun 2024, VyuApp telah mengembangkan dua produk utama yang berjalan di produksi:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Sellica</strong> — Platform intelijen pasar untuk trader aset digital, menggabungkan pipeline data real-time, model statistik, dan UI minimalis.</li>
                  <li><strong>The Avalon Project</strong> — Design system internal yang menerapkan Swiss minimalism bertemu cyberpunk utility di setiap produk.</li>
                </ul>
                <p>Stack teknis kami: <strong>Next.js</strong>, <strong>Supabase</strong> (PostgreSQL), <strong>TypeScript</strong>, <strong>Tailwind CSS</strong>, dan <strong>Python</strong> untuk backend computational.</p>
              </div>
            </section>

            {/* E-E-A-T: Authority */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-lg bg-[#2997ff]/10 dark:bg-[#5BA3FF]/10 flex items-center justify-center text-[#2997ff] dark:text-[#5BA3FF]">
                  <Globe className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Filosofi Kerja</h2>
              </div>
              <div className="text-[#4A4A48] dark:text-[#86868b] text-sm leading-relaxed space-y-3">
                <p>Kami percaya bahwa di era komoditisasi template dan AI generator, premium kembali pada keahlian yang dapat dipertanggungjawabkan. Setiap proyek yang kami bangun memiliki tiga pilar:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Kontinuitas kognitif</strong> — Insinyur yang sama membangun, men-deploy, dan memelihara.</li>
                  <li><strong>Stack yang dikurasi</strong> — Bukan karena tren, tetapi karena terbukti di produksi.</li>
                  <li><strong>Akuntabilitas penuh</strong> — Ketika sistem gagal pukul 02.00, orang yang menjawab adalah orang yang menulis kodenya.</li>
                </ul>
              </div>
            </section>

            {/* E-E-A-T: Trust */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-lg bg-[#2997ff]/10 dark:bg-[#5BA3FF]/10 flex items-center justify-center text-[#2997ff] dark:text-[#5BA3FF]">
                  <Calendar className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Kapasitas & Kontak</h2>
              </div>
              <div className="text-[#4A4A48] dark:text-[#86868b] text-sm leading-relaxed space-y-3">
                <p>VyuApp berbasis di <strong>Garut, Jawa Barat</strong> dan menerima 2–3 kolaborasi baru per kuartal. Kami bekerja secara remote-first dengan klien di seluruh Indonesia.</p>
                <div className="flex items-center gap-3 mt-4">
                  <Mail className="w-4 h-4 text-[#2997ff] dark:text-[#5BA3FF]" />
                  <a href="mailto:vyuapp@proton.me" className="text-[#2997ff] dark:text-[#5BA3FF] hover:text-[#0066cc] dark:hover:text-[#2997ff]">vyuapp@proton.me</a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#2997ff] dark:text-[#5BA3FF]" />
                  <a href="https://github.com/avvy-lavoienne" target="_blank" rel="noopener noreferrer" className="text-[#2997ff] dark:text-[#5BA3FF] hover:text-[#0066cc] dark:hover:text-[#2997ff]">GitHub</a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
