import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id } = await params;
    const item = await prisma.currency.findUnique({ where: { id: Number(id) } });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const { code, name, symbol, isActive } = body;

    const data: Record<string, unknown> = {};
    if (code !== undefined) data.code = code.trim().toUpperCase();
    if (name !== undefined) data.name = name.trim();
    if (symbol !== undefined) data.symbol = symbol.trim();
    if (isActive !== undefined) data.isActive = isActive;

    try {
        const item = await prisma.currency.update({ where: { id: Number(id) }, data });
        return NextResponse.json(item);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Update failed";
        if (msg.includes("Record to update not found") || msg.includes("not found")) {
            return NextResponse.json({ error: "Currency not found" }, { status: 404 });
        }
        if (msg.includes("Unique constraint")) {
            return NextResponse.json({ error: "A currency with that code already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id } = await params;
    await prisma.currency.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 });
}
