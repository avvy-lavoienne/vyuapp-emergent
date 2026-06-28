import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, Globe, Zap } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.vyuapp.my.id';

export const metadata = {
  title: 'VyuApp Multi-Agent System — Portfolio',
  description: 'Bagaimana VyuApp menggunakan sistem multi-agent AI untuk menghasilkan website berkualitas tinggi dengan riset mendalam, kualitas kode terjamin, dan SEO yang dioptimasi.',
  openGraph: {
    title: 'VyuApp Multi-Agent System',
    description: 'Sistem multi-agent AI yang membuat website berkualitas tinggi.',
    images: [{ url: `${baseUrl}/opengraph-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VyuApp Multi-Agent System — Portfolio',
    description: 'Bagaimana VyuApp menggunakan sistem multi-agent AI untuk menghasilkan website berkualitas tinggi.',
  },
  alternates: { canonical: `${baseUrl}/portfolio/ai-agents` },
};

const features = [
  {
    icon: Search,
    title: 'Riset Lebih Mendalam',
    description: 'Setiap proyek dimulai dengan tahap riset komprehensif — analisis kompetitor, perilaku pengunjung, dan tren industri — sehingga solusi yang dihasilkan benar-benar sesuai kebutuhan pasar.',
  },
  {
    icon: ShieldCheck,
    title: 'Kualitas Kode Terjamin',
    description: 'Agent khusus melakukan pengecekan kualitas secara otomatis: memastikan kode bersih, performa optimal, dan tidak ada celah keamanan sebelum dikirim ke klien.',
  },
  {
    icon: Globe,
    title: 'SEO Dioptimasi dari Awal',
    description: 'Struktur website dibangun dengan prinsip SEO sejak baris pertama — bukan dijadikan catatan kaki. Hasilnya? Website Anda langsung siap bersaing di mesin pencari.',
  },
  {
    icon: Zap,
    title: 'Delivery Lebih Cepat',
    description: 'Dengan pembagian kerja antar agent yang efisien, waktu pengembangan lebih singkat tanpa mengorbankan kualitas. Deadline lebih mudah ditepati.',
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Analisis Kebutuhan',
    description: 'Memahami bisnis klien, target audiens, dan tujuan website secara menyeluruh.',
  },
  {
    step: '02',
    title: 'Riset & Strategi',
    description: 'Menganalisis kometitor, tren pasar, dan peluang SEO untuk membangun fondasi strategi yang solid.',
  },
  {
    step: '03',
    title: 'Pengembangan Terkoordinasi',
    description: 'Tim agent bekerja secara paralel — membangun, menguji, dan mengoptimasi komponen website secara bersamaan.',
  },
  {
    step: '04',
    title: 'Quality Assurance',
    description: 'Setiap elemen diperiksa: dari performa, keamanan, responsivitas, hingga kebersihan kode.',
  },
];

const breadcrumbItems = [
  { name: 'Beranda', url: `${baseUrl}/` },
  { name: 'Portfolio', url: `${baseUrl}/portfolio` },
  { name: 'Multi-Agent System', url: `${baseUrl}/portfolio/ai-agents` },
];

export default function AIAgentsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-[#6B6B68] hover:text-[#6D5BA0] transition-colors mb-8"
          >
            ← Kembali ke Portfolio
          </Link>
          <p className="font-mono text-xs text-[#6D5BA0] uppercase tracking-[0.15em] font-medium">
            Case Study
          </p>
          <h1 className="mt-4 text-3xl md:text-5xl font-sans font-semibold leading-tight tracking-[-0.025em] text-[#141413]">
            VyuApp Multi-Agent System
          </h1>
          <p className="mt-5 text-lg md:text-xl text-[#4A4A48] leading-relaxed max-w-2xl">
            Bagaimana Kami Menggunakan AI untuk Memberikan Hasil Terbaik
          </p>
        </div>
      </section>

      {/* Apa itu Multi-Agent System */}
      <section className="py-16 md:py-24 border-t border-[#E5E4E0]">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <h2 className="text-2xl md:text-3xl font-sans font-semibold text-[#141413] tracking-[-0.02em]">
            Apa itu Sistem Multi-Agent?
          </h2>
          <p className="mt-5 text-base text-[#4A4A48] leading-relaxed">
            Bayangkan memiliki tim ahli yang masing-masing spesialis pada bidangnya — ada yang ahli riset pasar, ada yang spesialis SEO, ada yang fokus pada kualitas kode, dan ada yang memastikan semuanya berjalan sempurna. Itulah inti dari sistem multi-agent kami.
          </p>
          <p className="mt-4 text-base text-[#4A4A48] leading-relaxed">
            Alih-alih mengandalkan satu proses linier, VyuApp menjalankan beberapa &quot;agent&quot; AI yang bekerja secara terkoordinasi. Setiap agent memiliki peran spesifik dan saling melengkapi. Hasilnya adalah website yang dibangun dengan presisi tinggi — dari riset hingga deployment.
          </p>
          <div className="mt-8 p-6 md:p-8 rounded-2xl border border-[#E5E4E0] bg-white">
            <p className="text-sm text-[#4A4A48] leading-relaxed italic">
              &quot;Ini bukan soal mengganti manusia dengan mesin. Ini tentang memberdayakan tim kami dengan alat yang tepat sehingga setiap proyek mendapat perhatian terbaik dari setiap aspeknya.&quot;
            </p>
            <p className="mt-3 text-xs font-mono text-[#8F8E8A]">— VyuApp Studio</p>
          </div>
        </div>
      </section>

      {/* Manfaat */}
      <section className="py-16 md:py-24 border-t border-[#E5E4E0]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="font-mono text-xs text-[#8F8E8A] uppercase tracking-[0.15em] font-medium">
            Manfaat
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-sans font-semibold text-[#141413] tracking-[-0.02em]">
            Apa yang Anda Dapatkan
          </h2>
          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-8 rounded-2xl border border-[#E5E4E0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D0C9]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#6D5BA0]/10 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-[#6D5BA0]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#141413] tracking-[-0.01em]">{f.title}</h3>
                  <p className="mt-3 text-sm text-[#4A4A48] leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Proses */}
      <section className="py-16 md:py-24 border-t border-[#E5E4E0]">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <p className="font-mono text-xs text-[#8F8E8A] uppercase tracking-[0.15em] font-medium">
            Proses
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-sans font-semibold text-[#141413] tracking-[-0.02em]">
            Dari Ide hingga Website Hidup
          </h2>
          <div className="mt-14 space-y-8">
            {processSteps.map((s) => (
              <div key={s.step} className="flex gap-6 items-start">
                <span className="font-mono text-xs text-[#6D5BA0] font-semibold mt-1 shrink-0">{s.step}</span>
                <div className="flex-1 p-6 rounded-2xl border border-[#E5E4E0] bg-white">
                  <h3 className="text-base font-semibold text-[#141413]">{s.title}</h3>
                  <p className="mt-2 text-sm text-[#4A4A48] leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-[#E5E4E0]">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <div className="p-8 md:p-10 rounded-2xl border border-[#E5E4E0] bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-[#141413]">Siap Merasakan Bedanya?</h3>
              <p className="text-sm text-[#4A4A48] mt-2 max-w-xl">Diskusikan proyek Anda bersama kami. Kami hanya menerima 2–3 kolaborasi baru per kuartal untuk menjaga kualitas.</p>
            </div>
            <Link
              href="/#kontak"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6D5BA0] text-white text-sm font-semibold hover:bg-[#574886] transition-all duration-200 hover:-translate-y-0.5 shrink-0"
            >
              Mulai Diskusi <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
