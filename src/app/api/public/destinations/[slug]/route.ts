import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public destination guide by slug. Inactive/missing destinations 404.
export const dynamic = "force-dynamic";

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params;
    const destination = await prisma.destination.findFirst({
        where: { slug, isActive: true },
        include: { country: { select: { name: true, code: true } } },
    });
    if (!destination) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(destination);
}
