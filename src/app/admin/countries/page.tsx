import { prisma } from "@/lib/prisma";
import { CountriesTable } from "@/components/admin/CountriesTable";

export default async function CountriesPage() {
    const countries = await prisma.country.findMany({ orderBy: { name: "asc" } });
    return <CountriesTable initialCountries={countries} />;
}
