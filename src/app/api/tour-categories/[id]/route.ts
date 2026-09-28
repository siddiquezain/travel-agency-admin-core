import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
