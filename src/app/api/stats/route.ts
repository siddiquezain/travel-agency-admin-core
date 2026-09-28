import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET() {
    const { error } = await requireSession();
    if (error) return error;

    const [users, activeTours, inquiries, activeVisas] = await Promise.all([
        prisma.user.count(),
        prisma.tour.count({ where: { isActive: true } }),
        prisma.inquiry.count(),
        prisma.visa.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json({ users, activeTours, inquiries, activeVisas });
}
