// src/components/schema/ReviewSchema.tsx
// Add to homepage — enables star ratings in Google search results
//
// ⚠️  UPDATE BEFORE DEPLOYING:
//   - ratingCount  → your actual number of ratings (Google, Justdial, etc.)
//   - reviewCount  → your actual number of written reviews
//   - reviews[]    → use real reviews with real dates from your customers

export default function ReviewSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Origin Tours and Travels",
    "url": "https://origintoursandtravels.com",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",        // ← Update with your actual average rating
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "10000",      // ← Update with actual count
      "reviewCount": "500"         // ← Update with actual written reviews count
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Ahmed K." },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Excellent service for Umrah visa. The team guided me at every step and I received the visa in just 2 days. Highly recommend Origin Tours for all pilgrimage needs.",
        "datePublished": "2025-11-10"
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Sara M." },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Booked a Dubai tour with Origin. The itinerary was perfect, hotels were premium, and the on-ground support was amazing. Will definitely book again.",
        "datePublished": "2025-12-03"
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Rahul S." },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Got my degree attested for UAE employment. Very professional and transparent tracking system. Highly recommended for attestation services in Hyderabad.",
        "datePublished": "2026-01-18"
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Fatima N." },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Our family Umrah trip was seamless. From visa to hotels near Haram, everything was perfectly arranged. JazakAllah to the entire Origin team!",
        "datePublished": "2026-02-07"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
