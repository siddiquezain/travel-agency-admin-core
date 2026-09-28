"use client";
import React, { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus, Pencil, Trash2, X, Download, Search } from "lucide-react";
import { ImageUploader } from "@/core/ui/ImageUploader";
import RichTextEditor from "@/core/ui/RichTextEditor";
import { DESTINATION_SECTIONS } from "@/modules/destinations/destination-fields";

type Country = { id: number; name: string; code: string };
type Faq = { q: string; a: string };
type Attraction = { name: string; description: string; image: string };
type Sections = Record<string, string>;

type Destination = {
    id: number;
    name: string;
    slug: string;
    countryId: number;
    country: Country | null;
    description: string | null;
    heroImage: string | null;
    gallery: unknown;
    overview: string | null;
    sections: unknown;
    attractions: unknown;
    faqs: unknown;
    region: string | null;
    bestTimeShort: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    featured: boolean;
    sortOrder: number | null;
    isActive: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
};

type Form = {
    name: string;
    slug: string;
    countryId: string;
    description: string;
    heroImage: string;
    gallery: string[];
    overview: string;
    sections: Sections;
    attractions: Attraction[];
    faqs: Faq[];
    region: string;
    bestTimeShort: string;
    metaTitle: string;
    metaDescription: string;
    featured: boolean;
    sortOrder: string;
    isActive: boolean;
};

type Modal =
    | { open: false }
    | { open: true; mode: "create" }
    | { open: true; mode: "edit"; item: Destination };

const blank: Form = {
    name: "",
    slug: "",
    countryId: "",
    description: "",
    heroImage: "",
    gallery: [],
    overview: "",
    sections: {},
    attractions: [],
    faqs: [],
    region: "",
    bestTimeShort: "",
    metaTitle: "",
    metaDescription: "",
    featured: false,
    sortOrder: "",
    isActive: true,
};

const inputCls =
    "block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600 sm:text-sm";
const labelCls = "block text-sm font-medium text-slate-700 mb-1";
const sectionCls = "border border-slate-200 rounded-lg p-4 space-y-3";

function slugify(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function normFaqs(value: unknown): Faq[] {
    if (!Array.isArray(value)) return [];
    return value
        .map((f) => {
            if (!f || typeof f !== "object") return null;
            const r = f as Record<string, unknown>;
            return { q: typeof r.q === "string" ? r.q : "", a: typeof r.a === "string" ? r.a : "" };
        })
        .filter((f): f is Faq => f !== null);
}

function normAttractions(value: unknown): Attraction[] {
    if (!Array.isArray(value)) return [];
    return value
        .map((a) => {
            if (!a || typeof a !== "object") return null;
            const r = a as Record<string, unknown>;
            return {
                name: typeof r.name === "string" ? r.name : "",
                description: typeof r.description === "string" ? r.description : "",
                image: typeof r.image === "string" ? r.image : "",
            };
        })
        .filter((a): a is Attraction => a !== null);
}

function normSections(value: unknown): Sections {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const out: Sections = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        if (typeof v === "string") out[k] = v;
    }
    return out;
}

function exportCSV(data: Destination[]) {
    const headers = ["ID", "Name", "Slug", "Country", "Featured", "Status"];
    const rows = data.map((d) => [
        d.id,
        `"${d.name}"`,
        d.slug,
        d.country?.name ?? "",
        d.featured ? "Yes" : "No",
        d.isActive ? "Active" : "Inactive",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `destinations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export function DestinationsTable({
    initialDestinations,
    countries,
}: {
    initialDestinations: Destination[];
    countries: Country[];
}) {
    const router = useRouter();
    const { data: session } = useSession();
    const role = (session?.user as { role?: string })?.role ?? "ADMIN";
    const canDelete = role === "SUPER_ADMIN";

    const [modal, setModal] = useState<Modal>({ open: false });
    const [form, setForm] = useState<Form>(blank);
    const [slugTouched, setSlugTouched] = useState(false);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState("");
    const [countryFilter, setCountryFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

    const filtered = useMemo(() => {
        return initialDestinations.filter((d) => {
            const matchSearch =
                !search ||
                d.name.toLowerCase().includes(search.toLowerCase()) ||
                (d.country?.name ?? "").toLowerCase().includes(search.toLowerCase());
            const matchCountry = countryFilter === "all" || String(d.countryId) === countryFilter;
            const matchStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && d.isActive) ||
                (statusFilter === "inactive" && !d.isActive);
            return matchSearch && matchCountry && matchStatus;
        });
    }, [initialDestinations, search, countryFilter, statusFilter]);

    function openCreate() {
        setForm(blank);
        setSlugTouched(false);
        setError("");
        setModal({ open: true, mode: "create" });
    }

    function openEdit(d: Destination) {
        setSlugTouched(true);
        setForm({
            name: d.name,
            slug: d.slug,
            countryId: String(d.countryId),
            description: d.description ?? "",
            heroImage: d.heroImage ?? "",
            gallery: Array.isArray(d.gallery) ? (d.gallery as string[]) : [],
            overview: d.overview ?? "",
            sections: normSections(d.sections),
            attractions: normAttractions(d.attractions),
            faqs: normFaqs(d.faqs),
            region: d.region ?? "",
            bestTimeShort: d.bestTimeShort ?? "",
            metaTitle: d.metaTitle ?? "",
            metaDescription: d.metaDescription ?? "",
            featured: d.featured,
            sortOrder: d.sortOrder != null ? String(d.sortOrder) : "",
            isActive: d.isActive,
        });
        setError("");
        setModal({ open: true, mode: "edit", item: d });
    }

    function close() {
        setModal({ open: false });
    }

    function setSection(key: string, html: string) {
        setForm((f) => ({ ...f, sections: { ...f.sections, [key]: html } }));
    }

    async function save() {
        if (!form.name.trim()) {
            setError("Destination name is required");
            return;
        }
        if (!form.countryId) {
            setError("Country is required");
            return;
        }
        setError("");
        const isEdit = modal.open && modal.mode === "edit";
        const url = isEdit
            ? `/api/destinations/${(modal as { open: true; mode: "edit"; item: Destination }).item.id}`
            : "/api/destinations";
        const body = {
            name: form.name.trim(),
            slug: form.slug.trim(),
            countryId: Number(form.countryId),
            description: form.description.trim() || null,
            heroImage: form.heroImage || null,
            gallery: form.gallery,
            overview: form.overview,
            sections: form.sections,
            attractions: form.attractions
                .map((a) => ({
                    name: a.name.trim(),
                    description: a.description.trim(),
                    image: a.image.trim(),
                }))
                .filter((a) => a.name),
            faqs: form.faqs
                .map((f) => ({ q: f.q.trim(), a: f.a.trim() }))
                .filter((f) => f.q && f.a),
            region: form.region.trim() || null,
            bestTimeShort: form.bestTimeShort.trim() || null,
            metaTitle: form.metaTitle.trim() || null,
            metaDescription: form.metaDescription.trim() || null,
            featured: form.featured,
            sortOrder: form.sortOrder.trim() === "" ? null : Number(form.sortOrder),
            isActive: form.isActive,
        };
        const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            setError(d.error || "Failed");
            return;
        }
        close();
        startTransition(() => router.refresh());
    }

    async function del(id: number) {
        if (!confirm("Delete this destination?")) return;
        const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
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
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Destinations</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Destination guides — hero, attractions, sections, FAQs and SEO.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center gap-2">
                    <button
                        onClick={() => exportCSV(filtered)}
                        className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-300 hover:bg-slate-50"
                    >
                        <Download className="h-4 w-4" /> Export CSV
                    </button>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                    >
                        <Plus className="h-4 w-4" /> Add Destination
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or country…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={inputCls + " pl-9"}
                    />
                </div>
                <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className={inputCls + " sm:w-48"}
                >
                    <option value="all">All Countries</option>
                    {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                    className={inputCls + " sm:w-40"}
                >
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
                                {initialDestinations.length === 0
                                    ? "No destinations yet."
                                    : "No destinations match your filters."}
                            </p>
                        ) : (
                            <table className="min-w-full divide-y divide-slate-300">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">
                                            Name
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                            Country
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                            Status
                                        </th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {filtered.map((d) => (
                                        <tr key={d.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                                                {d.name}
                                                <div className="text-xs text-slate-500">/{d.slug}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                {d.country?.name ?? "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${d.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"}`}
                                                >
                                                    {d.isActive ? "Active" : "Inactive"}
                                                </span>
                                                {d.featured && (
                                                    <span className="ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
                                                        Featured
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => openEdit(d)}
                                                        className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" /> Edit
                                                    </button>
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => del(d.id)}
                                                            className="text-red-500 hover:text-red-700 flex items-center gap-1"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" /> Delete
                                                        </button>
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
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto">
                        <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {modal.mode === "create" ? "Add Destination" : "Edit Destination"}
                            </h3>
                            <button onClick={close} aria-label="Close">
                                <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-5">
                            {error && (
                                <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* Basics */}
                            <div className={sectionCls}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelCls}>
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className={inputCls}
                                            value={form.name}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                setForm((f) => ({
                                                    ...f,
                                                    name: v,
                                                    slug: slugTouched ? f.slug : slugify(v),
                                                }));
                                            }}
                                            placeholder="e.g. Dubai, Bali, Thailand"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Slug</label>
                                        <input
                                            className={inputCls}
                                            value={form.slug}
                                            onChange={(e) => {
                                                setSlugTouched(true);
                                                setForm((f) => ({ ...f, slug: e.target.value }));
                                            }}
                                            placeholder="auto-generated from name"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>
                                            Country <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            className={inputCls}
                                            value={form.countryId}
                                            onChange={(e) => setForm((f) => ({ ...f, countryId: e.target.value }))}
                                        >
                                            <option value="">Select country</option>
                                            {countries.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Region (for menu grouping)</label>
                                        <input
                                            className={inputCls}
                                            value={form.region}
                                            onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                                            placeholder="e.g. Middle East, Southeast Asia"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Best time (short chip)</label>
                                        <input
                                            className={inputCls}
                                            value={form.bestTimeShort}
                                            onChange={(e) => setForm((f) => ({ ...f, bestTimeShort: e.target.value }))}
                                            placeholder="e.g. Nov–Mar"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Sort order</label>
                                        <input
                                            type="number"
                                            className={inputCls}
                                            value={form.sortOrder}
                                            onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                                            placeholder="lower shows first"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Short description (card excerpt)</label>
                                    <textarea
                                        rows={2}
                                        className={inputCls}
                                        value={form.description}
                                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                        placeholder="One or two lines shown on listing cards and used as a meta fallback."
                                    />
                                </div>
                            </div>

                            {/* Hero + gallery */}
                            <div className={sectionCls}>
                                <label className={labelCls}>Hero image</label>
                                <ImageUploader
                                    images={form.heroImage ? [form.heroImage] : []}
                                    onChange={(arr) => setForm((f) => ({ ...f, heroImage: arr[0] ?? "" }))}
                                    category="destinations"
                                    maxFiles={1}
                                />
                                <label className={labelCls}>Gallery</label>
                                <ImageUploader
                                    images={form.gallery}
                                    onChange={(arr) => setForm((f) => ({ ...f, gallery: arr }))}
                                    category="destinations"
                                    maxFiles={12}
                                />
                            </div>

                            {/* Overview */}
                            <div className={sectionCls}>
                                <label className={labelCls}>Overview</label>
                                <RichTextEditor
                                    value={form.overview}
                                    onChange={(html) => setForm((f) => ({ ...f, overview: html }))}
                                    placeholder="Introduce the destination…"
                                />
                            </div>

                            {/* Guide sections */}
                            <div className={sectionCls}>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Guide sections
                                </p>
                                <p className="text-xs text-slate-400">
                                    Leave any section blank to hide it on the public page.
                                </p>
                                {DESTINATION_SECTIONS.map((s) => (
                                    <div key={s.key}>
                                        <label className={labelCls}>{s.label}</label>
                                        <RichTextEditor
                                            value={form.sections[s.key] ?? ""}
                                            onChange={(html) => setSection(s.key, html)}
                                            placeholder={`Write the "${s.label}" section…`}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Attractions */}
                            <div className={sectionCls}>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Top Attractions
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm((f) => ({
                                                ...f,
                                                attractions: [...f.attractions, { name: "", description: "", image: "" }],
                                            }))
                                        }
                                        className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
                                    >
                                        <Plus className="h-3.5 w-3.5" /> Add attraction
                                    </button>
                                </div>
                                {form.attractions.length === 0 ? (
                                    <p className="text-sm text-slate-400">No attractions added.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {form.attractions.map((a, i) => (
                                            <div key={i} className="rounded-md border border-slate-200 p-3 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-slate-500">
                                                        Attraction {i + 1}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setForm((f) => ({
                                                                ...f,
                                                                attractions: f.attractions.filter((_, idx) => idx !== i),
                                                            }))
                                                        }
                                                        className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" /> Remove
                                                    </button>
                                                </div>
                                                <input
                                                    className={inputCls}
                                                    value={a.name}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        setForm((f) => ({
                                                            ...f,
                                                            attractions: f.attractions.map((x, idx) =>
                                                                idx === i ? { ...x, name: v } : x,
                                                            ),
                                                        }));
                                                    }}
                                                    placeholder="Attraction name"
                                                />
                                                <textarea
                                                    rows={2}
                                                    className={inputCls}
                                                    value={a.description}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        setForm((f) => ({
                                                            ...f,
                                                            attractions: f.attractions.map((x, idx) =>
                                                                idx === i ? { ...x, description: v } : x,
                                                            ),
                                                        }));
                                                    }}
                                                    placeholder="Short description"
                                                />
                                                <ImageUploader
                                                    images={a.image ? [a.image] : []}
                                                    onChange={(arr) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            attractions: f.attractions.map((x, idx) =>
                                                                idx === i ? { ...x, image: arr[0] ?? "" } : x,
                                                            ),
                                                        }))
                                                    }
                                                    category="destinations"
                                                    maxFiles={1}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* FAQs */}
                            <div className={sectionCls}>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">FAQs</p>
                                    <button
                                        type="button"
                                        onClick={() => setForm((f) => ({ ...f, faqs: [...f.faqs, { q: "", a: "" }] }))}
                                        className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
                                    >
                                        <Plus className="h-3.5 w-3.5" /> Add FAQ
                                    </button>
                                </div>
                                {form.faqs.length === 0 ? (
                                    <p className="text-sm text-slate-400">No FAQs added.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {form.faqs.map((faq, i) => (
                                            <div key={i} className="rounded-md border border-slate-200 p-3 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-slate-500">FAQ {i + 1}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setForm((f) => ({
                                                                ...f,
                                                                faqs: f.faqs.filter((_, idx) => idx !== i),
                                                            }))
                                                        }
                                                        className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" /> Remove
                                                    </button>
                                                </div>
                                                <input
                                                    className={inputCls}
                                                    value={faq.q}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        setForm((f) => ({
                                                            ...f,
                                                            faqs: f.faqs.map((x, idx) => (idx === i ? { ...x, q: v } : x)),
                                                        }));
                                                    }}
                                                    placeholder="Question"
                                                />
                                                <textarea
                                                    rows={2}
                                                    className={inputCls}
                                                    value={faq.a}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        setForm((f) => ({
                                                            ...f,
                                                            faqs: f.faqs.map((x, idx) => (idx === i ? { ...x, a: v } : x)),
                                                        }));
                                                    }}
                                                    placeholder="Answer"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* SEO */}
                            <div className={sectionCls}>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">SEO</p>
                                <div>
                                    <label className={labelCls}>Meta title</label>
                                    <input
                                        className={inputCls}
                                        value={form.metaTitle}
                                        onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                                        placeholder="Defaults to “{Name} Travel Guide”"
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Meta description</label>
                                    <textarea
                                        rows={2}
                                        className={inputCls}
                                        value={form.metaDescription}
                                        onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                                        placeholder="Defaults to the short description"
                                    />
                                </div>
                            </div>

                            {/* Flags */}
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                                    />
                                    Active (published)
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.featured}
                                        onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                                    />
                                    Featured
                                </label>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
                            <button
                                onClick={close}
                                className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ring-1 ring-slate-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={save}
                                disabled={isPending}
                                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                            >
                                {isPending ? "Saving..." : modal.mode === "create" ? "Save Destination" : "Update Destination"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
