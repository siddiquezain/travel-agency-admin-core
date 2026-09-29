// Ready-to-paste JSON-LD builders for service & detail pages.
// Mirrors the inline pattern already used in src/app/hajj/page.jsx and the
// root TravelAgency node in src/app/layout.tsx (@id `${SITE_URL}#travelagency`).
//
// Usage in a server page:
//   import { serviceJsonLd, breadcrumbJsonLd } from "@/lib/service-jsonld";
//   const jsonLd = { "@context": "https://schema.org", "@graph": [
//     serviceJsonLd({ name: "...", serviceType: "...", path: "/visas", description: "..." }),
//     breadcrumbJsonLd([{ name: "Visa Services", path: "/visas" }]),
//   ]};
//   <script type="application/ld+json"
//     dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

type Maybe<T> = T | null | undefined;

export const SITE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const TRAVELAGENCY_ID = `${SITE_URL}#travelagency`;

const abs = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

function parsePrice(input: Maybe<string | number>): string | null {
  if (input == null) return null;
  const cleaned = String(input).replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const n = parseFloat(cleaned);
  if (!isFinite(n) || n <= 0) return null;
  return String(Math.round(n));
}

// Lowest room price across a tour's `packages` array.
function startingPriceFromPackages(packages: unknown): string | null {
  if (!Array.isArray(packages)) return null;
  let best: number | null = null;
  for (const p of packages as Array<Record<string, unknown>>) {
    const rooms = (p?.roomPrices ?? p?.prices ?? []) as Array<Record<string, unknown>>;
    if (!Array.isArray(rooms)) continue;
    for (const r of rooms) {
      const n = parseFloat(String(r?.price ?? "").replace(/[^0-9.]/g, ""));
      if (isFinite(n) && n > 0 && (best === null || n < best)) best = n;
    }
  }
  return best === null ? null : String(Math.round(best));
}

function firstImage(images: unknown): string | null {
  if (!Array.isArray(images)) return null;
  for (const img of images) {
    if (typeof img === "string" && img.trim()) return abs(img);
  }
  return null;
}

// ── BreadcrumbList ───────────────────────────────────────────────────────────
// Pass the trail AFTER Home (Home is prepended automatically).
export function breadcrumbJsonLd(
  trail: Array<{ name: string; path: string }>,
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...trail.map((t, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: t.name,
        item: abs(t.path),
      })),
    ],
  };
}

// ── Service (visas, attestation, air-ticketing, hotel, transport) ────────────
// Correct replacement for the misused `Product` type on non-tour services.
export function serviceJsonLd(args: {
  name: string;
  serviceType: string;
  path: string;
  description?: Maybe<string>;
  areaServed?: string; // default "India"
  price?: Maybe<string | number>; // optional "from" price (e.g. visa/attestation fee)
  images?: unknown; // optional image array
}) {
  const price = parsePrice(args.price);
  const image = firstImage(args.images);
  const description =
    (args.description ?? "").trim() ||
    `${args.name} — contact us to learn more.`;
  return {
    "@type": "Service",
    name: args.name,
    serviceType: args.serviceType,
    description: description.slice(0, 500),
    url: abs(args.path),
    ...(image ? { image } : {}),
    areaServed: args.areaServed ?? "India",
    provider: { "@id": TRAVELAGENCY_ID },
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            url: abs(args.path),
            priceCurrency: "INR",
            price,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

// ── TouristTrip (tour / holiday / Umrah packages) ────────────────────────────
// Correct replacement for `Product` on /tours/[slug] and /umrah.
export function touristTripJsonLd(args: {
  name: string;
  path: string;
  description?: Maybe<string>;
  image?: Maybe<string>;
  images?: unknown; // image array (first valid one is used if `image` is absent)
  price?: Maybe<string | number>; // "from" price per person
  packages?: unknown; // tour packages — lowest room price is used if `price` is absent
  destination?: string; // e.g. "Makkah & Madinah, Saudi Arabia"
  itinerary?: string[]; // optional ordered stops
}) {
  const price = parsePrice(args.price) ?? startingPriceFromPackages(args.packages);
  const image = args.image ? abs(args.image) : firstImage(args.images);
  const description =
    (args.description ?? "").trim() ||
    `${args.name} — contact us to learn more.`;
  return {
    "@type": "TouristTrip",
    name: args.name,
    description: description.slice(0, 500),
    url: abs(args.path),
    ...(image ? { image } : {}),
    ...(args.destination
      ? { touristType: "Leisure", arrivalLocation: { "@type": "Place", name: args.destination } }
      : {}),
    ...(args.itinerary && args.itinerary.length
      ? {
          itinerary: {
            "@type": "ItemList",
            itemListElement: args.itinerary.map((stop, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: stop,
            })),
          },
        }
      : {}),
    provider: { "@id": TRAVELAGENCY_ID },
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            url: abs(args.path),
            priceCurrency: "INR",
            price,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

// ── AggregateRating ──────────────────────────────────────────────────────────
// IMPORTANT (audit C-1 / H-2): only emit this with REAL, verifiable review data
// from the claimed Google Business Profile. Do NOT use the marketing "10K+ / 4.9"
// figures — invented ratings are a YMYL trust violation and a structured-data
// guideline breach. Wire ratingValue/reviewCount to live GBP numbers, then spread
// the result into the root TravelAgency node in app/layout.tsx:
//   { ...travelAgencyNode, ...aggregateRatingJsonLd({ ratingValue, reviewCount }) }
export function aggregateRatingJsonLd(args: {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
}) {
  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(args.ratingValue),
      reviewCount: String(args.reviewCount),
      bestRating: String(args.bestRating ?? 5),
    },
  };
}
