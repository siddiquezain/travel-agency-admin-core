import { prisma } from "@/core/lib/prisma";
import BlogClient from "./BlogClient";
import { breadcrumbJsonLd } from "@/lib/service-jsonld";
import { publishedBlogWhere } from "@/modules/blog/blog";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    breadcrumbJsonLd([{ name: "Travel Resources", path: "/travel-resources" }]),
  ],
};

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    absolute:
      "Travel Resources – Guides, Tips & Destinations | Origin Tours and Travels",
  },
  description:
    "Travel guides, visa tips and destination features from Hyderabad's trusted travel agency. Plan smarter trips with expert advice on Umrah, Hajj, India and international holidays.",
  alternates: { canonical: "/travel-resources" },
  openGraph: {
    title: "Travel Resources | Origin Tours and Travels",
    description:
      "Travel guides, visa tips and destination features from Hyderabad's trusted travel agency.",
    url: "/travel-resources",
    type: "website",
  },
};

async function loadPosts() {
  try {
    const rows = await prisma.blogPost.findMany({
      // Only active posts whose scheduled publishedAt has arrived (UTC-safe).
      where: publishedBlogWhere(),
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        featuredImage: true,
        category: true,
        publishedAt: true,
        createdAt: true,
        featured: true,
        author: { select: { name: true } },
      },
    });
    return rows.map((p) => ({
      ...p,
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
      createdAt: p.createdAt ? p.createdAt.toISOString() : null,
    }));
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await loadPosts();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogClient initialPosts={posts} />
    </>
  );
}
