import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";
import { requireSession } from "@/core/auth/helpers";

// ── Collection ────────────────────────────────────────────────────────────────

export async function GET() {
    const { error } = await requireSession();
    if (error) return error;

    const items = await prisma.documentType.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
    const { error } = await requireSession();
    if (error) return error;

    const body = await request.json();
    const { name, description, isActive } = body;

    if (!name?.trim()) {
        return NextResponse.json({ error: "Document type name is required" }, { status: 400 });
    }

    try {
        const item = await prisma.documentType.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                isActive: isActive ?? true,
            },
        });
        return NextResponse.json(item, { status: 201 });
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Create failed";
        if (msg.includes("Unique constraint")) {
            return NextResponse.json({ error: "A document type with that name already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

// ── Single resource ───────────────────────────────────────────────────────────

export async function GET_BY_ID(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id } = await params;
    const item = await prisma.documentType.findUnique({ where: { id: Number(id) } });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const { name, description, isActive } = body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name.trim();
    if (description !== undefined) data.description = description?.trim() || null;
    if (isActive !== undefined) data.isActive = isActive;

    try {
        const item = await prisma.documentType.update({ where: { id: Number(id) }, data });
        return NextResponse.json(item);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Update failed";
        if (msg.includes("Record to update not found") || msg.includes("not found")) {
            return NextResponse.json({ error: "Document type not found" }, { status: 404 });
        }
        if (msg.includes("Unique constraint")) {
            return NextResponse.json({ error: "A document type with that name already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id } = await params;
    await prisma.documentType.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 });
}
