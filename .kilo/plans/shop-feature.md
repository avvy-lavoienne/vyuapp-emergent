# VyuApp Shop — Implementasi Fitur Toko Template & Source Code Next.js

## Ringkasan

Menambahkan fitur "Shop" (toko) ke VyuApp untuk berjualan template dan source code
Next.js. Pembayaran via QRIS Statis (manual — upload gambar QR, customer transfer,
upload bukti bayar, admin konfirmasi). File deliver via Supabase Storage (private
bucket) dengan download token + license key. Admin panel terintegrasi di admin
utama (`/admin`).

---

## 1. Database — 4 Tabel Baru (`lib/shop.sql`)

### `shop_products`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid PK | gen_random_uuid() |
| name | text NOT NULL | Nama produk |
| slug | text UNIQUE NOT NULL | Slug untuk URL |
| description | text | Deskripsi panjang (HTML) |
| price | numeric(12,0) NOT NULL | Harga dalam IDR |
| type | text DEFAULT 'template' | 'template' atau 'source_code' |
| category | text | Kategori produk |
| cover | text | URL cover image |
| screenshots | text[] | Array URL screenshot |
| tech_stack | text[] | Array tech stack (Next.js, Tailwind...) |
| features | text[] | Array fitur |
| file_path | text | Path di Supabase Storage |
| file_size | bigint | Ukuran file dalam bytes |
| what_you_learn | text[] | Apa yang dipelajari |
| status | text DEFAULT 'active' | 'active' atau 'inactive' |
| position | int DEFAULT 0 | Urutan tampil |
| created_at / updated_at | timestamptz | Auto |

### `orders`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid PK | gen_random_uuid() |
| order_number | text UNIQUE NOT NULL | INV-{YYYYMMDD}-{XXX} |
| customer_name | text NOT NULL | |
| customer_email | text NOT NULL | |
| customer_whatsapp | text | Nomor WA |
| amount | numeric(12,0) | Total bayar |
| payment_method | text DEFAULT 'qris' | |
| payment_status | text DEFAULT 'pending' | pending → paid → confirmed → delivered / cancelled |
| payment_proof | text | URL bukti bayar (screenshot) |
| qris_image_url | text | QRIS yang ditampilkan saat order |
| download_token | text UNIQUE | UUID untuk akses download |
| download_count | int DEFAULT 0 | |
| download_limit | int DEFAULT 5 | |
| license_key | text UNIQUE | VYU-XXXX-XXXX-XXXX |
| notes | text | Catatan customer |
| admin_notes | text | Catatan admin |
| paid_at | timestamptz | |
| confirmed_at | timestamptz | |
| created_at / updated_at | timestamptz | Auto |

### `order_items`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid PK | |
| order_id | uuid FK → orders | |
| product_id | uuid FK → shop_products | |
| product_name | text | Snapshot nama saat beli |
| product_price | numeric(12,0) | Snapshot harga saat beli |
| quantity | int DEFAULT 1 | |
| created_at | timestamptz | |

### `shop_settings` (single row)
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid PK | |
| store_name | text DEFAULT 'VyuApp Store' | |
| store_description | text | |
| qris_image_url | text | Image QRIS statis |
| whatsapp_number | text | Nomor WA admin untuk notifikasi |
| admin_email | text | Email admin |
| created_at / updated_at | timestamptz | |

### RLS Policies
Sama seperti pola existing (`articles` / `portfolio_items`):
- `shop_products`: public SELECT (status='active'), authenticated ALL
- `orders`: authenticated ALL (admin only), customer bisa SELECT own order via token
- `order_items`: authenticated ALL
- `shop_settings`: authenticated ALL

### Trigger auto-updated_at
Sama pattern: `moddatetime` on `shop_products`, `orders`, `shop_settings`.

---

## 2. Public Pages

### `/shop` — `app/shop/page.js`
- Server component (RSC)
- Fetch `shop_products` where status='active', order by position
- Grid layout dengan card: cover, nama, harga (format IDR), badge type, tech stack chips
- Filter tabs: Semua / Template / Source Code
- Search input (client-side filter atau URL search params)
- Desain konsisten dengan halaman utama (vyu-card, vyu-overline, dll)

### `/shop/[slug]` — `app/shop/[slug]/page.js`
- Server component
- Fetch product by slug, 404 jika tidak ditemukan / inactive
- Layout:
  - Header: cover image (hero), nama, kategori badge, harga
  - Deskripsi (render HTML via `dangerouslySetInnerHTML`)
  - Gallery screenshot (carousel atau grid kecil)
  - Tech stack chips
  - Features list (checkmark)
  - "What You'll Learn" list
  - `Beli Sekarang` button → modal/redirect ke order form

### `/shop/order/[id]` — `app/shop/order/[id]/page.js`
- Client component
- Bisa diakses via 2 cara: (1) new order flow, (2) lihat status existing
- **New Order Flow:**
  - Form: Nama, Email, No. WA, Catatan (opsional)
  - Submit → `POST /api/shop/orders` → redirect ke halaman yang sama dengan order ID
- **View Existing Order (after submitted):**
  - Tampilkan: nomor invoice, produk, jumlah, status
  - Jika `pending`: tampilkan QRIS image + nominal → upload bukti bayar
  - Jika `paid`: "Menunggu konfirmasi admin"
  - Jika `confirmed`: tampilkan license key + link download
  - Jika `delivered`: tampilkan license key + link download
  - Jika `cancelled`: alasan pembatalan

### `/shop/download/[token]` — `app/shop/download/[token]/page.js`
- Server component yang validasi token
- Cari order dengan `download_token` = token
- Jika tidak valid → 404
- Jika sudah melebihi `download_limit` → "Download limit exceeded"
- Tampilkan: license key, nama produk, tombol download
- Tombol download → server action `generateDownloadUrl()` → signed URL (expired 24 jam) → file zip

---

## 3. Admin Panel — 3 Komponen Baru

### `components/admin/ShopProductEditor.jsx`
- Mirip `PortfolioEditor` pattern
- Fields:
  - Nama, Slug (auto dari nama)
  - Tipe: dropdown (Template / Source Code)
  - Kategori: input/text
  - Harga (numeric, IDR)
  - Deskripsi: RichEditor (sama seperti artikel)
  - Cover Image: ImageUpload
  - Screenshots: multiple ImageUpload (add/remove)
  - Tech Stack: ArrayEditor
  - Features: ArrayEditor
  - What You'll Learn: ArrayEditor
  - File Upload: FileUpload component (upload zip ke `shop-files` bucket)
  - Status: dropdown (active / inactive)
  - Position: number
- Save → insert/update ke `shop_products`

### `components/admin/OrderManager.jsx`
- List orders, filter by status (pending / paid / confirmed / delivered / cancelled)
- Search by order number, customer name, email
- Tabel columns: Order #, Customer, Product, Amount, Status, Date
- Click row → detail panel:
  - Informasi customer + produk
  - Status timeline
  - QRIS yang ditampilkan
  - Bukti bayar (image preview)
  - Action buttons (berdasarkan status):
    - Jika `paid`: **Konfirmasi Pembayaran** (generate license key + download token)
    - Jika `pending`: **Tandai Dibayar** (manual)
    - Jika `confirmed`: **Tandai Terkirim**
    - **Tolak / Batalkan** (dengan alasan)
  - Kolom admin_notes (textarea)

### `components/admin/ShopSettings.jsx`
- Single form:
  - Store Name
  - Store Description
  - QRIS Image: ImageUpload (upload ke `featured-images`)
  - WhatsApp Number
  - Admin Email
- Save → update row di `shop_settings` (upsert)

### `components/admin/FileUpload.jsx`
- Upload file (zip, maks 100MB) ke bucket `shop-files`
- Mirip `ImageUpload` pattern tapi untuk file zip
- Progress bar, drag-and-drop area
- Return file path + file size

### `components/admin/PaymentProofView.jsx`
- Modal/viewer untuk bukti bayar (image)
- Zoom, compare nominal with order amount

---

## 4. Storage

| Bucket | Visibility | Policy |
|--------|-----------|--------|
| `shop-files` | Private | Authenticated user bisa upload/download. Signed URL untuk customer download. |
| `featured-images` | Public (existing) | Upload bukti bayar (customer) |

### Signed URL Flow
1. File zip diupload admin ke `shop-files/<product-id>/<filename>.zip`
2. Saat admin confirm payment, `download_token` digenerate
3. Saat customer klik download:
   - Validasi token dan download limit
   - `supabase.storage.from('shop-files').createSignedUrl(filePath, 60*60*24)` (24 jam)
   - Increment `download_count`
   - Redirect ke signed URL

---

## 5. API / Server Actions

### `POST /api/shop/orders` (Route Handler)
- Body: `{ product_id, customer_name, customer_email, customer_whatsapp, notes }`
- Validasi: product exists, status active
- Hitung amount (product price x qty)
- Generate order_number: `INV-{YYYYMMDD}-{XXX}` (sequential)
- Insert ke `orders` + `order_items`
- Ambil `qris_image_url` dari `shop_settings`
- Return `{ order_id, order_number }`

### Server Actions (di `app/admin/actions.js` atau file baru)
- `confirmPayment(orderId)`:
  - Generate `download_token` (crypto.randomUUID)
  - Generate `license_key` (format: `VYU-{XXXX}-{XXXX}-{XXXX}`)
  - Update `orders`: status=confirmed, confirmed_at, download_token, license_key
  - RevalidatePath
- `cancelOrder(orderId, reason)`:
  - Update status=cancelled, admin_notes=reason
  - RevalidatePath
- `markAsDelivered(orderId)`:
  - Update status=delivered
- `generateDownloadUrl(orderId)`:
  - Validasi token, limit
  - Create signed URL
  - Increment download_count
  - Return signed URL

### Data Helpers (`lib/shop.js`)
- `getActiveProducts()` — SELECT published products
- `getProductBySlug(slug)` — single product
- `getOrderById(id)` — single order
- `getOrderByToken(token)` — order by download token
- `getShopSettings()` — single row settings
- `generateOrderNumber()` — INV-{date}-{seq}

---

## 6. Modifikasi File Existing

### `app/admin/AdminClient.jsx`
- **Import** komponen shop dari `components/admin/`
- **State**: tambah `tab: 'shop'` dan `shopView: { section: 'products' | 'orders' | 'settings', mode: 'list' | 'edit', item: null }`
- **Sidebar**: tambah section "Shop" dengan submenu:
  - Products (daftar)
  - + New Product
  - Orders
  - Settings
  - Divider
- **Render area**: switch case untuk Shop section
- **Refresh function**: tambah fetch `shop_products` dan `orders`

### `components/Navbar.jsx`
- Tambah `{ href: '/shop', label: 'Shop' }` ke `LINKS`

### `SUPABASE_SETUP.sql`
- Append schema untuk 4 tabel baru + RLS policies + triggers

### `app/api/admin/setup/route.js`
- Tambah seed: 2-3 produk contoh
- Tambah seed: shop_settings (default)

### `next.config.js`
- Mungkin perlu update `remotePatterns` untuk bucket `shop-files`

### `proxy.js`
- Tidak perlu perubahan (shop path public, tidak terproteksi middleware admin)

---

## 7. Struktur File Lengkap

```
lib/
  shop.sql                     → Schema migrasi (BARU)
  shop.js                      → Server data helpers (BARU)

components/
  admin/
    ShopProductEditor.jsx      → CRUD produk (BARU)
    OrderManager.jsx           → Manajemen order (BARU)
    ShopSettings.jsx           → Pengaturan toko (BARU)
    FileUpload.jsx             → Upload file zip (BARU)
    PaymentProofView.jsx       → Preview bukti bayar (BARU)

app/
  shop/
    page.js                    → Daftar produk (BARU)
    [slug]/
      page.js                  → Detail produk (BARU)
    order/
      [id]/
        page.js                → Order flow (BARU)
    download/
      [token]/
        page.js                → Download page (BARU)
  api/
    shop/
      orders/
        route.js               → API create order (BARU)
  admin/
    AdminClient.jsx            → Tambah tab Shop (EDIT)
    actions.js                 → Server actions shop (BARU)

components/
  Navbar.jsx                   → Tambah link Shop (EDIT)
SUPABASE_SETUP.sql             → Append schema baru (EDIT)
```

---

## 8. Urutan Implementasi

1. **Schema DB**: Buat `lib/shop.sql`, update `SUPABASE_SETUP.sql`
2. **Data layer**: Buat `lib/shop.js`
3. **Storage**: Setup bucket `shop-files`, update `next.config.js`
4. **Components**: Buat `FileUpload.jsx`, `PaymentProofView.jsx`
5. **Admin**: Buat `ShopProductEditor.jsx`, `OrderManager.jsx`, `ShopSettings.jsx`
6. **Admin integration**: Edit `AdminClient.jsx` + buat server actions `app/admin/actions.js`
7. **API**: Buat `app/api/shop/orders/route.js`
8. **Public pages**: `/shop`, `/shop/[slug]`, `/shop/order/[id]`, `/shop/download/[token]`
9. **Navbar**: Edit `Navbar.jsx`, add "Shop" link
10. **Seed**: Update `app/api/admin/setup/route.js` dengan seed produk

---

## Catatan Teknis

- **Desain**: Konsisten dengan existing — pakai `vyu-card`, `vyu-overline`, `vyu-btn-primary`, dark theme
- **Format harga**: `new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })`
- **Order number format**: `INV-20260610-001` (sequential per hari)
- **License key format**: `VYU-{4 chars}-{4 chars}-{4 chars}` (uppercase alfanumerik)
- **Download limit**: 5x per token, signed URL expired 24 jam
- **Error handling**: Sama pattern dengan existing (toast notification di admin)
- **Loading states**: Skeleton/spinner konsisten dengan existing
