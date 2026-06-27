# VyuApp Sprint Night — 10 Secondary Priorities
**Date:** 2026-06-27
**Status:** Pending discussion with Vy

---

## 1. Rate Limiting on API Endpoints
**Priority:** HIGH
**Impact:** Prevents email bombing, spam, abuse
**Implementation:** Add `@upstash/ratelimit` or Vercel Edge rate limiting to:
- `/api/contact` — 5 requests/hour per IP
- `/api/discovery` — 3 requests/hour per IP
- `/api/admin/setup` — already protected with SETUP_TOKEN

---

## 2. CAPTCHA on Forms
**Priority:** HIGH
**Impact:** Prevents bot spam on contact & discovery forms
**Implementation:** Cloudflare Turnstile (free, no UX friction) on:
- Contact form (homepage)
- Discovery form (questionnaire)

---

## 3. Homepage Server/Client Split
**Priority:** MEDIUM
**Impact:** ~60% reduction in client JS, better SEO, faster FCP
**Implementation:**
- Extract static sections (About, Capabilities, Portfolio, Philosophy) into Server Components
- Keep only Navbar + Contact Form as Client Components
- Refactor LocaleProvider to work with Server Components (pass locale as prop)

---

## 4. Migrate Fontshare Satoshi to next/font
**Priority:** MEDIUM
**Impact:** Eliminates external CSS request, faster font loading
**Implementation:**
- Satoshi is available on Google Fonts OR self-host the woff2 files
- Use `next/font/google` or `next/font/local` with font-display: swap
- Remove `<link>` tags from layout.js

---

## 5. Remove Unused Radix UI Packages
**Priority:** MEDIUM
**Impact:** ~200-300KB bundle reduction
**Implementation:**
- Audit which Radix packages are actually imported in admin components
- Remove unused: context-menu, menubar, navigation-menu, hover-card, aspect-ratio, etc.
- Keep only: button, label, separator, sheet, skeleton, tooltip, dialog, toaster, toast, input

---

## 6. Email Input Sanitization
**Priority:** MEDIUM
**Impact:** Prevents header injection and HTML injection in emails
**Implementation:**
- Strip newlines from user input in email subjects
- HTML-escape all user input in discovery form email template
- Add input length limits

---

## 7. Env Variable Validation
**Priority:** MEDIUM
**Impact:** Fail-fast on missing config, better error messages
**Implementation:**
- Create `lib/env.js` that validates required env vars at startup
- Throw clear errors if `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` are missing
- Add `SETUP_TOKEN` to .env.example

---

## 8. Per-Page Metadata
**Priority:** LOW
**Impact:** Better SEO for individual portfolio/insights pages
**Implementation:**
- Add `generateMetadata()` to portfolio/[slug] and insights/[slug]
- Dynamic title, description, OG images per article/project
- Consider dynamic OG image generation

---

## 9. Admin-Only UI Component Cleanup
**Priority:** LOW
**Impact:** Cleaner codebase, easier maintenance
**Implementation:**
- Move admin-only shadcn components to `components/admin/ui/`
- Keep public-facing components in `components/ui/`
- Remove truly unused shadcn components

---

## 10. TypeScript Migration (Gradual)
**Priority:** LOW
**Impact:** Type safety, better DX, fewer runtime errors
**Implementation:**
- Already have 2 TS files (DiscoveryForm.tsx, discovery/route.ts)
- Gradually convert critical files: lib/data.js, lib/supabase/*.js, API routes
- Add strict mode to tsconfig.json

---

## Bonus: Future Considerations
- **next-themes** installed but unused — implement dark mode or remove
- **.env.example** should be un-gitignored for documentation
- **RLS policies** — restrict write access to admin user only (not all authenticated)
- **Dynamic imports** — use `next/dynamic` for below-fold components
- **Testing** — add unit tests for API routes and integration tests for critical flows
