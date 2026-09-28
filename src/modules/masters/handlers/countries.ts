import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";
import { requireSession } from "@/core/auth/helpers";

// ── Collection ────────────────────────────────────────────────────────────────

export async function GET() {
    const { error } = await requireSession();
    if (error) return error;

    const countries = await prisma.country.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(countries);
}

export async function POST(request: NextRequest) {
    const { error } = await requireSession();
    if (error) return error;

    const body = await request.json();
    const { name, code, flag, isActive } = body;

    if (!name?.trim()) {
        return NextResponse.json({ error: "Country name is required" }, { status: 400 });
    }
    if (!code?.trim()) {
        return NextResponse.json({ error: "Country code is required" }, { status: 400 });
    }

    const country = await prisma.country.create({
        data: {
            name: name.trim(),
            code: code.trim().toUpperCase(),
            flag: flag || null,
            isActive: isActive ?? true,
        },
    });

    return NextResponse.json(country, { status: 201 });
}

// ── Single resource ───────────────────────────────────────────────────────────

export async function GET_BY_ID(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id } = await params;
    const country = await prisma.country.findUnique({ where: { id: Number(id) } });
    if (!country) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(country);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const { name, code, flag, isActive } = body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name.trim();
    if (code !== undefined) data.code = code.trim().toUpperCase();
    if (flag !== undefined) data.flag = flag || null;
    if (isActive !== undefined) data.isActive = isActive;

    try {
        const country = await prisma.country.update({
            where: { id: Number(id) },
            data,
        });
        return NextResponse.json(country);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Update failed";
        if (msg.includes("Record to update not found") || msg.includes("not found")) {
            return NextResponse.json({ error: "Country not found" }, { status: 404 });
        }
        if (msg.includes("Unique constraint")) {
            return NextResponse.json({ error: "A country with that code already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id } = await params;
    await prisma.country.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 });
}
