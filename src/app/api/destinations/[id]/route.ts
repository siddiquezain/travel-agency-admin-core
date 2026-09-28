import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, makeSlug } from "@/lib/auth";
import { normalizeDestinationRichFields } from "@/lib/destination-fields";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Start from the rich guide fields, then layer the core fields on top.
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
