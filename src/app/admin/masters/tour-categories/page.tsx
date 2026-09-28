import { prisma } from "@/lib/prisma";
import { TourCategoriesTable } from "@/modules/masters/components/TourCategoriesTable";

export default async function TourCategoriesPage() {
    const items = await prisma.tourCategory.findMany({ orderBy: { name: "asc" } });
    return <TourCategoriesTable initialItems={items} />;
}
