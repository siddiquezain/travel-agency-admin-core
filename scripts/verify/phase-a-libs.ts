// Phase A library verification. Run inside the app container:
//   docker compose exec app npx tsx scripts/verify/phase-a-libs.ts
import assert from "node:assert/strict";
import {
  RESOURCE_CATEGORIES,
  isResourceCategory,
} from "../../src/lib/travel-resources";
import {
  destinationJsonLd,
  faqPageJsonLd,
  destinationGraph,
} from "../../src/lib/destination-jsonld";

// --- travel-resources.ts ---
assert.equal(RESOURCE_CATEGORIES.length, 17, "expected 17 resource categories");
assert.ok(RESOURCE_CATEGORIES.includes("Destination Guides"));
assert.ok(RESOURCE_CATEGORIES.includes("Seasonal Travel Guides"));
assert.equal(isResourceCategory("Travel Tips"), true);
assert.equal(isResourceCategory("Nonsense Category"), false);

// --- destination-jsonld.ts ---
const d = destinationJsonLd({
  name: "Dubai",
  slug: "dubai",
  description: "Guide to Dubai.",
  heroImage: "/img/dubai.jpg",
  country: "United Arab Emirates",
}) as Record<string, unknown>;
assert.equal(d["@type"], "TouristDestination");
assert.equal(d.url, "https://origintoursandtravels.com/destinations/dubai");
assert.equal(d.image, "https://origintoursandtravels.com/img/dubai.jpg");

assert.equal(faqPageJsonLd([]), null, "empty faqs -> null");
const faq = faqPageJsonLd([{ q: "Is it safe?", a: "Yes." }]) as Record<
  string,
  unknown
>;
assert.equal(faq["@type"], "FAQPage");
assert.equal((faq.mainEntity as unknown[]).length, 1);

const graph = destinationGraph({
  name: "Dubai",
  slug: "dubai",
  faqs: [{ q: "Q", a: "A" }],
}) as Record<string, unknown>;
const nodes = graph["@graph"] as Array<Record<string, unknown>>;
assert.equal(graph["@context"], "https://schema.org");
assert.ok(nodes.some((n) => n["@type"] === "TouristDestination"));
assert.ok(nodes.some((n) => n["@type"] === "BreadcrumbList"));
assert.ok(nodes.some((n) => n["@type"] === "FAQPage"));

console.log("phase-a-libs: ALL ASSERTIONS PASSED");
