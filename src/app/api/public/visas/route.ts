import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normaliseVisaCard } from "@/lib/public-card";

export async function GET() {
    const visas = await prisma.visa.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(visas.map(normaliseVisaCard));
}
