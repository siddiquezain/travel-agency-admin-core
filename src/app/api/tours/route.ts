import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, resolveSlug, prismaErrorResponse } from "@/lib/auth";

export async function GET() {
    const { error } = await requireSession();
    if (error) return error;

    const tours = await prisma.tour.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(tours);
}

export async function POST(request: NextRequest) {
    const { error } = await requireSession();
    if (error) return error;

    const body = await request.json();
    const { title, slug, description, price, originalPrice, rating, reviewsCount, duration, hotelName, country, itinerary, images, packages, features, mealTypes, inclusions, exclusions, datesAvailability, gallery, isActive, featured, tourCategoryId, destinationId } = body;

    if (!title) {
        return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    try {
        const tour = await prisma.tour.create({
            data: {
                slug: resolveSlug(slug, title),
                title,
                description,
                price,
                originalPrice,
                rating: rating || rating === 0 ? Number(rating) : null,
                reviewsCount: reviewsCount || reviewsCount === 0 ? Number(reviewsCount) : null,
                duration,
                hotelName,
                country,
                itinerary,
                images,
                packages,
                features,
                mealTypes: Array.isArray(mealTypes) ? mealTypes : null,
                inclusions,
                exclusions,
                datesAvailability,
                gallery,
                isActive: isActive ?? true,
                featured: featured ?? false,
                tourCategoryId: tourCategoryId ? Number(tourCategoryId) : null,
                destinationId: destinationId ? Number(destinationId) : null,
            },
        });
        return NextResponse.json(tour, { status: 201 });
    } catch (e: unknown) {
        const mapped = prismaErrorResponse(e);
        if (mapped) return mapped;
        throw e;
    }
}
