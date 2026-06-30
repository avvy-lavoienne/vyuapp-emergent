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

function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= max;
}

function setAdmin(id: string) { adminStore.set(id, Date.now() + ADMIN_DURATION); }
function getAdmin(id: string): boolean {
  const exp = adminStore.get(id);
  if (!exp) return false;
  if (Date.now() > exp) { adminStore.delete(id); return false; }
  return true;
}

const SYSTEM_PROMPT = `Kamu adalah Hana, customer service VyuApp yang elegan dan cerdas.

Siapa Hana:
- Nama: Hana (ハナ)
- Peran: Customer Service & Brand Ambassador VyuApp
- Gaya bicara: Tenang, jelas, tidak berlebihan. 1-2 emoji per pesan.

Tentang VyuApp:
- Studio rekayasa web bespoke dari Garut, Jawa Barat
- Founder: Firman Firdaus (fullstack developer, 4+ tahun)
- Spesialis: AI-powered web systems & data intelligence
- 9 AI agent yang bekerja 24/7

Produk:
1. Sellica — Sistem evaluasi kinerja berbasis Scrum + AI
2. Avalon — Market intelligence untuk e-commerce enterprise

Kebijakan:
- Bahasa: Ikuti bahasa pengunjung (ID/EN)
- Panjang: Maks 5 kalimat, 200 kata
- Akhiri dengan CTA (kontak/email)
- JANGAN fabricate harga/timeline
- Email: vyuapp@proton.me | Kontak: https://www.vyuapp.my.id/#kontak`;

interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string; }

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
      if (!checkRateLimit(`chat:${visitorId}`, RATE_LIMIT, 60 * 60 * 1000)) {
        return NextResponse.json({
          reply: `⏳ Batas ${RATE_LIMIT} pesan/jam tercapai. Hubungi vyuapp@proton.me`,
          rateLimited: true,
        });
      }
    }

    // If no model configured
    if (!CS_MODEL_BASE) {
      return NextResponse.json({
        reply: 'Maaf, layanan chat sedang tidak tersedia. Hubungi vyuapp@proton.me 📧',
      });
    }

    // Build messages
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

    // Call model
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
      return NextResponse.json({
        reply: 'Maaf, layanan chat sedang tidak tersedia. Hubungi vyuapp@proton.me 📧',
      });
    }

    const data = await modelRes.json();
    const reply = data.choices?.[0]?.message?.content || 'Maaf, saya tidak dapat memproses pesan Anda saat ini.';
    return NextResponse.json({ reply });

  } catch (err: any) {
    console.error('Chat API error:', err);
    return NextResponse.json({
      reply: `Error: ${err?.message || String(err)}`,
    });
  }
}
