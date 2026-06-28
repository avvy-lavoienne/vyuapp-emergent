-- ===========================================================
-- VyuApp — Supabase schema bootstrap
-- Paste this entire file into the Supabase SQL editor and Run.
-- It is idempotent (safe to re-run).
-- ===========================================================

-- Required extensions
create extension if not exists pgcrypto;
create extension if not exists moddatetime schema extensions;

-- =========================
-- ARTICLES
-- =========================
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  cover text,
  category text default 'Engineering',
  tags text[] default '{}',
  status text not null default 'draft',
  author_id uuid,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists handle_articles_updated_at on public.articles;
create trigger handle_articles_updated_at
before update on public.articles
for each row execute procedure extensions.moddatetime (updated_at);

alter table public.articles enable row level security;

drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles"
on public.articles for select to anon, authenticated
using (status = 'published');

drop policy if exists "Authenticated full access articles" on public.articles;
create policy "Authenticated full access articles"
on public.articles for all to authenticated
using (true) with check (true);

-- =========================
-- PORTFOLIO ITEMS
-- =========================
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  description text,
  long_description text,
  features text[] default '{}',
  value_props text[] default '{}',
  stack text[] default '{}',
  category text default 'Produk',
  cover text,
  href text,
  cta_label text default 'Pelajari lebih lanjut',
  position int default 0,
  status text not null default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists handle_portfolio_updated_at on public.portfolio_items;
create trigger handle_portfolio_updated_at
before update on public.portfolio_items
for each row execute procedure extensions.moddatetime (updated_at);

alter table public.portfolio_items enable row level security;

drop policy if exists "Public can read published portfolio" on public.portfolio_items;
create policy "Public can read published portfolio"
on public.portfolio_items for select to anon, authenticated
using (status = 'published');

drop policy if exists "Authenticated full access portfolio" on public.portfolio_items;
create policy "Authenticated full access portfolio"
on public.portfolio_items for all to authenticated
using (true) with check (true);

-- =========================
-- STORAGE: featured-images bucket policies
-- Bucket itself is created by /api/admin/setup (service role) — these policies
-- govern access from the public anon and authenticated roles.
-- =========================

-- Allow authenticated users to upload/update/delete
drop policy if exists "Auth can manage featured-images" on storage.objects;
create policy "Auth can manage featured-images"
on storage.objects for all to authenticated
using (bucket_id = 'featured-images')
with check (bucket_id = 'featured-images');

-- Allow public to read (since bucket will be public anyway, this is harmless)
drop policy if exists "Public can read featured-images" on storage.objects;
create policy "Public can read featured-images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'featured-images');

-- =========================
-- PROPOSALS (for VyuApp Writer)
-- =========================
create table if not exists public.proposals (
  id text primary key,
  title text not null,
  excerpt text,
  topic text,
  sources text[] default '{}',
  category text default 'Engineering',
  tags text[] default '{}',
  estimated_words integer default 2000,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists handle_proposals_updated_at on public.proposals;
create trigger handle_proposals_updated_at
before update on public.proposals
for each row execute procedure extensions.moddatetime (updated_at);

alter table public.proposals enable row level security;

drop policy if exists "Authenticated full access proposals" on public.proposals;
create policy "Authenticated full access proposals"
on public.proposals for all to authenticated
using (true) with check (true);
