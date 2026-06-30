import { NextResponse } from 'next/server';

const CS_MODEL_BASE = process.env.CS_MODEL_BASE_URL || 'http://195.88.211.166:20128/v1';
const CS_MODEL = process.env.CS_MODEL_NAME || 'nara/mimo-v2.5';
const CS_API_KEY = process.env.CS_API_KEY || '';
const RATE_LIMIT = 5;
const ADMIN_PASSWORD = 'AkuWibuGanteng';
const ADMIN_DURATION = 5 * 60 * 1000; // 5 minutes

// In-memory rate limit store (per-process)
const visitorSessions = new Map();

function getVisitorId(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return ip;
}

function checkRateLimit(visitorId) {
  const now = Date.now();
  const session = visitorSessions.get(visitorId) || { count: 0, resetAt: now + 60 * 60 * 1000, adminUntil: 0 };

  // Check admin mode
  if (session.adminUntil > now) {
    return { allowed: true, admin: true, remaining: Infinity };
  }

  // Reset if expired
  if (now > session.resetAt) {
    session.count = 0;
    session.resetAt = now + 60 * 60 * 1000;
  }

  if (session.count >= RATE_LIMIT) {
    return { allowed: false, admin: false, remaining: 0 };
  }

  session.count++;
  visitorSessions.set(visitorId, session);
  return { allowed: true, admin: false, remaining: RATE_LIMIT - session.count };
}

function activateAdmin(visitorId) {
  const now = Date.now();
  const session = visitorSessions.get(visitorId) || { count: 0, resetAt: now + 60 * 60 * 1000, adminUntil: 0 };
  session.adminUntil = now + ADMIN_DURATION;
  visitorSessions.set(visitorId, session);
  return Math.floor(ADMIN_DURATION / 60000);
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

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
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
      const minutes = activateAdmin(visitorId);
      return NextResponse.json({
        reply: `🔑 Admin mode activated! Rate limit removed for ${minutes} minutes. Enjoy testing!`,
        admin: true,
      });
    }

    const rateCheck = checkRateLimit(visitorId);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 5 messages per hour.' },
        { status: 429 }
      );
    }

    // Build messages array with history
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(Array.isArray(history) ? history.slice(-6) : []),
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

  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json(
      { reply: 'Terjadi kesalahan. Silakan hubungi kami via vyuapp@proton.me' },
      { status: 200 }
    );
  }
}
