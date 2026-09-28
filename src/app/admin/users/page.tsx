import { prisma } from "@/core/lib/prisma";
import { UsersTable } from "@/components/admin/UsersTable";

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return <UsersTable initialUsers={users} />;
}
