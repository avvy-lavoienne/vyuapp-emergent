import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Syarat & Ketentuan',
  description: 'Syarat dan ketentuan penggunaan layanan VyuApp — ketentuan kerja sama, pembayaran, dan hak kekayaan intelektual.',
  alternates: { canonical: 'https://www.vyuapp.my.id/tos' },
};

export default function TosPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <Navbar />
      <article className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <p className="font-mono text-xs text-[#2997ff] uppercase tracking-[0.15em] font-medium">Legal</p>
          <h1 className="mt-4 text-3xl md:text-4xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.02em]">
            Syarat & Ketentuan
          </h1>
          <p className="mt-3 text-sm text-[#6e6e73]">Terakhir diperbarui: 28 Juni 2026</p>

          <div className="mt-10 space-y-8 text-[#4A4A48] text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[#1d1d1f] mb-3">1. Penerimaan Syarat</h2>
              <p>Dengan mengakses atau menggunakan layanan VyuApp, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak menyetujui bagian apa pun dari syarat ini, mohon untuk tidak menggunakan layanan kami.</p>
              <p className="mt-2">Syarat ini berlaku untuk semua pengguna, klien, dan pihak yang berinteraksi dengan layanan VyuApp, baik melalui situs web, formulir kontak, maupun kerja sama langsung.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1d1d1f] mb-3">2. Layanan</h2>
              <p>VyuApp menyediakan layanan profesional di bidang:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Pengembangan Web</strong> — perancangan, pembuatan, dan pemeliharaan situs web serta aplikasi berbasis web</li>
                <li><strong>Konsultasi Teknologi</strong> — analisis kebutuhan, rekomendasi arsitektur, dan strategi transformasi digital</li>
                <li><strong>Data Intelligence</strong> — pengolahan data, analitik, dan pembuatan dashboard untuk pengambilan keputusan</li>
              </ul>
              <p className="mt-2">Spesifikasi detail setiap proyek dituangkan dalam proposal atau kontrak kerja yang disepakati secara tertulis sebelum pengerjaan dimulai.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1d1d1f] mb-3">3. Hak Kekayaan Intelektual</h2>
              <p>Seluruh kode sumber, desain, dan aset digital yang dikembangkan oleh VyuApp tetap menjadi milik VyuApp kecuali disepakati lain secara tertulis.</p>
              <p className="mt-2">Setelah proyek selesai dan pembayaran diterima secara penuh, klien mendapat lisensi non-eksklusif untuk menggunakan hasil pekerjaan sesuai dengan ruang lingup yang disepakati dalam kontrak kerja.</p>
              <p className="mt-2">Klien tidak diperkenankan menjual, mendistribusikan, atau memberikan akses kepada pihak ketiga atas hasil pekerjaan tanpa izin tertulis dari VyuApp.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1d1d1f] mb-3">4. Pembayaran dan Pembatalan</h2>
              <p>Pembayaran dilakukan sesuai dengan jadwal yang ditetapkan dalam proposal atau kontrak kerja. Biasanya terbagi menjadi:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>DP sebesar 50% saat kontrak ditandatangani</li>
                <li>Pelunasan setelah deliverable akhir diterima dan disetujui</li>
              </ul>
              <p className="mt-2">Pembatalan oleh klien setelah pengerjaan dimulai dikenakan biaya sesuai dengan proporsi pekerjaan yang telah diselesaikan. VyuApp berhak menolak pengembalian dana untuk pekerjaan yang sudah rampung.</p>
              <p className="mt-2">Keterlambatan pembayaran melebihi 14 hari kalender dapat mengakibatkan penghentian sementara layanan hingga pembayaran diterima.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1d1d1f] mb-3">5. Pembatasan Tanggung Jawab</h2>
              <p>VyuApp berusaha memberikan layanan dengan kualitas terbaik, namun tidak memberikan jaminan bahwa layanan akan selalu tanpa gangguan atau bebas dari kesalahan.</p>
              <p className="mt-2">VyuApp tidak bertanggung jawab atas kerugian tidak langsung, kehilangan data, atau kerugian bisnis yang timbul dari penggunaan layanan kami. Tanggung jawab kami terbatas pada nilai kontrak yang telah disepakati.</p>
              <p className="mt-2">Klien bertanggung jawab untuk melakukan backup data secara berkala dan memastikan penggunaan layanan sesuai dengan ketentuan yang berlaku.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1d1d1f] mb-3">6. Privasi</h2>
              <p>Pengumpulan dan penggunaan data pribadi Anda diatur dalam <a href="/privacy" className="text-[#2997ff] hover:text-[#0066cc]">Kebijakan Privasi</a> kami. Dengan menggunakan layanan VyuApp, Anda juga menyetujui ketentuan privasi yang berlaku.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1d1d1f] mb-3">7. Perubahan Syarat</h2>
              <p>VyuApp berhak mengubah atau memperbarui syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Perubahan akan berlaku efektif segera setelah dipublikasikan di halaman ini.</p>
              <p className="mt-2">Disarankan untuk meninjau halaman ini secara berkala. Penggunaan layanan yang berlanjut setelah perubahan merupakan bentuk penerimaan Anda terhadap syarat yang telah diperbarui.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1d1d1f] mb-3">8. Kontak</h2>
              <p>Untuk pertanyaan terkait syarat dan ketentuan ini, silakan hubungi kami:</p>
              <p className="mt-2">VyuApp Studio — Garut, Jawa Barat, Indonesia<br />
              Email: <a href="mailto:vyuapp@proton.me" className="text-[#2997ff] hover:text-[#0066cc]">vyuapp@proton.me</a></p>
            </section>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
