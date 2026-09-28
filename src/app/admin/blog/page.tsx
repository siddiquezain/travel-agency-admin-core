import React from "react";
import { prisma } from "@/core/lib/prisma";
import { BlogPostsTable } from "@/modules/blog/BlogPostsTable";

export default async function AdminBlogPage() {
    const posts = await prisma.blogPost.findMany({
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        include: {
            author: { select: { id: true, name: true, email: true } },
            destinations: { select: { id: true, name: true } },
        },
    });
    return <BlogPostsTable initialPosts={posts} />;
}
