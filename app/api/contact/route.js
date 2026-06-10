import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, company, projectType, message } = body;

    if (!name || !email || !projectType || !message) {
      return NextResponse.json({ error: 'Semua field wajib harus diisi.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: 'VyuApp Contact <onboarding@resend.dev>',
      to: 'vyuapp@proton.me',
      replyTo: email,
      subject: `[VyuApp Contact] ${projectType} — ${name}`,
      text: `
Name: ${name}
Email: ${email}
Company: ${company || '-'}
Project Type: ${projectType}

Message:
${message}
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
