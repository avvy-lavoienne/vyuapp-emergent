import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, Globe, Zap, Brain, FileText, Code, TestTube, Server, Megaphone, Building2, GraduationCap, ChevronRight, Headphones } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.vyuapp.my.id';

export const metadata = {
  title: 'VyuApp Multi-Agent System — Tim AI Agent',
  description: 'Kenali 10 AI agent VyuApp: Hikari, Merlin, Bedivere, Lancelot, Agravain, Gawain, Tristan, Lotus, dan Guru. Sistem multi-agent untuk website berkualitas tinggi.',
  openGraph: {
    title: 'VyuApp Multi-Agent System — Tim AI Agent',
    description: 'Kenali 10 AI agent yang membentuk tim digital VyuApp.',
    images: [{ url: `${baseUrl}/opengraph-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VyuApp Multi-Agent System — Tim AI Agent',
    description: 'Kenali 10 AI agent yang membentuk tim digital VyuApp.',
  },
  alternates: { canonical: `${baseUrl}/portfolio/ai-agents` },
};

const agentGroups = [
  {
    category: 'Inti',
    agents: [
      {
        emoji: '🌸',
        name: 'Hikari',
        role: 'Orchestrator & Main Interface',
        icon: Brain,
        description: 'Mengoordinasi semua agent, mendeteksi intent, dan mengelola alur kerja multi-agent. "Otak" dari seluruh sistem yang memastikan setiap agent bekerja sesuai perannya.',
        capabilities: ['Intent detection & routing', 'Multi-agent coordination', 'Workflow management', 'Error recovery & fallback'],
      },
    ],
  },
  {
    category: 'Konten',
    agents: [
      {
        emoji: '🧙',
        name: 'Merlin',
        role: 'Deep Research Specialist',
        icon: Search,
        description: 'Riset komprehensif, analisis kompetitor, benchmark teknologi, dan investigasi data. Selalu menyertakan sumber valid — tidak pernah menebak.',
        capabilities: ['Competitor analysis', 'Market research & trends', 'Data investigation', 'Source validation'],
      },
      {
        emoji: '📜',
        name: 'Bedivere',
        role: 'Technical Writer & Content Creator',
        icon: FileText,
        description: 'Menulis artikel SEO-optimized, dokumentasi teknis, PRD, dan panduan. Gaya: business-focused, data-driven, 100% Bahasa Indonesia.',
        capabilities: ['SEO-optimized articles', 'Technical documentation', 'PRD & guidelines', 'Business-focused copywriting'],
      },
    ],
  },
  {
    category: 'Teknik',
    agents: [
      {
        emoji: '⚔️',
        name: 'Lancelot',
        role: 'Full-Stack Developer',
        icon: Code,
        description: 'Spesialis Next.js, Go, Python, Supabase, Tailwind CSS. Menulis kode bersih, efisien, dan aman untuk skala produksi.',
        capabilities: ['Next.js & React', 'Go & Python backends', 'Supabase integration', 'Clean & secure code'],
      },
      {
        emoji: '🛡️',
        name: 'Agravain',
        role: 'Quality Guardian',
        icon: TestTube,
        description: 'Review kode, security audit, test design, bug detection. Tidak pernah menyetujui kode yang substandar — standar kualitas adalah mutlak.',
        capabilities: ['Code review & audit', 'Security assessment', 'Test design & coverage', 'Bug detection & prevention'],
      },
      {
        emoji: '☀️',
        name: 'Gawain',
        role: 'Infrastructure Specialist',
        icon: Server,
        description: 'Deploy, Docker, CI/CD, monitoring, server management. Memastikan sistem reliable dan scalable dari hari pertama.',
        capabilities: ['Docker & containerization', 'CI/CD pipelines', 'Server monitoring', 'Scalable infrastructure'],
      },
    ],
  },
  {
    category: 'Pertumbuhan',
    agents: [
      {
        emoji: '🎵',
        name: 'Tristan',
        role: 'Marketing Strategist',
        icon: Megaphone,
        description: 'Growth strategy, social media, content calendar, user retention. Prioritas utama: membangun kepercayaan komunitas jangka panjang.',
        capabilities: ['Growth strategy', 'Social media management', 'Content calendar planning', 'Community trust building'],
      },
    ],
  },
  {
    category: 'Spesialis',
    agents: [
      {
        emoji: '🏛️',
        name: 'Lotus',
        role: 'Government Systems Specialist',
        icon: Building2,
        description: 'Asisten khusus PNS Disdukcapil. Mengelola surat-menyurat, laporan, KTP/KK, dan proses birokrasi dengan presisi.',
        capabilities: ['Surat-menyurat otomatis', 'Laporan berkala', 'KTP/KK management', 'Birokrasi workflow'],
      },
      {
        emoji: '🎓',
        name: 'Guru',
        role: 'Personal Learning Mentor',
        icon: GraduationCap,
        description: 'Kurikulum personal, accountability belajar, penjelasan konsep dengan analogi, quiz & review. Membantu belajar dengan pendekatan personal.',
        capabilities: ['Personal curriculum', 'Learning accountability', 'Concept explanation', 'Quiz & review system'],
      },
    ],
  },
  {
    category: 'Layanan',
    agents: [
      {
        emoji: '🌸',
        name: 'Hana',
        role: 'Customer Service & Brand Ambassador',
        icon: Headphones,
        description: 'Wajah VyuApp yang melayani pengunjung website secara real-time. Anggun, cerdas, dan selalu siap membantu — dari pertanyaan umum hingga kualifikasi prospek.',
        capabilities: ['Live chat di website', 'Lead qualification', 'Product knowledge', 'Multi-language support'],
      },
    ],
  },
];

const pipelineSteps = [
  { agent: 'Merlin', task: 'Riset & Analisis', description: 'Merlin mengumpulkan data, menganalisis kompetitor, dan menyusun insight berbasis sumber.' },
  { agent: 'Bedivere', task: 'Penulisan & Dokumentasi', description: 'Bedivere mengubah riset menjadi konten SEO-optimized dan dokumentasi teknis yang jelas.' },
  { agent: 'Lancelot', task: 'Pengembangan', description: 'Lancelot menerjemahkan desain dan konten menjadi kode produksi yang bersih dan efisien.' },
  { agent: 'Agravain', task: 'Quality Assurance', description: 'Agravain melakukan review menyeluruh: kode, keamanan, performa, dan user experience.' },
  { agent: 'Gawain', task: 'Deployment', description: 'Gawain memastikan sistem ter-deploy dengan aman, monitored, dan scalable.' },
];

const features = [
  {
    icon: Search,
    title: 'Riset Lebih Mendalam',
    description: 'Setiap proyek dimulai dengan tahap riset komprehensif — analisis kompetitor, perilaku pengunjung, dan tren industri.',
  },
  {
    icon: ShieldCheck,
    title: 'Kualitas Kode Terjamin',
    description: 'Agent khusus melakukan pengecekan kualitas secara otomatis: memastikan kode bersih, performa optimal, dan tidak ada celah keamanan.',
  },
  {
    icon: Globe,
    title: 'SEO Dioptimasi dari Awal',
    description: 'Struktur website dibangun dengan prinsip SEO sejak baris pertama — bukan dijadikan catatan kaki.',
  },
  {
    icon: Zap,
    title: 'Delivery Lebih Cepat',
    description: 'Dengan pembagian kerja antar agent yang efisien, waktu pengembangan lebih singkat tanpa mengorbankan kualitas.',
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
    description: 'Menganalisis kompetitor, tren pasar, dan peluang SEO untuk membangun fondasi strategi yang solid.',
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
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-[#0F0F10]">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-[#6B6B68] dark:text-[#B0B0B0] hover:text-[#6D5BA0] dark:hover:text-[#8B7BC4] transition-colors mb-8"
          >
            ← Kembali ke Portfolio
          </Link>
          <p className="font-mono text-xs text-[#6D5BA0] dark:text-[#8B7BC4] uppercase tracking-[0.15em] font-medium">
            Case Study
          </p>
          <h1 className="mt-4 text-3xl md:text-5xl font-sans font-semibold leading-tight tracking-[-0.025em] text-[#141413] dark:text-[#F0F0F0]">
            VyuApp Multi-Agent System
          </h1>
          <p className="mt-5 text-lg md:text-xl text-[#4A4A48] dark:text-[#B0B0B0] leading-relaxed max-w-2xl">
            Bagaimana Kami Menggunakan AI untuk Memberikan Hasil Terbaik
          </p>
        </div>
      </section>

      {/* Apa itu Multi-Agent System */}
      <section className="py-16 md:py-24 border-t border-[#E5E4E0] dark:border-[#2A2A2D]">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <h2 className="text-2xl md:text-3xl font-sans font-semibold text-[#141413] dark:text-[#F0F0F0] tracking-[-0.02em]">
            Apa itu Sistem Multi-Agent?
          </h2>
          <p className="mt-5 text-base text-[#4A4A48] dark:text-[#B0B0B0] leading-relaxed">
            Bayangkan memiliki tim ahli yang masing-masing spesialis pada bidangnya — ada yang ahli riset pasar, ada yang spesialis SEO, ada yang fokus pada kualitas kode, dan ada yang memastikan semuanya berjalan sempurna. Itulah inti dari sistem multi-agent kami.
          </p>
          <p className="mt-4 text-base text-[#4A4A48] dark:text-[#B0B0B0] leading-relaxed">
            Alih-alih mengandalkan satu proses linier, VyuApp menjalankan beberapa &quot;agent&quot; AI yang bekerja secara terkoordinasi. Setiap agent memiliki peran spesifik dan saling melengkapi. Hasilnya adalah website yang dibangun dengan presisi tinggi — dari riset hingga deployment.
          </p>
          <div className="mt-8 p-6 md:p-8 rounded-2xl border border-[#E5E4E0] dark:border-[#2A2A2D] bg-white dark:bg-[#1A1A1D]">
            <p className="text-sm text-[#4A4A48] dark:text-[#B0B0B0] leading-relaxed italic">
              &quot;Ini bukan soal mengganti manusia dengan mesin. Ini tentang memberdayakan tim kami dengan alat yang tepat sehingga setiap proyek mendapat perhatian terbaik dari setiap aspeknya.&quot;
            </p>
            <p className="mt-3 text-xs font-mono text-[#636360] dark:text-[#8A8A8A]">— VyuApp Studio</p>
          </div>
        </div>
      </section>

      {/* Tim Agent — Detailed Profiles */}
      <section className="py-16 md:py-24 border-t border-[#E5E4E0] dark:border-[#2A2A2D]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="font-mono text-xs text-[#636360] dark:text-[#8A8A8A] uppercase tracking-[0.15em] font-medium">
            Tim Agent
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-sans font-semibold text-[#141413] dark:text-[#F0F0F0] tracking-[-0.02em]">
            Mengenal Setiap Agent
          </h2>
          <p className="mt-4 text-base text-[#4A4A48] dark:text-[#B0B0B0] leading-relaxed max-w-2xl">
            10 AI agent dengan spesialisasi masing-masing, bekerja secara terkoordinasi untuk menghasilkan website berkualitas tinggi.
          </p>

          {agentGroups.map((group) => (
            <div key={group.category} className="mt-14">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-[11px] text-[#6D5BA0] dark:text-[#8B7BC4] uppercase tracking-[0.15em] font-semibold">{group.category}</span>
                <div className="flex-1 h-px bg-[#E5E4E0]" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.agents.map((agent) => {
                  const Icon = agent.icon;
                  return (
                    <div
                      key={agent.name}
                      className="p-7 rounded-2xl border border-[#E5E4E0] dark:border-[#2A2A2D] bg-white dark:bg-[#1A1A1D] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D0C9] dark:hover:border-[#3A3A3D] flex flex-col"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{agent.emoji}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-[#141413] dark:text-[#F0F0F0]">{agent.name}</h3>
                          <p className="font-mono text-[11px] text-[#6D5BA0] dark:text-[#8B7BC4] uppercase tracking-[0.1em]">{agent.role}</p>
                        </div>
                      </div>
                      <p className="text-sm text-[#4A4A48] dark:text-[#B0B0B0] leading-relaxed flex-1">{agent.description}</p>
                      <ul className="mt-5 space-y-2">
                        {agent.capabilities.map((cap) => (
                          <li key={cap} className="flex items-start gap-2.5 text-sm text-[#4A4A48] dark:text-[#B0B0B0]">
                            <span className="w-1 h-1 rounded-full bg-[#6D5BA0] mt-2 flex-shrink-0" />
                            {cap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-16 md:py-24 border-t border-[#E5E4E0] dark:border-[#2A2A2D] bg-[#F8F7F4] dark:bg-[#1A1A1D]">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <p className="font-mono text-xs text-[#636360] dark:text-[#8A8A8A] uppercase tracking-[0.15em] font-medium">
            Pipeline
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-sans font-semibold text-[#141413] dark:text-[#F0F0F0] tracking-[-0.02em]">
            Bagaimana Agent Bekerja Bersama
          </h2>
          <p className="mt-4 text-base text-[#4A4A48] dark:text-[#B0B0B0] leading-relaxed max-w-2xl">
            Dari riset hingga deployment, setiap agent memiliki momen spesifik dalam pipeline untuk memastikan kualitas di setiap tahap.
          </p>

          <div className="mt-14 space-y-0">
            {pipelineSteps.map((step, i) => (
              <div key={step.agent} className="flex gap-6 items-stretch">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#6D5BA0] text-white flex items-center justify-center text-sm font-semibold shrink-0">
                    {i + 1}
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <div className="w-px flex-1 bg-[#D1D0C9] dark:bg-[#3A3A3D] my-1" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-8 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-semibold text-[#141413] dark:text-[#F0F0F0]">{step.task}</span>
                    <ChevronRight className="w-4 h-4 text-[#636360] dark:text-[#8A8A8A]" />
                    <span className="font-mono text-[11px] text-[#6D5BA0] dark:text-[#8B7BC4] uppercase tracking-[0.1em] font-medium">{step.agent}</span>
                  </div>
                  <p className="text-sm text-[#4A4A48] dark:text-[#B0B0B0] leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manfaat */}
      <section className="py-16 md:py-24 border-t border-[#E5E4E0] dark:border-[#2A2A2D]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="font-mono text-xs text-[#636360] dark:text-[#8A8A8A] uppercase tracking-[0.15em] font-medium">
            Manfaat
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-sans font-semibold text-[#141413] dark:text-[#F0F0F0] tracking-[-0.02em]">
            Apa yang Anda Dapatkan
          </h2>
          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-8 rounded-2xl border border-[#E5E4E0] dark:border-[#2A2A2D] bg-white dark:bg-[#1A1A1D] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D1D0C9] dark:hover:border-[#3A3A3D]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#6D5BA0]/10 dark:bg-[#8B7BC4]/10 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-[#6D5BA0] dark:text-[#8B7BC4]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#141413] dark:text-[#F0F0F0] tracking-[-0.01em]">{f.title}</h3>
                  <p className="mt-3 text-sm text-[#4A4A48] dark:text-[#B0B0B0] leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Proses */}
      <section className="py-16 md:py-24 border-t border-[#E5E4E0] dark:border-[#2A2A2D]">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <p className="font-mono text-xs text-[#636360] dark:text-[#8A8A8A] uppercase tracking-[0.15em] font-medium">
            Proses
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-sans font-semibold text-[#141413] dark:text-[#F0F0F0] tracking-[-0.02em]">
            Dari Ide hingga Website Hidup
          </h2>
          <div className="mt-14 space-y-8">
            {processSteps.map((s) => (
              <div key={s.step} className="flex gap-6 items-start">
                <span className="font-mono text-xs text-[#6D5BA0] dark:text-[#8B7BC4] font-semibold mt-1 shrink-0">{s.step}</span>
                <div className="flex-1 p-6 rounded-2xl border border-[#E5E4E0] dark:border-[#2A2A2D] bg-white dark:bg-[#1A1A1D]">
                  <h3 className="text-base font-semibold text-[#141413] dark:text-[#F0F0F0]">{s.title}</h3>
                  <p className="mt-2 text-sm text-[#4A4A48] dark:text-[#B0B0B0] leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-[#E5E4E0] dark:border-[#2A2A2D]">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <div className="p-8 md:p-10 rounded-2xl border border-[#E5E4E0] dark:border-[#2A2A2D] bg-white dark:bg-[#1A1A1D] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-[#141413] dark:text-[#F0F0F0]">Siap Merasakan Bedanya?</h3>
              <p className="text-sm text-[#4A4A48] dark:text-[#B0B0B0] mt-2 max-w-xl">Diskusikan proyek Anda bersama kami. Kami hanya menerima 2–3 kolaborasi baru per kuartal untuk menjaga kualitas.</p>
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
