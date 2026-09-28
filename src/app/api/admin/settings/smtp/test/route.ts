import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { sendTestEmail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
    const { error } = await requireSession();
    if (error) return error;

    const body = await request.json().catch(() => null);
    const to = body && typeof body === "object" ? (body as { to?: unknown }).to : undefined;

    if (typeof to !== "string" || !EMAIL_RE.test(to)) {
        return NextResponse.json({ ok: false, error: "Valid recipient email is required." }, { status: 400 });
    }

    const result = await sendTestEmail(to);
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
