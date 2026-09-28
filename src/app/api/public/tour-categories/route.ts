import { NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";

export async function GET() {
    const categories = await prisma.tourCategory.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true, icon: true },
    });
    return NextResponse.json(categories);
}
