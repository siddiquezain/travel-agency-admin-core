import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";
import { requireSession, parseId, invalidIdResponse, prismaErrorResponse, pick } from "@/core/auth/helpers";
import { sendInquiryEmails } from "@/core/lib/mailer";
import { verifyRecaptcha } from "@/lib/recaptcha";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s\-()]{6,}$/;

const LIMITS = {
    name: 120,
    email: 200,
    phone: 40,
    message: 4000,
    serviceType: 80,
} as const;

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const ipHits = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
    const xff = req.headers.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim();
    const real = req.headers.get("x-real-ip");
    if (real) return real.trim();
    return "unknown";
}

function tooManyRequests(ip: string): boolean {
    const now = Date.now();
    const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
    if (hits.length >= RATE_MAX) {
        ipHits.set(ip, hits);
        return true;
    }
    hits.push(now);
    ipHits.set(ip, hits);
    // Cheap GC: every 200 entries, prune empties
    if (ipHits.size > 200) {
        for (const [k, v] of ipHits) {
            if (v.length === 0 || now - v[v.length - 1] > RATE_WINDOW_MS) {
                ipHits.delete(k);
            }
        }
    }
    return false;
}

// ── Collection ────────────────────────────────────────────────────────────────

// GET is protected — only admins can list all inquiries
export async function GET() {
    const { error } = await requireSession();
    if (error) return error;

    const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(inquiries);
}

// POST is public — submitted from the contact form on the public site
export async function POST(request: NextRequest) {
    const ip = clientIp(request);
    if (tooManyRequests(ip)) {
        return NextResponse.json(
            { error: "Too many requests. Please try again in a minute." },
            { status: 429 },
        );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
        return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }
    const { name, email, phone, message, serviceType, recaptchaToken } =
        body as Record<string, unknown>;

    const captcha = await verifyRecaptcha(recaptchaToken, { ip, action: "inquiry" });
    if (!captcha.ok) {
        return NextResponse.json({ error: "recaptcha failed" }, { status: 400 });
    }

    if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (name.length > LIMITS.name) {
        return NextResponse.json({ error: "name too long" }, { status: 400 });
    }
    if (email !== undefined && email !== null) {
        if (typeof email !== "string" || !EMAIL_RE.test(email) || email.length > LIMITS.email) {
            return NextResponse.json({ error: "invalid email" }, { status: 400 });
        }
    }
    if (phone !== undefined && phone !== null) {
        if (typeof phone !== "string" || !PHONE_RE.test(phone) || phone.length > LIMITS.phone) {
            return NextResponse.json({ error: "invalid phone" }, { status: 400 });
        }
    }
    if (message !== undefined && message !== null) {
        if (typeof message !== "string" || message.length > LIMITS.message) {
            return NextResponse.json({ error: "message too long" }, { status: 400 });
        }
    }
    if (serviceType !== undefined && serviceType !== null) {
        if (typeof serviceType !== "string" || serviceType.length > LIMITS.serviceType) {
            return NextResponse.json({ error: "invalid serviceType" }, { status: 400 });
        }
    }

    const inquiry = await prisma.inquiry.create({
        data: {
            name: name.trim(),
            email: typeof email === "string" ? email : null,
            phone: typeof phone === "string" ? phone : null,
            message: typeof message === "string" ? message : null,
            serviceType: typeof serviceType === "string" ? serviceType : null,
        },
    });

    try {
        await sendInquiryEmails({
            id: inquiry.id,
            name: inquiry.name,
            email: inquiry.email,
            phone: inquiry.phone,
            message: inquiry.message,
            serviceType: inquiry.serviceType,
            createdAt: inquiry.createdAt,
        });
    } catch (e) {
        console.error("[inquiries] email send failed", e);
    }

    return NextResponse.json(inquiry, { status: 201 });
}

// ── Single resource ───────────────────────────────────────────────────────────

const INQUIRY_ALLOWED_FIELDS = ["status", "notes", "assignedTo"] as const;

export async function GET_BY_ID(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
