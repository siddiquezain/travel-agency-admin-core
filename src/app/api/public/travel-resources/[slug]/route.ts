import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";
import { publishedBlogWhere } from "@/modules/blog/blog";

// Publish gate must run per-request; a future-dated post must 404 until its time.
export const dynamic = "force-dynamic";

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params;
    const post = await prisma.blogPost.findFirst({
        // Match by slug but only if the post is active AND already published.
        where: { slug, ...publishedBlogWhere() },
        include: { author: { select: { name: true } } },
    });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
}
