# Panduan Desain Landing Page Elegan ala Anthropic

> **Tujuan**: Membuat landing page yang terasa *premium, sophisticated, minimalis, dan trustworthy* — persis seperti vibe anthropic.com (perusahaan di balik Claude AI).  
> Filosofi utama: **"Less, but better"** — banyak whitespace, tipografi yang sempurna, warna yang terkendali, dan perhatian terhadap detail kecil.

---

## 1. Filosofi & Prinsip Desain

Anthropic berhasil menciptakan kesan **elegan dan berwibawa** karena:

- **Restraint yang kuat** — tidak ada warna mencolok, gradient berlebihan, atau elemen berisik.
- **Whitespacing yang generous** — ruang kosong adalah elemen desain.
- **Tipografi sebagai bintang utama** — hierarki yang sangat jelas dan readable.
- **Konsistensi absolut** — setiap detail (spacing, radius, shadow, hover) mengikuti sistem yang ketat.
- **Fokus pada kepercayaan** — desain yang tenang, profesional, dan "serius tapi tidak kaku".

**Aturan Emas**:
> Jika ragu, **kurangi**. Elegansi lahir dari penyederhanaan yang disengaja.

---

## 2. Color Palette (Inspirasi Anthropic)

Gunakan palet netral hangat dengan **satu aksen coral/terracotta** yang khas.

### Palet Utama (Light Mode — Recommended)

```css
/* CSS Variables */
:root {
  /* Background */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8F7F4;      /* Warm off-white (mirip Pampas #F4F3EE) */
  --bg-tertiary: #F4F3EE;

  /* Text */
  --text-primary: #141413;      /* Near-black (Slate Dark) */
  --text-secondary: #4A4A48;
  --text-muted: #6B6B68;

  /* Accent — Signature Anthropic */
  --accent: #C15F3C;            /* Crail / Clay — warm terracotta */
  --accent-hover: #A94E30;      /* Ember */
  --accent-light: #E8C4B3;

  /* Borders & Dividers */
  --border: #E5E4E0;
  --border-strong: #D1D0C9;
}
```

### Palet Dark Mode (Opsional, jika dibutuhkan)

```css
--bg-primary: #0F0F0E;
--text-primary: #F4F3EE;
--accent: #D97757;            /* Sedikit lebih terang di dark */
```

**Catatan Warna**:
- Hindari warna "techy" seperti ungu neon atau biru elektrik.
- Gunakan accent **hanya** untuk CTA utama, link penting, dan highlight.
- Semua elemen lain tetap netral.

---

## 3. Typography

Anthropic menggunakan kombinasi **sans-serif modern** + **serif** untuk kesan premium.

### Rekomendasi Font Stack

```css
/* Headings */
font-family: "Instrument Serif", "Playfair Display", Georgia, serif;

/* Body & UI */
font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

**Alternatif bagus (gratis)**:
- **Headings**: Instrument Serif, EB Garamond, Cormorant, Playfair Display
- **Body**: Inter, Satoshi, SF Pro, Neue Haas Grotesk, Helvetica Neue

### Skala Tipografi (Tailwind + Custom)

```css
/* Contoh di Tailwind */
h1, .display { 
  font-size: 4.5rem;      /* ~72px */
  line-height: 1.05;
  font-weight: 600;
  letter-spacing: -0.025em;
}

h2 { 
  font-size: 3rem;        /* 48px */
  line-height: 1.1;
  font-weight: 600;
}

h3 { 
  font-size: 1.875rem;    /* 30px */
  line-height: 1.2;
  font-weight: 600;
}

p, .body {
  font-size: 1.125rem;    /* 18px */
  line-height: 1.7;
  font-weight: 400;
}

.small {
  font-size: 0.875rem;
  line-height: 1.6;
}
```

**Prinsip Tipografi Anthropic**:
- Heading besar dengan **negative letter-spacing** ringan.
- Body text **sangat readable** (line-height long).
- Jangan gunakan font weight terlalu banyak (maksimal 3-4 weight).

---

## 4. Layout & Spacing System

### Container
- `max-width: 1280px` atau `1440px`
- Padding horizontal: `px-6` (mobile) → `px-8` atau `px-12` (desktop)

### Spacing Scale (sangat penting!)

Gunakan spacing yang **konsisten dan generous**:

```css
/* Rekomendasi */
section { padding-top: 6rem; padding-bottom: 6rem; }     /* py-24 */
.hero { padding-top: 8rem; padding-bottom: 6rem; }

.gap-sm { gap: 1rem; }
.gap-md { gap: 1.5rem; }
.gap-lg { gap: 2.5rem; }
.gap-xl { gap: 4rem; }
```

**Aturan**:
- Section spacing minimal **6rem** (bisa 8rem untuk hero).
- Card padding: **2.5rem – 3rem**
- Jangan takut memberi ruang kosong.

---

## 5. Komponen Utama

### Navbar
- Logo kiri (font weight 600-700)
- Menu tengah atau kanan (clean links)
- Sticky dengan `backdrop-blur` ringan + border bawah tipis
- Height: ~72-80px
- Hover link: subtle color change ke accent

### Hero Section
**Struktur ideal**:
1. Badge kecil di atas (opsional)
2. Headline besar (centered atau left-aligned)
3. Subheadline (max-width ~65ch)
4. Dual CTA:
   - Primary: Button accent besar (`rounded-2xl` atau `rounded-3xl`)
   - Secondary: Ghost button atau text link
5. Visual pendukung (gambar/ilustrasi minimal) di bawah atau samping

**Contoh Headline Style**:
> "AI yang dibangun dengan prinsip keselamatan di garis depan."

### Button
```css
/* Primary Button */
.btn-primary {
  background-color: var(--accent);
  color: white;
  padding: 1rem 2.25rem;
  border-radius: 9999px;        /* pill shape atau rounded-3xl */
  font-weight: 600;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  background-color: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Secondary */
.btn-secondary {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-strong);
}
```

### Card
- Background: putih atau `bg-secondary`
- Border: tipis atau tanpa border (hanya shadow sangat subtle)
- Padding: 2.5rem+
- Hover: `lift` ringan + border accent jika relevan
- Radius: `rounded-3xl` atau `rounded-2xl`

### Section Header
Setiap section baru dimulai dengan:
- Headline + subheadline pendek
- Banyak ruang di atas dan bawah

---

## 6. Animasi & Micro-interaction

**Gaya Anthropic**: Sangat subtle, hampir tidak terasa "animasi".

Rekomendasi:
- `transition-all duration-200` atau `300`
- Hover pada card/button: `translateY(-2px)` + shadow lebih dalam
- Scroll reveal: fade + `translateY(20px)` (gunakan Framer Motion atau AOS)
- Jangan gunakan:
  - Animasi bouncing
  - Gradient yang bergerak
  - Parallax berlebihan
  - Loading spinner yang mencolok

---

## 7. Panduan Section per Section (Landing Page)

### 1. Navbar
Clean, minimal, logo + 4-5 menu items + tombol "Talk to Claude" / primary CTA.

### 2. Hero
- Centered layout paling elegan
- Headline 1 baris atau 2 baris maksimal
- Subheadline panjang tapi tetap readable
- Visual: bisa foto orang, abstract 3D, atau ilustrasi minimal (hindari stock photo generik)

### 3. Trust / Social Proof
- Logo perusahaan (grayscale, hover color)
- Atau angka statistik besar dengan label kecil

### 4. Features
- Grid 3 kolom (atau 2 di mobile)
- Setiap fitur: icon minimal + judul + deskripsi 2-3 baris
- Hindari card dengan shadow berat

### 5. How it Works / Process
- Bisa numbered steps horizontal atau vertical timeline yang sangat clean
- Atau 3-4 langkah dengan nomor besar

### 6. Testimonials
- Quote besar
- Nama + jabatan + foto kecil (opsional)
- Bisa carousel minimal atau grid statis

### 7. Final CTA
- Background sedikit berbeda (`bg-secondary`)
- Headline kuat + 1-2 tombol besar

### 8. Footer
- Sangat minimal
- Logo + copyright + link penting
- Bisa 2 kolom atau centered

---

## 8. Rekomendasi Teknis (untuk Developer)

### Stack yang Direkomendasikan
- **Tailwind CSS** + custom design tokens
- **shadcn/ui** atau komponen custom (jangan pakai library terlalu "berat")
- **Framer Motion** (untuk animasi halus)
- **Next.js** atau **Astro** (performa tinggi)

### Struktur File yang Baik
```
styles/
  design-tokens.css     ← semua CSS variables di sini
components/
  Button.tsx
  Card.tsx
  Section.tsx
```

### Checklist Sebelum Launch
- [ ] Contrast ratio minimal AA (idealnya AAA)
- [ ] Semua gambar di-optimize
- [ ] Font loading optimal (self-host atau `font-display: swap`)
- [ ] Responsive test di mobile + tablet
- [ ] Loading state & skeleton (jika ada data fetching)
- [ ] Fokus state keyboard yang jelas

---

## 9. Kesalahan yang Harus Dihindari

| Kesalahan                        | Kenapa Buruk untuk Elegansi          | Solusi                              |
|----------------------------------|--------------------------------------|-------------------------------------|
| Terlalu banyak warna             | Terasa murahan                       | Maksimal 1 accent color             |
| Card dengan shadow berat         | Visual noise                         | Shadow sangat subtle atau tanpa     |
| Font size terlalu kecil          | Tidak premium                        | Body minimal 18px                   |
| Spacing sempit                   | Terasa crowded                       | Tambah whitespace                   |
| Gradient pelangi / mesh          | Tidak sesuai vibe Anthropic          | Hindari                             |
| Animasi berlebihan               | Mengganggu                           | Kurangi, buat lebih subtle          |
| Tombol terlalu banyak style      | Tidak konsisten                      | Hanya 2-3 variant button            |

---

## 10. Bonus: Cara Mencapai "Feeling" Anthropic

1. **Ambil screenshot** anthropic.com dan pelajari setiap 50px spacing-nya.
2. **Gunakan 1 accent color** secara konsisten di seluruh halaman.
3. **Test di grayscale** — jika masih terbaca bagus, berarti desainnya kuat.
4. **Baca ulang copy** — desain elegan butuh copy yang juga elegan dan ringkas.
5. **Iterasi dengan "kurangi 20%"** — setiap kali revisi, coba hilangkan satu elemen.

---

**Catatan Akhir**

Desain ala Anthropic bukan tentang meniru persis, tapi tentang **meniru filosofi**: kesederhanaan yang disengaja, perhatian pada detail, dan rasa hormat kepada pengunjung.

Jika kamu ingin, saya bisa bantu:
- Membuat komponen Tailwind siap pakai berdasarkan panduan ini
- Membuat contoh full landing page HTML/Tailwind
- Membuat design system sederhana dalam bentuk Figma atau code

Silakan beri tahu bagian mana yang ingin kamu kerjakan dulu!

---

*Panduan ini dibuat berdasarkan analisis visual anthropic.com dan prinsip desain yang membuatnya terasa premium.*