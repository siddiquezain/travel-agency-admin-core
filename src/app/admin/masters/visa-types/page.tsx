import { prisma } from "@/lib/prisma";
import { VisaTypesTable } from "@/components/admin/VisaTypesTable";

export default async function VisaTypesPage() {
    const items = await prisma.visaType.findMany({ orderBy: { name: "asc" } });
    return <VisaTypesTable initialItems={items} />;
}
