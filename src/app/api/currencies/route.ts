import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

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
