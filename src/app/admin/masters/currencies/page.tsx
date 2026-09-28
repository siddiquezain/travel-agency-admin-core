import { prisma } from "@/core/lib/prisma";
import { CurrenciesTable } from "@/modules/masters/components/CurrenciesTable";

export default async function CurrenciesPage() {
    const items = await prisma.currency.findMany({ orderBy: { code: "asc" } });
    return <CurrenciesTable initialItems={items} />;
}
