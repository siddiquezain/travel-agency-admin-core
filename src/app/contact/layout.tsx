import type { Metadata } from "next";
import { agency } from "@/config/agency";

export const metadata: Metadata = {
  title: {
    absolute: `Contact ${agency.name} – Travel Agency`,
  },
  description:
    `Get in touch with ${agency.name}. Call, WhatsApp or visit our office for bookings, packages, visa queries and travel assistance.`,
  keywords:
    "contact travel agency, travel agent phone number, book travel",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact ${agency.name} – Travel Agency`,
    description:
      `Call, WhatsApp or visit our office for bookings, packages, visa queries and travel assistance.`,
    url: "/contact",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  // NAP/geo/hasMap now live site-wide on the root TravelAgency node (#travelagency)
  // in app/layout.tsx — no separate /contact node needed (avoids duplicate @id).
  return children;
}
