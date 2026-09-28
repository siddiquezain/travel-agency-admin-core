import React from "react";
import { prisma } from "@/lib/prisma";
import { BlogPostsTable } from "@/components/admin/BlogPostsTable";

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
