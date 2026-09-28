import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, toSlug, parseId, invalidIdResponse, prismaErrorResponse, pick } from "@/lib/auth";

const VISA_ALLOWED_FIELDS = [
    "country", "slug", "type", "requirements", "fee", "originalFee", "rating", "reviewsCount",
    "processingTime", "description", "validityDuration", "images", "isActive", "featured",
] as const;

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
