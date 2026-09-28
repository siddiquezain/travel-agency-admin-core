import { prisma } from "@/lib/prisma";
import { AttestationsTable } from "@/components/admin/AttestationsTable";

export default async function AttestationsPage() {
    const attestations = await prisma.attestation.findMany({ orderBy: { createdAt: "desc" } });
    return <AttestationsTable initialAttestations={attestations} />;
}
