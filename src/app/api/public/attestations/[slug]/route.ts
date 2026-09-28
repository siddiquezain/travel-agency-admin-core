import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normaliseAttestationDetail } from "@/lib/public-detail";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params;
    const attestation = await prisma.attestation.findFirst({
        where: { slug, isActive: true },
    });

    if (!attestation) {
        return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(normaliseAttestationDetail(attestation));
}
