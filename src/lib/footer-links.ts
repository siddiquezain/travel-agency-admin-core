import { prisma } from "@/core/lib/prisma";

const TOUR_KEYWORDS: Array<{ name: string; keywords: string[] }> = [
  { name: "Delhi Agra Jaipur Tour Packages", keywords: ["delhi", "agra", "jaipur"] },
  { name: "Kashmir Promotional Package (Deluxe)", keywords: ["kashmir"] },
  { name: "Kerala Tour Package (Luxury)", keywords: ["kerala"] },
  { name: "Shimla Manali Chandigarh Tour Packages (Deluxe)", keywords: ["shimla", "manali"] },
  { name: "Ooty Tour Packages", keywords: ["ooty"] },
];

const VISA_KEYWORDS: Array<{ name: string; keywords: string[] }> = [
  { name: "Dubai Tourist Visa 30 Days", keywords: ["dubai", "30"] },
  { name: "Dubai Tourist Visa 90 Days", keywords: ["dubai", "90"] },
  { name: "Saudi Arabia 30 Days Tourist Visa", keywords: ["saudi"] },
  { name: "Malaysia 15 Days Tourist eNTRI Visa", keywords: ["malaysia"] },
  { name: "Qatar 30 Days Tourist Visa", keywords: ["qatar"] },
];

function pickBestMatch(
  rows: Array<{ slug: string; haystack: string }>,
  keywords: string[],
): string | null {
  let bestSlug: string | null = null;
  let bestScore = 0;
  for (const r of rows) {
    const hay = r.haystack.toLowerCase();
    const score = keywords.reduce((s, k) => s + (hay.includes(k) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestSlug = r.slug;
    }
  }
  return bestScore >= 1 ? bestSlug : null;
}

export async function getPopularFooterLinks() {
  try {
    const [tours, visas] = await Promise.all([
      prisma.tour.findMany({
        where: { isActive: true },
        select: { slug: true, title: true },
      }),
      prisma.visa.findMany({
        where: { isActive: true },
        select: { slug: true, country: true, type: true },
      }),
    ]);

    const tourRows = tours.map((t) => ({ slug: t.slug, haystack: t.title ?? "" }));
    const visaRows = visas.map((v) => ({
      slug: v.slug,
      haystack: `${v.country ?? ""} ${v.type ?? ""}`,
    }));

    return {
      popularTours: TOUR_KEYWORDS.map(({ name, keywords }) => {
        const slug = pickBestMatch(tourRows, keywords);
        return { name, to: slug ? `/tours/${slug}` : "/tours" };
      }),
      popularVisas: VISA_KEYWORDS.map(({ name, keywords }) => {
        const slug = pickBestMatch(visaRows, keywords);
        return { name, to: slug ? `/visas/${slug}` : "/visas" };
      }),
    };
  } catch {
    return { popularTours: undefined, popularVisas: undefined };
  }
}
