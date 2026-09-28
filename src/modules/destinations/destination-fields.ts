// Shared normalization for the rich Destination fields, used by both the
// create (POST) and update (PUT) admin API routes so the two stay in sync.
// Keeps the JSON columns (gallery, sections, attractions, faqs) clean:
// empty arrays/objects collapse to null so the DB never stores noise.

type Faq = { q: string; a: string };
type Attraction = { name: string; description?: string; image?: string };

// Ordered guide sections. `key` matches the Destination.sections JSON keys;
// `label` is the heading shown on the public guide page and the admin form.
// Single source of truth so the page and CMS never drift apart.
export const DESTINATION_SECTIONS = [
    { key: "whyVisit", label: "Why Visit" },
    { key: "bestTimeToVisit", label: "Best Time to Visit" },
    { key: "weather", label: "Weather" },
    { key: "thingsToDo", label: "Things to Do" },
    { key: "cuisine", label: "Local Cuisine" },
    { key: "culture", label: "Culture" },
    { key: "shopping", label: "Shopping" },
    { key: "transportation", label: "Transportation" },
    { key: "safetyTips", label: "Safety Tips" },
] as const;

export type DestinationSectionKey =
    (typeof DESTINATION_SECTIONS)[number]["key"];

function cleanStringArray(value: unknown): string[] | null {
    if (!Array.isArray(value)) return null;
    const arr = value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
    return arr.length ? arr : null;
}

function cleanFaqs(value: unknown): Faq[] | null {
    if (!Array.isArray(value)) return null;
    const arr = value
        .map((f) => {
            if (!f || typeof f !== "object") return null;
            const r = f as Record<string, unknown>;
            const q = typeof r.q === "string" ? r.q.trim() : "";
            const a = typeof r.a === "string" ? r.a.trim() : "";
            return q && a ? { q, a } : null;
        })
        .filter((f): f is Faq => f !== null);
    return arr.length ? arr : null;
}

function cleanAttractions(value: unknown): Attraction[] | null {
    if (!Array.isArray(value)) return null;
    const arr = value
        .map((a) => {
            if (!a || typeof a !== "object") return null;
            const r = a as Record<string, unknown>;
            const name = typeof r.name === "string" ? r.name.trim() : "";
            if (!name) return null;
            const description = typeof r.description === "string" ? r.description.trim() : "";
            const image = typeof r.image === "string" ? r.image.trim() : "";
            return {
                name,
                ...(description ? { description } : {}),
                ...(image ? { image } : {}),
            };
        })
        .filter((a): a is Attraction => a !== null);
    return arr.length ? arr : null;
}

// Keeps only non-empty string blocks in the sections object; returns null when
// nothing meaningful remains.
function cleanSections(value: unknown): Record<string, string> | null {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        if (typeof v === "string" && v.trim()) out[k] = v;
    }
    return Object.keys(out).length ? out : null;
}

const strOrNull = (v: unknown) =>
    typeof v === "string" && v.trim() ? v.trim() : null;

/**
 * Extracts and normalizes the rich Destination fields from a request body.
 * Returns a partial `data` object containing only the keys present in `body`,
 * so it composes with PUT's "only update what was sent" semantics. Core fields
 * (name, slug, countryId, isActive) are handled separately by each route.
 */
export function normalizeDestinationRichFields(
    body: Record<string, unknown>,
): Record<string, unknown> {
    const data: Record<string, unknown> = {};

    if ("heroImage" in body) data.heroImage = strOrNull(body.heroImage);
    if ("overview" in body) data.overview = strOrNull(body.overview);
    if ("region" in body) data.region = strOrNull(body.region);
    if ("bestTimeShort" in body) data.bestTimeShort = strOrNull(body.bestTimeShort);
    if ("metaTitle" in body) data.metaTitle = strOrNull(body.metaTitle);
    if ("metaDescription" in body) data.metaDescription = strOrNull(body.metaDescription);

    if ("gallery" in body) data.gallery = cleanStringArray(body.gallery);
    if ("sections" in body) data.sections = cleanSections(body.sections);
    if ("attractions" in body) data.attractions = cleanAttractions(body.attractions);
    if ("faqs" in body) data.faqs = cleanFaqs(body.faqs);

    if ("featured" in body) data.featured = Boolean(body.featured);
    if ("sortOrder" in body) {
        const n = Number(body.sortOrder);
        data.sortOrder = Number.isFinite(n) ? n : null;
    }

    return data;
}
