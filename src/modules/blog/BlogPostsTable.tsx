"use client";
import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { ImageUploader } from "@/core/ui/ImageUploader";
import { ConfirmDialog } from "@/core/ui/ConfirmDialog";
import RichTextEditor from "@/core/ui/RichTextEditor";
import { useDestinations } from "@/hooks/useDestinations";

type Faq = { q: string; a: string };

type BlogPost = {
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    faqs: unknown;
    featuredImage: string | null;
    category: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    authorId: number | null;
    author: { id: number; name: string | null; email: string } | null;
    isActive: boolean;
    featured: boolean;
    publishedAt: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    destinations?: { id: number; name: string }[];
};

type Form = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    faqs: Faq[];
    featuredImage: string;
    category: string;
    metaTitle: string;
    metaDescription: string;
    isActive: boolean;
    featured: boolean;
    publishedAt: string; // datetime-local: yyyy-mm-ddThh:mm (admin's local time)
    destinationIds: number[];
};

type Modal =
    | { open: false }
    | { open: true; mode: "create" }
    | { open: true; mode: "edit"; post: BlogPost };

function normalizeFaqs(value: unknown): Faq[] {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => {
            if (!item || typeof item !== "object") return null;
            const r = item as Record<string, unknown>;
            const q = typeof r.q === "string" ? r.q : "";
            const a = typeof r.a === "string" ? r.a : "";
            return { q, a };
        })
        .filter((f): f is Faq => f !== null);
}

function slugify(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Convert a stored UTC instant into the `yyyy-mm-ddThh:mm` string a
// datetime-local input expects, expressed in the admin's local timezone.
function toDateTimeLocalInput(value: Date | string | null): string {
    if (!value) return "";
    try {
        const d = typeof value === "string" ? new Date(value) : value;
        if (Number.isNaN(d.getTime())) return "";
        // Shift by the local tz offset so slice() yields local wall-clock time.
        const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
        return local.toISOString().slice(0, 16);
    } catch {
        return "";
    }
}

// Current local time as a datetime-local default for new posts.
function nowDateTimeLocalInput(): string {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
}

const blank: Form = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    faqs: [],
    featuredImage: "",
    category: "",
    metaTitle: "",
    metaDescription: "",
    isActive: true,
    featured: false,
    publishedAt: "", // set to "now" in openCreate()
    destinationIds: [],
};

const inputCls =
    "block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600 sm:text-sm";
const labelCls = "block text-sm font-medium text-slate-700 mb-1";
const sectionCls = "border border-slate-200 rounded-lg p-4 space-y-3";

export function BlogPostsTable({ initialPosts }: { initialPosts: BlogPost[] }) {
    const router = useRouter();
    const { destinations } = useDestinations();
    const [modal, setModal] = useState<Modal>({ open: false });
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        id: number | null;
        pending: boolean;
    }>({ open: false, id: null, pending: false });
    const [form, setForm] = useState<Form>(blank);
    const [slugTouched, setSlugTouched] = useState(false);
    const [error, setError] = useState("");
    const [, startTransition] = useTransition();

    // Resolved after mount to avoid SSR/client hydration mismatch on time.
    const [now, setNow] = useState<number | null>(null);
    useEffect(() => {
        setNow(Date.now());
    }, []);

    // A post is "scheduled" (not yet public) when it's active but its publish
    // instant is still in the future. Mirrors the server-side publish gate.
    function isScheduled(p: BlogPost): boolean {
        if (now === null || !p.publishedAt) return false;
        const t = new Date(p.publishedAt).getTime();
        return !Number.isNaN(t) && t > now;
    }

    function openCreate() {
        // Default a new post to "publish now" (local time), so leaving the field
        // untouched publishes immediately.
        setForm({ ...blank, publishedAt: nowDateTimeLocalInput() });
        setSlugTouched(false);
        setError("");
        setModal({ open: true, mode: "create" });
    }

    function openEdit(p: BlogPost) {
        setSlugTouched(true);
        setForm({
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt ?? "",
            content: p.content ?? "",
            faqs: normalizeFaqs(p.faqs),
            featuredImage: p.featuredImage ?? "",
            category: p.category ?? "",
            metaTitle: p.metaTitle ?? "",
            metaDescription: p.metaDescription ?? "",
            isActive: p.isActive,
            featured: p.featured,
            publishedAt: toDateTimeLocalInput(p.publishedAt),
            destinationIds: (p.destinations ?? []).map(d => d.id),
        });
        setError("");
        setModal({ open: true, mode: "edit", post: p });
    }

    function close() {
        setModal({ open: false });
    }

    async function save() {
        if (!form.title.trim()) {
            setError("Title is required");
            return;
        }
        if (!form.content.trim() || form.content === "<p></p>") {
            setError("Content is required");
            return;
        }
        setError("");
        const isEdit = modal.open && modal.mode === "edit";
        const url = isEdit
            ? `/api/blog/${(modal as { open: true; mode: "edit"; post: BlogPost }).post.id}`
            : "/api/blog";
        const body = {
            title: form.title,
            slug: form.slug.trim(),
            excerpt: form.excerpt.trim() || null,
            content: form.content,
            faqs: form.faqs
                .map((f) => ({ q: f.q.trim(), a: f.a.trim() }))
                .filter((f) => f.q && f.a),
            featuredImage: form.featuredImage || null,
            category: form.category.trim() || null,
            metaTitle: form.metaTitle.trim() || null,
            metaDescription: form.metaDescription.trim() || null,
            isActive: form.isActive,
            featured: form.featured,
            publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
            destinationIds: form.destinationIds,
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

    function confirmDelete(id: number) {
        setDeleteModal({ open: true, id, pending: false });
    }

    async function executeDelete() {
        if (deleteModal.id === null) return;
        setDeleteModal((prev) => ({ ...prev, pending: true }));
        const res = await fetch(`/api/blog/${deleteModal.id}`, { method: "DELETE" });
        if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            alert(d.error || "Delete failed");
            setDeleteModal((prev) => ({ ...prev, pending: false }));
            return;
        }
        setDeleteModal({ open: false, id: null, pending: false });
        startTransition(() => router.refresh());
    }

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Blog Posts</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Publish articles, guides, and destination features.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="mt-4 sm:mt-0 flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                >
                    <Plus className="h-4 w-4" /> New Post
                </button>
            </div>

            <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        {initialPosts.length === 0 ? (
                            <p className="px-6 py-8 text-sm text-slate-500 text-center bg-white">
                                No posts yet. Publish your first article.
                            </p>
                        ) : (
                            <table className="min-w-full divide-y divide-slate-300">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">
                                            Title
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                            Category
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                            Author
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                            Published
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
                                    {initialPosts.map((p) => (
                                        <tr key={p.id}>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                                                {p.title}
                                                <div className="text-xs text-slate-500">/{p.slug}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                {p.category ?? "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                {p.author?.name ?? p.author?.email ?? "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                {p.publishedAt
                                                    ? new Date(p.publishedAt).toLocaleString()
                                                    : "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                {!p.isActive ? (
                                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-800">
                                                        Draft
                                                    </span>
                                                ) : isScheduled(p) ? (
                                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                                                        Scheduled
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                                        Published
                                                    </span>
                                                )}
                                                {p.featured && (
                                                    <span className="ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
                                                        Featured
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => openEdit(p)}
                                                        className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(p.id)}
                                                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                                                    >
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

            {modal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto">
                        <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {modal.mode === "create" ? "New Post" : "Edit Post"}
                            </h3>
                            <button
                                onClick={close}
                                className="text-slate-400 hover:text-slate-600"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-5">
                            {error && (
                                <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <div className={sectionCls}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelCls}>Title *</label>
                                        <input
                                            className={inputCls}
                                            value={form.title}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                setForm((prev) => ({
                                                    ...prev,
                                                    title: v,
                                                    slug: slugTouched ? prev.slug : slugify(v),
                                                }));
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Slug</label>
                                        <input
                                            className={inputCls}
                                            value={form.slug}
                                            onChange={(e) => {
                                                setSlugTouched(true);
                                                setForm((prev) => ({ ...prev, slug: e.target.value }));
                                            }}
                                            placeholder="auto-generated from title"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Category</label>
                                        <input
                                            className={inputCls}
                                            value={form.category}
                                            onChange={(e) =>
                                                setForm((prev) => ({ ...prev, category: e.target.value }))
                                            }
                                            placeholder="e.g. Destinations, Visa Guides, Umrah"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Publish date &amp; time</label>
                                        <input
                                            type="datetime-local"
                                            className={inputCls}
                                            value={form.publishedAt}
                                            onChange={(e) =>
                                                setForm((prev) => ({ ...prev, publishedAt: e.target.value }))
                                            }
                                        />
                                        <p className="mt-1 text-xs text-slate-400">
                                            Set a future time to schedule. The post stays hidden
                                            (returns 404) until this moment, then publishes
                                            automatically. Uses your local timezone.
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Excerpt</label>
                                    <textarea
                                        rows={2}
                                        className={inputCls}
                                        value={form.excerpt}
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                                        }
                                        placeholder="Short summary shown in listings and search results (max ~280 chars)."
                                    />
                                </div>
                            </div>

                            <div className={sectionCls}>
                                <label className={labelCls}>Featured image</label>
                                <ImageUploader
                                    images={form.featuredImage ? [form.featuredImage] : []}
                                    onChange={(arr) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            featuredImage: arr[0] ?? "",
                                        }))
                                    }
                                    category="blog"
                                    maxFiles={1}
                                />
                            </div>

                            <div className={sectionCls}>
                                <label className={labelCls}>Content *</label>
                                <RichTextEditor
                                    value={form.content}
                                    onChange={(html) =>
                                        setForm((prev) => ({ ...prev, content: html }))
                                    }
                                    placeholder="Write your article…"
                                />
                            </div>

                            <div className={sectionCls}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            FAQs
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Optional. Shown as an accordion on the post and emitted as FAQ
                                            structured data for rich results.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                faqs: [...prev.faqs, { q: "", a: "" }],
                                            }))
                                        }
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
                                            <div
                                                key={i}
                                                className="rounded-md border border-slate-200 p-3 space-y-2 relative"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-slate-500">
                                                        FAQ {i + 1}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                faqs: prev.faqs.filter((_, idx) => idx !== i),
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
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            faqs: prev.faqs.map((f, idx) =>
                                                                idx === i ? { ...f, q: v } : f,
                                                            ),
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
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            faqs: prev.faqs.map((f, idx) =>
                                                                idx === i ? { ...f, a: v } : f,
                                                            ),
                                                        }));
                                                    }}
                                                    placeholder="Answer"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {destinations.length > 0 && (
                                <div className={sectionCls}>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                        Destinations
                                    </p>
                                    <p className="text-xs text-slate-400 mb-2">
                                        Tag this post with one or more destinations so it surfaces on destination pages.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {destinations.map(d => (
                                            <label key={d.id} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={form.destinationIds.includes(d.id)}
                                                    onChange={() =>
                                                        setForm(prev => ({
                                                            ...prev,
                                                            destinationIds: prev.destinationIds.includes(d.id)
                                                                ? prev.destinationIds.filter(id => id !== d.id)
                                                                : [...prev.destinationIds, d.id],
                                                        }))
                                                    }
                                                    className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                                                />
                                                <span className="text-sm text-slate-700">{d.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={sectionCls}>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    SEO
                                </p>
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label className={labelCls}>Meta title</label>
                                        <input
                                            className={inputCls}
                                            value={form.metaTitle}
                                            onChange={(e) =>
                                                setForm((prev) => ({ ...prev, metaTitle: e.target.value }))
                                            }
                                            placeholder="Defaults to post title"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Meta description</label>
                                        <textarea
                                            rows={2}
                                            className={inputCls}
                                            value={form.metaDescription}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    metaDescription: e.target.value,
                                                }))
                                            }
                                            placeholder="Defaults to excerpt"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                                        }
                                    />
                                    Active (published)
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.featured}
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, featured: e.target.checked }))
                                        }
                                    />
                                    Featured
                                </label>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
                            <button
                                onClick={close}
                                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={save}
                                className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={deleteModal.open}
                title="Delete post?"
                body="This will permanently remove the blog post. This action cannot be undone."
                confirmText="Delete"
                danger
                isPending={deleteModal.pending}
                onConfirm={executeDelete}
                onCancel={() => setDeleteModal({ open: false, id: null, pending: false })}
            />
        </div>
    );
}
