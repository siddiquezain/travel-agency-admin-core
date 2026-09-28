import { NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";
import { normaliseTourDetail } from "@/lib/public-detail";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params;
    const tour = await prisma.tour.findFirst({
        where: { slug, isActive: true },
        include: { tourCategory: true },
    });

    if (!tour) {
        return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(normaliseTourDetail(tour));
}
