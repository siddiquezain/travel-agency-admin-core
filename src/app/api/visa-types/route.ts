import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET() {
    const { error } = await requireSession();
    if (error) return error;

    const items = await prisma.visaType.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
    const { error } = await requireSession();
    if (error) return error;

    const body = await request.json();
    const { name, code, description, isActive } = body;

    if (!name?.trim()) {
        return NextResponse.json({ error: "Visa type name is required" }, { status: 400 });
    }
    if (!code?.trim()) {
        return NextResponse.json({ error: "Visa type code is required" }, { status: 400 });
    }

    try {
        const item = await prisma.visaType.create({
            data: {
                name: name.trim(),
                code: code.trim().toUpperCase(),
                description: description?.trim() || null,
                isActive: isActive ?? true,
            },
        });
        return NextResponse.json(item, { status: 201 });
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Create failed";
        if (msg.includes("Unique constraint")) {
            return NextResponse.json({ error: "A visa type with that code already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
