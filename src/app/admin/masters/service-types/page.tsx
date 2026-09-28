import { prisma } from "@/lib/prisma";
import { ServiceTypesTable } from "@/modules/masters/components/ServiceTypesTable";

export default async function ServiceTypesPage() {
    const items = await prisma.serviceType.findMany({ orderBy: { name: "asc" } });
    return <ServiceTypesTable initialItems={items} />;
}
