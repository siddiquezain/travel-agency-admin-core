import Link from "next/link";
import { MapPin, BadgeCheck, Stamp, FolderTree, DollarSign, FileText, Wrench } from "lucide-react";

const masters = [
    { name: "Destinations", href: "/admin/destinations", icon: MapPin, desc: "Destination guides — moved to its own top-level section." },
    { name: "Visa Types", href: "/admin/masters/visa-types", icon: BadgeCheck, desc: "Tourist, business, student, etc." },
    { name: "Attestation Types", href: "/admin/masters/attestation-types", icon: Stamp, desc: "Educational, commercial, personal, etc." },
    { name: "Tour Categories", href: "/admin/masters/tour-categories", icon: FolderTree, desc: "Beach, adventure, religious, etc." },
    { name: "Currencies", href: "/admin/masters/currencies", icon: DollarSign, desc: "ISO currency codes and symbols." },
    { name: "Document Types", href: "/admin/masters/document-types", icon: FileText, desc: "Passport, photo, bank statement, etc." },
    { name: "Service Types", href: "/admin/masters/service-types", icon: Wrench, desc: "Inquiry routing categories." },
];

export default function MastersIndexPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Masters</h2>
                <p className="mt-1 text-sm text-slate-500">Reference data used across tours, visas, attestations, and inquiries.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {masters.map(m => {
                    const Icon = m.icon;
                    return (
                        <Link
                            key={m.href}
                            href={m.href}
                            className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition"
                        >
                            <div className="flex items-start gap-3">
                                <div className="rounded-md bg-emerald-50 p-2">
                                    <Icon className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-slate-900">{m.name}</h3>
                                    <p className="mt-1 text-xs text-slate-500">{m.desc}</p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
