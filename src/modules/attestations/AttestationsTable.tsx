"use client";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { ImageUploader } from "@/core/ui/ImageUploader";
import { useCountries } from "@/hooks/useCountries";

type Attestation = {
    id: number; slug: string; type: string; country: string | null;
    fee: string | null; originalFee: string | null; rating: number | null; reviewsCount: number | null;
    description: string | null; isActive: boolean; featured: boolean;
    images: string[] | null;
};
type Form = { type: string; slug: string; country: string; fee: string; originalFee: string; rating: string; reviewsCount: string; description: string; isActive: boolean; featured: boolean; images: string[] };
type Modal = { open: false } | { open: true; mode: "create" } | { open: true; mode: "edit"; item: Attestation };

const blank: Form = { type: "", slug: "", country: "", fee: "", originalFee: "", rating: "", reviewsCount: "", description: "", isActive: true, featured: false, images: [] };

function slugify(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
const sectionCls = "border border-slate-200 rounded-lg p-4 space-y-3";
const inputCls = "block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600 sm:text-sm";
const labelCls = "block text-sm font-medium text-slate-700 mb-1";

export function AttestationsTable({ initialAttestations }: { initialAttestations: Attestation[] }) {
    const router = useRouter();
    const { countries } = useCountries();
    const [modal, setModal] = useState<Modal>({ open: false });
    const [form, setForm] = useState<Form>(blank);
    const [slugTouched, setSlugTouched] = useState(false);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    function openCreate() { setForm(blank); setSlugTouched(false); setError(""); setModal({ open: true, mode: "create" }); }
    function openEdit(a: Attestation) {
        setSlugTouched(true);
        setForm({ type: a.type, slug: a.slug, country: a.country ?? "", fee: a.fee ?? "", originalFee: a.originalFee ?? "", rating: a.rating != null ? String(a.rating) : "", reviewsCount: a.reviewsCount != null ? String(a.reviewsCount) : "", description: a.description ?? "", isActive: a.isActive, featured: a.featured, images: a.images ?? [] });
        setError(""); setModal({ open: true, mode: "edit", item: a });
    }
    function close() { setModal({ open: false }); }
    function set(k: keyof Form, v: string | boolean) { setForm(f => ({ ...f, [k]: v })); }

    async function save() {
        if (!form.type.trim()) { setError("Document type is required"); return; }
        setError("");
        const isEdit = modal.open && modal.mode === "edit";
        const url = isEdit ? `/api/attestations/${(modal as { open: true; mode: "edit"; item: Attestation }).item.id}` : "/api/attestations";
        const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, slug: form.slug.trim() }) });
        if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
        close(); startTransition(() => router.refresh());
    }

    async function del(id: number) {
        if (!confirm("Delete this attestation service?")) return;
        const res = await fetch(`/api/attestations/${id}`, { method: "DELETE" });
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
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Document Attestations</h2>
                    <p className="mt-1 text-sm text-slate-500">Manage attestation services across document types and embassies.</p>
                </div>
                <button onClick={openCreate} className="mt-4 sm:mt-0 flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
                    <Plus className="h-4 w-4" /> Add Service
                </button>
            </div>

            <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        {initialAttestations.length === 0 ? (
                            <p className="px-6 py-8 text-sm text-slate-500 text-center bg-white">No attestation services yet.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-slate-300">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Document Type</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Country</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Fee</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {initialAttestations.map(a => (
                                        <tr key={a.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">{a.type}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{a.country ?? "—"}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{a.fee ?? "—"}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${a.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"}`}>
                                                    {a.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button onClick={() => openEdit(a)} className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                                                    <button onClick={() => del(a.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
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
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">{modal.mode === "create" ? "Add Attestation Service" : "Edit Service"}</h3>
                            <button onClick={close}><X className="h-5 w-5 text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            {error && <p className="text-sm text-red-600 bg-red-50 rounded-md p-2">{error}</p>}
                            <div>
                                <label className={labelCls}>Document Type <span className="text-red-500">*</span></label>
                                <input
                                    className={inputCls}
                                    value={form.type}
                                    onChange={e => {
                                        const type = e.target.value;
                                        setForm(f => ({ ...f, type, slug: slugTouched ? f.slug : slugify(f.country ? `${type}-${f.country}` : type) }));
                                    }}
                                    placeholder="e.g. Marriage Certificate, Degree"
                                />
                            </div>
                            <div>
                                <label className={labelCls}>Target Country</label>
                                <select
                                    className={inputCls}
                                    value={form.country}
                                    onChange={e => {
                                        const country = e.target.value;
                                        setForm(f => ({ ...f, country, slug: slugTouched ? f.slug : slugify(country ? `${f.type}-${country}` : f.type) }));
                                    }}
                                >
                                    <option value="">Select country</option>
                                    {countries.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>
                                    Slug
                                    <span className="ml-2 text-xs font-normal text-slate-400">URL: /attestations/{form.slug || "<auto>"}</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        className={inputCls + " font-mono"}
                                        value={form.slug}
                                        onChange={e => { setSlugTouched(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                                        placeholder="auto-generated from type + country"
                                    />
                                    {slugTouched && (
                                        <button
                                            type="button"
                                            onClick={() => { setSlugTouched(false); setForm(f => ({ ...f, slug: slugify(f.country ? `${f.type}-${f.country}` : f.type) })); }}
                                            className="shrink-0 text-xs text-emerald-600 hover:text-emerald-800 font-medium"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Service Fee</label>
                                    <input className={inputCls} value={form.fee} onChange={e => set("fee", e.target.value)} placeholder="e.g. ₹3,500" />
                                </div>
                                <div>
                                    <label className={labelCls}>
                                        Original Fee
                                        <span className="ml-2 text-xs font-normal text-slate-400">For discount %</span>
                                    </label>
                                    <input className={inputCls} value={form.originalFee} onChange={e => set("originalFee", e.target.value)} placeholder="e.g. ₹4,500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Rating</label>
                                    <input className={inputCls} type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => set("rating", e.target.value)} placeholder="e.g. 4.8" />
                                </div>
                                <div>
                                    <label className={labelCls}>Reviews</label>
                                    <input className={inputCls} type="number" min="0" value={form.reviewsCount} onChange={e => set("reviewsCount", e.target.value)} placeholder="e.g. 42" />
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Description</label>
                                <textarea className={inputCls + " resize-none"} rows={2} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Brief description…" />
                            </div>
                            {/* Images */}
                            <div className={sectionCls}>
                                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Images (first = card image)</h4>
                                <ImageUploader
                                    images={form.images}
                                    onChange={imgs => setForm(prev => ({ ...prev, images: imgs }))}
                                    category="attestations"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="attest-active" checked={form.isActive} onChange={e => set("isActive", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                                <label htmlFor="attest-active" className="text-sm font-medium text-slate-700">Active (visible on public site)</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="attest-featured" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                                <label htmlFor="attest-featured" className="text-sm font-medium text-slate-700">Featured on homepage</label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
                            <button onClick={close} className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ring-1 ring-slate-300">Cancel</button>
                            <button onClick={save} disabled={isPending} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">
                                {isPending ? "Saving…" : "Save Service"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
