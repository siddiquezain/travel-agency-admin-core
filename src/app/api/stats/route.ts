import { NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";
import { requireSession } from "@/core/auth/helpers";

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
