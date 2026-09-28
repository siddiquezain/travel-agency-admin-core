import { prisma } from "@/lib/prisma";
import { InquiriesTable } from "@/components/admin/InquiriesTable";

export default async function InquiriesPage() {
    const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
    return <InquiriesTable initialInquiries={inquiries} />;
}
