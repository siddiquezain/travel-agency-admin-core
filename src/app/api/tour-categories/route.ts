import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, makeSlug } from "@/lib/auth";

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
