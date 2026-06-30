# vyuapp-emergent — Project Memory

## Project Identity
- **Name:** VyuApp (vyuapp.my.id)
- **Type:** Portfolio/agency website with article publishing
- **Stack:** Next.js 16, React 19, Tailwind CSS 3, Supabase, Vercel
- **Branch:** `dev` = production (auto-deploys to Vercel)
- **Domain:** www.vyuapp.my.id (301 non-www → www)

## Architecture
```
vyuapp-emergent/
├── app/                    # Next.js App Router
│   ├── page.js             # Homepage (Client Component)
│   ├── layout.js           # Root layout (Server Component)
│   ├── globals.css         # Satoshi font + Tailwind
│   ├── insights/           # Articles (SSR + ISR)
│   │   ├── page.js         # Article listing
│   │   └── [slug]/page.js  # Article detail (Server Component)
│   ├── portfolio/          # Portfolio pages
│   └── api/                # API routes (contact, discovery, admin)
├── components/             # React components
│   ├── Hero.jsx            # Homepage hero (Server Component)
│   ├── Navbar.jsx          # Navigation (Client Component)
│   ├── Footer.jsx          # Footer
│   ├── ArticleFilters.jsx  # Tag/category filters
│   └── ui/                 # Radix UI components
├── lib/                    # Utilities
│   ├── data.js             # Supabase data fetching
│   └── locales.js          # i18n (ID/EN)
├── public/                 # Static assets
│   └── fonts/              # Self-hosted Satoshi font
└── scripts/                # Bot/utility scripts
```

## Key Configuration

### next.config.js
- `poweredByHeader: false`
- Images: Unsplash, GitHub avatars, Supabase
- Security headers: X-Frame-Options, CSP, HSTS
- Cache: favicon/images = 1 year immutable
- `experimental.optimizePackageImports`: Radix UI, lucide-react, date-fns

### tailwind.config.js
- Font: Satoshi (sans), JetBrains Mono (mono)
- Colors: sand (50-900), mauve (50-900), accent (#6D5BA0)
- Surface: #FFFFFF (primary), #F8F7F4 (secondary)

### Database (Supabase)
- **Table:** `articles`
- **Columns:** id, slug, title, excerpt, content (HTML), cover (URL), category, tags[], status, author_id, published_at, created_at, updated_at
- **Status:** published | draft
- **Content format:** HTML (h2, h3, p, ul, li, strong, em)

## Performance Optimizations (2026-06-30)
- Font: Satoshi with size-adjust/ascent-override/descent-override
- Font preload: 3 woff2 files in layout.js head
- Navbar: explicit h-[72px], requestAnimationFrame scroll handler
- Images: priority for first 3, quality={80}, optimized sizes
- Hero: Server Component for faster LCP
- Browserslist: modern browsers only (no polyfills)
- Tags: limited to 20 visible with "show more"
- Color contrast: sand-400=#737370, sand-500=#636360 (WCAG AA)

## Common Pitfalls
1. **DOMPurify + SSR** = crash → use sanitize-html
2. **Supabase URLs in next/image** = rejected → use proxy or direct Unsplash
3. **Font loading** = CLS → use size-adjust + preload
4. **`'use client'`** on page.js = no SSR → convert to Server Component where possible
5. **Radix UI** = heavy imports → use optimizePackageImports
6. **Tailwind v3** not v4 → check config syntax
7. **Vercel env vars** = override NEXT_PUBLIC_* → set in dashboard
8. **Article HTML** = stored in Supabase, not in codebase
9. **Rate limit** = 20 req/min across all agents
10. **Model config** = nara/mimo-v2.5 (with nara/ prefix, not bare mimo/)

## Build & Deploy
```bash
cd /root/vyuapp-emergent
npm run build          # Build check
npm run dev            # Local dev (port 3000)
git add -A && git commit -m "type: message" && git push origin dev  # Deploy
```

## AdSense
- Slots: SLOT_TOP, SLOT_MID, SLOT_END
- Placement: between article sections
- Format: auto (top/bottom), rectangle (mid)
