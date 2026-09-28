import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

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
