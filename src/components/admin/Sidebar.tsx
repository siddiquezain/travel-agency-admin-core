"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Users,
    Map,
    FileText,
    Settings,
    LogOut,
    PlaneTakeoff,
    Stamp,
    Globe,
    Layers,
    ChevronDown,
    ChevronRight,
    MapPin,
    BadgeCheck,
    FolderTree,
    DollarSign,
    Wrench,
    Newspaper,
} from "lucide-react";

type LeafItem = { name: string; href: string; icon: React.ComponentType<{ className?: string }> };
type GroupItem = { name: string; icon: React.ComponentType<{ className?: string }>; children: LeafItem[] };
type NavItem = LeafItem | GroupItem;

const navigation: NavItem[] = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Destinations", href: "/admin/destinations", icon: MapPin },
    { name: "Tours", href: "/admin/tours", icon: Map },
    { name: "Visas", href: "/admin/visas", icon: PlaneTakeoff },
    { name: "Attestations", href: "/admin/attestations", icon: Stamp },
    { name: "Blog", href: "/admin/blog", icon: Newspaper },
    { name: "Inquiries", href: "/admin/inquiries", icon: FileText },
    {
        name: "Masters",
        icon: Layers,
        children: [
            { name: "Countries", href: "/admin/countries", icon: Globe },
            { name: "Visa Types", href: "/admin/masters/visa-types", icon: BadgeCheck },
            { name: "Attestation Types", href: "/admin/masters/attestation-types", icon: Stamp },
            { name: "Tour Categories", href: "/admin/masters/tour-categories", icon: FolderTree },
            { name: "Currencies", href: "/admin/masters/currencies", icon: DollarSign },
            { name: "Document Types", href: "/admin/masters/document-types", icon: FileText },
            { name: "Service Types", href: "/admin/masters/service-types", icon: Wrench },
        ],
    },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

function isGroup(item: NavItem): item is GroupItem {
    return (item as GroupItem).children !== undefined;
}

function isLeafActive(href: string, pathname: string): boolean {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
}

function isGroupActive(group: GroupItem, pathname: string): boolean {
    return group.children.some(c => isLeafActive(c.href, pathname));
}

export default function Sidebar() {
    const pathname = usePathname();

    const initialOpen: Record<string, boolean> = {};
    for (const item of navigation) {
        if (isGroup(item)) initialOpen[item.name] = isGroupActive(item, pathname);
    }
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialOpen);

    function toggle(name: string) {
        setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }));
    }

    return (
        <div className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800 text-white shadow-xl">
            <div className="flex h-16 shrink-0 items-center justify-center border-b border-slate-800 px-6">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    Origin Admin
                </span>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
                <nav className="flex-1 space-y-1 px-4">
                    {navigation.map((item) => {
                        if (isGroup(item)) {
                            const groupActive = isGroupActive(item, pathname);
                            const isOpen = openGroups[item.name] ?? groupActive;
                            const Icon = item.icon;
                            const Chevron = isOpen ? ChevronDown : ChevronRight;
                            return (
                                <div key={item.name}>
                                    <button
                                        type="button"
                                        onClick={() => toggle(item.name)}
                                        className={`group flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${groupActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
                                    >
                                        <span className="flex items-center">
                                            <Icon className={`mr-3 h-5 w-5 shrink-0 transition-colors ${groupActive ? "text-emerald-300" : "text-slate-400 group-hover:text-slate-200"}`} aria-hidden="true" />
                                            {item.name}
                                        </span>
                                        <Chevron className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                    </button>
                                    {isOpen && (
                                        <div className="mt-1 space-y-1 pl-4">
                                            {item.children.map(child => {
                                                const childActive = isLeafActive(child.href, pathname);
                                                const ChildIcon = child.icon;
                                                return (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${childActive ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                                                    >
                                                        <ChildIcon className={`mr-3 h-4 w-4 shrink-0 transition-colors ${childActive ? "text-emerald-100" : "text-slate-500 group-hover:text-slate-300"}`} aria-hidden="true" />
                                                        {child.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        const isActive = isLeafActive(item.href, pathname);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
                            >
                                <Icon
                                    className={`mr-3 h-5 w-5 shrink-0 transition-colors ${isActive ? "text-emerald-100" : "text-slate-400 group-hover:text-slate-200"}`}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="border-t border-slate-800 p-4">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                    <LogOut className="mr-3 h-5 w-5 shrink-0 text-slate-400 group-hover:text-slate-200" aria-hidden="true" />
                    Logout
                </button>
            </div>
        </div>
    );
}
