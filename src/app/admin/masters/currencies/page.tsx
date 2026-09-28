import { prisma } from "@/lib/prisma";
import { CurrenciesTable } from "@/components/admin/CurrenciesTable";

export default async function CurrenciesPage() {
    const items = await prisma.currency.findMany({ orderBy: { code: "asc" } });
    return <CurrenciesTable initialItems={items} />;
}
