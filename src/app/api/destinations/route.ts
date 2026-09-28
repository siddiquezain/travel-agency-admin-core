import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, makeSlug } from "@/lib/auth";
import { normalizeDestinationRichFields } from "@/lib/destination-fields";

export async function GET() {
    const { error } = await requireSession();
    if (error) return error;

    const destinations = await prisma.destination.findMany({
        orderBy: { name: "asc" },
        include: { country: { select: { id: true, name: true, code: true } } },
    });
    return NextResponse.json(destinations);
}

export async function POST(request: NextRequest) {
    const { error } = await requireSession();
    if (error) return error;

    const body = await request.json();
    const { name, countryId, slug, description, isActive } = body;

    if (!name?.trim()) {
        return NextResponse.json({ error: "Destination name is required" }, { status: 400 });
    }
    if (!countryId) {
        return NextResponse.json({ error: "Country is required" }, { status: 400 });
    }

    try {
        const destination = await prisma.destination.create({
            data: {
                name: name.trim(),
                slug: slug?.trim() ? makeSlug(slug) : makeSlug(name),
                countryId: Number(countryId),
                description: description?.trim() || null,
                isActive: isActive ?? true,
                // Rich guide fields (hero, gallery, sections, attractions, faqs, SEO…).
                ...normalizeDestinationRichFields(body),
            },
            include: { country: { select: { id: true, name: true, code: true } } },
        });
        return NextResponse.json(destination, { status: 201 });
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Create failed";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
