"use client";
import React, { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus, Pencil, Trash2, X, Download, Search } from "lucide-react";

type DocumentType = {
    id: number; name: string; description: string | null;
    isActive: boolean; createdAt: string | Date; updatedAt: string | Date;
};
type Form = { name: string; description: string; isActive: boolean };
type Modal = { open: false } | { open: true; mode: "create" } | { open: true; mode: "edit"; item: DocumentType };

const blank: Form = { name: "", description: "", isActive: true };
const inputCls = "block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600 sm:text-sm";
const labelCls = "block text-sm font-medium text-slate-700 mb-1";

function exportCSV(data: DocumentType[]) {
    const headers = ["ID", "Name", "Status", "Created"];
    const rows = data.map(d => [d.id, `"${d.name}"`, d.isActive ? "Active" : "Inactive", new Date(d.createdAt).toLocaleDateString()]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `document-types-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
}

export function DocumentTypesTable({ initialItems }: { initialItems: DocumentType[] }) {
    const router = useRouter();
    const { data: session } = useSession();
    const role = (session?.user as { role?: string })?.role ?? "ADMIN";
    const canDelete = role === "SUPER_ADMIN";

    const [modal, setModal] = useState<Modal>({ open: false });
    const [form, setForm] = useState<Form>(blank);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

    const filtered = useMemo(() => initialItems.filter(d => {
        const ms = !search || d.name.toLowerCase().includes(search.toLowerCase());
        const mst = statusFilter === "all" || (statusFilter === "active" && d.isActive) || (statusFilter === "inactive" && !d.isActive);
        return ms && mst;
    }), [initialItems, search, statusFilter]);

    function openCreate() { setForm(blank); setError(""); setModal({ open: true, mode: "create" }); }
    function openEdit(d: DocumentType) {
        setForm({ name: d.name, description: d.description ?? "", isActive: d.isActive });
        setError(""); setModal({ open: true, mode: "edit", item: d });
    }
    function close() { setModal({ open: false }); }
    function set(k: keyof Form, val: string | boolean) { setForm(f => ({ ...f, [k]: val })); }

    async function save() {
        if (!form.name.trim()) { setError("Name is required"); return; }
        setError("");
        const isEdit = modal.open && modal.mode === "edit";
        const url = isEdit ? `/api/document-types/${(modal as { open: true; mode: "edit"; item: DocumentType }).item.id}` : "/api/document-types";
        const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
        close(); startTransition(() => router.refresh());
    }

    async function del(id: number) {
        if (!confirm("Delete this document type?")) return;
        const res = await fetch(`/api/document-types/${id}`, { method: "DELETE" });
        if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            alert(d.error || "Delete failed");
            return;
        }
        startTransition(() => router.refresh());
    }

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Document Types</h2>
                    <p className="mt-1 text-sm text-slate-500">Master list of documents for visa requirements (passport, photo, etc.).</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center gap-2">
                    <button onClick={() => exportCSV(filtered)} className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-300 hover:bg-slate-50">
                        <Download className="h-4 w-4" /> Export CSV
                    </button>
                    <button onClick={openCreate} className="flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
                        <Plus className="h-4 w-4" /> Add Document
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="text" placeholder="Search by name…" value={search} onChange={e => setSearch(e.target.value)} className={inputCls + " pl-9"} />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as "all" | "active" | "inactive")} className={inputCls + " sm:w-40"}>
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        {filtered.length === 0 ? (
                            <p className="px-6 py-8 text-sm text-slate-500 text-center bg-white">
                                {initialItems.length === 0 ? "No document types yet." : "No documents match your filters."}
                            </p>
                        ) : (
                            <table className="min-w-full divide-y divide-slate-300">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Name</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Description</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {filtered.map(d => (
                                        <tr key={d.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">{d.name}</td>
                                            <td className="px-3 py-4 text-sm text-slate-500 max-w-xs truncate">{d.description ?? "—"}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${d.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"}`}>
                                                    {d.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button onClick={() => openEdit(d)} className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                                                    {canDelete && (
                                                        <button onClick={() => del(d.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                                                    )}
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

            {modal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">{modal.mode === "create" ? "Add Document Type" : "Edit Document Type"}</h3>
                            <button onClick={close}><X className="h-5 w-5 text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            {error && <p className="text-sm text-red-600 bg-red-50 rounded-md p-2">{error}</p>}
                            <div>
                                <label className={labelCls}>Name <span className="text-red-500">*</span></label>
                                <input className={inputCls} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Passport, Bank Statement" />
                            </div>
                            <div>
                                <label className={labelCls}>Description</label>
                                <textarea className={inputCls + " resize-none"} rows={2} value={form.description} onChange={e => set("description", e.target.value)} placeholder="When this document is required, etc." />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="dt-active" checked={form.isActive} onChange={e => set("isActive", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                                <label htmlFor="dt-active" className="text-sm font-medium text-slate-700">Active</label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
                            <button onClick={close} className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ring-1 ring-slate-300">Cancel</button>
                            <button onClick={save} disabled={isPending} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">
                                {isPending ? "Saving..." : modal.mode === "create" ? "Save" : "Update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
