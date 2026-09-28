// src/app/page.tsx  (homepage)
// ─────────────────────────────────────────────────────────────────────────────
// Schema changes ONLY. Merge with your existing page.tsx.
// Add the three imports at the top and the three schema tags inside the JSX.
// ─────────────────────────────────────────────────────────────────────────────

import {
  FAQSchema,
  ReviewSchema,
  BreadcrumbSchema,
  breadcrumbs,
} from "@/components/schema";

export default function HomePage() {
  return (
    <>
      {/* ── SCHEMA 3: FAQPage — enables accordion in Google results ── */}
      <FAQSchema />

      {/* ── SCHEMA 4: AggregateRating + Reviews — enables star ratings ── */}
      <ReviewSchema />

      {/* ── SCHEMA 5: BreadcrumbList for homepage ── */}
      <BreadcrumbSchema items={breadcrumbs.home} />

      {/*
        ╔═══════════════════════════════════════════════════════════════╗
        ║  Your existing homepage JSX stays exactly as it is below.    ║
        ║  Just add the three schema tags above at the top of the      ║
        ║  return statement, before your first <section> or <main>.    ║
        ╚═══════════════════════════════════════════════════════════════╝
      */}

      {/* ... your existing homepage sections ... */}
    </>
  );
}
