import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Halaman Tidak Ditemukan',
  description: 'Halaman yang Anda cari tidak ditemukan.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000]">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
        <p className="font-mono text-8xl font-bold text-[#2997ff] dark:text-[#5BA3FF]">404</p>
        <h1 className="mt-6 text-2xl font-sans font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-3 text-[#6e6e73] dark:text-[#86868b] max-w-md">
          Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak tersedia.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#1d1d1f] dark:bg-[#f5f5f7] text-[#f5f5f7] dark:text-[#1d1d1f] rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
        >
          ← Kembali ke Beranda
        </Link>
      </div>
      <Footer />
    </main>
  );
}
