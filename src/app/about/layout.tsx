import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "About Origin Tours & Travels – 10+ Years Serving Hyderabad",
  },
  description:
    "Learn about Origin Tours & Travels, Hyderabad's trusted travel agency since 2010. Experts in Umrah, Hajj, holiday packages, air ticketing & personalised travel services.",
  keywords:
    "best travel agency Hyderabad, trusted travel agency India, experienced travel consultants Hyderabad, travel agency since 2010, Origin Tours Hyderabad, travel agency Humayun Nagar",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Origin Tours & Travels – 10+ Years Serving Hyderabad",
    description:
      "Hyderabad's trusted travel agency since 2010 — Umrah, Hajj, holiday packages, air ticketing and personalised travel services.",
    url: "/about",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
