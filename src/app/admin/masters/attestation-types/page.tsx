import { prisma } from "@/lib/prisma";
import { AttestationTypesTable } from "@/components/admin/AttestationTypesTable";

export default async function AttestationTypesPage() {
    const items = await prisma.attestationType.findMany({ orderBy: { name: "asc" } });
    return <AttestationTypesTable initialItems={items} />;
}
