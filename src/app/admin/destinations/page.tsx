import { prisma } from "@/lib/prisma";
import { DestinationsTable } from "@/components/admin/DestinationsTable";

export default async function DestinationsPage() {
    const [destinations, countries] = await Promise.all([
        prisma.destination.findMany({
            orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
            include: { country: { select: { id: true, name: true, code: true } } },
        }),
        prisma.country.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    ]);
    return <DestinationsTable initialDestinations={destinations} countries={countries} />;
}
