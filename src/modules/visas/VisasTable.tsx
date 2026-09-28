"use client";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, PlusCircle, MinusCircle } from "lucide-react";
import { ImageUploader } from "@/core/ui/ImageUploader";
import { useCountries } from "@/hooks/useCountries";

type Visa = {
    id: number; slug: string; country: string; type: string | null;
    fee: string | null; originalFee: string | null; rating: number | null; reviewsCount: number | null;
    processingTime: string | null; isActive: boolean; featured: boolean;
    description: string | null; validityDuration: string | null;
    requirements: { requiredDocument: string }[] | null;
    images: string[] | null;
};
type Form = {
    country: string; slug: string; type: string; fee: string; originalFee: string;
    rating: string; reviewsCount: string; processingTime: string;
    description: string; validityDuration: string; isActive: boolean; featured: boolean;
    requirements: string[];
    images: string[];
};
type Modal = { open: false } | { open: true; mode: "create" } | { open: true; mode: "edit"; visa: Visa };

const blank: Form = { country: "", slug: "", type: "", fee: "", originalFee: "", rating: "", reviewsCount: "", processingTime: "", description: "", validityDuration: "", isActive: true, featured: false, requirements: [], images: [] };

function slugify(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
const inputCls = "block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600 sm:text-sm";
const labelCls = "block text-sm font-medium text-slate-700 mb-1";
const sectionCls = "border border-slate-200 rounded-lg p-4 space-y-3";
const addBtnCls = "flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 font-medium";
const removeBtnCls = "flex items-center text-red-400 hover:text-red-600";

export function VisasTable({ initialVisas }: { initialVisas: Visa[] }) {
    const router = useRouter();
    const { countries } = useCountries();
    const [modal, setModal] = useState<Modal>({ open: false });
    const [form, setForm] = useState<Form>(blank);
    const [slugTouched, setSlugTouched] = useState(false);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    function openCreate() { setForm(blank); setSlugTouched(false); setError(""); setModal({ open: true, mode: "create" }); }
    function openEdit(v: Visa) {
        setSlugTouched(true);
        setForm({
            country: v.country, slug: v.slug, type: v.type ?? "", fee: v.fee ?? "",
            originalFee: v.originalFee ?? "",
            rating: v.rating != null ? String(v.rating) : "",
            reviewsCount: v.reviewsCount != null ? String(v.reviewsCount) : "",
            processingTime: v.processingTime ?? "", description: v.description ?? "",
            validityDuration: v.validityDuration ?? "", isActive: v.isActive, featured: v.featured,
            requirements: (v.requirements ?? []).map(r => r.requiredDocument),
            images: v.images ?? [],
        });
        setError(""); setModal({ open: true, mode: "edit", visa: v });
    }
    function close() { setModal({ open: false }); }

    async function save() {
        if (!form.country.trim()) { setError("Country is required"); return; }
        setError("");
        const isEdit = modal.open && modal.mode === "edit";
        const url = isEdit ? `/api/visas/${(modal as { open: true; mode: "edit"; visa: Visa }).visa.id}` : "/api/visas";
        const body = {
            country: form.country, slug: form.slug.trim(), type: form.type, fee: form.fee,
            originalFee: form.originalFee.trim() || null,
            rating: form.rating.trim() || null,
            reviewsCount: form.reviewsCount.trim() || null,
            processingTime: form.processingTime, description: form.description,
            validityDuration: form.validityDuration, isActive: form.isActive, featured: form.featured,
            requirements: form.requirements.filter(r => r.trim()).map(r => ({ requiredDocument: r })),
            images: form.images,
        };
        const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
        close(); startTransition(() => router.refresh());
    }

    async function del(id: number) {
        if (!confirm("Delete this visa?")) return;
        const res = await fetch(`/api/visas/${id}`, { method: "DELETE" });
        if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            alert(d.error || "Delete failed");
            return;
        }
        startTransition(() => router.refresh());
    }

    function updateReq(idx: number, val: string) {
        setForm(prev => { const a = [...prev.requirements]; a[idx] = val; return { ...prev, requirements: a }; });
    }
    function addReq() { setForm(prev => ({ ...prev, requirements: [...prev.requirements, ""] })); }
    function removeReq(idx: number) { setForm(prev => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== idx) })); }

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Visa Services</h2>
                    <p className="mt-1 text-sm text-slate-500">Manage visa processing requirements, fees, and active countries.</p>
                </div>
                <button onClick={openCreate} className="mt-4 sm:mt-0 flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
                    <Plus className="h-4 w-4" /> Add New Visa
                </button>
            </div>

            <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        {initialVisas.length === 0 ? (
                            <p className="px-6 py-8 text-sm text-slate-500 text-center bg-white">No visa services yet.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-slate-300">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Country</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Type</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Processing</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Fee</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {initialVisas.map(v => (
                                        <tr key={v.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">{v.country}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{v.type ?? "—"}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{v.processingTime ?? "—"}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{v.fee ?? "—"}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${v.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"}`}>
                                                    {v.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button onClick={() => openEdit(v)} className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                                                    <button onClick={() => del(v.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
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
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">{modal.mode === "create" ? "Add New Visa" : "Edit Visa"}</h3>
                            <button onClick={close}><X className="h-5 w-5 text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <div className="px-6 py-5 space-y-6">
                            {error && <p className="text-sm text-red-600 bg-red-50 rounded-md p-2">{error}</p>}

                            {/* Basic Info */}
                            <div className={sectionCls}>
                                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Basic Info</h4>
                                <div>
                                    <label className={labelCls}>Country <span className="text-red-500">*</span></label>
                                    <select
                                        className={inputCls}
                                        value={form.country}
                                        onChange={e => {
                                            const country = e.target.value;
                                            setForm(f => ({ ...f, country, slug: slugTouched ? f.slug : slugify(f.type ? `${country}-${f.type}` : country) }));
                                        }}
                                    >
                                        <option value="">Select country</option>
                                        {countries.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Visa Type</label>
                                    <input
                                        className={inputCls}
                                        value={form.type}
                                        onChange={e => {
                                            const type = e.target.value;
                                            setForm(f => ({ ...f, type, slug: slugTouched ? f.slug : slugify(type ? `${f.country}-${type}` : f.country) }));
                                        }}
                                        placeholder="e.g. Tourist, Business, Work"
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>
                                        Slug
                                        <span className="ml-2 text-xs font-normal text-slate-400">URL: /visas/{form.slug || "<auto>"}</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            className={inputCls + " font-mono"}
                                            value={form.slug}
                                            onChange={e => { setSlugTouched(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                                            placeholder="auto-generated from country + type"
                                        />
                                        {slugTouched && (
                                            <button
                                                type="button"
                                                onClick={() => { setSlugTouched(false); setForm(f => ({ ...f, slug: slugify(f.type ? `${f.country}-${f.type}` : f.country) })); }}
                                                className="shrink-0 text-xs text-emerald-600 hover:text-emerald-800 font-medium"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelCls}>Fee</label>
                                        <input className={inputCls} value={form.fee} onChange={e => setForm(f => ({ ...f, fee: e.target.value }))} placeholder="e.g. ₹5,000" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Processing Time</label>
                                        <input className={inputCls} value={form.processingTime} onChange={e => setForm(f => ({ ...f, processingTime: e.target.value }))} placeholder="e.g. 3-5 Days" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Validity Duration</label>
                                        <input className={inputCls} value={form.validityDuration} onChange={e => setForm(f => ({ ...f, validityDuration: e.target.value }))} placeholder="e.g. 30 Days" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelCls}>
                                            Original Fee
                                            <span className="ml-2 text-xs font-normal text-slate-400">For discount %</span>
                                        </label>
                                        <input className={inputCls} value={form.originalFee} onChange={e => setForm(f => ({ ...f, originalFee: e.target.value }))} placeholder="e.g. ₹6,500" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Rating</label>
                                        <input className={inputCls} type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} placeholder="e.g. 4.8" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Reviews</label>
                                        <input className={inputCls} type="number" min="0" value={form.reviewsCount} onChange={e => setForm(f => ({ ...f, reviewsCount: e.target.value }))} placeholder="e.g. 42" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="visa-active" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                                    <label htmlFor="visa-active" className="text-sm font-medium text-slate-700">Active (visible on public site)</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="visa-featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                                    <label htmlFor="visa-featured" className="text-sm font-medium text-slate-700">Featured on homepage</label>
                                </div>
                            </div>

                            {/* Description */}
                            <div className={sectionCls}>
                                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Description / Overview</h4>
                                <textarea className={inputCls + " resize-none"} rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the visa process, requirements overview, etc." />
                            </div>

                            {/* Images */}
                            <div className={sectionCls}>
                                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Images (first = card image)</h4>
                                <ImageUploader
                                    images={form.images}
                                    onChange={imgs => setForm(prev => ({ ...prev, images: imgs }))}
                                    category="visas"
                                />
                            </div>

                            {/* Required Documents */}
                            <div className={sectionCls}>
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Required Documents</h4>
                                    <button type="button" onClick={addReq} className={addBtnCls}><PlusCircle className="h-4 w-4" /> Add Document</button>
                                </div>
                                {form.requirements.map((req, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <input className={inputCls + " flex-1"} value={req} onChange={e => updateReq(i, e.target.value)} placeholder="e.g. Valid passport (6 months validity)" />
                                        <button type="button" onClick={() => removeReq(i)} className={removeBtnCls}><MinusCircle className="h-4 w-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
                            <button onClick={close} className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ring-1 ring-slate-300">Cancel</button>
                            <button onClick={save} disabled={isPending} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">
                                {isPending ? "Saving…" : "Save Visa"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
