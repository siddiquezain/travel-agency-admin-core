"use client";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type User = { id: number; name: string | null; email: string; role: string; createdAt: string | Date };
type Form = { name: string; email: string; password: string; role: string };
type Modal = { open: false } | { open: true; mode: "create" } | { open: true; mode: "edit"; user: User };

const blank: Form = { name: "", email: "", password: "", role: "ADMIN" };
const inputCls = "block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600 sm:text-sm";
const labelCls = "block text-sm font-medium text-slate-700 mb-1";

export function UsersTable({ initialUsers }: { initialUsers: User[] }) {
    const router = useRouter();
    const [modal, setModal] = useState<Modal>({ open: false });
    const [form, setForm] = useState<Form>(blank);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    function openCreate() { setForm(blank); setError(""); setModal({ open: true, mode: "create" }); }
    function openEdit(u: User) {
        setForm({ name: u.name ?? "", email: u.email, password: "", role: u.role });
        setError(""); setModal({ open: true, mode: "edit", user: u });
    }
    function close() { setModal({ open: false }); }
    function set(k: keyof Form, v: string) { setForm(f => ({ ...f, [k]: v })); }

    async function save() {
        if (!form.email.trim()) { setError("Email is required"); return; }
        const isEdit = modal.open && modal.mode === "edit";
        if (!isEdit && !form.password) { setError("Password is required for new users"); return; }
        setError("");
        const url = isEdit ? `/api/users/${(modal as { open: true; mode: "edit"; user: User }).user.id}` : "/api/users";
        const body: Record<string, string> = { email: form.email, role: form.role };
        if (form.name) body.name = form.name;
        if (form.password) body.password = form.password;
        const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
        close(); startTransition(() => router.refresh());
    }

    async function del(id: number) {
        if (!confirm("Delete this user?")) return;
        const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
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
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Users</h2>
                    <p className="mt-1 text-sm text-slate-500">Manage admin users and their roles.</p>
                </div>
                <button onClick={openCreate} className="mt-4 sm:mt-0 flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
                    <Plus className="h-4 w-4" /> Add User
                </button>
            </div>

            <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        {initialUsers.length === 0 ? (
                            <p className="px-6 py-8 text-sm text-slate-500 text-center bg-white">No users yet.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-slate-300">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Name</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Email</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Role</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Joined</th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {initialUsers.map(u => (
                                        <tr key={u.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">{u.name ?? "—"}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{u.email}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">{u.role}</span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button onClick={() => openEdit(u)} className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                                                    <button onClick={() => del(u.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
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
                            <h3 className="text-lg font-semibold text-slate-900">{modal.mode === "create" ? "Add User" : "Edit User"}</h3>
                            <button onClick={close}><X className="h-5 w-5 text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            {error && <p className="text-sm text-red-600 bg-red-50 rounded-md p-2">{error}</p>}
                            <div>
                                <label className={labelCls}>Name</label>
                                <input className={inputCls} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Full name" />
                            </div>
                            <div>
                                <label className={labelCls}>Email <span className="text-red-500">*</span></label>
                                <input className={inputCls} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="admin@example.com" />
                            </div>
                            <div>
                                <label className={labelCls}>{modal.mode === "edit" ? "New Password (leave blank to keep)" : "Password *"}</label>
                                <input className={inputCls} type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" />
                            </div>
                            <div>
                                <label className={labelCls}>Role</label>
                                <select className={inputCls} value={form.role} onChange={e => set("role", e.target.value)}>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
                            <button onClick={close} className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ring-1 ring-slate-300">Cancel</button>
                            <button onClick={save} disabled={isPending} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">
                                {isPending ? "Saving…" : "Save User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
