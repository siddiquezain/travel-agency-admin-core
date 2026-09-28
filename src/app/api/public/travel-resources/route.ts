import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publishedBlogWhere } from "@/lib/blog";

// Evaluate the publish gate on every request rather than serving a cached list,
// so scheduled posts appear as soon as their publish time passes.
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const posts = await prisma.blogPost.findMany({
            // Only posts that are active AND whose publishedAt has arrived.
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
        return NextResponse.json(posts);
    } catch {
        return NextResponse.json([]);
    }
}
