/**
 * Legacy URL redirects, derived from the Google Search Console "Not found (404)"
 * export (2026-07-20). Two eras of dead URLs are covered:
 *
 *  1. WooCommerce/WordPress URLs (`/product/*`, `/product-category/*`, `/shop/*`,
 *     and flat WP page slugs) from the site that preceded this Next.js app.
 *  2. Next.js tour slugs that were renamed after Google had already indexed them.
 *
 * Not covered on purpose: the ~730 `/?w=<hash>` URLs and ~115 `/wp-*.php` probes
 * in that same export. Those are spam/hack artifacts, never real pages — a 404 is
 * the correct response and redirecting them would only launder junk into the index.
 *
 * Order matters: Next.js takes the first match, so specific rules precede the
 * catch-alls at the bottom of each section. Sources are written WITHOUT a trailing
 * slash — Next.js 308s `/foo/` to `/foo` before redirect matching runs.
 */

type Redirect = { source: string; destination: string; permanent: boolean };

const permanent = (source: string, destination: string): Redirect => ({
  source,
  destination,
  permanent: true,
});

/**
 * Tour slugs renamed after indexing. These are the highest-value entries here —
 * unlike the WooCommerce URLs, these pages still exist and rank; they just moved.
 */
const renamedTours: Redirect[] = [
  permanent(
    "/tours/kerala-tour-munnar-thekkady-alleppey-kovalam",
    "/tours/kerala-tour-munnar-thekkady-alleppey-kovalam-from-hyderabad"
  ),
  permanent(
    "/tours/bangalore-mysore-coorg-wayanad-tour-deluxe",
    "/tours/bangalore-mysore-coorg-wayanad-tour-from-hyderabad"
  ),
  permanent(
    "/tours/chennai-tirupati-pondicherry-tour-from-hyderabad",
    "/tours/chennai-tirupati-pondicherry-tour-package"
  ),
  permanent(
    "/tours/dubai-city-tour-from-hyderabad",
    "/tours/dubai-tour-packages-from-hyderabad"
  ),
  permanent(
    "/tours/munnar-alleppey-kovalam-honeymoon-economy",
    "/tours/munnar-alleppey-kovalam-honeymoon-from-hyderabad"
  ),
  permanent("/tours/umrah-standard-package-from-hyderabad", "/umrah"),
];

/** Flat WordPress page slugs. */
const legacyPages: Redirect[] = [
  permanent("/about-us", "/about"),
  permanent("/airticketing", "/flights"),
  permanent("/services", "/"),

  // Holiday package hubs → the tours listing
  permanent("/holiday-packages", "/tours"),
  permanent("/domestic-holiday-packages", "/tours"),
  permanent("/international-holiday-packages", "/tours"),

  // Individual package pages
  permanent("/hyderabad-tour-package", "/tours/hyderabad-and-srisailam-heritage-pilgrimage-comfort"),
  permanent("/hyderabad-tour-package-2", "/tours/hyderabad-and-srisailam-heritage-pilgrimage-comfort"),
  permanent("/kerala-tour-packageluxury", "/tours/kerala-tour-package-munnar-thekkady-alleppey-kovalam"),
  permanent("/leh-ladakh-tour-package-6-nights-7-days", "/tours/leh-ladakh-tour-package-from-hyderabad"),
  permanent("/shimla-manali-chandigarh-tour-packagesdeluxe-tour-booking", "/tours/shimla-manali-package-from-hyderabad"),
  permanent("/shimla-manali-chandigarh-tour-packagesstandard", "/tours/shimla-manali-package-from-hyderabad"),
  permanent("/galleries/malaysia", "/tours/malaysia-tour-packages-from-hyderabad"),

  // Umrah
  permanent("/hajj-umrah-packages-hyderabad", "/umrah"),
  permanent("/golden-umrah-package-2", "/umrah"),
  permanent("/platinum-umrah-package-1", "/umrah"),
  permanent("/platinum-umrah-package-2", "/umrah"),
  permanent("/a-guide-to-umrah", "/travel-resources/umrah-from-hyderabad-2025-complete-guide"),

  // Visas
  permanent("/visa-stamping", "/visas"),
  permanent("/visastamping", "/visas"),
  permanent("/srilanka-30-days-tourist-visa", "/visas/sri-lanka-tourist"),

  // Attestations
  permanent("/certificate-attestation", "/attestations"),
  permanent("/dubai-birth-certificate-attestation", "/attestations/birth-certificate-attestation-united-arab-emirates"),
  permanent("/saudi-arabia-marriage-certificate-attestation", "/attestations/marriage-certificate-attestation-mp5bq3pa"),
  permanent("/saudi-arabia-bonafide-certificate-attestation", "/attestations"),
  permanent("/saudi-arabia-death-certificate-attestation", "/attestations"),

  // WP date archive and demo-theme leftovers
  permanent("/2024/11", "/travel-resources"),
  permanent("/portfolio/:path*", "/"),
];

/** WooCommerce product pages, mapped to their nearest current equivalent. */
const legacyProducts: Redirect[] = [
  // Visas
  permanent("/product/bahrain-30-days-tourist-visa", "/visas/bahrain-tourist-visa-from-hyderabad"),
  permanent("/product/china-30-days-business-visa", "/visas/china-tourist-single-entry"),
  permanent("/product/china-30-days-tourist-visaexpress-visa", "/visas/china-tourist-single-entry"),
  permanent("/product/japan-30-days-tourist-visa", "/visas/japan-tourist-single-entry-visa-from-hyderabad"),
  permanent("/product/malaysia-15-days-tourist-entri-visa", "/visas/malaysia-tourist-visa-from-hyderabad"),
  permanent("/product/malaysia-30-days-multiple-entry-sticker-visa", "/visas/malaysia-tourist-visa-from-hyderabad"),
  permanent("/product/oman-10-days-tourist-visa", "/visas/oman-tourist"),
  permanent("/product/oman-30-days-tourist-visa", "/visas/oman-tourist-30days"),
  permanent("/product/oman-90-days-tourist-visa", "/visas/oman-tourist"),
  permanent("/product/qatar-30-days-tourist-visa", "/visas/qatar-tourist-visa-from-hyderabad"),
  permanent("/product/qatar-30-days-tourist-visaexpress-visa", "/visas/qatar-tourist-visa-from-hyderabad"),
  permanent("/product/saudi-arabia-30-days-tourist-visa", "/visas/saudi-arabia-tourist-e-visa"),
  permanent("/product/srilanka-30-days-business-visa", "/visas/sri-lanka-tourist"),
  permanent("/product/thailand-tourist-e-visa-express", "/visas/thailand-tourist"),
  permanent("/product/thailand-tourist-e-visa-popular", "/visas/thailand-tourist"),
  permanent("/product/thailand-tourist-visa-stamp-visa", "/visas/thailand-tourist"),

  // Attestations
  permanent("/product/dubai-marriage-certificate-attestation", "/attestations/uae-marriage-certificate-attestation"),
  permanent("/product/oman-marriage-certificate-attestation", "/attestations/marriage-certificate-attestation-mp5bq3pa"),
  permanent("/product/qatar-marriage-certificate-attestation", "/attestations/marriage-certificate-attestation-mp5bq3pa"),
  permanent("/product/saudi-arabia-marriage-certificate-attestation", "/attestations/marriage-certificate-attestation-mp5bq3pa"),
  permanent("/product/saudi-arabia-birth-certificate-attestation", "/attestations/saudi-birth-certificate-attestation"),
  permanent("/product/dubai-death-certificate-attestation", "/attestations"),
  permanent("/product/qatar-birth-certificate-attestation", "/attestations"),
  permanent("/product/qatar-bonafide-certificate-attestation", "/attestations"),
  permanent("/product/qatar-death-certificate-attestation", "/attestations"),

  // Umrah packages — the old per-tier product pages are all superseded by /umrah
  permanent("/product/budget-umrah-package", "/umrah"),
  permanent("/product/diamond-umrah-package-1", "/umrah"),
  permanent("/product/diamond-umrah-package-2", "/umrah"),
  permanent("/product/golden-umrah-package-1", "/umrah"),
  permanent("/product/golden-umrah-package-2", "/umrah"),
  permanent("/product/platinum-umrah-package-2", "/umrah"),
  permanent("/product/eid-in-madinah-umrah-package", "/umrah"),
  permanent("/product/eid-in-makkah-umrah-package", "/umrah"),
  permanent("/product/full-month-eid-in-madinah-package", "/umrah"),

  // Tours
  permanent("/product/dubai-tour-packages-2", "/tours/dubai-tour-packages-from-hyderabad"),
  permanent("/product/hyderabad-highlights", "/tours/hyderabad-and-srisailam-heritage-pilgrimage-comfort"),
  permanent("/product/hyderabad-packages-deluxe", "/tours/hyderabad-and-srisailam-heritage-pilgrimage-deluxe"),
  permanent("/product/kerala-tour-packagedeluxe", "/tours/kerala-tour-package-munnar-thekkady-alleppey-from-hyderabad"),
  permanent("/product/kerala-tourspecial-honeymoon-package-1", "/tours/munnar-alleppey-kovalam-honeymoon-from-hyderabad"),
  permanent("/product/malaysia-tour-packages", "/tours/malaysia-tour-packages-from-hyderabad"),
  permanent("/product/shimla-manali-chandigarh-tour-packages1", "/tours/shimla-manali-package-from-hyderabad"),
  permanent("/product/tashkent-tour-packages", "/tours/tashkent-tour-package-from-hyderabad"),
  permanent("/product/thailand-tour-packages", "/tours/thailand-tour-package-from-hyderabad"),
];

/**
 * Catch-alls for the rest of the WooCommerce surface. Every `/shop/*` URL in the
 * export is a demo-theme leftover (`?filter_brand=flos`, `/shop/page/4/`) with no
 * real equivalent, so these land on the closest listing page rather than 404.
 */
const legacyStorefront: Redirect[] = [
  permanent("/product-category/visa-packages/:path*", "/visas"),
  permanent("/product-category/certificate-attestations/:path*", "/attestations"),
  permanent("/product-category/umrah-packages/:path*", "/umrah"),
  permanent("/product-category/:path*", "/tours"),
  permanent("/product/:path*", "/tours"),
  permanent("/shop/:path*", "/tours"),
  permanent("/shop", "/tours"),
];

export const legacyRedirects: Redirect[] = [
  ...renamedTours,
  ...legacyPages,
  ...legacyProducts,
  ...legacyStorefront,
];
