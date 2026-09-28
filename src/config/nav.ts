// src/config/nav.ts
// Sidebar nav items derived from enabled modules.
// Icons map to Lucide icon names — import them in Sidebar.tsx.

import { modules } from './modules'

type NavLeaf = { name: string; href: string; icon: string }
type NavGroup = { name: string; icon: string; children: NavLeaf[] }
export type NavItem = NavLeaf | NavGroup

const mastersChildren: NavLeaf[] = [
  { name: 'Countries',          href: '/admin/countries',                     icon: 'Globe' },
  { name: 'Visa Types',         href: '/admin/masters/visa-types',            icon: 'BadgeCheck' },
  { name: 'Attestation Types',  href: '/admin/masters/attestation-types',     icon: 'Stamp' },
  { name: 'Tour Categories',    href: '/admin/masters/tour-categories',        icon: 'FolderTree' },
  { name: 'Currencies',         href: '/admin/masters/currencies',            icon: 'DollarSign' },
  { name: 'Document Types',     href: '/admin/masters/document-types',        icon: 'FileText' },
  { name: 'Service Types',      href: '/admin/masters/service-types',         icon: 'Wrench' },
]

export const adminNav: NavItem[] = [
  { name: 'Dashboard',    href: '/admin',               icon: 'LayoutDashboard' },
  ...(modules.destinations ? [{ name: 'Destinations', href: '/admin/destinations', icon: 'MapPin' }] : []),
  ...(modules.tours        ? [{ name: 'Tours',         href: '/admin/tours',        icon: 'Map' }] : []),
  ...(modules.visas        ? [{ name: 'Visas',         href: '/admin/visas',        icon: 'PlaneTakeoff' }] : []),
  ...(modules.attestations ? [{ name: 'Attestations',  href: '/admin/attestations', icon: 'Stamp' }] : []),
  ...(modules.blog         ? [{ name: 'Blog',          href: '/admin/blog',         icon: 'Newspaper' }] : []),
  ...(modules.inquiries    ? [{ name: 'Inquiries',     href: '/admin/inquiries',    icon: 'FileText' }] : []),
  ...(modules.masters      ? [{ name: 'Masters', icon: 'Layers', children: mastersChildren } as NavGroup] : []),
  { name: 'Users',    href: '/admin/users',    icon: 'Users' },
  { name: 'Settings', href: '/admin/settings', icon: 'Settings' },
]
