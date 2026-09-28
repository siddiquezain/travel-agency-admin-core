// src/components/schema/WebSiteSchema.tsx
// Place this in your root layout.tsx — applies site-wide

export default function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Origin Tours and Travels",
    "url": "https://origintoursandtravels.com",
    "description": "Hyderabad's trusted travel agency for Umrah, Hajj, holiday packages, air tickets, visa & hotel reservations.",
    "inLanguage": "en-IN",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://origintoursandtravels.com/tours?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Origin Tours and Travels",
      "logo": {
        "@type": "ImageObject",
        "url": "https://origintoursandtravels.com/_next/static/media/logo.ad35f74e.webp",
        "width": 200,
        "height": 60
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
