# VyuApp Emergent — QA Plan (Visual, UX, Accessibility, Performance)

**Date:** 2026-07-08  
**Server:** http://localhost:3780  
**Tech Stack:** Next.js 16.2.7, Tailwind CSS v3, JavaScript, Supabase, next-themes  
**Complements:** TEST-PLAN.md (E2E), BLACKBOX-TEST-PLAN.md (API-level)  
**Scope:** Manual + automated visual review, accessibility audit, UX flow testing, performance benchmarks

---

## 1. Visual Consistency Review

### 1.1 Brand Identity — Apple Blue

| Check | Criteria | Method | Pass/Fail |
|-------|----------|--------|-----------|
| Primary blue | `#2997ff` used for CTAs, links, accent elements | Inspect elements → computed color | ☐ |
| Accent hover | `#0066cc` used for hover states on accent elements | Hover over CTA buttons | ☐ |
| Blue light | `#E8F4FD` used for subtle backgrounds | Check card backgrounds, section highlights | ☐ |
| Blue spectrum | Blue-50 through Blue-900 consistent | Audit all blue references in Tailwind classes | ☐ |
| Accent color class | `accent` color used consistently (not arbitrary hex) | `grep -r "accent" app/ components/` | ☐ |

### 1.2 Dark Mode

| Check | Criteria | Method | Pass/Fail |
|-------|----------|--------|-----------|
| Toggle works | Click theme toggle → `html.dark` class applied | Browser DevTools | ☐ |
| Colors invert | Background → dark, text → light | Visual check on all sections | ☐ |
| No contrast issues | All text readable on dark backgrounds | WCAG contrast checker (min 4.5:1) | ☐ |
| Images适应 | Images don't break on dark background | Check portfolio images, OG images | ☐ |
| Code blocks | Syntax highlighting readable in dark mode | Check `<code>` blocks | ☐ |
| Forms | Input fields, labels, placeholders visible | Contact form, chat input, admin login | ☐ |
| Chat widget | Chat panel readable in dark mode | Open Hana chat in dark mode | ☐ |
| Persist on reload | Theme state saved to localStorage | Toggle → reload → verify | ☐ |
| System preference | Respects `prefers-color-scheme` on first visit | Clear localStorage → check initial theme | ☐ |

### 1.3 Typography

| Check | Criteria | Method | Pass/Fail |
|-------|----------|--------|-----------|
| Satoshi font loaded | Primary font `--font-sans` loads correctly | Network tab: check woff2 files load | ☐ |
| JetBrains Mono | Monospace font for code/technical content | Check `<code>`, `<pre>` elements | ☐ |
| Font weights | 400 (regular), 500 (medium), 700 (bold) used correctly | Visual hierarchy review | ☐ |
| Font size scale | Tailwind text classes (text-sm through text-6xl) consistent | Check headings h1→h6 | ☐ |
| Line height | Body text 1.5-1.7, headings 1.1-1.3 | Visual readability check | ☐ |
| Fallback fonts | `system-ui, sans-serif` fallback if Satoshi fails | Disable font in DevTools → check fallback | ☐ |
| `font-display: swap` | No invisible text during font load | Network throttling → visual check | ☐ |

### 1.4 Layout & Spacing

| Check | Criteria | Method | Pass/Fail |
|-------|----------|--------|-----------|
| Container max-width | 1400px centered on 2xl screens | DevTools → inspect `.container` | ☐ |
| Section padding | Consistent 2rem horizontal padding | Visual rhythm check | ☐ |
| Grid alignment | Portfolio/insights cards align properly | Desktop (1280px) visual check | ☐ |
| No horizontal scroll | `document.body.scrollWidth <= window.innerWidth` | All viewports | ☐ |
| Animations | `fade-up` and `fade-in` animations smooth | Scroll through homepage | ☐ |

### 1.5 Component Inventory

Verify visual consistency across all components:

| Component | Location | Visual Check |
|-----------|----------|-------------|
| Header/Nav | Top of every page | ☐ |
| Footer | Bottom of every page | ☐ |
| Hero Section | Homepage | ☐ |
| Capabilities Section | Homepage | ☐ |
| Team Section | Homepage | ☐ |
| Portfolio Cards | `/portfolio` | ☐ |
| Article Cards | `/insights` | ☐ |
| Contact Form | Homepage `#kontak` | ☐ |
| Chat Widget (Hana) | Floating FAB, bottom-right | ☐ |
| Discovery Form | Multi-step form | ☐ |
| Cookie Consent | Bottom banner | ☐ |
| Admin Login | `/admin/login` | ☐ |
| Admin Dashboard | `/admin` | ☐ |
| 404 Page | Invalid routes | ☐ |

---

## 2. Accessibility Checklist

### 2.1 Keyboard Navigation

| Check | Criteria | Method | Pass/Fail |
|-------|----------|--------|-----------|
| Tab order | All interactive elements reachable via Tab | Tab through entire page | ☐ |
| Focus visible | Focus ring visible on all focusable elements | Tab through → check outline/box-shadow | ☐ |
| Skip link | "Skip to content" link available | Tab once on page load | ☐ |
| Enter/Space activation | Links and buttons activate on Enter/Space | Keyboard-only navigation | ☐ |
| Escape closes modals | ESC closes chat widget, dialogs | Open chat → press ESC | ☐ |
| Arrow keys in chat | Arrow keys navigate chat messages (if applicable) | Open chat → test arrows | ☐ |
| Form tab order | Contact form fields tab in logical order | Tab through form fields | ☐ |
| Admin form tab order | Login form, admin CRUD forms tab correctly | Tab through admin forms | ☐ |
| No keyboard traps | Tab never gets stuck in a component | Full tab cycle on each page | ☐ |

### 2.2 ARIA & Semantic HTML

| Check | Criteria | Method | Pass/Fail |
|-------|----------|--------|-----------|
| landmarks | `<nav>`, `<main>`, `<footer>`, `<header>` present | View page source | ☐ |
| `<h1>` single | Only one `<h1>` per page | DevTools → search `<h1>` | ☐ |
| Heading hierarchy | h1→h2→h3 nesting correct, no skips | Audit heading levels per page | ☐ |
| ARIA labels | Interactive elements have `aria-label` or visible label | Audit buttons, links, inputs | ☐ |
| Chat widget | `aria-expanded`, `aria-label` on chat FAB | Inspect chat button | ☐ |
| Cookie consent | `role="dialog"` or equivalent on banner | Inspect consent component | ☐ |
| Form labels | All inputs have associated `<label>` | Check contact, discovery, login forms | ☐ |
| Error announcements | Form errors announced to screen readers | `aria-live="polite"` or equivalent | ☐ |
| `role="presentation"` | Used on layout tables (email HTML) | Check email HTML templates | ☐ |

### 2.3 Screen Reader Testing

| Check | Criteria | Method | Pass/Fail |
|-------|----------|--------|-----------|
| Page title | Screen reader announces page title | NVDA/VoiceOver test | ☐ |
| Navigation | Nav links announced with roles | Screen reader nav test | ☐ |
| Form fields | Labels announced with inputs | Fill contact form with SR | ☐ |
| Error messages | Validation errors announced | Submit empty form with SR | ☐ |
| Chat responses | AI replies announced | Send message with SR active | ☐ |
| Image alt text | All meaningful images have descriptive alt | Audit `<img>` tags | ☐ |
| Decorative images | `alt=""` on decorative images | Audit `<img>` tags | ☐ |
| Icon buttons | Lucide icons have `aria-label` | Check all icon-only buttons | ☐ |

### 2.4 Color & Contrast

| Check | Criteria | Method | Pass/Fail |
|-------|----------|--------|-----------|
| Text contrast (light mode) | Body text ≥ 4.5:1 ratio | WebAIM Contrast Checker | ☐ |
| Text contrast (dark mode) | Body text ≥ 4.5:1 ratio | WebAIM Contrast Checker | ☐ |
| Link distinction | Links distinguishable from body text (not just color) | Check underlines/weight | ☐ |
| Focus indicators | Focus rings have ≥ 3:1 contrast | Check against background | ☐ |
| Error text | Red error text readable on light/dark backgrounds | Submit invalid form | ☐ |
| Disabled states | Disabled buttons have sufficient contrast or are grayed | Check form submit buttons | ☐ |

### 2.5 Motion & Animation

| Check | Criteria | Method | Pass/Fail |
|-------|----------|--------|-----------|
| `prefers-reduced-motion` | Animations disabled when OS setting is on | Set OS preference → reload | ☐ |
| No auto-playing video | No video/audio starts automatically | Audit all pages | ☐ |
| Flashing content | No content flashes more than 3x/sec | Visual check | ☐ |

---

## 3. UX Flow Review

### 3.1 Navigation Flow

| Flow | Steps | Expected Outcome | Pass/Fail |
|------|-------|------------------|-----------|
| Homepage → About | Click nav "About" | /about loads, content visible | ☐ |
| Homepage → Portfolio | Click nav "Portfolio" | /portfolio loads, cards visible | ☐ |
| Homepage → Insights | Click nav "Insights" | /insights loads, articles visible | ☐ |
| Homepage → Contact | Click nav "Kontak" | Scrolls to #kontak section | ☐ |
| Portfolio → Detail | Click project card | /portfolio/[slug] loads with content | ☐ |
| Insights → Article | Click article card | /insights/[slug] loads with content | ☐ |
| Category filter | Click category tag | /category/[slug] shows filtered results | ☐ |
| Back to home | Click logo/header | / loads homepage | ☐ |
| Mobile nav | Open hamburger → click link → menu closes | Smooth mobile navigation | ☐ |
| Footer links | Click privacy/tos links | Correct pages load | ☐ |

### 3.2 Contact Form Flow

| Step | Action | Expected | Pass/Fail |
|------|--------|----------|-----------|
| 1 | Navigate to #kontak | Form visible with all fields | ☐ |
| 2 | Click submit empty | Validation errors shown inline | ☐ |
| 3 | Enter invalid email | Email format error shown | ☐ |
| 4 | Fill all fields correctly | No validation errors | ☐ |
| 5 | Turnstile CAPTCHA loads | Widget renders, user completes challenge | ☐ |
| 6 | Submit valid form | Loading spinner → success message | ☐ |
| 7 | After success | Form resets, fields cleared | ☐ |
| 8 | Rate limit scenario | Submit 5x → rate limit error shown | ☐ |
| 9 | Network failure | Error state with retry suggestion | ☐ |

### 3.3 Chat Widget (Hana) Flow

| Step | Action | Expected | Pass/Fail |
|------|--------|----------|-----------|
| 1 | Homepage load | Chat FAB visible (bottom-right) | ☐ |
| 2 | Click FAB | Chat panel opens with greeting | ☐ |
| 3 | Type message | Text appears in input | ☐ |
| 4 | Send message | User message appears, typing indicator, AI reply | ☐ |
| 5 | Send prompt injection | Bot refuses gracefully | ☐ |
| 6 | Send empty | Validation prevents submission | ☐ |
| 7 | Multiple messages | Conversation flows naturally | ☐ |
| 8 | Close chat | Panel hides, FAB remains | ☐ |
| 9 | Reopen chat | Previous conversation visible | ☐ |
| 10 | Mobile view | Chat panel full-width on small screens | ☐ |

### 3.4 Discovery Form Flow

| Step | Action | Expected | Pass/Fail |
|------|--------|----------|-----------|
| 1 | Navigate to discovery | Multi-step form visible, step 1 active | ☐ |
| 2 | Fill step 1 | Progress bar updates | ☐ |
| 3 | Click next | Step 2 appears, step 1 data preserved | ☐ |
| 4 | Click back | Step 1 data still present | ☐ |
| 5 | Submit empty step | Validation errors shown | ☐ |
| 6 | Complete all steps | Review/submit step visible | ☐ |
| 7 | Turnstile loads on final step | CAPTCHA widget renders | ☐ |
| 8 | Submit | Loading → success message | ☐ |
| 9 | Rate limit | 4th submission → error shown | ☐ |

### 3.5 Admin Auth Flow

| Step | Action | Expected | Pass/Fail |
|------|--------|----------|-----------|
| 1 | Visit /admin unauthenticated | Redirect to /admin/login | ☐ |
| 2 | Login page renders | Email + password fields, submit button | ☐ |
| 3 | Wrong credentials | Error message displayed | ☐ |
| 4 | Correct credentials | Redirect to /admin dashboard | ☐ |
| 5 | Dashboard shows data | Article list, portfolio list visible | ☐ |
| 6 | Create article | Fill form → save → appears in list | ☐ |
| 7 | Edit article | Click edit → modify → save → changes reflected | ☐ |
| 8 | Delete article | Click delete → confirm → removed | ☐ |
| 9 | Logout | Redirect to /admin/login | ☐ |
| 10 | Access /admin after logout | Redirect back to login | ☐ |
| 11 | Non-admin user login | Redirect with ?error=unauthorized | ☐ |
| 12 | Login rate limit | 5 wrong attempts → lockout message | ☐ |

### 3.6 Error State UX

| Scenario | Expected UX | Pass/Fail |
|----------|-------------|-----------|
| 404 page | Custom 404 page with link back to homepage | ☐ |
| API 500 error | User-friendly error message, no stack trace | ☐ |
| Network offline | Error state with suggestion to retry | ☐ |
| Image load failure | Fallback/placeholder image shown | ☐ |
| Empty states | "No articles yet" / "No portfolio items" message | ☐ |
| Form submission failure | Error message + form data preserved | ☐ |
| Cookie consent | Non-blocking banner, accept/decline options | ☐ |

---

## 4. Cross-Browser Testing

### 4.1 Target Browsers

| Browser | Version | Platform | Priority |
|---------|---------|----------|----------|
| Chrome | Latest stable | Desktop (Windows/Mac) | P0 |
| Chrome | Latest stable | Mobile (Android) | P0 |
| Safari | Latest stable | Desktop (Mac) | P0 |
| Safari | Latest stable | Mobile (iOS) | P0 |
| Firefox | Latest stable | Desktop | P1 |
| Edge | Latest stable | Desktop (Windows) | P1 |
| Samsung Internet | Latest | Mobile (Android) | P2 |

### 4.2 Browser-Specific Checks

| Check | Chrome | Safari | Firefox | Edge |
|-------|--------|--------|---------|------|
| Dark mode toggle works | ☐ | ☐ | ☐ | ☐ |
| Turnstile CAPTCHA renders | ☐ | ☐ | ☐ | ☐ |
| Chat widget opens/closes | ☐ | ☐ | ☐ | ☐ |
| Form submissions work | ☐ | ☐ | ☐ | ☐ |
| Fonts load correctly | ☐ | ☐ | ☐ | ☐ |
| CSS animations smooth | ☐ | ☐ | ☐ | ☐ |
| localStorage persistence | ☐ | ☐ | ☐ | ☐ |
| Cookie consent banner | ☐ | ☐ | ☐ | ☐ |
| Admin login works | ☐ | ☐ | ☐ | ☐ |
| No console errors | ☐ | ☐ | ☐ | ☐ |

### 4.3 Responsive Viewports

| Viewport | Width | Height | Device | Layout Target |
|----------|-------|--------|--------|---------------|
| iPhone SE | 375px | 667px | Mobile | Single column, hamburger nav |
| iPhone 14 Pro | 393px | 852px | Mobile | Single column, hamburger nav |
| iPad Mini | 768px | 1024px | Tablet | 2-column grid, collapsed nav |
| iPad Pro | 1024px | 1366px | Tablet | 2-3 column grid |
| Laptop | 1280px | 720px | Desktop | Full layout |
| Desktop HD | 1440px | 900px | Desktop | Full layout, max-width container |
| Ultra-wide | 1920px | 1080px | Desktop | Centered container, no stretch |

### 4.4 Responsive Checks

| Check | 375px | 768px | 1280px | Pass/Fail |
|-------|-------|-------|--------|-----------|
| No horizontal scroll | ☐ | ☐ | ☐ | ☐ |
| Images scale properly | ☐ | ☐ | ☐ | ☐ |
| Text readable (no truncation) | ☐ | ☐ | ☐ | ☐ |
| Navigation adapts | ☐ | ☐ | ☐ | ☐ |
| Forms usable | ☐ | ☐ | ☐ | ☐ |
| Chat widget usable | ☐ | ☐ | ☐ | ☐ |
| Cards stack correctly | ☐ | ☐ | ☐ | ☐ |
| Footer stacks correctly | ☐ | ☐ | ☐ | ☐ |

---

## 5. Performance Benchmarks

### 5.1 Core Web Vitals Targets

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | Lighthouse, Web Vitals JS |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | Lighthouse, Web Vitals JS |
| **FID** (First Input Delay) | ≤ 100ms | Lighthouse, Web Vitals JS |
| **INP** (Interaction to Next Paint) | ≤ 200ms | Lighthouse |
| **TTFB** (Time to First Byte) | ≤ 800ms | Lighthouse, curl timing |
| **FCP** (First Contentful Paint) | ≤ 1.8s | Lighthouse |
| **TBT** (Total Blocking Time) | ≤ 200ms | Lighthouse |

### 5.2 Page Performance Audit

| Page | LCP Target | CLS Target | Lighthouse Score |
|------|-----------|-----------|-----------------|
| `/` (Homepage) | ≤ 2.5s | ≤ 0.1 | ≥ 90 |
| `/about` | ≤ 2.0s | ≤ 0.1 | ≥ 90 |
| `/portfolio` | ≤ 2.5s | ≤ 0.1 | ≥ 90 |
| `/insights` | ≤ 2.5s | ≤ 0.1 | ≥ 90 |
| `/admin/login` | ≤ 2.0s | ≤ 0.1 | ≥ 85 |

### 5.3 Resource Audit

| Check | Target | Method |
|-------|--------|--------|
| Total page weight | ≤ 500KB (excluding images) | Network tab |
| JavaScript bundle | ≤ 200KB gzipped | Bundle analyzer |
| CSS bundle | ≤ 50KB gzipped | Network tab |
| Image optimization | WebP/AVIF, lazy-loaded below fold | Audit `<img>` tags |
| Font files | ≤ 100KB total | Network tab |
| Third-party scripts | ≤ 2 (AdSense, Turnstile) | Audit `<script>` tags |
| Unused CSS | ≤ 10% of total CSS | Coverage tab |
| Unused JS | ≤ 15% of total JS | Coverage tab |

### 5.4 Caching Strategy

| Resource | Expected Cache Header | Check |
|----------|----------------------|-------|
| Static assets (`/_next/static/`) | `Cache-Control: immutable, max-age=31536000` | Response headers |
| Images | `Cache-Control: public, max-age=86400` | Response headers |
| HTML pages | `Cache-Control: no-cache` or `s-maxage` | Response headers |
| API responses | `Cache-Control: no-store` | Response headers |
| Fonts | `Cache-Control: immutable` | Response headers |

### 5.5 Performance Measurement Commands

```bash
# Lighthouse audit (CLI)
npx lighthouse http://localhost:3780 --output html --output-path ./lighthouse-homepage.html

# Curl timing (TTFB measurement)
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" http://localhost:3780

# Bundle size analysis
npx next build && du -sh .next/static/chunks/

# Check response headers
curl -sI http://localhost:3780 | grep -i "cache-control\|x-powered-by\|server"
```

---

## 6. SEO Audit Checklist

### 6.1 Meta Tags

| Check | Page(s) | Criteria | Pass/Fail |
|-------|---------|----------|-----------|
| `<title>` tag | All pages | Unique, descriptive, ≤ 60 chars | ☐ |
| `<meta description>` | All pages | Unique, compelling, ≤ 160 chars | ☐ |
| `<meta keywords>` | Homepage | Relevant keywords present | ☐ |
| `<link rel="canonical">` | All pages | Self-referencing canonical URL | ☐ |
| `<meta robots>` | All public pages | `index, follow` | ☐ |
| `<meta robots>` | /admin/* | `noindex, nofollow` | ☐ |
| `<meta viewport>` | All pages | `width=device-width, initial-scale=1` | ☐ |
| `<meta charset>` | All pages | `utf-8` | ☐ |

### 6.2 Open Graph & Social

| Check | Criteria | Pass/Fail |
|-------|----------|-----------|
| `og:title` | Present on all pages | ☐ |
| `og:description` | Present on all pages | ☐ |
| `og:image` | Present, 1200×630px, accessible | ☐ |
| `og:url` | Correct canonical URL | ☐ |
| `og:type` | `website` on homepage, `article` on articles | ☐ |
| `og:site_name` | "VyuApp" | ☐ |
| `og:locale` | `id_ID` | ☐ |
| `twitter:card` | `summary_large_image` | ☐ |
| `twitter:title` | Present | ☐ |
| `twitter:description` | Present | ☐ |
| `twitter:image` | Present | ☐ |

### 6.3 Structured Data (JSON-LD)

| Schema | Page | Criteria | Pass/Fail |
|--------|------|----------|-----------|
| `Organization` | Homepage | Valid JSON-LD with name, url, logo | ☐ |
| `WebSite` | Homepage | Valid with searchAction (if applicable) | ☐ |
| `LocalBusiness` | Homepage | Valid with address, geo, contact | ☐ |
| `Article` | /insights/[slug] | Valid with headline, author, datePublished | ☐ |
| `BreadcrumbList` | All subpages | Valid breadcrumb navigation | ☐ |

### 6.4 Technical SEO

| Check | Criteria | Method | Pass/Fail |
|-------|----------|--------|-----------|
| `sitemap.xml` | Valid XML with all public routes | `GET /sitemap.xml` → validate | ☐ |
| `robots.txt` | Present, references sitemap | `GET /robots.txt` | ☐ |
| RSS feed | Valid XML with `<item>`, `<link>`, `<pubDate>` | `GET /feed.xml` → validate | ☐ |
| Canonical URLs | Self-referencing, no duplicates | Audit `<link rel="canonical">` | ☐ |
| 301 redirects | www → non-www (or vice versa) consistent | curl -I both | ☐ |
| HTTPS | All pages served over HTTPS | Check in production | ☐ |
| No mixed content | All resources loaded over HTTPS | Audit `<img>`, `<script>`, `<link>` | ☐ |
| Clean URLs | No query parameters for content pages | Audit all public URLs | ☐ |
| Favicon | Present in all sizes (16x16, 32x32, apple-touch) | Check `/favicon/` directory | ☐ |
| `hreflang` | Present if multilingual (ID/EN) | Check `<head>` for hreflang tags | ☐ |

### 6.5 Content SEO

| Check | Page(s) | Criteria | Pass/Fail |
|-------|---------|----------|-----------|
| Single `<h1>` | All pages | Only one h1 per page | ☐ |
| Heading hierarchy | All pages | h1→h2→h3 logical nesting | ☐ |
| Image alt text | All pages | Descriptive alt text on meaningful images | ☐ |
| Internal linking | Articles, portfolio | Related content linked | ☐ |
| Outbound links | About, articles | External links open with `rel="noopener"` | ☐ |
| Content length | Articles | ≥ 300 words per article | ☐ |
| Slug format | Articles, portfolio | lowercase, hyphenated, no special chars | ☐ |

### 6.6 SEO Validation Commands

```bash
# Sitemap validation
curl -s http://localhost:3780/sitemap.xml | head -50

# Robots.txt
curl -s http://localhost:3780/robots.txt

# RSS feed validation
curl -s http://localhost:3780/feed.xml | head -30

# Check meta tags on homepage
curl -s http://localhost:3780 | grep -i '<meta\|<title\|<link rel="canonical"'

# Check JSON-LD
curl -s http://localhost:3780 | grep -o '<script type="application/ld+json">[^<]*</script>'

# Check OG tags
curl -s http://localhost:3780 | grep -i 'og:'

# Lighthouse SEO audit
npx lighthouse http://localhost:3780 --only-categories=seo --output=html --output-path=./seo-report.html
```

---

## 7. Testing Tools & Setup

### 7.1 Required Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Chrome DevTools | Latest | Visual inspection, performance, accessibility |
| Lighthouse | Built-in | Performance, accessibility, SEO scores |
| axe DevTools | Browser extension | Automated accessibility scanning |
| WAVE | Browser extension | Accessibility evaluation |
| WebAIM Contrast Checker | Online | Color contrast verification |
| Screaming Frog | Free (500 URLs) | Technical SEO crawl |
| PageSpeed Insights | Online | Core Web Vitals (field data) |
| BrowserStack | Cloud | Cross-browser testing |

### 7.2 Automated Audit Commands

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run full Lighthouse audit
lhci autorun --config=lighthouserc.js

# axe-core accessibility audit (CLI)
npx @axe-core/cli http://localhost:3780 --save results.json

# HTML validation
npx html-validate http://localhost:3780

# CSS validation
npx stylelint "app/**/*.css" "components/**/*.css"
```

---

## 8. Issue Severity Classification

| Severity | Definition | SLA |
|----------|-----------|-----|
| **Critical** | Security vulnerability, data loss, complete feature broken | Fix immediately |
| **Major** | Significant UX issue, accessibility blocker, performance regression | Fix within 24h |
| **Minor** | Visual inconsistency, non-critical accessibility, minor UX friction | Fix within 1 week |
| **Cosmetic** | Pixel-perfect alignment, minor color variation, style polish | Fix in next sprint |

---

## 9. QA Sign-Off Criteria

### Must-Pass (Ship Blockers)

- [ ] All P0 E2E tests pass (TEST-PLAN.md Suite A + B + E + J)
- [ ] All API blackbox tests pass (BLACKBOX-TEST-PLAN.md)
- [ ] Lighthouse Performance score ≥ 90
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] Lighthouse SEO score ≥ 90
- [ ] No console errors on any public page
- [ ] Dark mode works correctly on Chrome + Safari
- [ ] Mobile layout correct on 375px viewport
- [ ] Contact form submits successfully
- [ ] Chat widget responds correctly
- [ ] Admin login/logout flow works
- [ ] No horizontal scroll on any viewport

### Should-Pass (Quality Gates)

- [ ] Cross-browser: Chrome, Safari, Firefox, Edge
- [ ] Keyboard navigation: all interactive elements accessible
- [ ] ARIA: screen reader can navigate core flows
- [ ] Core Web Vitals: LCP ≤ 2.5s, CLS ≤ 0.1, FID ≤ 100ms
- [ ] Page weight ≤ 500KB (excluding images)
- [ ] All images have alt text
- [ ] RSS feed valid
- [ ] Sitemap covers all public routes
- [ ] Open Graph tags present on all pages

### Nice-to-Have (Polish)

- [ ] `prefers-reduced-motion` respected
- [ ] `hreflang` tags for ID/EN
- [ ] JSON-LD structured data validated
- [ ] Lighthouse score ≥ 95 across all categories
- [ ] Page load < 1.5s on 3G

---

*Plan authored: 2026-07-08 | Review after each major release*
