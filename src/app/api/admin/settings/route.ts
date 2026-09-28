import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";
import { requireSession, pick, prismaErrorResponse } from "@/core/auth/helpers";
import { SITE_SETTING_FIELDS, invalidateSiteSettings } from "@/core/lib/site-settings";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS: Record<string, number> = {
    companyName: 200,
    tagline: 240,
    supportEmail: 200,
    supportPhone: 40,
    whatsapp: 40,
    addressLine: 240,
    city: 120,
    state: 120,
    postalCode: 20,
    country: 120,
    smtpHost: 200,
    smtpUser: 200,
    smtpPass: 400,
    inquiryFrom: 240,
    inquiryTo: 240,
};

export async function GET() {
    const { error } = await requireSession();
    if (error) return error;

    const row = await prisma.siteSetting.upsert({
        where: { id: 1 },
        create: { id: 1 },
        update: {},
    });
    return NextResponse.json(row);
}

export async function PUT(request: NextRequest) {
    const { error } = await requireSession();
    if (error) return error;

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
        return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }

    const candidate = pick(body as Record<string, unknown>, SITE_SETTING_FIELDS) as Record<string, unknown>;

    if (typeof candidate.companyName === "string" && !candidate.companyName.trim()) {
        return NextResponse.json({ error: "companyName cannot be empty" }, { status: 400 });
    }

    for (const [field, max] of Object.entries(LIMITS)) {
        const v = candidate[field];
        if (typeof v === "string" && v.length > max) {
            return NextResponse.json({ error: `${field} too long (max ${max})` }, { status: 400 });
        }
    }

    if (typeof candidate.supportEmail === "string" && candidate.supportEmail && !EMAIL_RE.test(candidate.supportEmail)) {
        return NextResponse.json({ error: "invalid supportEmail" }, { status: 400 });
    }
    if (typeof candidate.inquiryTo === "string" && candidate.inquiryTo && !EMAIL_RE.test(candidate.inquiryTo)) {
        return NextResponse.json({ error: "invalid inquiryTo" }, { status: 400 });
    }

    if ("smtpPort" in candidate) {
        const raw = candidate.smtpPort;
        if (raw === "" || raw == null) {
            candidate.smtpPort = null;
        } else {
            const n = Number(raw);
            if (!Number.isInteger(n) || n < 1 || n > 65535) {
                return NextResponse.json({ error: "invalid smtpPort" }, { status: 400 });
            }
            candidate.smtpPort = n;
        }
    }
    if ("smtpSecure" in candidate) {
        candidate.smtpSecure = Boolean(candidate.smtpSecure);
    }

    for (const key of ["sliderAutoplay", "sliderLoop", "sliderShowDots", "sliderShowArrows", "sliderPauseOnHover"] as const) {
        if (key in candidate) candidate[key] = Boolean(candidate[key]);
    }
    const SLIDER_RANGES: Record<string, [number, number]> = {
        sliderInterval: [1000, 30000],
        sliderSpeed: [100, 3000],
    };
    for (const [field, [min, max]] of Object.entries(SLIDER_RANGES)) {
        if (field in candidate) {
            const n = Number(candidate[field]);
            if (!Number.isInteger(n) || n < min || n > max) {
                return NextResponse.json({ error: `invalid ${field} (${min}-${max})` }, { status: 400 });
            }
            candidate[field] = n;
        }
    }
    if ("heroSlides" in candidate) {
        const raw = candidate.heroSlides;
        if (raw != null && !Array.isArray(raw)) {
            return NextResponse.json({ error: "heroSlides must be an array" }, { status: 400 });
        }
        const arr = Array.isArray(raw) ? raw : [];
        if (arr.length > 12) {
            return NextResponse.json({ error: "too many hero slides (max 12)" }, { status: 400 });
        }
        candidate.heroSlides = arr.map((item) => {
            const s = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
            return {
                image: String(s.image ?? "").slice(0, 500),
                title: String(s.title ?? "").slice(0, 200),
                subtitle: String(s.subtitle ?? "").slice(0, 300),
                ctaLabel: String(s.ctaLabel ?? "").slice(0, 60),
                ctaHref: String(s.ctaHref ?? "").slice(0, 300),
            };
        });
    }

    // Coerce empty strings to null for optional fields (so the DB column is null, not "")
    for (const key of Object.keys(candidate)) {
        if (candidate[key] === "" && key !== "companyName") candidate[key] = null;
    }

    try {
        const row = await prisma.siteSetting.upsert({
            where: { id: 1 },
            create: { id: 1, ...candidate },
            update: candidate,
        });
        invalidateSiteSettings();
        return NextResponse.json(row);
    } catch (e: unknown) {
        const mapped = prismaErrorResponse(e);
        if (mapped) return mapped;
        throw e;
    }
}
