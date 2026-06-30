import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { discoveryLimiter } from '@/lib/rate-limit';

interface DiscoveryPayload {
  fullName: string;
  companyName: string;
  businessEmail: string;
  coreGoal: string;
  targetAudience: string;
  uniqueValue: string;
  techRequirements: string;
  budgetRange: string;
  timeline: string;
  turnstileToken?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const budgetOptions: Record<string, string> = {
  '< 50jt': '< Rp 50 Juta',
  '50jt\u2013150jt': 'Rp 50 \u2013 150 Juta',
  '150jt\u2013500jt': 'Rp 150 \u2013 500 Juta',
  '> 500jt': '> Rp 500 Juta',
  discuss: 'Diskusikan dulu',
};

const timelineOptions: Record<string, string> = {
  '1\u20132 bulan': '1\u20132 Bulan',
  '3\u20134 bulan': '3\u20134 Bulan',
  '5\u20138 bulan': '5\u20138 Bulan',
  '> 8 bulan': '> 8 Bulan',
  flexible: 'Fleksibel',
};

function validate(body: DiscoveryPayload): string | null {
  if (!body.fullName?.trim()) return 'Nama lengkap wajib diisi.';
  if (!body.companyName?.trim()) return 'Nama perusahaan wajib diisi.';
  if (!body.businessEmail?.trim()) return 'Email wajib diisi.';
  if (!emailRegex.test(body.businessEmail)) return 'Format email tidak valid.';
  if (!body.coreGoal?.trim()) return 'Tujuan utama proyek wajib diisi.';
  if (!body.targetAudience?.trim()) return 'Target audiens wajib diisi.';
  if (!body.uniqueValue?.trim()) return 'Nilai unik wajib diisi.';
  if (!body.techRequirements?.trim()) return 'Kebutuhan teknis wajib diisi.';
  if (!body.budgetRange) return 'Kisaran budget wajib dipilih.';
  if (!body.timeline) return 'Estimasi timeline wajib dipilih.';
  return null;
}

function buildEmail(body: DiscoveryPayload): string {
  const ts = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const budgetLabel = budgetOptions[body.budgetRange] || body.budgetRange;
  const timelineLabel = timelineOptions[body.timeline] || body.timeline;

  const fieldRow = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;font-size:12px;color:#a1a1aa;font-family:monospace;vertical-align:top;white-space:nowrap;padding-right:16px;">${label}</td>
      <td style="padding:6px 0;font-size:13px;color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">${value}</td>
    </tr>`;

  const section = (title: string, rows: string) => `
    <tr>
      <td style="padding:16px 30px;background:#18181b;border-top:1px solid #27272a;">
        <h3 style="margin:0 0 10px;font-size:12px;color:#34d399;text-transform:uppercase;letter-spacing:0.5px;font-family:Arial,Helvetica,sans-serif;">${title}</h3>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${rows}</table>
      </td>
    </tr>`;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <tr>
            <td style="padding:28px 30px;background:#18181b;border-radius:12px 12px 0 0;border-bottom:2px solid #34d399;">
              <h1 style="margin:0;font-size:18px;color:#f4f4f5;font-weight:700;font-family:Arial,Helvetica,sans-serif;">[VyuApp Discovery Brief]</h1>
              <p style="margin:6px 0 0;font-size:12px;color:#a1a1aa;font-family:Arial,Helvetica,sans-serif;">${body.companyName} \u2014 ${body.fullName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 30px;background:#18181b;">
              <h2 style="margin:0 0 12px;font-size:13px;color:#34d399;text-transform:uppercase;letter-spacing:0.5px;font-family:Arial,Helvetica,sans-serif;">Ringkasan Jawaban</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                ${fieldRow('Dikirim', ts)}
                ${fieldRow('Nama', body.fullName)}
                ${fieldRow('Perusahaan', body.companyName)}
                ${fieldRow('Email', body.businessEmail)}
              </table>
            </td>
          </tr>
          ${section('Corporate Identity', fieldRow('Nama Lengkap', body.fullName) + fieldRow('Perusahaan', body.companyName) + fieldRow('Email Bisnis', body.businessEmail))}
          ${section('Project Core Goals & Audience', fieldRow('Tujuan Utama', body.coreGoal) + fieldRow('Target Audiens', body.targetAudience))}
          ${section('UVP, Tech & Investment', fieldRow('Nilai Unik', body.uniqueValue) + fieldRow('Kebutuhan Teknis', body.techRequirements) + fieldRow('Budget', budgetLabel) + fieldRow('Timeline', timelineLabel))}
          <tr>
            <td style="padding:18px 30px;background:#18181b;border-radius:0 0 12px 12px;border-top:1px solid #27272a;text-align:center;">
              <p style="margin:0;font-size:11px;color:#52525b;font-family:Arial,Helvetica,sans-serif;">VyuApp Studio \u2014 Garut, Indonesia</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const { success, remaining, reset } = await discoveryLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Terlalu banyak percobaan. Coba lagi nanti.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        },
      );
    }

    const rawBody = await request.json();
    const { turnstileToken, ...restBody } = rawBody;
    const body: DiscoveryPayload = restBody;

    // Verify Turnstile token
    if (!turnstileToken) {
      return NextResponse.json({ error: 'Security verification required.' }, { status: 403 });
    }
    const turnstileResult = await verifyTurnstileToken(turnstileToken);
    if (!turnstileResult.success) {
      return NextResponse.json({ error: 'Security verification failed. Please try again.' }, { status: 403 });
    }

    const validationError = validate(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: 'VyuApp Discovery <noreply@vyuapp.my.id>',
      to: 'vyuapp@proton.me',
      replyTo: body.businessEmail,
      subject: `[VyuApp Discovery] ${body.companyName} \u2014 ${body.fullName}`,
      html: buildEmail(body),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Gagal mengirim brief. Silakan coba lagi.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Discovery API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
