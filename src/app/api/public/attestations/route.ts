import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normaliseAttestationCard } from "@/lib/public-card";

export async function GET() {
    const attestations = await prisma.attestation.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(attestations.map(normaliseAttestationCard));
}
