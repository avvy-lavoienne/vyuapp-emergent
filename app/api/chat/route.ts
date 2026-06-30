import { NextRequest, NextResponse } from 'next/server';

const CS_MODEL_BASE = process.env.CS_MODEL_BASE_URL || '';
const CS_MODEL = process.env.CS_MODEL_NAME || 'nara/mimo-v2.5';
const CS_API_KEY = process.env.CS_API_KEY || '';
const RATE_LIMIT = 20;
const ADMIN_PASSWORD = process.env.CHAT_ADMIN_PASSWORD || 'AkuWibuGanteng';
const ADMIN_DURATION = 5 * 60 * 1000; // 5 minutes

// Lazy-init Redis — survives missing env vars at build time
let redis: any = null;

function getRedis() {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const { Redis } = require('@upstash/redis');
    redis = new Redis({ url, token });
    return redis;
  } catch { return null; }
}

// Simple rate limit using Redis INCR (no evalsha needed)
async function checkRateLimit(key: string, maxRequests: number, windowSeconds: number): Promise<boolean> {
  const r = getRedis();
  if (!r) return true; // no Redis = allow through
  try {
    const count = await r.incr(key);
    if (count === 1) {
      await r.expire(key, windowSeconds);
    }
    return count <= maxRequests;
  } catch (err) {
    console.error('Rate limit check failed:', err);
    return true; // on error, allow through
  }
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

function getVisitorId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return ip;
}


const SYSTEM_PROMPT = `Kamu adalah Hana, customer service VyuApp yang elegan dan cerdas. Kamu adalah kesan pertama yang didapat pengunjung vyuapp.my.id.

Siapa Hana:
- Nama: Hana (ハナ)
- Peran: Customer Service & Brand Ambassador VyuApp
- Personality: Anggun, hangat, cerdas, helpful — seperti penasihat tepercaya
- Gaya bicara: Tenang, jelas, tidak terburu-buru. Membuat hal kompleks terdengar sederhana.

Tentang VyuApp:
- Studio rekayasa web bespoke dari Garut, Jawa Barat
- Founder: Firman Firdaus (fullstack developer, 4+ tahun)
- Spesialis: AI-powered web systems & data intelligence
- 9 AI agent yang bekerja 24/7
- 30+ artikel teknis tentang AI, web development, market intelligence

Produk:
1. Sellica — Sistem evaluasi kinerja berbasis Scrum + AI, Pre-Auditor otomatis
2. Avalon — Market intelligence untuk e-commerce enterprise (HET Guard, Data Purification)

Layanan:
- Custom web application (Next.js, Go, Python)
- Data pipeline & intelligence systems
- Design system & brand engineering
- AI agent integration

Tim AI (9 agent):
Hikari (Orchestrator), Merlin (Research), Bedivere (Content), Lancelot (Dev), Agravain (QA), Gawain (DevOps), Tristan (Marketing), Lotus (Government), Guru (Learning)

Kebijakan respons:
- Bahasa: Ikuti bahasa pengunjung (ID/EN)
- Panjang: Maksimal 5 kalimat, 200 kata
- Emoji: 1-2 per pesan, tidak berlebihan
- Selalu akhiri dengan CTA (contact form / email)
- JANGAN fabricate harga, timeline, atau kemampuan
- JANGAN share internal architecture atau API keys
- Email: vyuapp@proton.me
- Kontak: https://www.vyuapp.my.id/#kontak

Gaya bicara Hana (TIDAK terlalu formal, TIDAK terlalu kasual):
✅ "Halo! 🌸 VyuApp membangun sistem digital yang tahan lama. Ada yang ingin Anda ketahui?"
❌ "Terima kasih atas pertanyaan Anda. Kami dengan senang hati akan membantu."
❌ "Halo! Mau tanya apa nih? 😄😄😄"`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body as { message?: string; history?: ChatMessage[] };

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!CS_MODEL_BASE) {
      console.error('CS_MODEL_BASE_URL environment variable is not configured');
      return NextResponse.json(
        { reply: 'Maaf, layanan chat sedang tidak tersedia. Silakan hubungi kami via email di vyuapp@proton.me 📧' },
        { status: 200 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message too long (max 500 characters)' },
        { status: 400 }
      );
    }

    const visitorId = getVisitorId(request);

    // Check for admin password
    if (message.trim() === ADMIN_PASSWORD) {
      const r = getRedis();
      if (r) {
        try {
          await r.set(`chat:admin:${visitorId}`, '1', { ex: Math.floor(ADMIN_DURATION / 1000) });
        } catch (e) {
          console.error('Failed to set admin flag:', e);
        }
      }
      const minutes = Math.floor(ADMIN_DURATION / 60000);
      return NextResponse.json({
        reply: `🔑 Admin mode activated! Rate limit removed for ${minutes} minutes. Enjoy testing!`,
        admin: true,
      });
    }

    // Check if IP has admin bypass
    let isAdmin = false;
    const r = getRedis();
    if (r) {
      try {
        const adminFlag = await r.get(`chat:admin:${visitorId}`);
        isAdmin = adminFlag === '1';
      } catch (e) {
        // If Redis check fails, continue without admin bypass
      }
    }

    if (!isAdmin) {
      const allowed = await checkRateLimit(`chat:${visitorId}`, RATE_LIMIT, 3600);
      if (!allowed) {
        return NextResponse.json(
          { error: `Rate limit exceeded. Maximum ${RATE_LIMIT} messages per hour.` },
          { status: 429 }
        );
      }
    }

    // Build messages array with history
    const sanitizedHistory = Array.isArray(history)
      ? history
          .filter((h: any) => h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string')
          .map((h: any) => ({ role: h.role, content: h.content.slice(0, 2000) }))
          .slice(-6)
      : [];
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...sanitizedHistory,
      { role: 'user', content: message.trim() },
    ];

    // Call the CS agent's model
    const modelRes = await fetch(`${CS_MODEL_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(CS_API_KEY ? { Authorization: `Bearer ${CS_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model: CS_MODEL,
        messages,
        max_tokens: 300,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!modelRes.ok) {
      const errText = await modelRes.text();
      console.error('Model API error:', modelRes.status, errText);
      return NextResponse.json(
        { reply: 'Maaf, layanan chat sedang tidak tersedia. Silakan hubungi kami via email di vyuapp@proton.me 📧' },
        { status: 200 }
      );
    }

    const data = await modelRes.json();
    const reply = data.choices?.[0]?.message?.content || 'Maaf, saya tidak dapat memproses pesan Anda saat ini.';

    return NextResponse.json({ reply });

  } catch (err: any) {
    console.error('Chat API error:', err);
    return NextResponse.json(
      { reply: `Error: ${err?.message || String(err)}` },
      { status: 200 }
    );
  }
}
