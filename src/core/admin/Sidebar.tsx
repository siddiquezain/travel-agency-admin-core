'use client'

// src/core/admin/Sidebar.tsx
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
    LayoutDashboard, Users, Map, FileText, Settings, LogOut,
    PlaneTakeoff, Stamp, Globe, Layers, ChevronDown, ChevronRight,
    MapPin, BadgeCheck, FolderTree, DollarSign, Wrench, Newspaper,
} from 'lucide-react'
import { adminNav, type NavItem } from '@/config/nav'
import { agency } from '@/config/agency'

// Map icon name strings (from config/nav.ts) to Lucide components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard, Users, Map, FileText, Settings,
    PlaneTakeoff, Stamp, Globe, Layers, MapPin,
    BadgeCheck, FolderTree, DollarSign, Wrench, Newspaper,
}

type LeafItem  = { name: string; href: string; icon: string }
type GroupItem = { name: string; icon: string; children: LeafItem[] }

function isGroup(item: NavItem): item is GroupItem {
    return (item as GroupItem).children !== undefined
}

function isLeafActive(href: string, pathname: string): boolean {
    if (href === '/admin') return pathname === '/admin'
    return pathname === href || pathname.startsWith(`${href}/`)
}

function isGroupActive(group: GroupItem, pathname: string): boolean {
    return group.children.some(c => isLeafActive(c.href, pathname))
}

export default function Sidebar() {
    const pathname = usePathname()

    const initialOpen: Record<string, boolean> = {}
    for (const item of adminNav) {
        if (isGroup(item)) initialOpen[item.name] = isGroupActive(item as GroupItem, pathname)
    }
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialOpen)

    function toggle(name: string) {
        setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }))
    }

    return (
        <div className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800 text-white shadow-xl">
            <div className="flex h-16 shrink-0 items-center justify-center border-b border-slate-800 px-6">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    {agency.name}
                </span>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
                <nav className="flex-1 space-y-1 px-4">
                    {adminNav.map((item) => {
                        if (isGroup(item)) {
                            const group       = item as GroupItem
                            const groupActive = isGroupActive(group, pathname)
                            const isOpen      = openGroups[group.name] ?? groupActive
                            const Icon        = ICON_MAP[group.icon] ?? LayoutDashboard
                            const Chevron     = isOpen ? ChevronDown : ChevronRight
                            return (
                                <div key={group.name}>
                                    <button
                                        type="button"
                                        onClick={() => toggle(group.name)}
                                        className={`group flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${groupActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                                    >
                                        <span className="flex items-center">
                                            <Icon className={`mr-3 h-5 w-5 shrink-0 transition-colors ${groupActive ? 'text-emerald-300' : 'text-slate-400 group-hover:text-slate-200'}`} aria-hidden="true" />
                                            {group.name}
                                        </span>
                                        <Chevron className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                    </button>
                                    {isOpen && (
                                        <div className="mt-1 space-y-1 pl-4">
                                            {group.children.map(child => {
                                                const childActive = isLeafActive(child.href, pathname)
                                                const ChildIcon   = ICON_MAP[child.icon] ?? FileText
                                                return (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${childActive ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                                                    >
                                                        <ChildIcon className={`mr-3 h-4 w-4 shrink-0 transition-colors ${childActive ? 'text-emerald-100' : 'text-slate-500 group-hover:text-slate-300'}`} aria-hidden="true" />
                                                        {child.name}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        const leaf     = item as LeafItem
                        const isActive = isLeafActive(leaf.href, pathname)
                        const Icon     = ICON_MAP[leaf.icon] ?? LayoutDashboard
                        return (
                            <Link
                                key={leaf.name}
                                href={leaf.href}
                                className={`group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <Icon className={`mr-3 h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-emerald-100' : 'text-slate-400 group-hover:text-slate-200'}`} aria-hidden="true" />
                                {leaf.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="border-t border-slate-800 p-4">
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                    <LogOut className="mr-3 h-5 w-5 shrink-0 text-slate-400 group-hover:text-slate-200" aria-hidden="true" />
                    Logout
                </button>
            </div>
        </div>
    )
}
