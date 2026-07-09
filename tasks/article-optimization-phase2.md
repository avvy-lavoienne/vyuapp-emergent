# Task: VyuApp Article Optimization — Phase 2

## Overview
Setelah cleanup phase 1 selesai (18 articles cleaned from full HTML format, 94K chars saved), perlu dilanjutkan dengan optimization konten dan SEO untuk semua published articles.

## Assigned Agent: **Artoria (Scribe)**

---

## Sub-Task 1: Internal Links Addition
**Priority: Tinggi** | **Estimasi: 30-40 artikel**

### Problem
Banyak artikel belum punya internal links ke artikel lain di VyuApp. Ini buruk untuk:
- SEO (internal linking structure)
- User engagement (breadcrumb navigation)
- Reducing bounce rate

### Action
Untuk setiap published article yang belum punya internal links di konten:
1. Baca konten artikel
2. Identifikasi 2-3 topik relevan dari artikel lain
3. Tambahkan natural internal links di dalam konten (bukan di akhir)
4. Anchor text harus contextual, bukan "klik di sini"

### Contoh
```
Sebelum: "Apache Kafka adalah platform event streaming..."
Sesudah: "Apache Kafka adalah platform event streaming... [Redis Streams](/insights/redis-streams-panduan-lengkap-untuk-developer-indonesia) bisa menjadi alternatif untuk use case tertentu."
```

### Target
- Minimal 2 internal links per artikel
- Links harus relevan secara topikal
- Anchor text natural, bukan forced

---

## Sub-Task 2: Excerpt Optimization
**Priority: Sedang** | **Estimasi: 40 artikel**

### Problem
Beberapa excerpt terlalu pendek (<50 chars) atau terlalu panjang (>200 chars). Excerpt yang baik:
- 120-160 karakter
- Mengandung keyword utama
- Menggambarkan isi artikel secara akurat
- Mengundang klik (curiosity gap)

### Action
Untuk setiap artikel:
1. Review excerpt saat ini
2. Rewrite jika <100 chars atau >200 chars
3. Pastikan mengandung primary keyword
4. Pastikan berbeda dari judul (bukan copy-paste)

### Contoh Excerpt yang Baik
```
❌ Terlalu pendek: "Artikel tentang Redis Streams"
❌ Terlalu panjang: "Redis Streams adalah fitur terbaru dari Redis yang memungkinkan anda untuk melakukan streaming data dengan cara yang sangat mudah dan efisien untuk berbagai macam kebutuhan aplikasi modern anda"
✅ Good: "Redis Streams dari dasar hingga implementasi: commands, consumer groups, use cases, dan best practices untuk production."
```

---

## Sub-Task 3: Tag Optimization
**Priority: Rendah** | **Estimasi: 10 artikel**

### Problem
Beberapa artikel punya tags >5 (max 5 recommended). Tags yang terlalu banyak mengurangi fokus SEO.

### Action
Untuk artikel dengan tags >5:
1. Identifikasi top 3-5 tags yang paling relevan
2. Hapus tags yang terlalu generik atau duplikat
3. Pastikan tags konsisten dengan format lowercase

### Contoh
```
Sebelum: ['ai', 'artificial-intelligence', 'machine-learning', 'deep-learning', 'neural-network', 'python', 'tutorial', 'panduan']
Sesudah: ['ai', 'machine-learning', 'python', 'tutorial', 'neural-network']
```

---

## Sub-Task 4: Draft Articles Review
**Priority: Rendah** | **Estimasi: 19 drafts**

### Problem
Ada 19 draft articles yang belum dipublikasikan. Perlu di-review apakah:
- Layak dipublikasikan (kualitas konten cukup)
- Perlu perbaikan sebelum publish
- Sebaiknya dihapus (outdated/irrelevant)

### Action
1. List semua draft articles
2. Review konten masing-masing
3. Kategorikan: Publish / Fix dulu / Delete
4. Buat rekomendasi untuk setiap draft

### Output
```markdown
## Draft Review Report
### Ready to Publish
- [ ] Artikel A — sudah bagus, tinggal publish
- [ ] Artikel B — sudah bagus, tinggal publish

### Need Fix
- [ ] Artikel C — perlu update data tahun 2026
- [ ] Artikel D — perlu tambah internal links

### Delete
- [ ] Artikel E — outdated, sudah tidak relevan
- [ ] Artikel F — test article, bukan konten nyata
```

---

## Success Criteria
- [ ] Semua published articles punya minimal 2 internal links
- [ ] Semua excerpts 120-160 chars
- [ ] Tags per artikel ≤5
- [ ] Draft articles sudah di-review dan dikategorikan

## Expected Output
1. Updated articles di Supabase (internal links, excerpts, tags)
2. Draft review report (markdown)
3. Summary report untuk Vy

---

## Notes
- Gunakan `supabase` Python client untuk update
- Backup sebelum edit (sudah ada di cleanup-backup-log.json)
- Prioritaskan Sub-Task 1 (internal links) karena impact SEO paling besar
- Jangan edit konten yang sudah bersih — fokus pada metadata dan linking
