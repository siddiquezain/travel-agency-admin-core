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
import { agency } from "../config/agency";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const priestacy = localFont({
  src: "../assets/fonts/Priestacy.otf",
  variable: "--font-priestacy",
  display: "optional",
  weight: "400",
  style: "normal",
  fallback: ["cursive"],
});

const SITE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";
// Server-side read so the Docker build doesn't inline this at build time.
const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY || "";
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION || "";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: agency.name,
    template: `%s | ${agency.name}`,
  },
  description: agency.tagline,
  applicationName: agency.name,
  authors: [{ name: agency.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: agency.name,
    title: agency.name,
    description: agency.tagline,
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: agency.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: agency.name,
    description: agency.tagline,
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
  ...(GSC_VERIFICATION ? { verification: { google: GSC_VERIFICATION } } : {}),
};

// Minimal org schema — fill in with real details for your agency.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: agency.name,
  url: SITE_URL,
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
        {GTM_ID && (
          <>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
          </>
        )}
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
