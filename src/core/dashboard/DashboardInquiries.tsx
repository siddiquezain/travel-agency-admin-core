"use client";
import React, { useState, useMemo } from "react";
import { Search, Download } from "lucide-react";

type Inquiry = {
    id: number; name: string; email: string | null; phone: string | null;
    message: string | null; serviceType: string | null; status: string;
    createdAt: string | Date;
};

const inputCls = "block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600 sm:text-sm";

function exportCSV(data: Inquiry[]) {
    const headers = ["ID", "Name", "Email", "Phone", "Service", "Status", "Date"];
    const rows = data.map(i => [
        i.id,
        `"${i.name}"`,
        i.email ?? "",
        i.phone ?? "",
        i.serviceType ?? "",
        i.status,
        new Date(i.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export function DashboardInquiries({ inquiries }: { inquiries: Inquiry[] }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const statuses = useMemo(() => {
        const set = new Set(inquiries.map(i => i.status));
        return Array.from(set).sort();
    }, [inquiries]);

    const filtered = useMemo(() => {
        return inquiries.filter(i => {
            const matchSearch = !search ||
                i.name.toLowerCase().includes(search.toLowerCase()) ||
                (i.email?.toLowerCase().includes(search.toLowerCase())) ||
                (i.serviceType?.toLowerCase().includes(search.toLowerCase()));
            const matchStatus = statusFilter === "all" || i.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [inquiries, search, statusFilter]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <h3 className="text-lg font-medium leading-6 text-slate-900">Recent Inquiries</h3>
                <button
                    onClick={() => exportCSV(filtered)}
                    className="flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-300 hover:bg-slate-50"
                >
                    <Download className="h-4 w-4" /> Export CSV
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or service..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className={inputCls + " pl-9"}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className={inputCls + " sm:w-44"}
                >
                    <option value="all">All Status</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="overflow-hidden bg-white shadow-sm ring-1 ring-slate-200 sm:rounded-lg">
                {filtered.length === 0 ? (
                    <p className="px-6 py-8 text-sm text-slate-500 text-center">
                        {inquiries.length === 0 ? "No inquiries yet." : "No inquiries match your filters."}
                    </p>
                ) : (
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Customer</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Service</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {filtered.map((inquiry) => (
                                <tr key={inquiry.id} className="hover:bg-slate-50">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="font-medium text-slate-900">{inquiry.name}</div>
                                        {inquiry.email && <div className="text-slate-500">{inquiry.email}</div>}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                        {inquiry.serviceType ?? "\u2014"}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            inquiry.status === "Completed" ? "bg-green-100 text-green-800"
                                            : inquiry.status === "Processing" ? "bg-blue-100 text-blue-800"
                                            : "bg-orange-100 text-orange-800"
                                        }`}>
                                            {inquiry.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                        {new Date(inquiry.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
