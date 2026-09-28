import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

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
