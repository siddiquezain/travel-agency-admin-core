// src/components/schema/BreadcrumbSchema.tsx
// Usage: Add to any inner page with appropriate breadcrumb items
//
// Examples:
//   <BreadcrumbSchema items={[{ name: "Home", url: "/" }]} />
//   <BreadcrumbSchema items={[
//     { name: "Home", url: "/" },
//     { name: "Umrah Packages", url: "/umrah" },
//   ]} />
//   <BreadcrumbSchema items={[
//     { name: "Home", url: "/" },
//     { name: "Tours", url: "/tours" },
//     { name: "Umrah Economy Package", url: "/tours/umrah-package-economy" },
//   ]} />

const BASE_URL = "https://origintoursandtravels.com";

interface BreadcrumbItem {
  name: string;
  url: string; // relative path, e.g. "/umrah" or full URL
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http")
        ? item.url
        : `${BASE_URL}${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Pre-built breadcrumbs for common pages ───────────────────────────────────

export const breadcrumbs = {
  home: [
    { name: "Home", url: "/" }
  ],
  tours: [
    { name: "Home", url: "/" },
    { name: "Holiday Packages", url: "/tours" }
  ],
  umrah: [
    { name: "Home", url: "/" },
    { name: "Umrah Packages", url: "/umrah" }
  ],
  hajj: [
    { name: "Home", url: "/" },
    { name: "Hajj Packages", url: "/hajj" }
  ],
  visas: [
    { name: "Home", url: "/" },
    { name: "Visa Services", url: "/visas" }
  ],
  airTicketing: [
    { name: "Home", url: "/" },
    { name: "Air Ticketing", url: "/air-ticketing" }
  ],
  hotelBooking: [
    { name: "Home", url: "/" },
    { name: "Hotel Booking", url: "/hotel-booking" }
  ],
  attestations: [
    { name: "Home", url: "/" },
    { name: "Certificate Attestation", url: "/attestations" }
  ],
  transport: [
    { name: "Home", url: "/" },
    { name: "Transport Booking", url: "/transport" }
  ],
  contact: [
    { name: "Home", url: "/" },
    { name: "Contact Us", url: "/contact" }
  ],
  about: [
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" }
  ],
  blog: [
    { name: "Home", url: "/" },
    { name: "Travel Blog", url: "/blog" }
  ],
};
