import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Syarat & Ketentuan',
  description: 'Syarat dan ketentuan penggunaan layanan VyuApp — ketentuan kerja sama, pembayaran, dan hak kekayaan intelektual.',
  alternates: { canonical: 'https://vyuapp.my.id/tos' },
};

const linkClass = 'text-clay underline underline-offset-4 hover:text-clayStrong transition-colors';

const SECTIONS = [
  {
    title: 'Penerimaan Syarat',
    body: (
      <>
        <p>Dengan mengakses atau menggunakan layanan VyuApp, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak menyetujui bagian apa pun dari syarat ini, mohon untuk tidak menggunakan layanan kami.</p>
        <p className="mt-3">Syarat ini berlaku untuk semua pengguna, klien, dan pihak yang berinteraksi dengan layanan VyuApp, baik melalui situs web, formulir kontak, maupun kerja sama langsung.</p>
      </>
    ),
  },
  {
    title: 'Layanan',
    body: (
      <>
        <p>VyuApp menyediakan layanan profesional di bidang:</p>
        <ul className="mt-3 list-disc pl-5 space-y-1.5 marker:text-clay">
          <li><strong className="text-ink">Pengembangan Web</strong> — perancangan, pembuatan, dan pemeliharaan situs web serta aplikasi berbasis web</li>
          <li><strong className="text-ink">Konsultasi Teknologi</strong> — analisis kebutuhan, rekomendasi arsitektur, dan strategi transformasi digital</li>
          <li><strong className="text-ink">Data Intelligence</strong> — pengolahan data, analitik, dan pembuatan dashboard untuk pengambilan keputusan</li>
        </ul>
        <p className="mt-3">Spesifikasi detail setiap proyek dituangkan dalam proposal atau kontrak kerja yang disepakati secara tertulis sebelum pengerjaan dimulai.</p>
      </>
    ),
  },
  {
    title: 'Hak Kekayaan Intelektual',
    body: (
      <>
        <p>Seluruh kode sumber, desain, dan aset digital yang dikembangkan oleh VyuApp tetap menjadi milik VyuApp kecuali disepakati lain secara tertulis.</p>
        <p className="mt-3">Setelah proyek selesai dan pembayaran diterima secara penuh, klien mendapat lisensi non-eksklusif untuk menggunakan hasil pekerjaan sesuai dengan ruang lingup yang disepakati dalam kontrak kerja.</p>
        <p className="mt-3">Klien tidak diperkenankan menjual, mendistribusikan, atau memberikan akses kepada pihak ketiga atas hasil pekerjaan tanpa izin tertulis dari VyuApp.</p>
      </>
    ),
  },
  {
    title: 'Pembayaran dan Pembatalan',
    body: (
      <>
        <p>Pembayaran dilakukan sesuai dengan jadwal yang ditetapkan dalam proposal atau kontrak kerja. Biasanya terbagi menjadi:</p>
        <ul className="mt-3 list-disc pl-5 space-y-1.5 marker:text-clay">
          <li>DP sebesar 50% saat kontrak ditandatangani</li>
          <li>Pelunasan setelah deliverable akhir diterima dan disetujui</li>
        </ul>
        <p className="mt-3">Pembatalan oleh klien setelah pengerjaan dimulai dikenakan biaya sesuai dengan proporsi pekerjaan yang telah diselesaikan. VyuApp berhak menolak pengembalian dana untuk pekerjaan yang sudah rampung.</p>
        <p className="mt-3">Keterlambatan pembayaran melebihi 14 hari kalender dapat mengakibatkan penghentian sementara layanan hingga pembayaran diterima.</p>
      </>
    ),
  },
  {
    title: 'Pembatasan Tanggung Jawab',
    body: (
      <>
        <p>VyuApp berusaha memberikan layanan dengan kualitas terbaik, namun tidak memberikan jaminan bahwa layanan akan selalu tanpa gangguan atau bebas dari kesalahan.</p>
        <p className="mt-3">VyuApp tidak bertanggung jawab atas kerugian tidak langsung, kehilangan data, atau kerugian bisnis yang timbul dari penggunaan layanan kami. Tanggung jawab kami terbatas pada nilai kontrak yang telah disepakati.</p>
        <p className="mt-3">Klien bertanggung jawab untuk melakukan backup data secara berkala dan memastikan penggunaan layanan sesuai dengan ketentuan yang berlaku.</p>
      </>
    ),
  },
  {
    title: 'Privasi',
    body: (
      <p>
        Pengumpulan dan penggunaan data pribadi Anda diatur dalam{' '}
        <a href="/privacy" className={linkClass}>Kebijakan Privasi</a>{' '}
        kami. Dengan menggunakan layanan VyuApp, Anda juga menyetujui ketentuan privasi yang berlaku.
      </p>
    ),
  },
  {
    title: 'Perubahan Syarat',
    body: (
      <>
        <p>VyuApp berhak mengubah atau memperbarui syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Perubahan akan berlaku efektif segera setelah dipublikasikan di halaman ini.</p>
        <p className="mt-3">Disarankan untuk meninjau halaman ini secara berkala. Penggunaan layanan yang berlanjut setelah perubahan merupakan bentuk penerimaan Anda terhadap syarat yang telah diperbarui.</p>
      </>
    ),
  },
  {
    title: 'Kontak',
    body: (
      <>
        <p>Untuk pertanyaan terkait syarat dan ketentuan ini, silakan hubungi kami:</p>
        <p className="mt-3">
          VyuApp Studio — Garut, Jawa Barat, Indonesia<br />
          Email: <a href="mailto:vyuapp@proton.me" className={linkClass}>vyuapp@proton.me</a>
        </p>
      </>
    ),
  },
];

export default function TosPage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="paper-canvas" aria-hidden="true" />
      <Navbar />

      <article className="pt-36 md:pt-44 pb-24 md:pb-32">
        <div className="max-w-page mx-auto px-6 md:px-10">
          <header className="border-b border-rule pb-8">
            <p className="eyebrow text-clay">Legal — Ketentuan</p>
            <div className="mt-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h1 className="display text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[1.02] text-ink">
                Syarat &amp; Ketentuan
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
