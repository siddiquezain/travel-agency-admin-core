import { prisma } from "@/lib/prisma";
import { DocumentTypesTable } from "@/components/admin/DocumentTypesTable";

export default async function DocumentTypesPage() {
    const items = await prisma.documentType.findMany({ orderBy: { name: "asc" } });
    return <DocumentTypesTable initialItems={items} />;
}
