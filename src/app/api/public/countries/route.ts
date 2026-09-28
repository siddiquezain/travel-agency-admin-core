import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const countries = await prisma.country.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, code: true, flag: true },
    });
    return NextResponse.json(countries);
}
