# Hana Knowledge Base — VyuApp Intelligence
# File ini berisi semua pengetahuan yang Hana butuhkan untuk menjawab pertanyaan tentang VyuApp.

## Tentang VyuApp
- **Nama**: VyuApp Studio
- **Lokasi**: Garut, Jawa Barat, Indonesia
- **Founder**: Firman Firdaus (fullstack developer, 4+ tahun pengalaman)
- **Website**: https://www.vyuapp.my.id
- **Email**: vyuapp@proton.me
- **Spesialisasi**: AI-powered web systems, data intelligence, bespoke web engineering
- **Tagline**: "Membangun sistem yang tahan lama"
- **Filosofi**: Setiap proyek diperlakukan sebagai produk yang bertanggung jawab atas keberlangsungan operasionalnya sendiri

## Tim AI (9 Agent)
VyuApp mengoperasikan 9 AI agent 24/7 menggunakan Hermes Agent (Nous Research):
1. **Hikari** — Orchestrator & koordinasi tim
2. **Scout** — Riset & analisis pasar
3. **Scribe** — Penulisan konten & dokumentasi
4. **Dev** — Pengembangan software
5. **QA** — Quality assurance & testing
6. **DevOps** — Infrastructure & deployment
7. **Reach** — Marketing & growth
8. **Lotus** — Administrasi pemerintahan
9. **Guru** — Edukasi & mentoring

## Produk Unggulan

### 1. Sellica — Sistem Evaluasi Kinerja & Administrasi Kependudukan
**Apa itu**: Platform tata kelola administrasi internal untuk instansi pemerintah (Disdukcapil).
**Stack teknis**: 
- Backend: Go (Gin framework) — high performance, 100+ ops/sec
- Frontend: Next.js 15 + TypeScript + Tailwind CSS
- Database: Supabase Postgres (migrasi dari MongoDB)
- Real-time: WebSocket + Event Bus
- AI: RAG (Retrieval Augmented Generation) untuk pencarian dokumen

**Fitur utama**:
- **Scrum Framework Management** — Dasbor sprint dan manajemen tugas real-time
- **Automated Activity Logging** — Catatan aktivitas harian terstruktur
- **AI Pre-Auditor** — Deteksi otomatis ketidaksinkronan laporan (80% pengurangan waktu koreksi)
- **Document Validation** — NLP untuk pengecekan kepatuhan dokumen
- **Duplicate Operator Detection** — Deteksi entri duplikat dengan algoritma canggih
- **SIAK Integration** — Sistem Informasi Administrasi Kependudukan
- **SILPANA Reporting** — Sistem Informasi Pelaporan Pemerintah
- **Data Rekam** — Salah Rekam, Adjudicate Record, Pengajuan Bulanan

**Testing**: 49 tests, 100% passing, 4-layer testing pyramid
**Performa**: 1.5ms/op create, 1.1ms/op get, <100ms p99 latency

### 2. Avalon — Market Intelligence & Price Surveillance
**Apa itu**: Platform Market Intelligence enterprise untuk e-commerce Indonesia (Shopee).
**Stack teknis**:
- Backend: FastAPI (Python) + Supabase Postgres
- Frontend: React 19 + Tailwind + Shadcn UI
- Data Collection: Chrome Extension (Avalon Harvester)
- Theme: Cyberpunk dark mode (#09090b, emerald #34d399)

**Fitur utama**:
- **HET Guard** — Pelacak harga 24/7, alert jika reseller tidak resmi membanting harga
- **Merlin Data Purification** — Algoritma semantic regex untuk membersihkan data pasar
- **Excalibur Engine** — Pipeline data yang menembus enkripsi platform e-commerce
- **Brand Detection** — Deteksi merek otomatis dari data produk
- **Price Analysis** — Analisis harga IDR dengan bracket histogram
- **Shop Leaderboard** — Peringkat toko berdasarkan metrik
- **Discount Radar** — Deteksi diskon dan penghematan
- **Product Explorer** — Pencarian produk dengan filter, sort, pagination, CSV export
- **Client Dashboard** — KPI overview, brand share chart, GMV tracking
- **Admin Console** — Manajemen leads & client (CRUD)

**Chrome Extension (Avalon Harvester)**:
- Inject script ke halaman Shopee
- Extract data produk (harga, merek, rating)
- Deterministic price parsing (IDR × 100000)
- Worker ID system per Chrome profile
- Kirim data ke Supabase via REST API

**Testing**: 35/35 backend tests, 100% frontend tests
**Arsitektur ETL**: Kebal blokir, akurasi data 99.8%

## Layanan VyuApp
1. **Custom Web Application** — Next.js, Go, Python
2. **Data Pipeline & Intelligence Systems** — ETL, real-time processing
3. **Design System & Brand Engineering** — UI/UX premium
4. **AI Agent Integration** — Multi-agent system, chatbot, automation

## Proyek Lainnya

### vyuapp-emergent (Portfolio Website)
- Next.js 16 + Supabase
- Hana AI Chat (customer service agent)
- 9 AI Agent Team Page
- Writer Bot v2 (auto article pipeline)
- 33+ artikel teknis
- RSS feed, sitemap optimized
- Rate limiting, CAPTCHA, security audit

### vyu-estate (Real Estate Website)
- Next.js 15 + TypeScript + React 19
- Virtual Tours, Property Configurator
- Animated sections, Magnetic buttons
- Dark theme, Figma-based design
- SEO-ready, WCAG accessible

### vyu-docs (Documentation SaaS)
- Next.js + Supabase Auth
- QRIS payment integration
- API usage tracking, credit management

## Statistik & Pencapaian
- **28 repository** di GitHub (public + private)
- **33+ artikel teknis** dipublish di vyuapp.my.id
- **9 AI agent** berjalan 24/7
- **49 tests** (Sellica) + **35 tests** (Avalon) = 100% passing
- **36+ commits** dalam 10 hari (Sprint Juni 2026)
- **Google Search Console**: www.vyuapp.my.id terindeks

## Kebijakan Hana
- **Fokus**: Hanya menjawab pertanyaan terkait VyuApp, produk, layanan, dan teknologi web
- **Di luar konteks**: "Itu di luar keahlian saya. Untuk pertanyaan umum, silakan cari di Google atau hubungi kontak yang relevan."
- **Rate limit**: 20 pesan per jam per pengunjung
- **Keamanan**: Tidak boleh share API keys, internal architecture, atau informasi sensitif
- **Bahasa**: Ikuti bahasa pengunjung (ID/EN)
- **Panjang**: Maks 5 kalimat, 200 kata
- **CTA**: Selalu akhiri dengan ajakan kontak (email/formulir)
