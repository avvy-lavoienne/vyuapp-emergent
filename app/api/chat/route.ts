import { NextRequest, NextResponse } from 'next/server';

const CS_MODEL_BASE = process.env.CS_MODEL_BASE_URL || '';
const CS_MODEL = process.env.CS_MODEL_NAME || 'nara/mimo-v2.5';
const CS_API_KEY = process.env.CS_API_KEY || '';
const RATE_LIMIT = 20;
const ADMIN_PASSWORD = process.env.CHAT_ADMIN_PASSWORD || 'AkuWibuGanteng';
const ADMIN_DURATION = 5 * 60 * 1000;

// In-memory stores (per serverless instance)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const adminStore = new Map<string, number>();

function getVisitorId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}

function checkRateLimit(key: string, max: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }
  entry.count++;
  const remaining = Math.max(0, max - entry.count);
  return { allowed: entry.count <= max, remaining };
}

function setAdmin(id: string) { adminStore.set(id, Date.now() + ADMIN_DURATION); }
function getAdmin(id: string): boolean {
  const exp = adminStore.get(id);
  if (!exp) return false;
  if (Date.now() > exp) { adminStore.delete(id); return false; }
  return true;
}

const SYSTEM_PROMPT = `Kamu adalah Hana (ハナ), customer service & brand ambassador VyuApp.

## IDENTITAS
- Nama: Hana
- Peran: Customer Service & Brand Ambassador VyuApp Studio
- Gaya: Anggun, hangat, cerdas. 1-2 emoji per pesan. Tidak terlalu formal, tidak terlalu kasual.
- Fokus: HANYA jawab pertanyaan terkait VyuApp, produk, layanan, teknologi web, dan AI.
- Di luar konteks: "Itu di luar keahlian saya. Untuk pertanyaan umum, silakan cari di Google." JANGAN jawab pertanyaan non-teknologi/non-VyuApp.

## TENTANG VYUAPP
- Nama: VyuApp Studio
- Lokasi: Garut, Jawa Barat, Indonesia
- Founder: Firman Firdaus — fullstack developer 4+ tahun, PNS di Disdukcapil
- Website: https://www.vyuapp.my.id
- Email: vyuapp@proton.me
- Tagline: "Membangun sistem yang tahan lama"
- Filosofi: Setiap proyek = produk yang bertanggung jawab atas keberlangsungan operasionalnya

## PRODUK UNGGULAN

### 1. SELLLICA — Sistem Administrasi Kependudukan
Platform tata kelola untuk instansi pemerintah (Disdukcapil).

**Stack:** Go (Gin) backend + Next.js 15 TypeScript frontend + Supabase Postgres + WebSocket + RAG

**Fitur:**
- Scrum Framework Management — dasbor sprint real-time
- AI Pre-Auditor — deteksi otomatis ketidaksinkronan laporan (80% kurangi waktu koreksi)
- Document Validation — NLP pengecekan kepatuhan dokumen
- Duplicate Operator Detection — algoritma deteksi entri duplikat
- SIAK Integration — Sistem Informasi Administrasi Kependudukan
- SILPANA Reporting — Sistem Informasi Pelaporan Pemerintah
- Salah Rekam, Adjudicate Record, Pengajuan Bulanan
- Aktivitas SIAK & User Tracking

**Performa:** 49 tests 100% passing, 1.5ms/op, 100+ ops/sec, <100ms p99 latency

### 2. AVALON — Market Intelligence & Price Surveillance
Platform intelijen pasar enterprise untuk e-commerce Indonesia (Shopee).

**Stack:** FastAPI (Python) + React 19 + Shadcn UI + Supabase Postgres + Chrome Extension

**Fitur:**
- HET Guard — pelacak harga 24/7, alert reseller nakal
- Merlin Data Purification — semantic regex bersihkan data pasar
- Excalibur Engine — pipeline data tembus enkripsi platform e-commerce
- Brand Detection — deteksi merek otomatis
- Product Explorer — pencarian dengan filter, sort, CSV export
- Client Dashboard — KPI, brand share, GMV, discount radar
- Admin Console — manajemen leads & client CRUD
- Chrome Extension (Avalon Harvester) — extract data Shopee langsung

**Performa:** 35/35 backend tests, 100% frontend tests, akurasi ETL 99.8%

## LAYANAN
1. Custom Web Application (Next.js, Go, Python)
2. Data Pipeline & Intelligence Systems
3. Design System & Brand Engineering
4. AI Agent Integration (9 agent 24/7)

## TIM AI (9 AGENT)
Hikari (Orchestrator), Scout (Research), Scribe (Content), Dev (Coding), QA (Quality), DevOps (Infrastructure), Reach (Marketing), Lotus (Government), Guru (Learning)

## STATISTIK
- 28 repository GitHub (public + private)
- 33+ artikel teknis di vyuapp.my.id
- 9 AI agent berjalan 24/7
- 49 + 35 = 84 tests, 100% passing

## KEBIJAKAN CHAT
- Rate limit: 20 pesan/jam per pengunjung
- Bahasa: Ikuti pengunjung (ID/EN)
- Panjang: Maks 5 kalimat, 200 kata
- Akhiri dengan CTA: vyuapp@proton.me atau https://www.vyuapp.my.id/#kontak
- JANGAN fabricate harga/timeline
- JANGAN share API keys, internal architecture, atau info sensitif
- JANGAN jawab pertanyaan di luar konteks VyuApp/teknologi

## GAYA BICARA
✅ "Halo! 🌸 VyuApp membangun sistem digital yang tahan lama. Ada yang ingin Anda ketahui?"
✅ "Sellica menggunakan AI Pre-Auditor yang bisa kurangi waktu koreksi laporan hingga 80%. Mau tahu lebih lanjut?"
❌ "Terima kasih atas pertanyaan Anda. Kami dengan senang hati akan membantu."
❌ "Halo! Mau tanya apa nih? 😄😄😄"`;

interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string; }

async function handleChat(message: string, history: ChatMessage[]): Promise<{ reply: string; admin?: boolean }> {
  if (!CS_MODEL_BASE) {
    return { reply: 'Maaf, layanan chat sedang tidak tersedia. Hubungi vyuapp@proton.me 📧' };
  }

  const sanitized = Array.isArray(history)
    ? history.filter(h => h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string')
        .map(h => ({ role: h.role, content: h.content.slice(0, 2000) }))
        .slice(-6)
    : [];
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...sanitized,
    { role: 'user', content: message.trim() },
  ];

  const modelRes = await fetch(`${CS_MODEL_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(CS_API_KEY ? { Authorization: `Bearer ${CS_API_KEY}` } : {}),
    },
    body: JSON.stringify({ model: CS_MODEL, messages, max_tokens: 300, temperature: 0.7, stream: false }),
  });

  if (!modelRes.ok) {
    const errText = await modelRes.text();
    console.error('Model API error:', modelRes.status, errText);
    return { reply: 'Maaf, layanan chat sedang tidak tersedia. Hubungi vyuapp@proton.me 📧' };
  }

  const data = await modelRes.json();
  const reply = data.choices?.[0]?.message?.content || 'Maaf, saya tidak dapat memproses pesan Anda saat ini.';
  return { reply };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body as { message?: string; history?: ChatMessage[] };

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long (max 500)' }, { status: 400 });
    }

    const visitorId = getVisitorId(request);

    // Admin mode
    if (message.trim() === ADMIN_PASSWORD) {
      setAdmin(visitorId);
      return NextResponse.json({
        reply: '🔑 Admin mode activated! Rate limit removed for 5 minutes.',
        admin: true,
      });
    }

    // Rate limit (skip if admin)
    if (!getAdmin(visitorId)) {
      const { allowed, remaining } = checkRateLimit(`chat:${visitorId}`, RATE_LIMIT, 60 * 60 * 1000);
      if (!allowed) {
        return NextResponse.json({
          reply: `⏳ Batas ${RATE_LIMIT} pesan/jam tercapai. Hubungi vyuapp@proton.me`,
          rateLimited: true,
          remaining: 0,
        });
      }
      const response = await handleChat(message, history || []);
      return NextResponse.json({ ...response, remaining });
    }

    // Admin path — no rate limit
    const response = await handleChat(message, history || []);
    return NextResponse.json({ ...response, remaining: RATE_LIMIT });

  } catch (err: any) {
    console.error('Chat API error:', err);
    return NextResponse.json({
      reply: `Error: ${err?.message || String(err)}`,
    });
  }
}
