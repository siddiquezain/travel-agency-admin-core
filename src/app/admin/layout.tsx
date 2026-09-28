import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata: Metadata = {
    title: "Admin Dashboard - Origin Travels",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    const initial = (session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? "A").toUpperCase();

    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-6 shadow-sm">
                    <div className="flex flex-1 items-center justify-between">
                        <h1 className="text-lg font-semibold text-slate-800">Overview</h1>
                        <div className="flex items-center gap-3">
                            {session?.user?.name && (
                                <span className="text-sm text-slate-600">{session.user.name}</span>
                            )}
                            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                {initial}
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
