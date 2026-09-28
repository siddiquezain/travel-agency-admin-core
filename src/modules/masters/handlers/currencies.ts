import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";
import { requireSession } from "@/core/auth/helpers";

// ── Collection ────────────────────────────────────────────────────────────────

export async function GET() {
    const { error } = await requireSession();
    if (error) return error;

    const items = await prisma.currency.findMany({ orderBy: { code: "asc" } });
    return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
    const { error } = await requireSession();
    if (error) return error;

    const body = await request.json();
    const { code, name, symbol, isActive } = body;

    if (!code?.trim()) {
        return NextResponse.json({ error: "Currency code is required" }, { status: 400 });
    }
    if (code.trim().length !== 3) {
        return NextResponse.json({ error: "Currency code must be exactly 3 characters" }, { status: 400 });
    }
    if (!name?.trim()) {
        return NextResponse.json({ error: "Currency name is required" }, { status: 400 });
    }
    if (!symbol?.trim()) {
        return NextResponse.json({ error: "Currency symbol is required" }, { status: 400 });
    }

    try {
        const item = await prisma.currency.create({
            data: {
                code: code.trim().toUpperCase(),
                name: name.trim(),
                symbol: symbol.trim(),
                isActive: isActive ?? true,
            },
        });
        return NextResponse.json(item, { status: 201 });
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Create failed";
        if (msg.includes("Unique constraint")) {
            return NextResponse.json({ error: "A currency with that code already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

// ── Single resource ───────────────────────────────────────────────────────────

export async function GET_BY_ID(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
