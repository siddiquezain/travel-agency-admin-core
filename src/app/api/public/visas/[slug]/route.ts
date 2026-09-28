import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normaliseVisaDetail } from "@/lib/public-detail";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params;
    const visa = await prisma.visa.findFirst({
        where: { slug, isActive: true },
    });

    if (!visa) {
        return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(normaliseVisaDetail(visa));
}
