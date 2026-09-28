// src/components/schema/LocalBusinessSchema.tsx
// Place this in your root layout.tsx — applies site-wide

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    "name": "Origin Tours and Travels",
    "url": "https://origintoursandtravels.com",
    "logo": "https://origintoursandtravels.com/_next/static/media/logo.ad35f74e.webp",
    "image": "https://origintoursandtravels.com/og-default.jpg",
    "description": "Hyderabad's trusted travel agency for 10+ years. Book Umrah, Hajj, holiday packages, air tickets, visa & hotel reservations. Serving families, groups & corporate travellers.",
    "telephone": "+91-91777-87635",
    "email": "sales@origingroups.com",
    "foundingDate": "2010",
    "priceRange": "₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, Credit Card, Google Pay, UPI",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Third Floor, Serene Heights, Humayun Nagar Road, Masab Tank",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500028",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 17.4065,
      "longitude": 78.4772
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-91777-87635",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi", "Urdu", "Telugu"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday","Tuesday","Wednesday","Thursday",
          "Friday","Saturday","Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
      ],
      "opens": "09:00",
      "closes": "19:00"
    },
    "sameAs": [
      "https://facebook.com/origintoursandtravels",
      "https://instagram.com/origintoursandtravels",
      "https://twitter.com/origintravels",
      "https://youtube.com/@origintravels"
    ],
    "hasMap": "https://maps.google.com/?q=Serene+Heights+Masab+Tank+Hyderabad",
    "areaServed": ["Hyderabad", "Telangana", "Andhra Pradesh", "India"]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
