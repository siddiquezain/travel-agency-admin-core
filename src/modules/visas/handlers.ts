import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";
import { requireSession, resolveSlug, toSlug, parseId, invalidIdResponse, prismaErrorResponse, pick } from "@/core/auth/helpers";

// ── Collection ────────────────────────────────────────────────────────────────

export async function GET() {
    const { error } = await requireSession();
    if (error) return error;

    const visas = await prisma.visa.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(visas);
}

export async function POST(request: NextRequest) {
    const { error } = await requireSession();
    if (error) return error;

    const body = await request.json();
    const { country, slug, type, requirements, fee, originalFee, rating, reviewsCount, processingTime, description, validityDuration, images, isActive, featured } = body;

    if (!country) {
        return NextResponse.json({ error: "country is required" }, { status: 400 });
    }

    const fallback = type ? `${country}-${type}` : country;
    try {
        const visa = await prisma.visa.create({
            data: {
                slug: resolveSlug(slug, fallback),
                country,
                type,
                requirements,
                fee,
                originalFee,
                rating: rating || rating === 0 ? Number(rating) : null,
                reviewsCount: reviewsCount || reviewsCount === 0 ? Number(reviewsCount) : null,
                processingTime,
                description,
                validityDuration,
                images,
                isActive: isActive ?? true,
                featured: featured ?? false,
            },
        });
        return NextResponse.json(visa, { status: 201 });
    } catch (e: unknown) {
        const mapped = prismaErrorResponse(e);
        if (mapped) return mapped;
        throw e;
    }
}

// ── Single resource ───────────────────────────────────────────────────────────

const VISA_ALLOWED_FIELDS = [
    "country", "slug", "type", "requirements", "fee", "originalFee", "rating", "reviewsCount",
    "processingTime", "description", "validityDuration", "images", "isActive", "featured",
] as const;

export async function GET_BY_ID(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (id === null) return invalidIdResponse();

    const visa = await prisma.visa.findUnique({ where: { id } });
    if (!visa) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(visa);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (id === null) return invalidIdResponse();

    const body = await request.json();
    const data: Record<string, unknown> = pick(body, VISA_ALLOWED_FIELDS);

    if (typeof data.slug === "string") {
        const cleaned = data.slug.trim();
        if (!cleaned) {
            delete data.slug;
        } else {
            data.slug = toSlug(cleaned);
        }
    }

    if ("rating" in data) {
        data.rating = data.rating || data.rating === 0 ? Number(data.rating) : null;
    }
    if ("reviewsCount" in data) {
        data.reviewsCount = data.reviewsCount || data.reviewsCount === 0 ? Number(data.reviewsCount) : null;
    }

    try {
        const visa = await prisma.visa.update({ where: { id }, data });
        return NextResponse.json(visa);
    } catch (e: unknown) {
        const mapped = prismaErrorResponse(e);
        if (mapped) return mapped;
        throw e;
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (id === null) return invalidIdResponse();

    try {
        await prisma.visa.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (e: unknown) {
        const mapped = prismaErrorResponse(e);
        if (mapped) return mapped;
        throw e;
    }
}
