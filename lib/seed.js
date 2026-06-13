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
    slug: 'sellica-mesin-intelijen-pasar',
    title: 'Sellica: Membangun Mesin Intelijen Pasar untuk Trader Aset Digital',
    excerpt: 'Sellica bukan dashboard kripto. Sellica adalah lapisan analitis yang menyatukan data on-chain, sentimen pasar, dan model harga yang dapat dipertanggungjawabkan — dirancang untuk operator serius.',
    cover: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1600&q=80',
    category: 'Produk',
    tags: ['Sellica', 'fintech', 'data'],
    status: 'published',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    content: `<p>Sebagian besar produk "crypto analytics" yang tersedia hari ini menderita masalah yang sama: mereka adalah agregator. Mereka menarik data dari sumber publik, menggambar grafik di atasnya, dan menyebutnya intelijen. Hasilnya adalah lautan dashboard yang terlihat canggih tetapi tidak benar-benar memberi tahu trader apa pun yang tidak dapat mereka lihat di TradingView.</p>
<p>Sellica dirancang dari premis berbeda. Pertanyaan inti yang kami ajukan adalah: <em>data apa yang sebenarnya memprediksi pergerakan, dan bagaimana kami menyajikannya tanpa membebani trader dengan kebisingan?</em></p>
<h2>Arsitektur Tiga Lapis</h2>
<p>Sellica dibangun di atas tiga lapisan yang saling memperkuat:</p>
<ul><li><strong>Lapisan Akuisisi.</strong> Pipeline data real-time dari multiple exchange, on-chain feeds, dan sumber sentimen terverifikasi. Semua dinormalisasi ke skema internal.</li><li><strong>Lapisan Sintesis.</strong> Di sinilah keajaiban terjadi — model statistik dan ML yang dilatih khusus untuk mengidentifikasi divergensi antara harga, volume, dan aktivitas wallet.</li><li><strong>Lapisan Presentasi.</strong> UI yang sengaja dibuat tenang. Tidak ada blink, tidak ada notification spam. Yang muncul di layar adalah sinyal yang sudah lolos beberapa filter kualitas.</li></ul>
<h2>Stack Teknis</h2>
<p>Frontend: Next.js 14 dengan App Router, React Server Components untuk halaman analitik berat. Backend: Node.js + Bun untuk worker pipeline, PostgreSQL dengan TimescaleDB extension untuk time-series data. Infrastruktur dijalankan di Cloudflare Workers untuk edge dan Hetzner untuk compute berat.</p>
<h2>Mengapa Trader Memilih Sellica</h2>
<blockquote>Trader profesional tidak butuh lebih banyak grafik. Mereka butuh konteks yang dapat dipercaya.</blockquote>
<p>Sellica menargetkan segmen yang sering diabaikan: operator yang menjalankan posisi nyata, bukan retail penghibur. Untuk mereka, akurasi data dan kecepatan eksekusi keputusan jauh lebih berharga daripada estetika dashboard.</p>`,
  },
  {
    slug: 'avalon-estetika-sebagai-strategi',
    title: 'The Avalon Project: Estetika Sebagai Strategi Diferensiasi',
    excerpt: 'Mengapa kami menghabiskan ratusan jam pada sebuah design system — dan bagaimana investasi itu mengubah cara klien mempersepsikan kualitas teknis kami sebelum satu baris kode pun ditulis.',
    cover: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1600&q=80',
    category: 'Design Systems',
    tags: ['Avalon', 'design system', 'branding'],
    status: 'published',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    content: `<p>Ada gagasan yang masih bertahan di sebagian industri teknologi: bahwa desain adalah lapisan akhir, kosmetik yang ditempelkan setelah "hal yang sebenarnya" selesai. Avalon Project lahir dari penolakan terhadap gagasan itu.</p>
<h2>Premis Avalon</h2>
<p>Avalon adalah design system internal VyuApp — bahasa visual yang kami terapkan pada setiap produk, setiap landing page, dan setiap dokumen klien. Bukan template, bukan koleksi komponen, tetapi sebuah <strong>tata bahasa</strong>.</p>
<p>Kombinasinya secara sengaja kontras: Swiss minimalism untuk struktur dan hierarki, cyberpunk utility untuk tekstur dan kepadatan informasi. Hasilnya adalah sesuatu yang terasa kontrol, gelap, editorial, dan premium — tanpa pernah jatuh ke dalam klise "agency dark mode".</p>
<h2>Token, Bukan Estetika</h2>
<p>Inti Avalon adalah sistem token: warna, tipografi, spasi, dan animasi semua didefinisikan sebagai variabel yang dapat dikomposisi. Ini bukan latihan akademis — ini berarti tim kami dapat membangun halaman baru dalam jam, bukan hari, sambil tetap mempertahankan konsistensi visual mutlak.</p>
<ul><li>Palet emerald/teal/sky yang dikalibrasi untuk dark surface</li><li>Outfit untuk headline, Inter untuk body, JetBrains Mono untuk overline dan meta</li><li>Animasi CSS murni — tidak ada framer-motion, tidak ada GSAP</li><li>Molekul standar: <code>vyu-card</code>, <code>vyu-overline</code>, <code>vyu-icon-container</code></li></ul>
<h2>Mengapa Klien Membayar Lebih</h2>
<blockquote>Kualitas visual yang terkurasi adalah sinyal paling cepat tentang kualitas teknis yang ada di baliknya.</blockquote>
<p>Ini bukan klaim subjektif. Klien menandatangani kontrak premium karena halaman pertama yang mereka lihat sudah mengkomunikasikan bahwa kami serius pada level detail. Avalon adalah aset paling underrated kami.</p>`,
  },
  {
    slug: 'membangun-data-pipeline-yang-tidak-pernah-tidur',
    title: 'Membangun Data Pipeline yang Tidak Pernah Tidur',
    excerpt: 'Catatan teknis dari pembangunan pipeline ingestion 24/7 yang menggerakkan Sellica — strategi retry, idempotensi, dan kenapa monitoring jauh lebih penting daripada framework.',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80',
    category: 'Engineering',
    tags: ['data', 'pipeline', 'reliability'],
    status: 'draft',
    published_at: null,
    content: `<p>Membangun pipeline data yang berjalan selama 24 jam sehari di lingkungan finansial mengajarkan satu pelajaran brutal: <strong>tidak ada framework yang menyelamatkan kamu dari operasional yang buruk</strong>.</p>
<h2>Idempotensi Adalah Kontrak, Bukan Optimasi</h2>
<p>Setiap worker di pipeline Sellica diasumsikan akan crash, dijalankan dua kali, atau menerima data dalam urutan yang salah. Setiap operasi penulisan ke database harus aman untuk diulang. Ini bukan nice-to-have — ini adalah satu-satunya cara untuk tidur nyenyak.</p>
<h2>Retry yang Cerdas</h2>
<p>Naïve retry adalah racun. Backoff eksponensial dengan jitter, dead-letter queue untuk pesan yang gagal berulang kali, dan circuit breaker untuk downstream services yang melambat — ini adalah dasar, bukan opsi lanjutan.</p>
<h2>Monitoring Sebagai Produk Pertama</h2>
<blockquote>Sistem yang tidak dapat kamu observasi adalah sistem yang sedang menunggu untuk gagal di waktu paling buruk.</blockquote>
<p>Sebelum baris kode bisnis pertama ditulis, kami selalu memasang Prometheus + Grafana, structured logging, dan alert ke channel yang benar-benar dilihat manusia. Observability bukan langkah terakhir — itu adalah langkah pertama.</p>`,
  },
];

export const SEED_PORTFOLIO = [
  {
    slug: 'sellica',
    name: 'Sellica',
    tagline: 'Financial Intelligence Engine',
    description: 'Platform intelijen pasar untuk trader aset digital serius. Menyatukan data on-chain, sentimen, dan model harga ke dalam satu lapisan analitis yang dapat dipertanggungjawabkan.',
    long_description: 'Sellica adalah platform intelijen pasar yang kami bangun untuk trader aset digital yang menjalankan posisi nyata. Berbeda dari mayoritas "crypto dashboard" yang sekadar mengagregasi data publik, Sellica menyatukan akuisisi data real-time, lapisan sintesis statistik, dan presentasi yang sengaja dibuat tenang. Arsitekturnya tiga-lapis: pipeline ingestion 24/7 yang idempoten, mesin sintesis yang menghasilkan sinyal berlapis filter, dan UI yang menyembunyikan kebisingan.',
    features: ['Pipeline data real-time multi-exchange', 'Model statistik divergensi harga / volume', 'UI tenang — sinyal sudah difilter berlapis', 'Observability penuh, uptime 99.9%+'],
    value_props: ['Pipeline data 24/7 dengan retry idempoten', 'Model statistik divergensi harga & volume', 'UI tenang — sinyal pre-filtered berlapis', 'Observability penuh (Prometheus + Grafana)', 'Edge delivery via Cloudflare Workers', 'Skema database time-series teroptimasi'],
    stack: ['Next.js 14', 'PostgreSQL', 'TimescaleDB', 'Cloudflare Workers', 'Bun', 'Hetzner', 'Prometheus'],
    category: 'Produk Utama',
    cover: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1600&q=80',
    href: '/portfolio',
    cta_label: 'Pelajari Sellica',
    position: 1,
    status: 'published',
  },
  {
    slug: 'avalon',
    name: 'The Avalon Project',
    tagline: 'Bespoke Design System',
    description: 'Design system internal VyuApp — Swiss minimalism bertemu cyberpunk utility. Bahasa visual yang kami terapkan pada setiap produk, landing page, dan dokumen klien.',
    long_description: 'Avalon adalah design system internal VyuApp — dan secara tidak sengaja menjadi salah satu aset komersial paling kuat kami. Ini bukan koleksi komponen, bukan template, melainkan sebuah tata bahasa visual yang kami terapkan pada setiap produk, setiap landing page, dan setiap dokumen klien. Kombinasinya sengaja kontras: Swiss minimalism memberi kerangka hierarki yang ketat, sementara cyberpunk utility menyumbangkan kepadatan informasi dan tekstur monospace.',
    features: ['Token-based color, typography, spacing', 'Animasi CSS murni — tanpa framer-motion', 'Molekul reusable: vyu-card, overline, chips', 'Sinyal kualitas teknis sebelum kode pertama'],
    value_props: ['Token system: warna, tipografi, spasi, motion', 'Animasi CSS murni — zero motion library', 'Komposisi cepat: halaman baru dalam jam', 'Konsistensi visual mutlak lintas produk', 'Sinyal kualitas teknis sejak halaman pertama', 'Dapat di-relicense ke klien strategis'],
    stack: ['Tailwind v3', 'Design Tokens', 'CSS Keyframes', 'Outfit', 'Inter', 'JetBrains Mono'],
    category: 'Produk Utama',
    cover: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1600&q=80',
    href: 'https://avalon.vyuapp.my.id/',
    cta_label: 'Jelajahi Avalon',
    position: 2,
    status: 'published',
  },
];
