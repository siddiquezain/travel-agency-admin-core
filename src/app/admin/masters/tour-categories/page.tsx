import { prisma } from "@/lib/prisma";
import { TourCategoriesTable } from "@/components/admin/TourCategoriesTable";

export default async function TourCategoriesPage() {
    const items = await prisma.tourCategory.findMany({ orderBy: { name: "asc" } });
    return <TourCategoriesTable initialItems={items} />;
}
