// src/app/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Root layout — schema changes ONLY. Merge with your existing layout.tsx.
// Add the two schema components inside <head> and import them at the top.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { LocalBusinessSchema, WebSiteSchema } from "@/components/schema";

// ── Keep your existing metadata export unchanged ──────────────────────────────
export const metadata: Metadata = {
  // ... your existing metadata fields remain here unchanged
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ── SCHEMA 1: LocalBusiness + TravelAgency (site-wide) ── */}
        <LocalBusinessSchema />

        {/* ── SCHEMA 2: WebSite + Sitelinks Searchbox (site-wide) ── */}
        <WebSiteSchema />

        {/*
          ╔═══════════════════════════════════════════════════════════════╗
          ║  All your existing <head> tags (fonts, favicon, etc.) stay   ║
          ║  exactly as they are. Just add the two lines above.          ║
          ╚═══════════════════════════════════════════════════════════════╝
        */}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
