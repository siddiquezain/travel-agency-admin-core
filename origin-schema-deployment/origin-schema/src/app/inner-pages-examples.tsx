// ─────────────────────────────────────────────────────────────────────────────
// INNER PAGE EXAMPLES — Breadcrumb schema usage
// Copy the relevant snippet into each of your route page.tsx files
// ─────────────────────────────────────────────────────────────────────────────

// ── /umrah/page.tsx ──────────────────────────────────────────────────────────
import { BreadcrumbSchema, breadcrumbs } from "@/components/schema";

export default function UmrahPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs.umrah} />
      {/* ... rest of Umrah page JSX ... */}
    </>
  );
}

// ── /hajj/page.tsx ───────────────────────────────────────────────────────────
export default function HajjPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs.hajj} />
      {/* ... rest of Hajj page JSX ... */}
    </>
  );
}

// ── /visas/page.tsx ──────────────────────────────────────────────────────────
export default function VisasPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs.visas} />
      {/* ... rest of Visas page JSX ... */}
    </>
  );
}

// ── /attestations/page.tsx ───────────────────────────────────────────────────
export default function AttestationsPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs.attestations} />
      {/* ... rest of Attestations page JSX ... */}
    </>
  );
}

// ── /tours/[slug]/page.tsx — dynamic tour detail page ────────────────────────
interface TourPageProps {
  params: { slug: string };
}

export default function TourDetailPage({ params }: TourPageProps) {
  // Fetch your tour data here...
  const tourName = "Umrah Economy Package"; // replace with actual tour name from DB/CMS

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tours", url: "/tours" },
          { name: tourName, url: `/tours/${params.slug}` },
        ]}
      />
      {/* ... rest of tour detail page JSX ... */}
    </>
  );
}

// ── /visas/[slug]/page.tsx — dynamic visa detail page ────────────────────────
export default function VisaDetailPage({ params }: { params: { slug: string } }) {
  const visaName = "Dubai Tourist Visa 30 Days"; // replace with actual visa name

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Visa Services", url: "/visas" },
          { name: visaName, url: `/visas/${params.slug}` },
        ]}
      />
      {/* ... rest of visa detail page JSX ... */}
    </>
  );
}

// ── /attestations/[slug]/page.tsx — dynamic attestation detail page ──────────
export default function AttestationDetailPage({ params }: { params: { slug: string } }) {
  const attestationName = "Birth Certificate Attestation – UAE"; // replace with actual name

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Certificate Attestation", url: "/attestations" },
          { name: attestationName, url: `/attestations/${params.slug}` },
        ]}
      />
      {/* ... rest of attestation detail page JSX ... */}
    </>
  );
}

// ── /blog/[slug]/page.tsx — dynamic blog post page ───────────────────────────
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const postTitle = "Umrah Visa Requirements for Indians 2026"; // replace with actual post title

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Travel Blog", url: "/blog" },
          { name: postTitle, url: `/blog/${params.slug}` },
        ]}
      />
      {/* ... rest of blog post JSX ... */}
    </>
  );
}
