// src/components/schema/FAQSchema.tsx
// Add to your homepage (src/app/page.tsx) — enables FAQ rich results in Google

export default function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Which services does Origin Tours & Travels offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer air ticketing, Umrah & Hajj packages, domestic & international holiday packages, visa stamping, hotel reservations, transport bookings and certificate attestation services across 50+ countries."
        }
      },
      {
        "@type": "Question",
        "name": "Is Origin Tours & Travels based in Hyderabad?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our office is located at Third Floor, Serene Heights, Humayun Nagar Road, Masab Tank, Hyderabad-500028, Telangana. We serve clients across Hyderabad, Telangana, and all major Indian cities."
        }
      },
      {
        "@type": "Question",
        "name": "How many years of experience does Origin Tours & Travels have?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Over 10 years. We have been arranging travel for individuals, families and groups since 2010, serving 10,000+ happy travellers across 50+ countries."
        }
      },
      {
        "@type": "Question",
        "name": "Can I book via WhatsApp?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, WhatsApp us on +91 91777 87635. Our multilingual team is available 24/7 to assist with queries and bookings in English, Hindi, Urdu and Telugu."
        }
      },
      {
        "@type": "Question",
        "name": "Does Origin Tours offer Umrah visa assistance from Hyderabad?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer complete Umrah packages from Hyderabad including visa processing, premium accommodation near Haram in Makkah and Madinah, Ziyarat tours, and guided support throughout your spiritual journey."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide certificate attestation services in Hyderabad?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we handle MEA, HRD, embassy apostille and document attestation for UAE, Saudi Arabia, Qatar, Kuwait and 50+ countries. Most attestations including birth certificate, marriage certificate and degree apostille are completed in 2–5 working days."
        }
      },
      {
        "@type": "Question",
        "name": "Is Origin Tours & Travels IATA certified?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Origin Tours and Travels is IATA accredited, Ministry of Hajj certified, VFS Global partner, and authorised by Dubai Tourism and multiple embassies, ensuring you get authentic and reliable travel services."
        }
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
