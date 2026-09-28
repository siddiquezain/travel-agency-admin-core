import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Contact Origin Tours & Travels – Hyderabad Travel Agency",
  },
  description:
    "Get in touch with Origin Tours & Travels in Hyderabad. Call, WhatsApp or visit our office for bookings, packages, visa queries and travel assistance.",
  keywords:
    "contact travel agency Hyderabad, travel agent phone number Hyderabad, travel agent near me Hyderabad, book travel Hyderabad, Origin Tours contact number, Origin Tours Masab Tank Hyderabad",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Origin Tours & Travels – Hyderabad Travel Agency",
    description:
      "Call, WhatsApp or visit our Hyderabad office for bookings, packages, visa queries and travel assistance.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  // NAP/geo/hasMap now live site-wide on the root TravelAgency node (#travelagency)
  // in app/layout.tsx — no separate /contact node needed (avoids duplicate @id).
  return children;
}
