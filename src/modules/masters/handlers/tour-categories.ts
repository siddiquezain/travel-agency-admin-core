import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";
import { requireSession, makeSlug } from "@/core/auth/helpers";

// ── Collection ────────────────────────────────────────────────────────────────

export async function GET() {
    const { error } = await requireSession();
    if (error) return error;

    const items = await prisma.tourCategory.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
    const { error } = await requireSession();
    if (error) return error;

    const body = await request.json();
    const { name, description, icon, isActive } = body;

    if (!name?.trim()) {
        return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    try {
        const item = await prisma.tourCategory.create({
            data: {
                name: name.trim(),
                slug: makeSlug(name),
                description: description?.trim() || null,
                icon: icon?.trim() || null,
                isActive: isActive ?? true,
            },
        });
        return NextResponse.json(item, { status: 201 });
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
    const item = await prisma.tourCategory.findUnique({ where: { id: Number(id) } });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const { name, description, icon, isActive } = body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name.trim();
    if (description !== undefined) data.description = description?.trim() || null;
    if (icon !== undefined) data.icon = icon?.trim() || null;
    if (isActive !== undefined) data.isActive = isActive;

    try {
        const item = await prisma.tourCategory.update({ where: { id: Number(id) }, data });
        return NextResponse.json(item);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Update failed";
        if (msg.includes("Record to update not found") || msg.includes("not found")) {
            return NextResponse.json({ error: "Tour category not found" }, { status: 404 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id } = await params;
    await prisma.tourCategory.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 });
}
