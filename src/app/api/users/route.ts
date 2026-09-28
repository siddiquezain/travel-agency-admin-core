import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
    const { error } = await requireSession();
    if (error) return error;

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
    const { error } = await requireSession();
    if (error) return error;

    const body = await request.json();
    const { name, email, password, role } = body;

    if (!email || !password) {
        return NextResponse.json({ error: "email and password are required" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { name, email, passwordHash, role: role ?? "ADMIN" },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json(user, { status: 201 });
}
