import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, toSlug, parseId, invalidIdResponse, prismaErrorResponse, pick } from "@/lib/auth";

const TOUR_ALLOWED_FIELDS = [
    "title", "slug", "description", "price", "originalPrice", "rating", "reviewsCount", "duration", "hotelName", "country",
    "itinerary", "images", "packages", "features", "mealTypes", "inclusions",
    "exclusions", "datesAvailability", "gallery", "isActive", "featured", "tourCategoryId",
    "destinationId",
] as const;

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (id === null) return invalidIdResponse();

    const tour = await prisma.tour.findUnique({ where: { id } });
    if (!tour) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(tour);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (id === null) return invalidIdResponse();

    const body = await request.json();
    const data: Record<string, unknown> = pick(body, TOUR_ALLOWED_FIELDS);

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
    if ("tourCategoryId" in data) {
        data.tourCategoryId = data.tourCategoryId ? Number(data.tourCategoryId) : null;
    }
    if ("destinationId" in data) {
        data.destinationId = data.destinationId ? Number(data.destinationId) : null;
    }

    try {
        const tour = await prisma.tour.update({ where: { id }, data });
        return NextResponse.json(tour);
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
        await prisma.tour.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (e: unknown) {
        const mapped = prismaErrorResponse(e);
        if (mapped) return mapped;
        throw e;
    }
}
