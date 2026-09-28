import nodemailer, { Transporter } from "nodemailer";
import type { InquiryEmailPayload } from "@/core/lib/email-templates";
import { getSiteSettings, invalidateSiteSettings } from "@/core/lib/site-settings";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type MailerConfig = {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
    adminTo: string | null;
};

let cached: { transporter: Transporter; signature: string } | null = null;

function signature(c: MailerConfig): string {
    return [c.host, c.port, c.secure, c.user, c.pass.length, c.from, c.adminTo ?? ""].join("|");
}

async function resolveConfig(): Promise<MailerConfig | null> {
    const env = process.env;
    let host: string | null | undefined = env.SMTP_HOST;
    let port: number | null = env.SMTP_PORT ? Number(env.SMTP_PORT) : null;
    let user: string | null | undefined = env.SMTP_USER;
    let pass: string | null | undefined = env.SMTP_PASS;
    let secure: boolean = env.SMTP_SECURE === "true";
    let from: string | null | undefined = env.INQUIRY_FROM ?? env.SMTP_USER;
    let adminTo: string | null | undefined = env.INQUIRY_TO ?? null;

    try {
        const settings = await getSiteSettings();
        if (settings.smtpHost) host = settings.smtpHost;
        if (settings.smtpPort) port = settings.smtpPort;
        if (settings.smtpUser) user = settings.smtpUser;
        if (settings.smtpPass) pass = settings.smtpPass;
        if (settings.smtpHost) secure = settings.smtpSecure;
        if (settings.inquiryFrom) from = settings.inquiryFrom;
        if (settings.inquiryTo) adminTo = settings.inquiryTo;
        if (!from && settings.smtpUser) from = settings.smtpUser;
    } catch (e) {
        console.error("[mailer] failed to read site settings, falling back to env", e);
    }

    if (!host || !user || !pass || !from) return null;
    return {
        host,
        port: port ?? 587,
        secure,
        user,
        pass,
        from,
        adminTo: adminTo ?? null,
    };
}

export async function getTransporter(): Promise<{ transporter: Transporter; config: MailerConfig } | null> {
    const config = await resolveConfig();
    if (!config) return null;
    const sig = signature(config);
    if (!cached || cached.signature !== sig) {
        cached = {
            signature: sig,
            transporter: nodemailer.createTransport({
                host: config.host,
                port: config.port,
                secure: config.secure,
                auth: { user: config.user, pass: config.pass },
            }),
        };
    }
    return { transporter: cached.transporter, config };
}

export function invalidateMailerCache(): void {
    cached = null;
    invalidateSiteSettings();
}

export async function sendInquiryEmails(payload: InquiryEmailPayload): Promise<void> {
    const resolved = await getTransporter();
    if (!resolved) return;
    const { transporter, config } = resolved;

    const { renderAdminInquiry, renderCustomerAck } = await import("@/core/lib/email-templates");

    const tasks: Promise<unknown>[] = [];
    if (config.adminTo) {
        const admin = renderAdminInquiry(payload);
        tasks.push(
            transporter.sendMail({
                from: config.from,
                to: config.adminTo,
                subject: admin.subject,
                html: admin.html,
                text: admin.text,
                replyTo: payload.email ?? undefined,
            }),
        );
    }
    if (payload.email) {
        const cust = renderCustomerAck(payload);
        tasks.push(
            transporter.sendMail({
                from: config.from,
                to: payload.email,
                subject: cust.subject,
                html: cust.html,
                text: cust.text,
            }),
        );
    }

    const results = await Promise.allSettled(tasks);
    for (const r of results) {
        if (r.status === "rejected") {
            console.error("[mailer] sendInquiryEmails: one recipient failed", r.reason);
        }
    }
}

export async function sendTestEmail(to: string): Promise<{ ok: boolean; error?: string }> {
    if (!EMAIL_RE.test(to)) return { ok: false, error: "Invalid recipient email" };
    const resolved = await getTransporter();
    if (!resolved) return { ok: false, error: "SMTP is not configured" };
    const { transporter, config } = resolved;

    try {
        await transporter.verify();
    } catch (e) {
        return { ok: false, error: `SMTP verify failed: ${(e as Error).message}` };
    }

    try {
        await transporter.sendMail({
            from: config.from,
            to,
            subject: "Origin Tours and Travels — SMTP test",
            text:
                "This is a test message from the Origin admin Settings page.\n\nIf you received it, your SMTP credentials are working.",
            html: `
                <p>This is a test message from the <strong>Origin admin Settings</strong> page.</p>
                <p>If you received it, your SMTP credentials are working.</p>
            `.trim(),
        });
        return { ok: true };
    } catch (e) {
        return { ok: false, error: `Send failed: ${(e as Error).message}` };
    }
}
