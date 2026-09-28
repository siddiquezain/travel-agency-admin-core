# Phase 0 — UI Review (Retroactive, Full-Project)

**Audited:** 2026-05-19
**Project:** Origin Tours and Travels (Next.js 16 + MUI v7 + Tailwind v4)
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md, no GSD phase artifacts)
**Screenshots:** **NOT captured.** Dev server on `localhost:3000` was serving an unrelated project ("BodyReset Wellness Center" from Docker container `complete-all-phases-app`), not Origin Travels. Routes `/tours`, `/visas`, `/attestations` returned 404 against the served app. All findings below are derived from a **code-only audit** of the repository at `/home/musahibkhan/Desktop/Origin/Github/origin-travels`.

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 3/4 | Public-facing copy is brand-aligned; admin uses raw "Failed" and bare `confirm()` dialogs |
| 2. Visuals | 2/4 | Two disjoint visual languages — MUI-rich public site vs. unstyled Tailwind admin; god components (1,400+ LOC) signal copy-paste sprawl |
| 3. Color | 1/4 | 297 hardcoded hex/rgb values across components — design tokens defined in `designSystem.js` are bypassed everywhere; two competing color systems |
| 4. Typography | 2/4 | 16+ inline `fontSize` rem/px values plus 6 distinct `fontWeight` numerics defy the theme.js typography scale; Tailwind admin uses 7 size classes |
| 5. Spacing | 2/4 | Per-component ad-hoc `px:`, `py:`, `mb:` responsive objects everywhere — `spacing` token from `designSystem.js` (`sectionPy`, `cardPadding`) is barely used outside its definition file |
| 6. Experience Design | 2/4 | Skeletons + ErrorBoundary + 404 exist, but admin destructive actions use `window.confirm()`, IconButton aria-label coverage is ~41% (9/22), and there is no global toast/snackbar system |

**Overall: 12/24**

---

## Top Priority Fixes (BLOCKERS first, then WARNINGS)

1. **BLOCKER — Consolidate two disjoint design systems (public vs admin).** Public site uses MUI v7 + `theme.js` + `designSystem.js` tokens; admin tables (`src/components/admin/*Table.tsx`) bypass that entirely and use raw Tailwind utility classes with hardcoded `bg-emerald-600`, `text-slate-700`, `ring-slate-300`. **User impact:** an admin who clicks back to the public site experiences a different product — typography family, color palette, button radius, and form styling all change. **Fix:** Pick one. Either (a) port admin tables to MUI components (`DataGrid`, `Dialog`, `TextField`) to inherit `theme.js`, or (b) extract a shared `<AdminButton>`, `<AdminModal>`, `<AdminInput>` Tailwind component layer that consumes CSS variables aligned with the MUI palette. Start with `ToursTable.tsx`, `VisasTable.tsx`, `AttestationsTable.tsx`, `CountriesTable.tsx`.

2. **BLOCKER — Eliminate 297 hardcoded color values; route everything through `theme.palette` and `sectionColors`.** Files with worst offenders: `src/app/about/page.jsx` (65), `src/app/contact/page.jsx` (55), `src/app/umrah/page.jsx` (20), `src/components/ServiceCard.jsx` (18), `src/app/tours/[slug]/page.jsx` (18). The `designSystem.js` token export of `sectionColors` (blue/teal/indigo/amber/emerald/orange/purple/sky/rose) is the intended escape hatch, but pages reach past it to write `#1A428A`, `#DC2626`, `rgba(0,0,0,0.7)` inline. **User impact:** dark-mode toggle (via `ColorModeContext`) produces broken contrast on the hardcoded sections — body bg is `#0b1121` (forced in `src/styles/globals.css`) regardless of mode. **Fix:** Replace inline hex with `theme.palette.*` or `sectionColors.*` references; remove hardcoded `background-color: #0b1121` from `src/styles/globals.css:47`.

3. **BLOCKER — Replace `window.confirm()` destructive-action dialogs in 13 admin tables.** Every admin table uses native browser confirm for delete: `InquiriesTable.tsx:41`, `AttestationsTable.tsx:54`, `DestinationsTable.tsx:106`, `ServiceTypesTable.tsx:72`, `DocumentTypesTable.tsx:72`, `AttestationTypesTable.tsx:73`, `UsersTable.tsx:44`, `TourCategoriesTable.tsx:72`, `VisasTable.tsx:75`, `VisaTypesTable.tsx:73`, `CurrenciesTable.tsx:75`, `CountriesTable.tsx:93`, `ToursTable.tsx:120`. **User impact:** mobile admins on iOS Safari see a generic OS dialog with no item-specific context, no undo, and inconsistent styling. **Fix:** Build a single `<ConfirmDialog>` MUI Dialog or Tailwind modal that takes `{ title, body, danger, onConfirm }` and wire it into a delete-button shared component.

4. **WARNING — Break up god components.** `src/app/about/page.jsx` is 1,442 lines, `src/app/contact/page.jsx` 1,407, `src/app/umrah/page.jsx` 896, `src/app/tours/[slug]/page.jsx` 803, `src/components/ServiceCard.jsx` 599. All contain inline styling, animation, and data sections. **Fix:** Extract section components (`ContactStats`, `ContactHero`, `ContactFAQ`, `UmrahPackagesGrid`, `TourItinerary`).

5. **WARNING — Replace inline `fontSize` strings with theme typography variants.** 16+ distinct inline `fontSize` literals (`"0.7rem"`, `"0.72rem"`, `"0.75rem"`, `"0.8rem"`, `"0.82rem"`, `"0.85rem"`, `"0.875rem"`, `"0.9em"`, `"0.9rem"`, `"0.95rem"`, `"1.05rem"`, `"1.1rem"`, `"1.2rem"`, `"4rem"`, `"12px"`, `"14px"`) are scattered across components — `theme.js` already defines `body1`/`body2`/`caption`/`h1`-`h6` via `clamp()` but components ignore them. **Fix:** Audit each `fontSize:` site and either pick a `<Typography variant="...">` or add a missing variant to the theme.

6. **WARNING — Add aria-label to every icon-only IconButton.** 22 IconButton usages, only 9 have `aria-label` (~41% coverage). E.g. `src/components/Header.jsx:203` (theme toggle), `src/components/Header.jsx:326` (drawer close) lack labels. Screen reader users hear "button" with no semantic. **Fix:** Add `aria-label="Toggle theme"`, `aria-label="Close menu"`, etc.

7. **WARNING — `_not-found/page.jsx` is at non-standard path.** Next.js App Router expects `src/app/not-found.tsx` (no underscore, no folder). Current `src/app/_not-found/page.jsx` is treated as a private route and is likely **never rendered** as the 404 — the framework default 404 ("This page could not be found.") will show instead. **Fix:** Move to `src/app/not-found.jsx`.

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)

**Strengths:**
- Public-facing CTAs are specific and brand-aligned: `"Book Now"`, `"Get Started"`, `"View Details"`, `"Load More"`, `"Send Enquiry"`, `"Clear Filters"` (`src/components/Header.jsx:262`, `src/components/home/HeroSlider.jsx:134`, `src/components/ServiceCard.jsx:580`).
- Empty state for tours is contextual: `"No tours found matching your criteria."` with a Clear Filters action (`src/app/tours/page.jsx:392`).
- Error messages on enquiry form include a recovery path: `"Something went wrong. Please try again or call us directly."` (`src/components/EnquiryForm.jsx:290`).
- Success state is warm: `"Thank you! Your enquiry has been received. We will contact you shortly."` (`src/components/EnquiryForm.jsx:285`).
- ErrorBoundary copy is empathetic: `"Oops!"` → `"Something went wrong"` → `"We encountered an unexpected error. Please try refreshing the page or contact us if the problem persists."` (`src/components/ErrorBoundary.jsx:51-58`).

**Findings (justify deducted point):**
- **WARNING — Bare "Failed" strings in admin tables.** 13 admin tables fall back to `setError(d.error || "Failed")` (e.g., `src/components/admin/AttestationTypesTable.tsx:68`, `src/components/admin/ToursTable.tsx:115`). "Failed" is meaningless — no action, no remediation. Replace with `"Could not save changes. Check required fields and try again."`.
- **WARNING — Generic admin Cancel buttons.** 13 instances of `<button>Cancel</button>` in modal footers (e.g., `AttestationsTable.tsx:195`). This is acceptable for modals but pairs with the destructive-action problem below.
- **WARNING — `window.confirm("Delete this tour?")`** copy is technically clear but visually inconsistent and not customizable per-OS — see Top Priority Fix #3.
- **WARNING — Umrah empty state weak.** `"No Umrah packages available at the moment."` (`src/app/umrah/page.jsx:580`) lacks a fallback CTA (e.g., "Contact us to plan a custom Umrah").
- **WARNING — Footer holiday/visa package lists are placeholder.** All 5 holiday packages link to `/tours` (not specific slugs), all 5 visa packages link to `/visas`, all 5 attestation services link to `/attestations` (`src/components/Footer.jsx:35-57`). Either the data should be wired to real slugs or these should be removed as broken affordances.
- **WARNING — Login error too terse.** `"Invalid email or password."` (`src/app/login/page.tsx:37`) — fine for security but no "Forgot password?" recovery path exists anywhere in the admin shell.

### Pillar 2: Visuals (2/4)

**Strengths:**
- Public-side home has a clear visual hierarchy: HeroSlider (video bg, large `Priestacy` script font headline, two CTAs) → TrustedPartners → WhyChooseUs (4 cards) → Featured sections (3) → Testimonials → FAQ → Newsletter (`src/app/page.jsx:42-87`).
- ServiceCard has differentiated badges, location chip, country-flag gradient strip at card bottom (a nice touch — `src/components/ServiceCard.jsx:585-592`).
- Mobile drawer has dedicated layout with logo, nav items, Book Now and Call Us CTAs (`src/components/Header.jsx:296-389`).
- Skeleton components exist for loading states (`src/components/skeletons/SkeletonCard.jsx`, `SkeletonDetail.jsx`).

**Findings:**
- **BLOCKER — Two visual languages.** Compare `src/app/page.jsx` (MUI Container, Typography variants, theme.palette colors) vs `src/components/admin/CountriesTable.tsx` (raw `<table>`, `text-slate-700`, `ring-emerald-600`). They could be two products. The admin login page (`src/app/login/page.tsx`) uses Tailwind utility classes with no MUI involvement, no logo, no theme tokens.
- **WARNING — God components erode visual consistency.** `about/page.jsx` (1,442 lines) and `contact/page.jsx` (1,407 lines) contain animations, data, stats counters, and section markup inline. No way to reuse a "stats counter" or "FAQ accordion" across pages — copy-paste pressure leads to drift.
- **WARNING — Header is transparent on every "hero" route.** `hasHeroSection` evaluates true for `/`, `/tours`, `/umrah`, `/visas`, `/attestations`, `/about`, `/contact` (`src/components/Header.jsx:78-84`), meaning a white-text header sits on top of every page. The dynamic detail routes (e.g., `/tours/[slug]`) are NOT in this list — they will render with `background: transparent` and white text against potentially-white content, making nav unreadable.
- **WARNING — ServiceCard mixes design eras.** Country-flag gradients (`getCountryGradient`) + Umrah-specific palette (`umrahPalette` hardcoded inside the component at `src/components/ServiceCard.jsx:37-44`) + theme palette colors all coexist. The badge background is `countryGradient.gradient` for tours but `umrahPalette` for `variant === "umrah"` and uses `theme.palette.error.main` for badgeColor in tour type — three sources for one element.
- **WARNING — Footer logo height inconsistent.** Header logo is `{ xs: 28, sm: 32, md: 38, lg: 42 }`, footer logo is `{ xs: 32, md: 40 }`, mobile drawer logo is fixed `32` — three different responsive scales for one brand mark.
- **WARNING — No focal point on listing pages.** `tours/page.jsx`, `visas/page.jsx`, `attestations/page.jsx` lead with a hero image + title, then a horizontal filter bar (`src/app/tours/page.jsx:232`), then a grid. Visual hierarchy is flat — nothing pushes the user toward the most-valuable card.

### Pillar 3: Color (1/4)

**Audit numbers:**

| Metric | Count |
|--------|------:|
| Total `#hex` / `rgb()` / `rgba()` occurrences in JSX | **297** |
| Files with >10 hardcoded colors | 11 |
| Worst offenders | `about/page.jsx` (65), `contact/page.jsx` (55), `umrah/page.jsx` (20), `ServiceCard.jsx` (18), `tours/[slug]/page.jsx` (18), `WhyChooseUs.jsx` (16) |
| `theme.palette` references (estimate) | ~80 |
| `sectionColors.*` references outside `designSystem.js` | ~12 |

**Findings:**
- **BLOCKER — Hardcoded brand color drift.** `src/components/_not-found/page.jsx:18` writes `linear-gradient(135deg, #1A428A, #2AB0E5)` — this duplicates the gradient already defined in `theme.js:104` (`containedPrimary.background`). If brand colors change, two places must update.
- **BLOCKER — `--background` and `body bgcolor` conflict.** `src/app/globals.css:12` sets `--background: #ffffff` (light) and dark via `prefers-color-scheme`, BUT `src/styles/globals.css:47` forces `background-color: #0b1121` on body. Both are imported (layout uses `./globals.css` from app/, but `src/styles/globals.css` is in the styles folder — likely an orphan from a Vite-era migration). Result: deep navy body bg appears beneath every page regardless of dark-mode setting.
- **BLOCKER — `60/30/10` is not measurable.** With 297 hardcoded values across primaries (blue `#1A428A`, cyan `#2AB0E5`, deep navy `#0b1121`), accents (emerald `#065F46`, gold `#D4AF37`, orange `#FF6B35`), error reds (`#DC2626`, `#F87171`), and dozens of `rgba(0,0,0,0.X)` overlays, there is no observable 60/30/10 ratio. The intent (`designSystem.js`) shows a 9-color section palette plus 50+ country-flag gradients — a *coloring book*, not a color system.
- **BLOCKER — Two competing CSS-variable definitions.** `src/styles/globals.css:5-8` defines `--primary: #1a237e` and `--accent: #ff5722` (Material Indigo / Deep Orange — totally different brand). `theme.js:8` uses `#1A428A` / `#2AB0E5`. If any utility class (`.btn-primary`, `.btn-accent`) is used, it pulls the wrong brand color.
- **WARNING — Inline emerald-600 admin accent ignores theme.** Admin sidebar (`Sidebar.tsx:118`), login button (`login/page.tsx:98`), all admin table action buttons use `bg-emerald-600` / `text-emerald-600` directly. This is the *third* primary color (alongside theme blue and the orphan indigo).
- **WARNING — `umrahPalette` is a fourth palette source.** Defined inline in `ServiceCard.jsx:37-44` with `emerald: "#065F46"`, `gold: "#D4AF37"` — these duplicate `sectionColors.emerald` and `sectionColors.amber` from `designSystem.js` but live in their own const.
- **WARNING — TextSelection background is hard-coded.** `src/styles/globals.css:99` uses `background: var(--accent)` (`#ff5722`) — selection highlight will be orange on a project with cyan/blue accent.

### Pillar 4: Typography (2/4)

**Audit numbers:**

| Metric | Count / Values |
|--------|----------------|
| Tailwind `text-*` sizes in admin | `text-sm` (299), `text-xs` (24), `text-2xl` (17), `text-lg` (15), `text-base` (2), `text-xl` (1), `text-3xl` (1) — **7 sizes** |
| Tailwind font weights | `font-semibold` (117), `font-medium` (99), `font-bold` (20), `font-normal` (3) — 4 weights |
| Inline `fontWeight: <number>` values | 400, 500, 600, 700, 800, 900 — **6 distinct numeric weights** |
| Inline `fontWeight="bold"` named | 19 occurrences |
| Distinct inline `fontSize` rem/px literals | **16** (`0.7rem`, `0.72rem`, `0.75rem`, `0.7rem`, `0.8rem`, `0.82rem`, `0.85rem`, `0.875rem`, `0.9em`, `0.9rem`, `0.95rem`, `1.05rem`, `1.1rem`, `1.2rem`, `4rem`, `12px`, `14px`) |
| Theme typography variants defined | h1-h6, body1, body2, button (`theme.js:74-145`) |
| Font families in play | `Outfit` (headings), `Inter` (body), `Geist` / `Geist Mono` (Next.js loaded in `layout.tsx:7-15`), `Priestacy` (hero script — `src/app/globals.css:4`), `Arial/Helvetica` fallback (`src/app/globals.css:33`) — **5 families** |

**Findings:**
- **BLOCKER — Theme typography is bypassed.** `theme.js` provides 8 responsive `clamp()`-based variants. Inline `sx={{ fontSize: "0.72rem" }}` (e.g., `ServiceCard.jsx:183`) overrides them. The `clamp()` responsive scaling is lost.
- **WARNING — 6 distinct fontWeights against a 2-weight standard.** Public spec calls for ≤2 weights; this codebase uses 400/500/600/700/800/900 plus the named `"bold"` (= 700). Header active vs inactive nav are 700/600 (`Header.jsx:153`), about page hero uses 900 (`tours/page.jsx:204`), card titles 700/800 conditional (`ServiceCard.jsx:531`).
- **WARNING — Geist font loaded but never used.** `layout.tsx:7-15` loads Geist Sans + Geist Mono via `next/font/google`, applies the variables to `<body>`, but `theme.js:73` sets `fontFamily: '"Inter", "Roboto"...'`. Geist is dead weight on every page load.
- **WARNING — Font family conflict.** `src/app/globals.css:33` sets `body { font-family: Arial, Helvetica, sans-serif }` (this is the OS fallback from `create-next-app`), while `src/styles/globals.css:46` sets `body { font-family: "Inter", sans-serif; }`. Depending on which one wins the cascade, body text is either Inter (intended) or Arial.
- **WARNING — `Priestacy` script font used once for an emotional hero.** `HeroSlider.jsx:76` uses `'Priestacy', cursive` for "Your Travel Partner". Loading an entire custom font file (`src/app/globals.css:3-9`) for a single string is heavy. Either commit to using it for other headings or replace with a Google web font like `Allura`/`Great Vibes`.
- **WARNING — Hero h1 is `<Typography>` but bypasses the h1 variant.** `HeroSlider.jsx:74` uses raw `<Typography sx={{ fontSize: { xs: "2.2rem", ... lg: "6rem" } }}>`. The theme h1 already responsive-clamps; this overrides it.

### Pillar 5: Spacing (2/4)

**Audit numbers:**

| Metric | Result |
|--------|--------|
| `designSystem.js` `spacing` token usage outside its definition file | **0** direct imports of `spacing` (grep `from.*designSystem.*spacing`) — the token is defined but ignored |
| Tailwind arbitrary-value spacing | 5 occurrences (`max-h-[90vh]` x 4, `text-[10px]` x 1) — low |
| Responsive `px:` / `py:` / `mb:` object literals in JSX | High — present in nearly every page hero and section |
| `borderRadius: 50` (pill) inline usages | Heavy — Header CTAs, EnquiryForm submit, HeroSlider buttons, SearchBar, MobileStickyCTA, ServiceCard button, 404 buttons |

**Findings:**
- **WARNING — `spacing` token defined but never imported.** `designSystem.js:32-39` exports `cardPadding`, `cardGap`, `sectionGap`, `sectionPy`, `sectionPyLarge` — none are imported by any consuming component. Each section re-invents `py: { xs: 8, md: 12 }` inline (FeaturedSection.jsx:28, About page, Contact page, etc.). The token system is decorative.
- **WARNING — Container padding inconsistency.** Header uses `px: { xs: 2, sm: 3, lg: 4 }` (`Header.jsx:102`). Footer uses `px: { xs: 2, sm: 3, lg: 4 }` (matching). Tours page uses `px: { xs: 2, sm: 3, lg: 4 }` (matching). But tours hero inside the same page uses `px: { xs: 2, sm: 3 }` only (`tours/page.jsx:199`). Inconsistent across files.
- **WARNING — `borderRadius: 50` magic number.** Used as inline pill radius across 6+ components. `designSystem.js:18` exports `radius.button: "50px"` but very few sites use it (`ServiceCard.jsx:556` does; HeroSlider.jsx:123 does NOT — it uses raw `50`).
- **WARNING — Hero hero heights inconsistent.** HeroSlider: `{ xs: "80vh", md: "85vh" }`. Tours hero: `{ xs: "40vh", sm: "45vh", md: "50vh" }`. About page hero: separate (1,442-line god component — heights inline). No standard.
- **WARNING — Section vertical padding drifts.** `WhyChooseUs.jsx:53`: `py: { xs: 10, md: 18 }`. `FeaturedSection.jsx:28`: `py: { xs: 8, md: 12 }`. `Header.jsx:97`: `py: isScrolled ? { xs: 0.5, md: 0.75 } : { xs: 1, sm: 1.5, md: 2, lg: 2.5 }`. Five different scales.
- **WARNING — `space-y-8`, `space-y-5`, `space-y-3` interleaved in admin.** Login form uses `space-y-8` for outer, `space-y-5` for form (`login/page.tsx:47, 55`). Admin tables use `space-y-3` inside modals. No spacing scale documented.

### Pillar 6: Experience Design (2/4)

**Strengths:**
- Loading states present: `SkeletonCard`, `SkeletonDetail`, `CircularProgress` (86 hits across components).
- `ErrorBoundary` exists and is wrapped at the app shell level via `LayoutShell` / `Providers` (`src/components/ErrorBoundary.jsx`).
- EnquiryForm has full state machine: `loading | success | error` with Alert components and a disabled submit (`EnquiryForm.jsx:33, 283-310`).
- Mobile drawer auto-closes on route change (`Header.jsx:48-50`).
- Reduced-motion CSS present (`src/styles/globals.css:251-258`).
- Touch targets ≥44px enforced via `@media (pointer: coarse)` (`src/styles/globals.css:238-247`).
- Empty state on tours page includes a "Clear Filters" CTA — good recovery path (`tours/page.jsx:394`).

**Findings:**
- **BLOCKER — `window.confirm()` for 13 destructive admin actions** (see Top Priority Fix #3).
- **BLOCKER — No global toast/snackbar.** EnquiryForm shows inline Alert (good for forms), but admin save success / failure surfaces as either `setError(...)` text or a silent `router.refresh()` (`ToursTable.tsx:116`). No "Tour saved" / "Visa updated" feedback. User sees the page reload with no confirmation that the click succeeded.
- **BLOCKER — `_not-found/page.jsx` likely never renders.** Next.js App Router uses `not-found.tsx` at the route or app root (no underscore, no `page.jsx` inside a folder). `src/app/_not-found/page.jsx` is a private-folder route, ignored by the router. The Next.js framework default 404 will render instead (a stark `404 | This page could not be found.` exactly as we observed on the unrelated dev-server screenshot).
- **WARNING — Aria-label coverage ~41% on IconButton.** 22 `IconButton` instances, 9 with `aria-label`. Specifically missing: `Header.jsx:203` (theme toggle Brightness4/7), `Header.jsx:326` (drawer Close), `EnquiryForm` send icon (it has fallback text). Add labels.
- **WARNING — No `disabled` state on `Load More` button.** `tours/page.jsx:372-385` — clicking Load More while data still loads (race) is unguarded. Also no spinner on the button itself.
- **WARNING — No focus management on modal open.** Admin modals (`AttestationsTable.tsx:108-200` pattern) are raw divs — no `role="dialog"`, no `aria-modal`, no focus trap, no Escape-to-close. Keyboard users cannot escape and screen readers won't announce them as dialogs.
- **WARNING — Mobile CTA pattern unclear.** `MobileStickyCTA.jsx` exists; without screenshots its placement is unverified. Code review shows it uses `position: "fixed"` (likely bottom-fixed) — risk of overlap with iOS Safari bottom toolbar without `env(safe-area-inset-bottom)`.
- **WARNING — Theme persistence not verified.** `ColorModeContext` toggles MUI palette mode in memory; no `localStorage` write found in `src/context/ColorModeContext.jsx` (not in audit scope but referenced from Header). Reload likely resets to default.
- **WARNING — Search routing dead-ends.** `SearchBar.jsx:15-19` dispatches `setTourFilter` and pushes `/tours` regardless of input — but on home page the SearchBar's location button (`LocationOnIcon` IconButton at `SearchBar.jsx:43`) does nothing on click (no handler). It's decorative but presented as actionable.
- **WARNING — ErrorBoundary `handleRetry` only flips local state.** `ErrorBoundary.jsx:20-22` resets `hasError: false` but the failing child re-renders with the same props — likely re-throws immediately. Should also `window.location.reload()` or accept an `onRetry` prop.

---

## Files Audited (61 files)

**App routes (public):**
- `src/app/layout.tsx`
- `src/app/page.jsx`
- `src/app/globals.css`
- `src/app/tours/page.jsx`
- `src/app/tours/[slug]/page.jsx`
- `src/app/visas/page.jsx`
- `src/app/visas/[slug]/page.jsx`
- `src/app/attestations/page.jsx`
- `src/app/attestations/[slug]/page.jsx`
- `src/app/umrah/page.jsx`
- `src/app/about/page.jsx`
- `src/app/contact/page.jsx`
- `src/app/login/page.tsx`
- `src/app/_not-found/page.jsx`

**App routes (admin):**
- `src/app/admin/layout.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/tours/page.tsx`
- `src/app/admin/visas/page.tsx`
- `src/app/admin/attestations/page.tsx`
- `src/app/admin/inquiries/page.tsx`
- `src/app/admin/countries/page.tsx`
- `src/app/admin/users/page.tsx`
- `src/app/admin/settings/page.tsx`
- `src/app/admin/masters/{page,attestation-types,currencies,destinations,document-types,service-types,tour-categories,visa-types}/page.tsx`

**Shared components:**
- `src/components/Header.jsx`
- `src/components/Footer.jsx`
- `src/components/ServiceCard.jsx`
- `src/components/EnquiryForm.jsx`
- `src/components/SearchBar.jsx`
- `src/components/ErrorBoundary.jsx`
- `src/components/MobileStickyCTA.jsx`
- `src/components/LayoutShell.tsx`
- `src/components/Providers.jsx`
- `src/components/MarkdownContent.jsx`
- `src/components/ScrollToTop.jsx`
- `src/components/SEO.jsx`
- `src/components/TawkMessenger.jsx`
- `src/components/Globe.jsx`
- `src/components/skeletons/SkeletonCard.jsx`
- `src/components/skeletons/SkeletonDetail.jsx`

**Home sections:**
- `src/components/home/HeroSlider.jsx`
- `src/components/home/FeaturedSection.jsx`
- `src/components/home/WhyChooseUs.jsx`
- `src/components/home/Testimonials.jsx`
- `src/components/home/FAQSection.jsx`
- `src/components/home/HowItWorks.jsx`
- `src/components/home/NewsletterCTA.jsx`
- `src/components/home/TrustedPartners.jsx`
- `src/components/home/ServicesFlow.jsx`

**Admin tables:**
- `src/components/admin/Sidebar.tsx`
- `src/components/admin/ToursTable.tsx`
- `src/components/admin/VisasTable.tsx`
- `src/components/admin/AttestationsTable.tsx`
- `src/components/admin/InquiriesTable.tsx`
- `src/components/admin/CountriesTable.tsx`
- `src/components/admin/UsersTable.tsx`
- `src/components/admin/DashboardInquiries.tsx`
- `src/components/admin/ImageUploader.tsx`
- `src/components/admin/{AttestationTypesTable,CurrenciesTable,DestinationsTable,DocumentTypesTable,ServiceTypesTable,TourCategoriesTable,VisaTypesTable}.tsx`

**Design system / styling:**
- `src/config/designSystem.js`
- `src/theme.js`
- `src/styles/globals.css`

---

## Visual Verification Gap

Because `localhost:3000` was occupied by an unrelated Docker container during this audit, **no rendered screenshots of Origin Travels were captured**. The following findings are inferred from code patterns and would benefit from visual confirmation once the correct dev server is running (`docker compose up` per `DOCKER.md`):

- Header transparency / contrast across all routes (Pillar 2)
- Mobile drawer visual polish (Pillar 2)
- ServiceCard hover state behaviors (Pillar 2)
- Mobile sticky CTA placement and safe-area handling (Pillar 6)
- Dark-mode toggle actual rendered effect (Pillar 3)
- Hero video performance and overlay readability (Pillar 2)
- Admin table responsive behavior on mobile (Pillar 2)

Re-run `/gsd:ui-review` after stopping the conflicting container with `docker stop complete-all-phases-app` and starting the project's own server with `docker compose up` from this repo.
