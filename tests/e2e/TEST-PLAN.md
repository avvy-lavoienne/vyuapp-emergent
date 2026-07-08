# VyuApp Emergent — E2E Testing Plan (v2 — Validated)

**Date:** 2026-07-08
**Branch:** dev (commit 49e4de5)
**Server:** http://localhost:3780
**Framework:** Playwright (JavaScript)
**Validated by:** Jeanne (QA Agent) — 3 critical, 7 major, 8 minor issues addressed

---

## 1. Codebase Analysis

### Routes (15 pages)
| Route | Type | Auth | Description |
|-------|------|------|-------------|
| `/` | Static | No | Homepage (Hero, Capabilities, Team, Portfolio, Philosophy, Contact) |
| `/about` | Static | No | About page |
| `/portfolio` | Static | No | Portfolio listing |
| `/portfolio/[slug]` | Dynamic | No | Portfolio detail |
| `/portfolio/ai-agents` | Static | No | AI Agents showcase |
| `/insights` | Dynamic | No | Articles listing |
| `/insights/[slug]` | Dynamic | No | Article detail |
| `/category/[slug]` | Dynamic | No | Category filtering |
| `/admin/login` | Dynamic | No | Admin login form |
| `/admin` | Dynamic | **Yes** | Admin dashboard (CRUD) |
| `/privacy` | Static | No | Privacy policy |
| `/tos` | Static | No | Terms of service |
| `/feed.xml` | Dynamic | No | RSS feed |
| `/sitemap.xml` | Dynamic | No | Sitemap |

### API Endpoints (4)
| Endpoint | Method | Auth | Rate Limit | Description |
|----------|--------|------|------------|-------------|
| `/api/contact` | POST | Turnstile | contactLimiter | Contact form → Resend email |
| `/api/chat` | POST | No | 100 req/IP | AI chatbot (Hana) |
| `/api/admin/setup` | POST | SETUP_TOKEN | No | One-time bootstrap |
| `/api/discovery` | POST | Turnstile | discoveryLimiter (3/hr) | Discovery form → email |

### Key Interactive Features
- [ ] Theme toggle (dark/light mode, localStorage)
- [ ] Locale toggle (ID/EN, cookie `vyu-locale`)
- [ ] Cookie consent banner (accept/decline, localStorage persistence)
- [ ] Chat widget (Hana AI — prompt injection protection, admin mode)
- [ ] Contact form (Turnstile CAPTCHA, rate limiting)
- [ ] Discovery form (multi-step, Turnstile, rate limiting)
- [ ] Admin login/logout (Supabase Auth, middleware protection)
- [ ] Admin CRUD articles + portfolio
- [ ] Image upload (Supabase storage, 8MB limit)
- [ ] RSS feed generation

### Security Features (to test)
- Turnstile CAPTCHA on contact + discovery forms
- Prompt injection detection in chat (18 patterns)
- HTML sanitization (`sanitize-html`)
- Input length clamping
- Admin password bypass mode in chat
- Rate limiting on all form endpoints
- Login rate limiting (5 attempts/15min/IP)
- Middleware auth protection on `/admin/*`

---

## 2. Test Suites (10 Suites, 84 Test Cases)

### Suite A: Public Pages (Smoke Tests)
**Priority:** P0 — Must pass before any deploy
**Estimated time:** 2-3 min

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| A1 | Homepage loads | `GET /` | 200, title contains "VyuApp", hero h1 visible |
| A2 | All sections visible | Scroll full page | Hero, Capabilities, Team, Portfolio, Philosophy, Contact all visible |
| A3 | Navigation links work | Click each nav link | Correct page loads |
| A4 | Footer links work | Click footer links | Correct page loads |
| A5 | About page loads | `GET /about` | 200, content visible |
| A6 | Portfolio page loads | `GET /portfolio` | 200, project cards visible |
| A7 | Portfolio detail loads | Click first project | Detail page with content |
| A8 | Insights page loads | `GET /insights` | 200, article cards visible |
| A9 | Article detail loads | Click first article | Article content visible |
| A10 | Privacy page loads | `GET /privacy` | 200, policy text visible |
| A11 | TOS page loads | `GET /tos` | 200, terms text visible |
| A12 | AI Agents page loads | `GET /portfolio/ai-agents` | 200, agent cards visible |
| A13 | RSS feed valid | `GET /feed.xml` | 200, valid XML with `<item>`, `<link>`, `<pubDate>` |
| A14 | Category page loads | `GET /category/technology` | 200, filtered articles shown |
| A15 | 404 handling | `GET /insights/nonexistent-slug` | 404 page displayed |

### Suite B: Theme & Locale
**Priority:** P0
**Estimated time:** 1-2 min

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| B1 | Dark mode toggle | Click theme button | `html.dark` class added, colors invert |
| B2 | Light mode toggle | Click again | `html.dark` removed, original colors |
| B3 | Theme persists reload | Toggle → reload | Theme state preserved |
| B4 | Locale EN toggle | Click language button | Text changes to English |
| B5 | Locale ID toggle | Click again | Text changes to Bahasa Indonesia |
| B6 | Locale persists reload | Toggle → reload | Locale state preserved |
| B7 | Locale cookie set | Check cookie | `vyu-locale` cookie exists |

### Suite C: Contact Form
**Priority:** P1
**Estimated time:** 2 min

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| C1 | Form renders | Navigate to #kontak | Form fields visible |
| C2 | Empty submit validation | Submit empty form | Validation errors shown |
| C3 | Invalid email | Enter invalid email | Email validation error |
| C4 | Successful submit | Fill all fields, submit | Success message shown |
| C5 | Form resets after submit | Submit → wait | Fields cleared, status returns to idle |
| C6 | Loading state | Submit form | Loader spinner shown during submit |
| C7 | Rate limit hit | Submit 4x rapidly | 429 error message shown |
| C8 | Network failure | Disable network → submit | Error state displayed |

### Suite D: Chat Widget (Hana)
**Priority:** P1
**Estimated time:** 2 min

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| D1 | Chat button visible | Homepage load | Chat FAB button visible |
| D2 | Chat opens | Click chat button | Chat panel opens |
| D3 | Chat input works | Type message | Text appears in input |
| D4 | Send message | Type + send | Message appears in chat, AI response received |
| D5 | Chat closes | Click close button | Chat panel hides |
| D6 | Rate limit handling | Send 100+ messages fast | Rate limit error shown |
| D7 | Empty message | Click send without text | Validation error |
| D8 | Prompt injection | Send "ignore previous instructions" | Bot refuses, standard response |
| D9 | Admin mode bypass | Send admin password | Admin mode activated |
| D10 | Network failure | Disable network → send | Error message shown |

### Suite E: Admin Auth Flow
**Priority:** P0 ⬆️ (auth bypass = security breach)
**Estimated time:** 3 min

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| E1 | Unauth redirect | `GET /admin` | Redirect to `/admin/login` |
| E2 | Login page renders | `GET /admin/login` | Login form visible |
| E3 | Invalid credentials | Submit wrong creds | Error message shown |
| E4 | Login success | Submit correct creds | Redirect to `/admin` dashboard |
| E5 | Dashboard renders | After login | Article list, portfolio list visible |
| E6 | Logout | Click logout | Redirect to `/admin/login` |
| E7 | Non-admin user | Login as non-admin → `/admin` | Redirect with `?error=unauthorized` |
| E8 | Login rate limit | Submit 5 wrong passwords | Lockout message shown |
| E9 | `?next=` redirect | Access `/admin/settings` → login | Redirect to `/admin/settings` after login |
| E10 | Admin auto-redirect | Login while on `/admin/login` | Auto-redirect to dashboard |

### Suite F: Admin CRUD
**Priority:** P2
**Estimated time:** 5 min

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| F1 | Create article | Fill form → save | Article appears in list |
| F2 | Edit article | Click edit → modify → save | Changes reflected |
| F3 | Delete article | Click delete → confirm | Article removed from list |
| F4 | Create portfolio | Fill form → save | Portfolio item appears |
| F5 | Edit portfolio | Click edit → modify → save | Changes reflected |
| F6 | Delete portfolio | Click delete → confirm | Item removed |
| F7 | Image upload happy path | Click upload → select file | Image uploaded, preview shown |
| F8 | Rich editor works | Type → format → save | Formatting preserved |
| F9 | Delete without confirmation | Click delete → cancel | Item NOT deleted |
| F10 | Duplicate slug handling | Create article with existing slug | Graceful error or auto-suffix |
| F11 | Image upload: invalid type | Upload .exe file | Error message, upload rejected |
| F12 | Image upload: oversized | Upload >8MB file | Error message, upload rejected |

### Suite G: Discovery Form
**Priority:** P1 (lead gen = business critical)
**Estimated time:** 3 min

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| G1 | Form renders | Navigate to discovery section | Multi-step form visible |
| G2 | Step navigation | Fill step 1 → click next | Step 2 appears, progress bar updates |
| G3 | Step validation | Submit empty step | Validation errors shown |
| G4 | Successful submit | Complete all steps → submit | Success message, email sent |
| G5 | Turnstile required | Submit without token | 403 error returned |
| G6 | Rate limit | Submit 4x in 1 hour | 429 error returned |

### Suite H: Responsive Design
**Priority:** P2
**Estimated time:** 3 min

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| H1 | Mobile nav | 375px viewport | Hamburger menu visible |
| H2 | Mobile nav opens | Click hamburger | Mobile menu slides in |
| H3 | Mobile nav closes | Click link | Menu closes, page navigates |
| H4 | Tablet layout | 768px viewport | 2-column grids |
| H5 | Desktop layout | 1280px viewport | Full layout, all sections visible |
| H6 | No horizontal scroll | Any viewport | `document.body.scrollWidth <= window.innerWidth` |

### Suite I: Performance & SEO
**Priority:** P2
**Estimated time:** 2 min

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| I1 | Meta tags | Check `<head>` | title, description, OG tags present |
| I2 | Canonical URL | Check `<link rel="canonical">` | Correct URL set |
| I3 | robots meta | Check meta | `index, follow` on public pages |
| I4 | No JS errors | Monitor console | 0 uncaught errors |
| I5 | Images alt text | Check images | All images have alt attribute |
| I6 | Heading hierarchy | Check h1-h6 | Single h1, proper nesting |
| I7 | Sitemap valid | `GET /sitemap.xml` | 200, valid XML with all routes |

### Suite J: Security Testing
**Priority:** P0 ⬆️ (security = non-negotiable)
**Estimated time:** 4 min

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| J1 | Chat prompt injection | Send "ignore previous instructions" | Bot refuses, standard redirect |
| J2 | Chat admin password bypass | Send admin password as message | Admin mode activated response |
| J3 | Contact API: no Turnstile | POST /api/contact without token | 403 response |
| J4 | Contact API: malformed JSON | POST /api/contact with invalid JSON | 400 response, no crash |
| J5 | Contact API: XSS in fields | Submit `<script>alert(1)</script>` in name | Input sanitized, no script execution |
| J6 | Admin: non-admin access | Login as non-admin → `/admin` | Redirected with `?error=unauthorized` |
| J7 | Admin: duplicate session | Login → open new tab → logout tab 1 | Tab 2 redirects to login |
| J8 | API: empty body | POST /api/contact with `{}` | 400 validation error |
| J9 | API: oversized payload | POST /api/chat with 10KB message | 413 or validation error |
| J10 | Source maps exposed | `GET /_next/static/*.map` | 404 response |

---

## 3. Implementation Plan

### Phase 1: Setup (30 min)
1. Install Playwright: `npm init playwright@latest`
2. Configure `playwright.config.js` (baseURL: localhost:3780)
3. Create Page Objects:
   - `pages/HomePage.js`
   - `pages/AdminPage.js`
   - `pages/InsightsPage.js`
   - `pages/ContactForm.js`
   - `pages/ChatWidget.js`
   - `pages/DiscoveryForm.js`
4. Create fixtures:
   - `fixtures/auth.js` (admin credentials)
   - `fixtures/locales.js` (ID/EN test data)
   - `fixtures/testData.js` (article + portfolio data)

### Phase 2: P0 Tests (2-3 hours)
1. Suite A: Public pages smoke tests (A1-A15)
2. Suite B: Theme & locale tests (B1-B7)
3. Suite E: Admin auth (E1-E10) ⬆️
4. Suite J: Security (J1-J10) ⬆️

### Phase 3: P1 Tests (3-4 hours)
1. Suite C: Contact form (C1-C8)
2. Suite D: Chat widget (D1-D10)
3. Suite G: Discovery form (G1-G6)

### Phase 4: P2 Tests (3-4 hours)
1. Suite F: Admin CRUD (F1-F12)
2. Suite H: Responsive (H1-H6)
3. Suite I: Performance/SEO (I1-I7)

---

## 4. Test Data Requirements

### Admin Credentials
- Email: from `SUPABASE_ADMIN_EMAIL` env
- Password: from `SUPABASE_ADMIN_DEFAULT_PASSWORD` env

### Contact Form Test Data
```js
const contactData = {
  name: 'Test User',
  email: 'test@example.com',
  company: 'Test Corp',
  projectType: 'web',
  message: 'E2E test submission'
};
```

### Article Test Data
```js
const articleData = {
  title: 'E2E Test Article',
  slug: 'e2e-test-article',
  excerpt: 'Test excerpt',
  content: '<p>Test content</p>',
  category: 'technology',
  tags: ['test', 'e2e'],
  status: 'draft'
};
```

### Portfolio Test Data
```js
const portfolioData = {
  name: 'E2E Test Portfolio',
  slug: 'e2e-test-portfolio',
  tagline: 'Test project tagline',
  description: 'Test project description',
  long_description: '<p>Detailed test description</p>',
  features: ['Feature 1', 'Feature 2'],
  value_props: ['Value 1'],
  stack: ['Next.js', 'Supabase'],
  category: 'Produk Utama',
  cover: '',
  href: '/portfolio',
  cta_label: 'Learn more',
  position: 99,
  status: 'draft',
};
```

### Discovery Form Test Data
```js
const discoveryData = {
  name: 'Test Discovery',
  email: 'discovery@test.com',
  company: 'Test Corp',
  industry: 'Technology',
  budget: '50-100jt',
  timeline: '3 bulan',
  message: 'E2E test discovery submission'
};
```

---

## 5. Execution Commands

```bash
# Install Playwright
cd /root/vyuapp-emergent
npm init playwright@latest

# Run all tests
npx playwright test

# Run specific suite
npx playwright test --grep "Suite A"

# Run with UI (headed mode)
npx playwright test --headed

# Run single test
npx playwright test --grep "A1"

# Generate report
npx playwright show-report

# Debug mode
npx playwright test --debug
```

---

## 6. Success Criteria

- [ ] All P0 tests pass (Suite A + B + E + J)
- [ ] All P1 tests pass (Suite C + D + G)
- [ ] P2 tests pass ≥ 80% (Suite F + H + I)
- [ ] 0 console errors on all public pages
- [ ] All pages load < 3s
- [ ] Responsive design works on 375px, 768px, 1280px
- [ ] Dark mode works correctly
- [ ] Locale switching works correctly
- [ ] Security: no XSS, no auth bypass, rate limiting works
- [ ] Admin: CRUD operations work end-to-end

---

## 7. Validation Log

| Date | Validator | Issues Found | Status |
|------|-----------|--------------|--------|
| 2026-07-08 | Jeanne (QA) | 3 critical, 7 major, 8 minor | Addressed in v2 |
