import { prisma } from "@/lib/prisma";
import { VisasTable } from "@/components/admin/VisasTable";

export default async function VisasPage() {
    const visas = await prisma.visa.findMany({ orderBy: { createdAt: "desc" } });
    return <VisasTable initialVisas={visas} />;
}
