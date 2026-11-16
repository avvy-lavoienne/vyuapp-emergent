// Seed data used by /api/admin/setup. Server-only.

export const SEED_ARTICLES_FOR_SUPABASE = [
  {
    slug: 'studio-kecil-mengalahkan-agensi-besar',
    title: 'Mengapa Studio Kecil Mengalahkan Agensi Besar di Era Rekayasa Presisi',
    excerpt: 'Di tengah komoditisasi template dan pabrik kode, studio independen seperti VyuApp justru menemukan keunggulan struktural — bukan meskipun ukurannya kecil, tetapi karena ukurannya kecil.',
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80',
    category: 'Engineering Philosophy',
    tags: ['studio', 'engineering', 'craftsmanship'],
    status: 'published',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    content: `<p>Dalam dekade terakhir, industri pengembangan web mengalami sesuatu yang jarang dibicarakan secara terbuka: <strong>komoditisasi</strong>. Page builder, marketplace template, dan generator AI telah menurunkan ambang masuk hingga titik di mana "membuat website" tidak lagi memerlukan keahlian — hanya kesediaan untuk menyusun kembali komponen yang telah dibuat orang lain.</p>
<p>Bagi klien yang mencari kehadiran online dasar, ini adalah kabar baik. Tetapi bagi perusahaan, lembaga keuangan, dan operator yang sistem digitalnya benar-benar memengaruhi pendapatan, situasinya berbeda. Mereka tidak membutuhkan situs — mereka membutuhkan <strong>infrastruktur</strong>.</p>
<h2>Asimetri Keunggulan Studio Independen</h2>
<p>Agensi besar memiliki satu masalah struktural yang tidak dapat mereka selesaikan: mereka harus menjual jam. Model bisnis mereka memaksa mereka untuk memperlakukan setiap proyek sebagai unit yang dapat ditagih, bukan sebagai produk yang harus berfungsi.</p>
<p>Studio independen — terutama yang dijalankan oleh insinyur, bukan oleh manajer akun — beroperasi dengan logika berbeda. Mereka menjual <em>hasil</em>, dan reputasi mereka secara langsung terikat pada apakah hasil itu benar-benar bekerja di produksi.</p>
<blockquote>Kami tidak menjual kode mentah. Kami menjual sistem yang bertanggung jawab atas keberlangsungan operasionalnya sendiri.</blockquote>
<h2>Tiga Keunggulan Struktural</h2>
<ul><li><strong>Kontinuitas kognitif.</strong> Insinyur yang sama membangun, men-deploy, dan memelihara. Tidak ada handoff yang merusak konteks.</li><li><strong>Stack yang dikurasi.</strong> Next.js, Supabase, PostgreSQL — bukan karena tren, tetapi karena terbukti di produksi nyata.</li><li><strong>Akuntabilitas penuh.</strong> Ketika sistem gagal pukul 02.00, orang yang menjawab adalah orang yang menulis kodenya.</li></ul>
<h2>Apa yang Berubah di 2026</h2>
<p>Kami memprediksi bahwa pasar akan terbelah lebih tajam antara <strong>komoditas otomatis</strong> di satu sisi dan <strong>rekayasa bespoke yang dapat dipertanggungjawabkan</strong> di sisi lain. Lapisan tengah — agensi generik dengan tim besar dan margin tipis — akan menjadi yang paling rentan.</p>
<p>Bagi VyuApp, ini bukan ancaman. Ini adalah konfirmasi tesis pendiri kami: bahwa di setiap pasar yang matang, premium kembali pada keahlian.</p>`,
  },
  {
    slug: 'membangun-data-pipeline-yang-tidak-pernah-tidur',
    title: 'Membangun Data Pipeline yang Tidak Pernah Tidur',
    excerpt: 'Catatan teknis dari pembangunan pipeline ingestion 24/7 — strategi retry, idempotensi, dan kenapa monitoring jauh lebih penting daripada framework.',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80',
    category: 'Engineering',
    tags: ['data', 'pipeline', 'reliability'],
    status: 'draft',
    published_at: null,
    content: `<p>Membangun pipeline data yang berjalan selama 24 jam sehari di lingkungan finansial mengajarkan satu pelajaran brutal: <strong>tidak ada framework yang menyelamatkan kamu dari operasional yang buruk</strong>.</p>
<h2>Idempotensi Adalah Kontrak, Bukan Optimasi</h2>
<p>Setiap worker di pipeline diasumsikan akan crash, dijalankan dua kali, atau menerima data dalam urutan yang salah. Setiap operasi penulisan ke database harus aman untuk diulang. Ini bukan nice-to-have — ini adalah satu-satunya cara untuk tidur nyenyak.</p>
<h2>Retry yang Cerdas</h2>
<p>Naïve retry adalah racun. Backoff eksponensial dengan jitter, dead-letter queue untuk pesan yang gagal berulang kali, dan circuit breaker untuk downstream services yang melambat — ini adalah dasar, bukan opsi lanjutan.</p>
<h2>Monitoring Sebagai Produk Pertama</h2>
<blockquote>Sistem yang tidak dapat kamu observasi adalah sistem yang sedang menunggu untuk gagal di waktu paling buruk.</blockquote>
<p>Sebelum baris kode bisnis pertama ditulis, kami selalu memasang Prometheus + Grafana, structured logging, dan alert ke channel yang benar-benar dilihat manusia. Observability bukan langkah terakhir — itu adalah langkah pertama.</p>`,
  },
];

export const SEED_PORTFOLIO = [
  {
    slug: 'tafsha-farm',
    name: 'Tafsha Farm',
    tagline: 'Manajemen Kebun & Pencatatan Budidaya',
    description: 'Aplikasi web untuk mencatat siklus tanam, rawat, dan panen di tiap petak kebun. Dibangun sebagai PWA offline-first dengan alur kerja mobile-first.',
    long_description: 'Tafsha Farm adalah aplikasi manajemen kebun untuk mencatat seluruh siklus budidaya — dari tanam, rawat, hingga panen — pada beberapa petak lahan. Setiap batch tanaman memiliki jadwal perawatan yang diturunkan otomatis menjadi tugas dan entri kalender, sehingga pekerjaan harian tidak bergantung pada ingatan. Aplikasi juga mencatat hasil panen, penjualan bibit, dan stok sarana produksi, dengan ringkasan komoditas per petak. Dibangun sebagai PWA yang dapat dipasang di perangkat dan tetap berfungsi saat koneksi terbatas. Proyek ini masih berjalan dan terus dikembangkan secara aktif.',
    features: ['Batch budidaya per petak', 'Otomasi tugas & kalender perawatan', 'Pencatatan panen, bibit, dan sarana', 'PWA offline-capable, mobile-first'],
    value_props: ['Batch budidaya — catat tanam, jadwal rawat, dan siklus panen per petak', 'Otomasi tugas & kalender — pengingat perawatan dibuat otomatis dari siklus tanaman', 'Pencatatan hasil & sarana — log panen, bibit/penjualan, dan stok sarana', 'PWA terpasang — bisa dipakai offline, mobile-first, pengalaman seperti aplikasi'],
    stack: ['Next.js', 'TypeScript', 'Supabase Postgres', 'Tailwind CSS', 'PWA'],
    category: 'Agritech',
    cover: '',
    href: 'https://tafsha.vyuapp.my.id/',
    cta_label: 'Buka Tafsha Farm',
    position: 1,
    status: 'published',
  },
];
