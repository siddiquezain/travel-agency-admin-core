"use client";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, X, Eye } from "lucide-react";

type Inquiry = {
    id: number; name: string; email: string | null; phone: string | null;
    message: string | null; serviceType: string | null;
    status: string; createdAt: string | Date;
};

const STATUS_OPTIONS = ["Pending", "Contacted", "Converted", "Closed"];
const statusColors: Record<string, string> = {
    Pending: "bg-orange-100 text-orange-800",
    Contacted: "bg-blue-100 text-blue-800",
    Converted: "bg-green-100 text-green-800",
    Closed: "bg-slate-100 text-slate-800",
};

export function InquiriesTable({ initialInquiries }: { initialInquiries: Inquiry[] }) {
    const router = useRouter();
    const [selected, setSelected] = useState<Inquiry | null>(null);
    const [newStatus, setNewStatus] = useState("");
    const [isPending, startTransition] = useTransition();

    function openView(i: Inquiry) { setSelected(i); setNewStatus(i.status); }
    function close() { setSelected(null); }

    async function updateStatus() {
        if (!selected) return;
        await fetch(`/api/inquiries/${selected.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        close();
        startTransition(() => router.refresh());
    }

    async function del(id: number) {
        if (!confirm("Delete this inquiry?")) return;
        const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
        if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            alert(d.error || "Delete failed");
            return;
        }
        startTransition(() => router.refresh());
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Inquiries / Leads</h2>
                <p className="mt-1 text-sm text-slate-500">Track and manage customer inquiries submitted from the website.</p>
            </div>

            <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        {initialInquiries.length === 0 ? (
                            <p className="px-6 py-8 text-sm text-slate-500 text-center bg-white">No inquiries yet.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-slate-300">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Customer</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Contact</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Service</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Date</th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {initialInquiries.map(i => (
                                        <tr key={i.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">{i.name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                <div className="flex flex-col">
                                                    <span>{i.email ?? "—"}</span>
                                                    {i.phone && <span className="text-xs text-slate-400">{i.phone}</span>}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{i.serviceType ?? "—"}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[i.status] ?? "bg-slate-100 text-slate-800"}`}>
                                                    {i.status}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                {new Date(i.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button onClick={() => openView(i)} className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> View</button>
                                                    <button onClick={() => del(i.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">Inquiry Details</h3>
                            <button onClick={close}><X className="h-5 w-5 text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="font-medium text-slate-500">Name</p><p className="text-slate-900 mt-0.5">{selected.name}</p></div>
                                <div><p className="font-medium text-slate-500">Date</p><p className="text-slate-900 mt-0.5">{new Date(selected.createdAt).toLocaleDateString()}</p></div>
                                <div><p className="font-medium text-slate-500">Email</p><p className="text-slate-900 mt-0.5">{selected.email ?? "—"}</p></div>
                                <div><p className="font-medium text-slate-500">Phone</p><p className="text-slate-900 mt-0.5">{selected.phone ?? "—"}</p></div>
                                <div><p className="font-medium text-slate-500">Service</p><p className="text-slate-900 mt-0.5">{selected.serviceType ?? "—"}</p></div>
                            </div>
                            {selected.message && (
                                <div>
                                    <p className="font-medium text-slate-500 mb-1">Message</p>
                                    <p className="text-slate-900 bg-slate-50 rounded-lg p-3 whitespace-pre-wrap">{selected.message}</p>
                                </div>
                            )}
                            <div>
                                <label className="block font-medium text-slate-500 mb-1">Update Status</label>
                                <select
                                    value={newStatus}
                                    onChange={e => setNewStatus(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-emerald-600 sm:text-sm"
                                >
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
                            <button onClick={close} className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ring-1 ring-slate-300">Close</button>
                            <button onClick={updateStatus} disabled={isPending || newStatus === selected.status} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">
                                {isPending ? "Saving…" : "Save Status"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
