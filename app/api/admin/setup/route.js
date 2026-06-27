// One-time bootstrap endpoint. Idempotent. Requires SETUP_TOKEN header.
// Hit it ONCE after running the SUPABASE_SETUP.sql in the Supabase SQL editor.
// It will:
//   1. Create the 'featured-images' storage bucket (public)
//   2. Create / ensure the admin auth user (with default password)
//   3. Seed sample articles + portfolio items if tables are empty
import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { SEED_ARTICLES_FOR_SUPABASE, SEED_PORTFOLIO } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const setupToken = request.headers.get('x-setup-token');
  const expectedToken = process.env.SETUP_TOKEN;

  if (!expectedToken) {
    return NextResponse.json({ error: 'Setup not configured. Set SETUP_TOKEN env var.' }, { status: 503 });
  }
  if (!setupToken || setupToken !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const supabase = getAdminSupabase();
  const log = [];
  try {
    // 1. Bucket
    const { data: buckets } = await supabase.storage.listBuckets();
    const existing = (buckets || []).find(b => b.name === 'featured-images');
    if (!existing) {
      const { error } = await supabase.storage.createBucket('featured-images', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: '8MB',
      });
      if (error) log.push(`bucket error: ${error.message}`); else log.push('bucket created: featured-images');
    } else {
      log.push('bucket exists: featured-images');
    }

    // 2. Admin user
    const email = process.env.SUPABASE_ADMIN_EMAIL;
    const password = process.env.SUPABASE_ADMIN_DEFAULT_PASSWORD;
    let adminUserId = null;
    if (email && password) {
      const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
      const found = (list?.users || []).find(u => (u.email || '').toLowerCase() === email.toLowerCase());
      if (found) {
        adminUserId = found.id;
        log.push(`admin user exists: ${email}`);
      } else {
        const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
        if (error) log.push(`createUser error: ${error.message}`);
        else { adminUserId = data.user.id; log.push(`admin user created: ${email}`); }
      }
    } else {
      log.push('admin email/password env not set');
    }

    // 3. Seed articles (only if table empty)
    const { count: artCount, error: artCountErr } = await supabase
      .from('articles').select('id', { count: 'exact', head: true });
    if (artCountErr) {
      log.push(`articles count error: ${artCountErr.message} — did you run SUPABASE_SETUP.sql?`);
    } else if ((artCount || 0) === 0) {
      const rows = SEED_ARTICLES_FOR_SUPABASE.map(a => ({ ...a, author_id: adminUserId }));
      const { error } = await supabase.from('articles').insert(rows);
      if (error) log.push(`seed articles error: ${error.message}`);
      else log.push(`seeded ${rows.length} articles`);
    } else {
      log.push(`articles already has ${artCount} rows — skipping seed`);
    }

    // 4. Seed portfolio_items (only if table empty)
    const { count: pCount, error: pCountErr } = await supabase
      .from('portfolio_items').select('id', { count: 'exact', head: true });
    if (pCountErr) {
      log.push(`portfolio count error: ${pCountErr.message}`);
    } else if ((pCount || 0) === 0) {
      const { error } = await supabase.from('portfolio_items').insert(SEED_PORTFOLIO);
      if (error) log.push(`seed portfolio error: ${error.message}`);
      else log.push(`seeded ${SEED_PORTFOLIO.length} portfolio items`);
    } else {
      log.push(`portfolio already has ${pCount} rows — skipping seed`);
    }

    return NextResponse.json({ ok: true, log });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err?.message || err), log }, { status: 500 });
  }
}
