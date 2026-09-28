import { NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";

// Public destinations listing. Only active destinations are exposed; featured
// first, then manual sortOrder, then alphabetical. Evaluated per request so
// newly-published destinations appear immediately.
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const destinations = await prisma.destination.findMany({
            where: { isActive: true },
            orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
            select: {
                id: true,
                slug: true,
                name: true,
                description: true,
                heroImage: true,
                region: true,
                bestTimeShort: true,
                featured: true,
                country: { select: { name: true, code: true } },
            },
        });
        return NextResponse.json(destinations);
    } catch {
        return NextResponse.json([]);
    }
}
