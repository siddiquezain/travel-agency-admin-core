"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import FooterImport from "./Footer";

// Footer is a .jsx file so TS treats props as IntrinsicAttributes only.
// Cast to a typed component so we can pass popularTours / popularVisas.
const Footer = FooterImport as React.ComponentType<{
    popularTours?: { name: string; to: string }[];
    popularVisas?: { name: string; to: string }[];
}>;
import ScrollToTop from "./ScrollToTop";
import WhatsAppButton from "./WhatsAppButton";
import type { NavMenuData } from "../lib/nav-data";

// Header is a .jsx file; cast so we can pass the typed menuData prop.
const TypedHeader = Header as React.ComponentType<{ menuData?: NavMenuData }>;

type FooterLink = { name: string; to: string };

type Props = {
    children: React.ReactNode;
    popularTours?: FooterLink[];
    popularVisas?: FooterLink[];
    menuData?: NavMenuData;
};

export default function LayoutShell({ children, popularTours, popularVisas, menuData }: Props) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/login");

    if (isAdmin) return <>{children}</>;

    return (
        <>
            <TypedHeader menuData={menuData} />
            {children}
            <Footer popularTours={popularTours} popularVisas={popularVisas} />
            <ScrollToTop />
            <WhatsAppButton />
        </>
    );
}
