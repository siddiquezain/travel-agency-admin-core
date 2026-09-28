import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, resolveSlug, prismaErrorResponse } from "@/lib/auth";

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
