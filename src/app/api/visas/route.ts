import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, resolveSlug, prismaErrorResponse } from "@/lib/auth";

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
