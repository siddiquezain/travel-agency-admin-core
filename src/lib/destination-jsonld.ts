// JSON-LD builders for destination guide pages (/destinations/[slug]).
// Reuses SITE_URL + breadcrumb from service-jsonld to stay consistent with
// the tour/visa/service structured data already in production.
import { SITE_URL, breadcrumbJsonLd } from "@/lib/service-jsonld";

type Maybe<T> = T | null | undefined;
type Faq = { q: string; a: string };

const abs = (path: string) =>
  path.startsWith("http")
    ? path
    : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

// schema.org TouristDestination for a destination guide.
export function destinationJsonLd(args: {
  name: string;
  slug: string;
  description?: Maybe<string>;
  heroImage?: Maybe<string>;
  country?: Maybe<string>;
}) {
  const url = abs(`/destinations/${args.slug}`);
  const description =
    (args.description ?? "").trim() ||
    `${args.name} travel guide — best time to visit, top attractions, culture, and tips from Origin Tours and Travels.`;
  return {
    "@type": "TouristDestination",
    name: args.name,
    description: description.slice(0, 500),
    url,
    ...(args.heroImage ? { image: abs(args.heroImage) } : {}),
    ...(args.country
      ? { containedInPlace: { "@type": "Country", name: args.country } }
      : {}),
    touristType: "Leisure",
  };
}

// schema.org FAQPage; returns null when there are no complete Q/A pairs.
export function faqPageJsonLd(faqs: Maybe<Faq[]>) {
  const clean = (faqs ?? []).filter((f) => f?.q?.trim() && f?.a?.trim());
  if (!clean.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: clean.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// Full @graph for a destination guide page: TouristDestination + Breadcrumb
// (+ FAQPage when FAQs exist). Ready to JSON.stringify into a ld+json script.
export function destinationGraph(args: {
  name: string;
  slug: string;
  description?: Maybe<string>;
  heroImage?: Maybe<string>;
  country?: Maybe<string>;
  faqs?: Maybe<Faq[]>;
}) {
  const nodes: object[] = [
    destinationJsonLd(args),
    breadcrumbJsonLd([
      { name: "Destinations", path: "/destinations" },
      { name: args.name, path: `/destinations/${args.slug}` },
    ]),
  ];
  const faq = faqPageJsonLd(args.faqs);
  if (faq) nodes.push(faq);
  return { "@context": "https://schema.org", "@graph": nodes };
}
