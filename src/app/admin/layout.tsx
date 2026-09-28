// src/app/admin/layout.tsx
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import AdminLayout from '@/core/admin/AdminLayout'
import { agency } from '@/config/agency'

export const metadata: Metadata = {
    title: `Admin Dashboard - ${agency.name}`,
}

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)
    const initial = (session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? 'A').toUpperCase()

    return (
        <AdminLayout userName={session?.user?.name} userInitial={initial}>
            {children}
        </AdminLayout>
    )
}
