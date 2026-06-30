import '@/lib/env';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { contactLimiter } from '@/lib/rate-limit';

interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  message: string;
  turnstileToken?: string;
}

// --- helpers ---
function stripNewlines(str: string): string {
  return typeof str === 'string' ? str.replace(/[\r\n]+/g, ' ').trim() : '';
}

function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clampLen(str: string, max = 2000): string {
  return typeof str === 'string' ? str.slice(0, max) : '';
}

const LIMITS: Record<string, number> = { name: 200, email: 320, company: 200, projectType: 100, message: 5000 };

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const { success, remaining, reset } = await contactLimiter.limit(ip);
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

    const body: ContactPayload = await request.json();
    let { name, email, company, projectType, message, turnstileToken } = body;

    // Verify Turnstile token
    if (!turnstileToken) {
      return NextResponse.json({ error: 'Security verification required.' }, { status: 403 });
    }
    const turnstileResult = await verifyTurnstileToken(turnstileToken);
    if (!turnstileResult.success) {
      return NextResponse.json({ error: 'Security verification failed. Please try again.' }, { status: 403 });
    }

    // Trim & enforce length limits
    name = clampLen((name || '').trim(), LIMITS.name);
    email = clampLen((email || '').trim(), LIMITS.email);
    company = clampLen((company || '').trim(), LIMITS.company);
    projectType = clampLen((projectType || '').trim(), LIMITS.projectType);
    message = clampLen((message || '').trim(), LIMITS.message);

    if (!name || !email || !projectType || !message) {
      return NextResponse.json({ error: 'Semua field wajib harus diisi.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    // Strip newlines from subject, HTML-escape values for email body
    const safeSubject = stripNewlines(`[VyuApp Contact] ${projectType} — ${name}`);
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = escapeHtml(company || '-');
    const safeProjectType = escapeHtml(projectType);
    const safeMessage = escapeHtml(message);

    const { error } = await resend.emails.send({
      from: 'VyuApp Contact <noreply@vyuapp.my.id>',
      to: 'vyuapp@proton.me',
      replyTo: email,
      subject: safeSubject,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Company:</strong> ${safeCompany}</p>
        <p><strong>Project Type:</strong> ${safeProjectType}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${safeMessage.replace(/\n/g, '<br/>')}</p>
      `.trim(),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Gagal mengirim pesan. Silakan coba lagi.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
