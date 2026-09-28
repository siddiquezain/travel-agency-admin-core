import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
    requireSession,
    toSlug,
    parseId,
    invalidIdResponse,
    prismaErrorResponse,
    pick,
} from "@/lib/auth";

const BLOG_ALLOWED_FIELDS = [
    "title",
    "slug",
    "excerpt",
    "content",
    "faqs",
    "featuredImage",
    "category",
    "metaTitle",
    "metaDescription",
    "isActive",
    "featured",
    "publishedAt",
] as const;

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (id === null) return invalidIdResponse();

    const post = await prisma.blogPost.findUnique({
        where: { id },
        include: {
            author: { select: { id: true, name: true, email: true } },
            destinations: { select: { id: true, name: true } },
        },
    });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (id === null) return invalidIdResponse();

    const body = await request.json();
    const destinationIds: number[] | undefined = Array.isArray(body.destinationIds)
        ? (body.destinationIds as unknown[]).map(Number).filter(n => Number.isFinite(n))
        : undefined;
    const data: Record<string, unknown> = pick(body, BLOG_ALLOWED_FIELDS);

    if (typeof data.slug === "string") {
        const cleaned = data.slug.trim();
        if (!cleaned) {
            delete data.slug;
        } else {
            data.slug = toSlug(cleaned);
        }
    }
    if ("publishedAt" in data) {
        data.publishedAt = data.publishedAt ? new Date(data.publishedAt as string) : null;
    }
    if ("faqs" in data) {
        data.faqs = Array.isArray(data.faqs) && data.faqs.length ? data.faqs : null;
    }

    if (destinationIds !== undefined) {
        data.destinations = { set: destinationIds.map(id => ({ id })) };
    }

    try {
        const post = await prisma.blogPost.update({ where: { id }, data });
        return NextResponse.json(post);
    } catch (e: unknown) {
        const mapped = prismaErrorResponse(e);
        if (mapped) return mapped;
        throw e;
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (id === null) return invalidIdResponse();

    try {
        await prisma.blogPost.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (e: unknown) {
        const mapped = prismaErrorResponse(e);
        if (mapped) return mapped;
        throw e;
    }
}
