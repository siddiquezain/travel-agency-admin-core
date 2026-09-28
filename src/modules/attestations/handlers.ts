import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";
import { requireSession, resolveSlug, toSlug, parseId, invalidIdResponse, prismaErrorResponse, pick } from "@/core/auth/helpers";

// ── Collection ────────────────────────────────────────────────────────────────

export async function GET() {
    const { error } = await requireSession();
    if (error) return error;

    const attestations = await prisma.attestation.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(attestations);
}

export async function POST(request: NextRequest) {
    const { error } = await requireSession();
    if (error) return error;

    const body = await request.json();
    const { type, slug, country, description, fee, originalFee, rating, reviewsCount, images, isActive, featured } = body;

    if (!type) {
        return NextResponse.json({ error: "type is required" }, { status: 400 });
    }

    const fallback = country ? `${type}-${country}` : type;
    try {
        const attestation = await prisma.attestation.create({
            data: {
                slug: resolveSlug(slug, fallback),
                type,
                country,
                description,
                fee,
                originalFee,
                rating: rating || rating === 0 ? Number(rating) : null,
                reviewsCount: reviewsCount || reviewsCount === 0 ? Number(reviewsCount) : null,
                images,
                isActive: isActive ?? true,
                featured: featured ?? false,
            },
        });
        return NextResponse.json(attestation, { status: 201 });
    } catch (e: unknown) {
        const mapped = prismaErrorResponse(e);
        if (mapped) return mapped;
        throw e;
    }
}

// ── Single resource ───────────────────────────────────────────────────────────

const ATTESTATION_ALLOWED_FIELDS = [
    "type", "slug", "country", "description", "fee", "originalFee", "rating", "reviewsCount",
    "images", "isActive", "featured",
] as const;

export async function GET_BY_ID(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (id === null) return invalidIdResponse();

    const attestation = await prisma.attestation.findUnique({ where: { id } });
    if (!attestation) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(attestation);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (id === null) return invalidIdResponse();

    const body = await request.json();
    const data: Record<string, unknown> = pick(body, ATTESTATION_ALLOWED_FIELDS);

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
        const attestation = await prisma.attestation.update({ where: { id }, data });
        return NextResponse.json(attestation);
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
        await prisma.attestation.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (e: unknown) {
        const mapped = prismaErrorResponse(e);
        if (mapped) return mapped;
        throw e;
    }
}
