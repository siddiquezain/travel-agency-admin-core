"use client";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, PlusCircle, MinusCircle } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { ConfirmDialog } from "./ConfirmDialog";
import { useCountries } from "@/hooks/useCountries";
import { useTourCategories } from "@/hooks/useTourCategories";
import { useDestinations } from "@/hooks/useDestinations";

type RoomPrice = { roomType: string; price: string };
type Package = { packageTitle: string; hotelName?: string; roomPrices: RoomPrice[] };
type ItineraryDay = { day: string; activity: string; details: string };
type DateAvailability = { departure: string; arrival: string; airline?: string; price?: string };

type Tour = {
    id: number; slug: string; title: string;
    price: string | null; originalPrice: string | null;
    rating: number | null; reviewsCount: number | null;
    duration: string | null;
    hotelName: string | null;
    description: string | null; country: string | null;
    isActive: boolean;
    featured: boolean;
    tourCategoryId: number | null;
    destinationId: number | null;
    itinerary: ItineraryDay[] | null;
    images: string[] | null;
    packages: Package[] | null;
    features: string[] | null;
    mealTypes: string[] | null;
    inclusions: { inclusion: string }[] | null;
    exclusions: { exclusion: string }[] | null;
    datesAvailability: DateAvailability[] | null;
    gallery: string[] | null;
};

type Form = {
    title: string; slug: string; price: string; originalPrice: string; rating: string; reviewsCount: string;
    duration: string; hotelName: string; description: string;
    country: string; tourCategoryId: string; destinationId: string; isActive: boolean; featured: boolean;
    features: string[];
    mealTypes: string[];
    images: string[];
    packages: Package[];
    itinerary: ItineraryDay[];
    inclusions: string[];
    exclusions: string[];
    datesAvailability: DateAvailability[];
};

function slugify(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type Modal = { open: false } | { open: true; mode: "create" } | { open: true; mode: "edit"; tour: Tour };

const FEATURE_OPTIONS = ["Air Ticket", "Umrah Visa", "Visa", "Hotel", "Meals", "Ziyarat", "Transportation"];
const MEAL_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Snacks"];
const ROOM_TYPES = ["Double", "Triple", "Quad"];

const blank: Form = {
    title: "", slug: "", price: "", originalPrice: "", rating: "", reviewsCount: "", duration: "", hotelName: "", description: "", country: "", tourCategoryId: "", destinationId: "", isActive: true, featured: false,
    features: [], mealTypes: [], images: [], packages: [], itinerary: [],
    inclusions: [], exclusions: [], datesAvailability: [],
};

const inputCls = "block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600 sm:text-sm";
// Fixed-width select for inline flex rows — no `w-full`, so it never squeezes its row siblings.
const selectCls = "w-32 shrink-0 rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-emerald-600 sm:text-sm";
const labelCls = "block text-sm font-medium text-slate-700 mb-1";
const sectionCls = "border border-slate-200 rounded-lg p-4 space-y-3";
const addBtnCls = "flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 font-medium";
const removeBtnCls = "flex items-center text-red-400 hover:text-red-600";

export function ToursTable({ initialTours }: { initialTours: Tour[] }) {
    const router = useRouter();
    const { countries } = useCountries();
    const { categories } = useTourCategories();
    const { destinations } = useDestinations();
    const [modal, setModal] = useState<Modal>({ open: false });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null; pending: boolean }>({ open: false, id: null, pending: false });
    const [form, setForm] = useState<Form>(blank);
    const [slugTouched, setSlugTouched] = useState(false);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    function openCreate() { setForm(blank); setSlugTouched(false); setError(""); setModal({ open: true, mode: "create" }); }
    function openEdit(t: Tour) {
        setSlugTouched(true);
        setForm({
            title: t.title,
            slug: t.slug,
            price: t.price ?? "",
            originalPrice: t.originalPrice ?? "",
            rating: t.rating != null ? String(t.rating) : "",
            reviewsCount: t.reviewsCount != null ? String(t.reviewsCount) : "",
            duration: t.duration ?? "",
            hotelName: t.hotelName ?? "",
            description: t.description ?? "",
            country: t.country ?? "",
            tourCategoryId: t.tourCategoryId != null ? String(t.tourCategoryId) : "",
            destinationId: t.destinationId != null ? String(t.destinationId) : "",
            isActive: t.isActive,
            featured: t.featured,
            features: t.features ?? [],
            mealTypes: t.mealTypes ?? [],
            images: t.images ?? [],
            packages: t.packages ?? [],
            itinerary: t.itinerary ?? [],
            inclusions: (t.inclusions ?? []).map(i => i.inclusion),
            exclusions: (t.exclusions ?? []).map(e => e.exclusion),
            datesAvailability: t.datesAvailability ?? [],
        });
        setError(""); setModal({ open: true, mode: "edit", tour: t });
    }
    function close() { setModal({ open: false }); }

    async function save() {
        if (!form.title.trim()) { setError("Title is required"); return; }
        setError("");
        const isEdit = modal.open && modal.mode === "edit";
        const url = isEdit ? `/api/tours/${(modal as { open: true; mode: "edit"; tour: Tour }).tour.id}` : "/api/tours";
        const body = {
            title: form.title,
            slug: form.slug.trim(),
            price: form.price,
            originalPrice: form.originalPrice.trim() || null,
            rating: form.rating.trim() || null,
            reviewsCount: form.reviewsCount.trim() || null,
            duration: form.duration,
            hotelName: form.hotelName.trim() || null,
            description: form.description,
            country: form.country,
            tourCategoryId: form.tourCategoryId ? Number(form.tourCategoryId) : null,
            destinationId: form.destinationId ? Number(form.destinationId) : null,
            isActive: form.isActive,
            featured: form.featured,
            features: form.features,
            mealTypes: form.features.includes("Meals") ? form.mealTypes : [],
            images: form.images.filter(u => u.trim()),
            packages: form.packages,
            itinerary: form.itinerary,
            inclusions: form.inclusions.filter(i => i.trim()).map(i => ({ inclusion: i })),
            exclusions: form.exclusions.filter(e => e.trim()).map(e => ({ exclusion: e })),
            datesAvailability: form.datesAvailability,
        };
        const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
        close(); startTransition(() => router.refresh());
    }

    function confirmDelete(id: number) {
        setDeleteModal({ open: true, id, pending: false });
    }

    async function executeDelete() {
        if (deleteModal.id === null) return;
        setDeleteModal(prev => ({ ...prev, pending: true }));
        const res = await fetch(`/api/tours/${deleteModal.id}`, { method: "DELETE" });
        if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            alert(d.error || "Delete failed");
            setDeleteModal(prev => ({ ...prev, pending: false }));
            return;
        }
        setDeleteModal({ open: false, id: null, pending: false });
        startTransition(() => router.refresh());
    }

    // --- Repeater helpers ---
    function toggleFeature(f: string) {
        setForm(prev => {
            const willEnable = !prev.features.includes(f);
            const features = willEnable ? [...prev.features, f] : prev.features.filter(x => x !== f);
            const mealTypes = f === "Meals" && !willEnable ? [] : prev.mealTypes;
            return { ...prev, features, mealTypes };
        });
    }
    function toggleMeal(m: string) {
        setForm(prev => ({
            ...prev,
            mealTypes: prev.mealTypes.includes(m)
                ? prev.mealTypes.filter(x => x !== m)
                : [...prev.mealTypes, m],
        }));
    }

    function updatePackage(idx: number, field: keyof Package, val: unknown) {
        setForm(prev => {
            const a = [...prev.packages];
            a[idx] = { ...a[idx], [field]: val };
            return { ...prev, packages: a };
        });
    }
    function addPackage() {
        setForm(prev => ({ ...prev, packages: [...prev.packages, { packageTitle: "", hotelName: "", roomPrices: [{ roomType: "Double", price: "" }] }] }));
    }
    function removePackage(idx: number) { setForm(prev => ({ ...prev, packages: prev.packages.filter((_, i) => i !== idx) })); }
    function addRoomPrice(pkgIdx: number) {
        setForm(prev => {
            const a = [...prev.packages];
            a[pkgIdx] = { ...a[pkgIdx], roomPrices: [...a[pkgIdx].roomPrices, { roomType: "Double", price: "" }] };
            return { ...prev, packages: a };
        });
    }
    function removeRoomPrice(pkgIdx: number, rpIdx: number) {
        setForm(prev => {
            const a = [...prev.packages];
            a[pkgIdx] = { ...a[pkgIdx], roomPrices: a[pkgIdx].roomPrices.filter((_, i) => i !== rpIdx) };
            return { ...prev, packages: a };
        });
    }
    function updateRoomPrice(pkgIdx: number, rpIdx: number, field: keyof RoomPrice, val: string) {
        setForm(prev => {
            const a = [...prev.packages];
            const rp = [...a[pkgIdx].roomPrices];
            rp[rpIdx] = { ...rp[rpIdx], [field]: val };
            a[pkgIdx] = { ...a[pkgIdx], roomPrices: rp };
            return { ...prev, packages: a };
        });
    }

    function updateItinerary(idx: number, field: keyof ItineraryDay, val: string) {
        setForm(prev => { const a = [...prev.itinerary]; a[idx] = { ...a[idx], [field]: val }; return { ...prev, itinerary: a }; });
    }
    function addItinerary() { setForm(prev => ({ ...prev, itinerary: [...prev.itinerary, { day: `Day ${prev.itinerary.length + 1}`, activity: "", details: "" }] })); }
    function removeItinerary(idx: number) { setForm(prev => ({ ...prev, itinerary: prev.itinerary.filter((_, i) => i !== idx) })); }

    function updateInclusion(idx: number, val: string) {
        setForm(prev => { const a = [...prev.inclusions]; a[idx] = val; return { ...prev, inclusions: a }; });
    }
    function addInclusion() { setForm(prev => ({ ...prev, inclusions: [...prev.inclusions, ""] })); }
    function removeInclusion(idx: number) { setForm(prev => ({ ...prev, inclusions: prev.inclusions.filter((_, i) => i !== idx) })); }

    function updateExclusion(idx: number, val: string) {
        setForm(prev => { const a = [...prev.exclusions]; a[idx] = val; return { ...prev, exclusions: a }; });
    }
    function addExclusion() { setForm(prev => ({ ...prev, exclusions: [...prev.exclusions, ""] })); }
    function removeExclusion(idx: number) { setForm(prev => ({ ...prev, exclusions: prev.exclusions.filter((_, i) => i !== idx) })); }

    function updateDateAvail(idx: number, field: keyof DateAvailability, val: string) {
        setForm(prev => { const a = [...prev.datesAvailability]; a[idx] = { ...a[idx], [field]: val }; return { ...prev, datesAvailability: a }; });
    }
    function addDateAvail() { setForm(prev => ({ ...prev, datesAvailability: [...prev.datesAvailability, { departure: "", arrival: "", airline: "", price: "" }] })); }
    function removeDateAvail(idx: number) { setForm(prev => ({ ...prev, datesAvailability: prev.datesAvailability.filter((_, i) => i !== idx) })); }

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Tours &amp; Packages</h2>
                    <p className="mt-1 text-sm text-slate-500">Manage your travel packages, pricing, and availability.</p>
                </div>
                <button onClick={openCreate} className="mt-4 sm:mt-0 flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
                    <Plus className="h-4 w-4" /> Add New Tour
                </button>
            </div>

            {/* Table */}
            <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        {initialTours.length === 0 ? (
                            <p className="px-6 py-8 text-sm text-slate-500 text-center bg-white">No tours yet. Add your first tour.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-slate-300">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Title</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Country</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Duration</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Price</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {initialTours.map(t => (
                                        <tr key={t.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">{t.title}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{t.country ?? "—"}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{t.duration ?? "—"}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{t.price ?? "—"}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${t.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"}`}>
                                                    {t.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button onClick={() => openEdit(t)} className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1">
                                                        <Pencil className="h-3.5 w-3.5" /> Edit
                                                    </button>
                                                    <button onClick={() => confirmDelete(t.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1">
                                                        <Trash2 className="h-3.5 w-3.5" /> Delete
                                                    </button>
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

            {/* Modal */}
            {modal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">{modal.mode === "create" ? "Add New Tour" : "Edit Tour"}</h3>
                            <button onClick={close}><X className="h-5 w-5 text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <div className="px-6 py-5 space-y-6">
                            {error && <p className="text-sm text-red-600 bg-red-50 rounded-md p-2">{error}</p>}

                            {/* Basic Info */}
                            <div className={sectionCls}>
                                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Basic Info</h4>
                                <div>
                                    <label className={labelCls}>Title <span className="text-red-500">*</span></label>
                                    <input
                                        className={inputCls}
                                        value={form.title}
                                        onChange={e => {
                                            const title = e.target.value;
                                            setForm(f => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
                                        }}
                                        placeholder="e.g. Kashmir Paradise Tour"
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>
                                        Slug
                                        <span className="ml-2 text-xs font-normal text-slate-400">URL: /tours/{form.slug || "<auto>"}</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            className={inputCls + " font-mono"}
                                            value={form.slug}
                                            onChange={e => { setSlugTouched(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                                            placeholder="auto-generated from title"
                                        />
                                        {slugTouched && (
                                            <button
                                                type="button"
                                                onClick={() => { setSlugTouched(false); setForm(f => ({ ...f, slug: slugify(f.title) })); }}
                                                className="shrink-0 text-xs text-emerald-600 hover:text-emerald-800 font-medium"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Country</label>
                                        <select className={inputCls} value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
                                            <option value="">Select country</option>
                                            {countries.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Category</label>
                                        <select className={inputCls} value={form.tourCategoryId} onChange={e => setForm(f => ({ ...f, tourCategoryId: e.target.value }))}>
                                            <option value="">Uncategorised</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Destination</label>
                                    <select className={inputCls} value={form.destinationId} onChange={e => setForm(f => ({ ...f, destinationId: e.target.value }))}>
                                        <option value="">No destination</option>
                                        {destinations.map(d => <option key={d.id} value={d.id}>{d.name} ({d.country.name})</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Price</label>
                                        <input className={inputCls} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 15,000" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Duration</label>
                                        <input className={inputCls} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 5 Days / 4 Nights" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelCls}>
                                            Original Price
                                            <span className="ml-2 text-xs font-normal text-slate-400">For discount %</span>
                                        </label>
                                        <input className={inputCls} value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} placeholder="e.g. 18,000" />
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
                                <div>
                                    <label className={labelCls}>
                                        Hotel Name
                                        <span className="ml-2 text-xs font-normal text-slate-400">Optional — the main hotel for this tour</span>
                                    </label>
                                    <input className={inputCls} value={form.hotelName} onChange={e => setForm(f => ({ ...f, hotelName: e.target.value }))} placeholder="e.g. Hilton Makkah Convention Hotel" />
                                </div>
                                <div>
                                    <label className={labelCls}>Description</label>
                                    <textarea className={inputCls + " resize-none"} rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Overview of the tour…" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="tour-active" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                                    <label htmlFor="tour-active" className="text-sm font-medium text-slate-700">Active (visible on public site)</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="tour-featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                                    <label htmlFor="tour-featured" className="text-sm font-medium text-slate-700">Featured on homepage</label>
                                </div>
                            </div>

                            {/* Features */}
                            <div className={sectionCls}>
                                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Features</h4>
                                <div className="flex flex-wrap gap-3">
                                    {FEATURE_OPTIONS.map(f => (
                                        <label key={f} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={form.features.includes(f)} onChange={() => toggleFeature(f)} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                                            <span className="text-sm text-slate-700">{f}</span>
                                        </label>
                                    ))}
                                </div>
                                {form.features.includes("Meals") && (
                                    <div className="pl-6 pt-2 mt-2 border-l-2 border-emerald-200 space-y-2">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block">Meal Options</span>
                                        <div className="flex flex-wrap gap-3">
                                            {MEAL_OPTIONS.map(m => (
                                                <label key={m} className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" checked={form.mealTypes.includes(m)} onChange={() => toggleMeal(m)} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                                                    <span className="text-sm text-slate-700">{m}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Images */}
                            <div className={sectionCls}>
                                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Images (first = hero)</h4>
                                <ImageUploader
                                    images={form.images}
                                    onChange={imgs => setForm(prev => ({ ...prev, images: imgs }))}
                                    category="tours"
                                />
                            </div>

                            {/* Packages */}
                            <div className={sectionCls}>
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Packages &amp; Pricing</h4>
                                    <button type="button" onClick={addPackage} className={addBtnCls}><PlusCircle className="h-4 w-4" /> Add Package</button>
                                </div>
                                {form.packages.map((pkg, pi) => (
                                    <div key={pi} className="border border-slate-200 rounded-md p-3 space-y-3 bg-slate-50">
                                        <div className="flex gap-2 items-center">
                                            <input className={inputCls + " flex-1"} value={pkg.packageTitle} onChange={e => updatePackage(pi, "packageTitle", e.target.value)} placeholder="Package title (e.g. Economy)" />
                                            <button type="button" onClick={() => removePackage(pi)} className={removeBtnCls}><MinusCircle className="h-4 w-4" /></button>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Hotel Name</label>
                                            <input className={inputCls} value={pkg.hotelName ?? ""} onChange={e => updatePackage(pi, "hotelName", e.target.value)} placeholder="e.g. Hilton Makkah Convention Hotel" />
                                        </div>
                                        <div className="space-y-2 pl-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium text-slate-500 uppercase">Room Prices</span>
                                                <button type="button" onClick={() => addRoomPrice(pi)} className={addBtnCls}><PlusCircle className="h-3.5 w-3.5" /> Add Room</button>
                                            </div>
                                            {pkg.roomPrices.map((rp, ri) => (
                                                <div key={ri} className="flex gap-2 items-center">
                                                    <select className={selectCls} value={rp.roomType} onChange={e => updateRoomPrice(pi, ri, "roomType", e.target.value)}>
                                                        {ROOM_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                                                    </select>
                                                    <input className={inputCls + " flex-1 min-w-0"} type="number" value={rp.price} onChange={e => updateRoomPrice(pi, ri, "price", e.target.value)} placeholder="Price" />
                                                    <button type="button" onClick={() => removeRoomPrice(pi, ri)} className={removeBtnCls}><MinusCircle className="h-4 w-4" /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Itinerary */}
                            <div className={sectionCls}>
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Itinerary</h4>
                                    <button type="button" onClick={addItinerary} className={addBtnCls}><PlusCircle className="h-4 w-4" /> Add Day</button>
                                </div>
                                {form.itinerary.map((day, i) => (
                                    <div key={i} className="border border-slate-200 rounded-md p-3 space-y-2 bg-slate-50">
                                        <div className="flex gap-2 items-center">
                                            <input className={inputCls + " w-32"} value={day.day} onChange={e => updateItinerary(i, "day", e.target.value)} placeholder="Day 1" />
                                            <input className={inputCls + " flex-1"} value={day.activity} onChange={e => updateItinerary(i, "activity", e.target.value)} placeholder="Activity title" />
                                            <button type="button" onClick={() => removeItinerary(i)} className={removeBtnCls}><MinusCircle className="h-4 w-4" /></button>
                                        </div>
                                        <textarea className={inputCls + " resize-none"} rows={2} value={day.details} onChange={e => updateItinerary(i, "details", e.target.value)} placeholder="Details for this day…" />
                                    </div>
                                ))}
                            </div>

                            {/* Inclusions & Exclusions side by side */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className={sectionCls}>
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Inclusions</h4>
                                        <button type="button" onClick={addInclusion} className={addBtnCls}><PlusCircle className="h-4 w-4" /> Add</button>
                                    </div>
                                    {form.inclusions.map((inc, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <input className={inputCls + " flex-1"} value={inc} onChange={e => updateInclusion(i, e.target.value)} placeholder="e.g. Hotel stay" />
                                            <button type="button" onClick={() => removeInclusion(i)} className={removeBtnCls}><MinusCircle className="h-4 w-4" /></button>
                                        </div>
                                    ))}
                                </div>
                                <div className={sectionCls}>
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Exclusions</h4>
                                        <button type="button" onClick={addExclusion} className={addBtnCls}><PlusCircle className="h-4 w-4" /> Add</button>
                                    </div>
                                    {form.exclusions.map((exc, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <input className={inputCls + " flex-1"} value={exc} onChange={e => updateExclusion(i, e.target.value)} placeholder="e.g. Airfare" />
                                            <button type="button" onClick={() => removeExclusion(i)} className={removeBtnCls}><MinusCircle className="h-4 w-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dates & Availability */}
                            <div className={sectionCls}>
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Dates &amp; Availability</h4>
                                    <button type="button" onClick={addDateAvail} className={addBtnCls}><PlusCircle className="h-4 w-4" /> Add Date</button>
                                </div>
                                {form.datesAvailability.map((d, i) => (
                                    <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-end">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Departure</label>
                                            <input type="date" className={inputCls} value={d.departure} onChange={e => updateDateAvail(i, "departure", e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Arrival</label>
                                            <input type="date" className={inputCls} value={d.arrival} onChange={e => updateDateAvail(i, "arrival", e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Airline</label>
                                            <input type="text" className={inputCls} value={d.airline ?? ""} onChange={e => updateDateAvail(i, "airline", e.target.value)} placeholder="e.g. Saudi Airlines" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Price (₹)</label>
                                            <input type="number" className={inputCls} value={d.price ?? ""} onChange={e => updateDateAvail(i, "price", e.target.value)} placeholder="e.g. 95000" />
                                        </div>
                                        <button type="button" onClick={() => removeDateAvail(i)} className={removeBtnCls + " self-center sm:mt-5"}><MinusCircle className="h-4 w-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
                            <button onClick={close} className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ring-1 ring-slate-300">Cancel</button>
                            <button onClick={save} disabled={isPending} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">
                                {isPending ? "Saving…" : "Save Tour"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={deleteModal.open}
                title="Delete Tour"
                body="Are you sure you want to delete this tour? This action cannot be undone."
                confirmText="Delete"
                danger={true}
                isPending={deleteModal.pending}
                onConfirm={executeDelete}
                onCancel={() => setDeleteModal({ open: false, id: null, pending: false })}
            />
        </div>
    );
}
