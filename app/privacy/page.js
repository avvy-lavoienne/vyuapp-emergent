import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan privasi VyuApp — bagaimana kami melindungi data Anda.',
  alternates: { canonical: 'https://vyuapp.my.id/privacy' },
};

const linkClass = 'text-clay underline underline-offset-4 hover:text-clayStrong transition-colors';

const SECTIONS = [
  {
    title: 'Pengumpulan Informasi',
    body: (
      <>
        <p>VyuApp mengumpulkan informasi yang Anda berikan secara langsung melalui formulir kontak dan formulir discovery, termasuk nama, alamat email, nama perusahaan, dan pesan yang dikirimkan.</p>
        <p className="mt-3">Kami juga mengumpulkan data teknis secara otomatis seperti alamat IP, jenis browser, dan halaman yang dikunjungi untuk keperluan analisis dan peningkatan layanan.</p>
      </>
    ),
  },
  {
    title: 'Penggunaan Informasi',
    body: (
      <>
        <p>Informasi yang dikumpulkan digunakan untuk:</p>
        <ul className="mt-3 list-disc pl-5 space-y-1.5 marker:text-clay">
          <li>Merespons pertanyaan dan permintaan kolaborasi Anda</li>
          <li>Mengirimkan proposal dan penawaran layanan</li>
          <li>Meningkatkan kualitas situs dan layanan kami</li>
          <li>Menganalisis trafik dan perilaku pengunjung</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Penyimpanan Data',
    body: (
      <p>Data Anda disimpan di server Supabase yang aman dan dienkripsi. Kami tidak menjual, menukar, atau mentransfer informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda.</p>
    ),
  },
  {
    title: 'Cookie',
    body: (
      <p>Situs ini menggunakan cookie yang diperlukan untuk autentikasi admin dan preferensi sesi. Kami juga menggunakan Google AdSense yang dapat menggunakan cookie untuk personalisasi iklan.</p>
    ),
  },
  {
    title: 'Hak Anda',
    body: (
      <p>
        Anda berhak untuk meminta akses, perubahan, atau penghapusan data pribadi Anda. Untuk pertanyaan terkait privasi, hubungi kami di{' '}
        <a href="mailto:vyuapp@proton.me" className={linkClass}>vyuapp@proton.me</a>.
      </p>
    ),
  },
  {
    title: 'Kontak',
    body: (
      <p>
        VyuApp Studio — Garut, Jawa Barat, Indonesia<br />
        Email: <a href="mailto:vyuapp@proton.me" className={linkClass}>vyuapp@proton.me</a>
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="paper-canvas" aria-hidden="true" />
      <Navbar />

      <article className="pt-36 md:pt-44 pb-24 md:pb-32">
        <div className="max-w-page mx-auto px-6 md:px-10">
          <header className="border-b border-rule pb-8">
            <p className="eyebrow text-clay">Legal — Privasi</p>
            <div className="mt-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h1 className="display text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[1.02] text-ink">
                Kebijakan Privasi
              </h1>
              <p className="eyebrow whitespace-nowrap">Diperbarui 28 Juni 2026</p>
            </div>
          </header>

          <div className="max-w-4xl">
            {SECTIONS.map((section, i) => (
              <section key={section.title} className="grid grid-cols-12 gap-x-6 border-b border-rule py-8">
                <p className="index-mark col-span-2 md:col-span-1">{String(i + 1).padStart(2, '0')}</p>
                <div className="col-span-10 md:col-span-11">
                  <h2 className="display text-2xl leading-tight text-ink">{section.title}</h2>
                  <div className="mt-3 text-[0.95rem] leading-[1.85] text-ink2">
                    {section.body}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
