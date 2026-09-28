import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, parseId, invalidIdResponse, prismaErrorResponse, pick } from "@/lib/auth";

const INQUIRY_ALLOWED_FIELDS = ["status", "notes", "assignedTo"] as const;

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (id === null) return invalidIdResponse();

    const inquiry = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(inquiry);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession();
    if (error) return error;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (id === null) return invalidIdResponse();

    const body = await request.json();
    const data = pick(body, INQUIRY_ALLOWED_FIELDS);

    try {
        const inquiry = await prisma.inquiry.update({ where: { id }, data });
        return NextResponse.json(inquiry);
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
        await prisma.inquiry.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (e: unknown) {
        const mapped = prismaErrorResponse(e);
        if (mapped) return mapped;
        throw e;
    }
}
