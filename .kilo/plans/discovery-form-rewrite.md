# Multi-Step Project Discovery Questionnaire — Plan v2

## Summary

Rewrite the existing single-step `ContactForm.jsx` into a premium 4-step interactive **Project Discovery Questionnaire** with:
- Step indicator with connecting lines & numbered circles
- Animated Radix UI `<Progress>` bar
- Per-field validation with inline error messages
- localStorage auto-save
- Review & Submit step showing all answers
- Corresponding API route sending structured HTML email via Resend

---

## Step Restructure (per UX recommendation)

| Step | Title | Fields |
|------|-------|--------|
| **0** | Corporate Identity | `fullName`, `companyName`, `businessEmail` |
| **1** | Project Core Goals & Audience | `coreGoal`, `targetAudience` |
| **2** | UVP, Tech & Investment | `uniqueValue`, `techRequirements`, `budgetRange`, `timeline` |
| **3** | Review & Submit | Read-only summary of all answers + Submit button |

---

## Files to Create

### 1. `components/DiscoveryForm.tsx`

**Typing** — dedicated interface:
```ts
interface DiscoveryFormData {
  fullName: string;
  companyName: string;
  businessEmail: string;
  coreGoal: string;
  targetAudience: string;
  uniqueValue: string;
  techRequirements: string;
  budgetRange: string;
  timeline: string;
}
```

**State** — `useState` for answers object, step index, status (idle/loading/sent/error), errors per field, and a submitted flag.

**Validation per step** — returns `Record<string, string>` of field→error:
- **Step 0**: fullName required; companyName required; businessEmail required + regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Step 1**: coreGoal required; targetAudience required
- **Step 2**: uniqueValue required; techRequirements required; budgetRange must not be `""`; timeline must not be `""`
- **Step 3**: no validation (review step)

**Per-field error messages** displayed directly below each invalid input in red text (matching the `AlertCircle` pattern from existing ContactForm).

**Previous button** on Steps 1, 2, 3. Disabled on Step 0. Uses `vyu-btn-secondary` style.

**Next button** disabled until current step passes validation. On Step 3, label changes to "Submit Discovery Brief".

**Progress indicator** — visual row of 4 numbered circles with connecting lines between them. Current step filled solid emerald, completed steps have checkmark, upcoming steps are muted. CSS transitions on fill.

**Progress bar** — `@radix-ui/react-progress` with `value={((step + 1) / 4) * 100}`, emerald gradient fill, subtle glow.

**Step transitions** — keyed div per step using `animate-vyu-reveal` (CSS keyframe from globals.css) for fade-in + translateY on step change. Auto-focus first input of each step via `useEffect` + `ref`.

**localStorage persistence** — `useEffect` saves answers to `localStorage` on every change. On mount, restores from `localStorage`. Clears on successful submit.

**Submission** — POST JSON to `/api/discovery`. On success, show thank-you card with `CheckCircle2` icon, auto-reset after 8s. On error, show error card.

**Success state** — card with "Discovery brief submitted" message, green border, auto-dismiss + reset after 8s.

### 2. `app/api/discovery/route.ts`

- Import `NextResponse` from `next/server`, `Resend` from `resend`
- `POST` handler:
  - Parse body (all 9 fields)
  - **Backend validation** mirroring frontend exactly (fields required + email regex)
  - Construct **professionally formatted HTML email** with:
    - Dark theme (#09090b background)
    - Emerald (#34d399) accent borders and headers
    - White/light text (#f4f4f5)
    - **Summary section** at the top ("Ringkasan Jawaban")
    - **Per-step sections** with headers ("Corporate Identity", "Project Core Goals", etc.)
    - **Submission timestamp** formatted as "10 Juni 2026, 16:42 WIB"
    - Monospace font for labels, clean sans-serif for values
  - Send via Resend to `vyuapp@proton.me` with `replyTo` set to `businessEmail`
  - Return `{ ok: true }` or `{ error: string }`

**Resend email config:**
```ts
from: 'VyuApp Discovery <noreply@vyuapp.my.id>'
to: 'vyuapp@proton.me'
replyTo: businessEmail
subject: `[VyuApp Discovery] ${companyName} — ${fullName}`
```

---

## Files to Modify

### 3. `app/page.js`
- Import `DiscoveryForm` instead of `ContactForm`
- Replace `<ContactForm />` on line ~343 with `<DiscoveryForm />`

---

## Design Decisions

- **TypeScript**: `.tsx` and `.ts` for new files; `page.js` stays `.js` (migration to `.tsx` out of scope)
- **CSS-only animations**: `animate-vyu-reveal` keyframe for step transitions; no framer-motion needed
- **No external form libs**: native React `useState` + manual validation
- **Radix UI Progress**: `@radix-ui/react-progress` already in deps — use it for accessible progress bar (`role="progressbar"`, `aria-valuenow`)
- **localStorage**: auto-save/restore answers; clear on successful submit
- **Old ContactForm.jsx**: retained in repo but no longer imported; can be cleaned up later
- **Email template**: inline-styled dark HTML, no React Email dependency (keeps it simple for now)

---

## Implementation Order

1. Create `components/DiscoveryForm.tsx`
2. Create `app/api/discovery/route.ts`
3. Edit `app/page.js` to swap component import/usage
4. Verify with `npm run build` or lint check
