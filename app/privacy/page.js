import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan privasi VyuApp — bagaimana kami melindungi data Anda.',
  alternates: { canonical: 'https://www.vyuapp.my.id/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-[#0F0F10]">
      <Navbar />
      <article className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <p className="font-mono text-xs text-[#6D5BA0] dark:text-[#8B7BC4] uppercase tracking-[0.15em] font-medium">Legal</p>
          <h1 className="mt-4 text-3xl md:text-4xl font-sans font-semibold text-[#141413] dark:text-[#F0F0F0] tracking-[-0.02em]">
            Kebijakan Privasi
          </h1>
          <p className="mt-3 text-sm text-[#636360] dark:text-[#8A8A8A]">Terakhir diperbarui: 28 Juni 2026</p>

          <div className="mt-10 space-y-8 text-[#4A4A48] dark:text-[#B0B0B0] text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[#141413] dark:text-[#F0F0F0] mb-3">1. Pengumpulan Informasi</h2>
              <p>VyuApp mengumpulkan informasi yang Anda berikan secara langsung melalui formulir kontak dan formulir discovery, termasuk nama, alamat email, nama perusahaan, dan pesan yang dikirimkan.</p>
              <p className="mt-2">Kami juga mengumpulkan data teknis secara otomatis seperti alamat IP, jenis browser, dan halaman yang dikunjungi untuk keperluan analisis dan peningkatan layanan.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#141413] dark:text-[#F0F0F0] mb-3">2. Penggunaan Informasi</h2>
              <p>Informasi yang dikumpulkan digunakan untuk:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Merespons pertanyaan dan permintaan kolaborasi Anda</li>
                <li>Mengirimkan proposal dan penawaran layanan</li>
                <li>Meningkatkan kualitas situs dan layanan kami</li>
                <li>Menganalisis trafik dan perilaku pengunjung</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#141413] dark:text-[#F0F0F0] mb-3">3. Penyimpanan Data</h2>
              <p>Data Anda disimpan di server Supabase yang aman dan dienkripsi. Kami tidak menjual, menukar, atau mentransfer informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#141413] dark:text-[#F0F0F0] mb-3">4. Cookie</h2>
              <p>Situs ini menggunakan cookie yang diperlukan untuk autentikasi admin dan preferensi sesi. Kami juga menggunakan Google AdSense yang dapat menggunakan cookie untuk personalisasi iklan.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#141413] dark:text-[#F0F0F0] mb-3">5. Hak Anda</h2>
              <p>Anda berhak untuk meminta akses, perubahan, atau penghapusan data pribadi Anda. Untuk pertanyaan terkait privasi, hubungi kami di <a href="mailto:vyuapp@proton.me" className="text-[#6D5BA0] dark:text-[#8B7BC4] hover:text-[#574886] dark:hover:text-[#6D5BA0]">vyuapp@proton.me</a>.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#141413] dark:text-[#F0F0F0] mb-3">6. Kontak</h2>
              <p>VyuApp Studio — Garut, Jawa Barat, Indonesia<br />
              Email: <a href="mailto:vyuapp@proton.me" className="text-[#6D5BA0] dark:text-[#8B7BC4] hover:text-[#574886] dark:hover:text-[#6D5BA0]">vyuapp@proton.me</a></p>
            </section>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
