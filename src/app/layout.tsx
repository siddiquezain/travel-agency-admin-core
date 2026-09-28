import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Playfair_Display, Lora } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import Providers from "../components/Providers";
import RecaptchaProvider from "../components/RecaptchaProvider";
import LayoutShell from "../components/LayoutShell";
import { getPopularFooterLinks } from "../lib/footer-links";
import { getNavMenuData } from "../lib/nav-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Classic display serif used for headings on the Umrah pages.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

// Companion serif for body copy on the Umrah pages (pairs with Playfair).
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

// Decorative hero brand font. next/font/local auto-preloads it and builds a
// metric-matched fallback; display:"optional" means it never swaps mid-paint,
// eliminating the brief flash of the fallback font on the hero heading.
const priestacy = localFont({
  src: "../assets/fonts/Priestacy.otf",
  variable: "--font-priestacy",
  display: "optional",
  weight: "400",
  style: "normal",
  fallback: ["cursive"],
});

const SITE_URL = "https://origintoursandtravels.com";
const SITE_NAME = "Origin Tours and Travels";
// Public, non-secret IDs — env vars override these built-in production defaults.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-Q5DEX68WV6";
// Public site key, injected at runtime (read server-side, passed to the client
// provider) — not NEXT_PUBLIC_ because the Docker build doesn't inline those.
const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY || "";
const GSC_VERIFICATION =
  process.env.NEXT_PUBLIC_GSC_VERIFICATION || "y7klA6FaWRKCbW2gQngFTNVmJSuw6GH4BWvgXJ_pGpQ";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Hyderabad's premier travel agency`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Origin Tours and Travels is a Hyderabad-based travel agency offering air ticketing, holiday packages, Hajj & Umrah, visa services, and certificate attestation across 50+ countries.",
  keywords: [
    "Origin Tours Hyderabad",
    "travel agency Hyderabad",
    "Umrah packages Hyderabad",
    "visa services India",
    "certificate attestation",
    "holiday packages India",
    "air ticketing Hyderabad",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Hyderabad's premier travel agency`,
    description:
      "Air ticketing, holiday packages, Hajj & Umrah, visa services, and certificate attestation from Hyderabad.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Hyderabad's premier travel agency`,
    description:
      "Air ticketing, holiday packages, Umrah, visas, and attestation services.",
    images: ["/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: { google: GSC_VERIFICATION },
  // Icons are provided by the App Router file convention:
  // src/app/favicon.ico, src/app/icon.png, src/app/apple-icon.png
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/og-default.jpg`,
      sameAs: [
        "https://facebook.com/origintoursandtravels",
        "https://twitter.com/origintravels",
        "https://www.youtube.com/@origintoursandtravels",
        "https://instagram.com/origintoursandtravels",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-91777-87635",
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["en", "hi", "ur"],
        },
      ],
    },
    {
      "@type": "TravelAgency",
      "@id": `${SITE_URL}#travelagency`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/og-default.jpg`,
      image: `${SITE_URL}/og-default.jpg`,
      // Real, verifiable rating — Justdial profile, 428 reviews (verified 2026-06-01):
      // justdial.com/Hyderabad/Origin-Tours-and-Travels-Above-Ratnadeep-Masab-Tank
      // ⚠️ Replace with your LIVE Google Business Profile ratingValue/reviewCount when
      // available — that is the authoritative source Google prefers. Do NOT use the
      // "10K+ clients" marketing figure as a review count (it is not a rating count).
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.7",
        reviewCount: "428",
        bestRating: "5",
        worstRating: "1",
      },
      description:
        "Hyderabad's trusted travel agency for 10+ years. Book Umrah, Hajj, holiday packages, air tickets, visa and hotel reservations.",
      foundingDate: "2014",
      award: "Global Tourism Awards 2024 - Best Travel Agency of the Year",
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          name: "IATA Accreditation",
          credentialCategory: "Travel Agency Certification",
        },
        {
          "@type": "EducationalOccupationalCredential",
          name: "Ministry of Hajj and Umrah Authorised Agent (KSA)",
          credentialCategory: "Government Authorization",
        },
        {
          "@type": "EducationalOccupationalCredential",
          name: "VFS Global Partner",
          credentialCategory: "Visa Processing Authorization",
        },
      ],
      telephone: "+91-91777-87635",
      email: "sales@origingroups.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Third Floor, Serene Heights, Humayun Nagar Rd, Masab Tank",
        addressLocality: "Hyderabad",
        postalCode: "500028",
        addressRegion: "Telangana",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 17.39489,
        longitude: 78.45882,
      },
      hasMap: "https://www.google.com/maps?cid=10717014015615172025",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "19:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "09:00",
          closes: "17:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: "00:00",
          closes: "00:00",
        },
      ],
      sameAs: [
        "https://facebook.com/origintoursandtravels",
        "https://twitter.com/origintravels",
        "https://www.youtube.com/@origintoursandtravels",
        "https://instagram.com/origintoursandtravels",
        "https://www.google.com/maps?cid=10717014015615172025",
      ],
      areaServed: [
        { "@type": "City", name: "Hyderabad" },
        { "@type": "City", name: "Secunderabad" },
      ],
      priceRange: "₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, Credit Card, Google Pay, UPI",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Travel Services",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Umrah Packages from Hyderabad", url: `${SITE_URL}/umrah` } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hajj Packages", url: `${SITE_URL}/hajj` } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "International Holiday Packages", url: `${SITE_URL}/tours` } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Visa Services", url: `${SITE_URL}/visas` } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Air Ticketing", url: `${SITE_URL}/flights` } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Certificate Attestation", url: `${SITE_URL}/attestations` } },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_NAME,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/tours?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { popularTours, popularVisas } = await getPopularFooterLinks();
  const menuData = await getNavMenuData();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${priestacy.variable} ${playfair.variable} ${lora.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WXCSQM"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WXCSQM');`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <AppRouterCacheProvider>
          <Providers>
            <RecaptchaProvider siteKey={RECAPTCHA_SITE_KEY}>
              <LayoutShell popularTours={popularTours} popularVisas={popularVisas} menuData={menuData}>
                {children}
              </LayoutShell>
            </RecaptchaProvider>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
