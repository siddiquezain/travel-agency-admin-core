import { NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";
import { normaliseTourCard } from "@/lib/public-card";

export async function GET() {
    const tours = await prisma.tour.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        include: { tourCategory: true },
    });

    return NextResponse.json(tours.map(normaliseTourCard));
}
