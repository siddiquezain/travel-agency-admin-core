import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";
import { requireSession, makeSlug } from "@/core/auth/helpers";
import { normalizeDestinationRichFields } from "@/modules/destinations/destination-fields";

// ── Collection ────────────────────────────────────────────────────────────────

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

// ── Single resource ───────────────────────────────────────────────────────────

export async function GET_BY_ID(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id } = await params;
    const destination = await prisma.destination.findUnique({
        where: { id: Number(id) },
        include: { country: { select: { id: true, name: true, code: true } } },
    });
    if (!destination) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(destination);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const { name, slug, countryId, description, isActive } = body;

    const data: Record<string, unknown> = normalizeDestinationRichFields(body);
    if (name !== undefined) data.name = name.trim();
    if (typeof slug === "string" && slug.trim()) data.slug = makeSlug(slug);
    if (countryId !== undefined) data.countryId = Number(countryId);
    if (description !== undefined) data.description = description?.trim() || null;
    if (isActive !== undefined) data.isActive = isActive;

    try {
        const destination = await prisma.destination.update({
            where: { id: Number(id) },
            data,
            include: { country: { select: { id: true, name: true, code: true } } },
        });
        return NextResponse.json(destination);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Update failed";
        if (msg.includes("Record to update not found") || msg.includes("not found")) {
            return NextResponse.json({ error: "Destination not found" }, { status: 404 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id } = await params;
    await prisma.destination.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 });
}
