import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, resolveSlug, prismaErrorResponse } from "@/lib/auth";

export async function GET() {
    const { error } = await requireSession();
    if (error) return error;

    const posts = await prisma.blogPost.findMany({
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        include: {
            author: { select: { id: true, name: true, email: true } },
            destinations: { select: { id: true, name: true } },
        },
    });
    return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
    const { session, error } = await requireSession();
    if (error) return error;

    const body = await request.json();
    const {
        title,
        slug,
        excerpt,
        content,
        faqs,
        featuredImage,
        category,
        metaTitle,
        metaDescription,
        isActive,
        featured,
        publishedAt,
        destinationIds,
    } = body;

    if (!title) {
        return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    if (!content) {
        return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    const authorIdRaw = (session?.user as { id?: string } | undefined)?.id;
    const authorId = authorIdRaw ? Number(authorIdRaw) : null;

    try {
        const post = await prisma.blogPost.create({
            data: {
                slug: resolveSlug(slug, title),
                title,
                excerpt: excerpt ?? null,
                content,
                faqs: Array.isArray(faqs) && faqs.length ? faqs : null,
                featuredImage: featuredImage ?? null,
                category: category ?? null,
                metaTitle: metaTitle ?? null,
                metaDescription: metaDescription ?? null,
                authorId: authorId && Number.isFinite(authorId) ? authorId : null,
                isActive: isActive ?? true,
                featured: featured ?? false,
                publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
                destinations: Array.isArray(destinationIds) && destinationIds.length
                    ? { connect: destinationIds.map((id: number) => ({ id })) }
                    : undefined,
            },
        });
        return NextResponse.json(post, { status: 201 });
    } catch (e: unknown) {
        const mapped = prismaErrorResponse(e);
        if (mapped) return mapped;
        throw e;
    }
}
