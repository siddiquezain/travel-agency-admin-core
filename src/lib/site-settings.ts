import { prisma } from "@/lib/prisma";

export const SITE_SETTING_FIELDS = [
    "companyName",
    "tagline",
    "supportEmail",
    "supportPhone",
    "whatsapp",
    "addressLine",
    "city",
    "state",
    "postalCode",
    "country",
    "smtpHost",
    "smtpPort",
    "smtpUser",
    "smtpPass",
    "smtpSecure",
    "inquiryFrom",
    "inquiryTo",
    "heroSlides",
    "sliderAutoplay",
    "sliderInterval",
    "sliderSpeed",
    "sliderLoop",
    "sliderShowDots",
    "sliderShowArrows",
    "sliderPauseOnHover",
] as const;

export type SiteSettingFieldName = (typeof SITE_SETTING_FIELDS)[number];

export type SiteSettingRow = {
    id: number;
    companyName: string;
    tagline: string | null;
    supportEmail: string | null;
    supportPhone: string | null;
    whatsapp: string | null;
    addressLine: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
    smtpHost: string | null;
    smtpPort: number | null;
    smtpUser: string | null;
    smtpPass: string | null;
    smtpSecure: boolean;
    inquiryFrom: string | null;
    inquiryTo: string | null;
    heroSlides: unknown;
    sliderAutoplay: boolean;
    sliderInterval: number;
    sliderSpeed: number;
    sliderLoop: boolean;
    sliderShowDots: boolean;
    sliderShowArrows: boolean;
    sliderPauseOnHover: boolean;
    updatedAt: Date;
    createdAt: Date;
};

export type HeroSlide = {
    image: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
};

/** Safely coerce the SiteSetting.heroSlides JSON column into a typed array. */
export function parseHeroSlides(value: unknown): HeroSlide[] {
    if (!Array.isArray(value)) return [];
    return value
        .filter((s): s is Record<string, unknown> => !!s && typeof s === "object")
        .map((s) => ({
            image: typeof s.image === "string" ? s.image : "",
            title: typeof s.title === "string" ? s.title : "",
            subtitle: typeof s.subtitle === "string" ? s.subtitle : "",
            ctaLabel: typeof s.ctaLabel === "string" ? s.ctaLabel : "",
            ctaHref: typeof s.ctaHref === "string" ? s.ctaHref : "",
        }))
        .filter((s) => s.image || s.title);
}

let cached: SiteSettingRow | null = null;
let cachedAt = 0;
const TTL_MS = 30_000;

export async function getSiteSettings(): Promise<SiteSettingRow> {
    if (cached && Date.now() - cachedAt < TTL_MS) return cached;
    const row = await prisma.siteSetting.upsert({
        where: { id: 1 },
        create: { id: 1 },
        update: {},
    });
    cached = row as unknown as SiteSettingRow;
    cachedAt = Date.now();
    return cached;
}

export function invalidateSiteSettings(): void {
    cached = null;
    cachedAt = 0;
}
