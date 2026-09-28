import { prisma } from "@/core/lib/prisma";
import { AttestationTypesTable } from "@/modules/masters/components/AttestationTypesTable";

export default async function AttestationTypesPage() {
    const items = await prisma.attestationType.findMany({ orderBy: { name: "asc" } });
    return <AttestationTypesTable initialItems={items} />;
}
