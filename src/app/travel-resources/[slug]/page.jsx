import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogPostClient from "./BlogPostClient";
import { blogPostingJsonLd } from "@/lib/blog-jsonld";
import { breadcrumbJsonLd } from "@/lib/service-jsonld";
import { publishedBlogWhere } from "@/lib/blog";

const SITE_URL = "https://origintoursandtravels.com";

// Evaluate the publish gate per-request so a scheduled post 404s until its exact
// publish time, then becomes visible immediately (no ISR cache lag).
export const dynamic = "force-dynamic";

async function loadPost(slug) {
  try {
    return await prisma.blogPost.findFirst({
      // Match by slug but only if active AND publishedAt has already passed.
      where: { slug, ...publishedBlogWhere() },
      include: { author: { select: { name: true } } },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = post.metaTitle || post.title;
  const description =
    post.metaDescription ||
    post.excerpt ||
    `Read "${post.title}" on the Origin Tours and Travels blog.`;
  const canonical = `/travel-resources/${post.slug}`;
  const image = post.featuredImage || "/og-default.jpg";

  return {
    title,
    description: description.slice(0, 160),
    alternates: { canonical },
    openGraph: {
      title,
      description: description.slice(0, 160),
      url: canonical,
      type: "article",
      images: [{ url: image }],
      publishedTime: post.publishedAt ? post.publishedAt.toISOString() : undefined,
      modifiedTime: post.updatedAt ? post.updatedAt.toISOString() : undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description.slice(0, 160),
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) notFound();

  const jsonLd = blogPostingJsonLd({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    publishedAt: post.publishedAt ?? post.createdAt,
    updatedAt: post.updatedAt,
    authorName: post.author?.name,
  });

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbJsonLd([
        { name: "Travel Resources", path: "/travel-resources" },
        { name: post.title, path: `/travel-resources/${post.slug}` },
      ]),
    ],
  };

  const serialisedPost = {
    ...post,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    createdAt: post.createdAt ? post.createdAt.toISOString() : null,
    updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <BlogPostClient post={serialisedPost} canonical={`${SITE_URL}/travel-resources/${post.slug}`} />
    </>
  );
}
