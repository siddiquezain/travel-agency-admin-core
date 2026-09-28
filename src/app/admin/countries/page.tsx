import { prisma } from "@/core/lib/prisma";
import { CountriesTable } from "@/modules/masters/components/CountriesTable";

export default async function CountriesPage() {
    const countries = await prisma.country.findMany({ orderBy: { name: "asc" } });
    return <CountriesTable initialCountries={countries} />;
}
