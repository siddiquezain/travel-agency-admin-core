export type InquiryEmailPayload = {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    message?: string | null;
    serviceType?: string | null;
    createdAt: Date;
};

export type RenderedEmail = { subject: string; html: string; text: string };

function escapeHtml(input: string): string {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function fmtDate(d: Date): string {
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
    }).format(d);
}

const BRAND_NAVY = "#0F1B3C";
const BRAND_GOLD = "#D4AF37";
const TEXT_DARK = "#1f2937";
const TEXT_MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG_SOFT = "#f9fafb";

function emailShell(title: string, bodyHtml: string): string {
    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${BG_SOFT};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${TEXT_DARK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG_SOFT};padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${BORDER};border-radius:12px;overflow:hidden;">
        <tr><td style="background:${BRAND_NAVY};padding:24px 28px;">
          <div style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.2px;">Origin Tours &amp; Travels</div>
          <div style="color:${BRAND_GOLD};font-size:12px;font-weight:600;letter-spacing:1.5px;margin-top:4px;text-transform:uppercase;">${escapeHtml(title)}</div>
        </td></tr>
        ${bodyHtml}
        <tr><td style="padding:18px 28px;background:${BG_SOFT};border-top:1px solid ${BORDER};font-size:12px;color:${TEXT_MUTED};">
          Origin Tours &amp; Travels &middot; Hyderabad, India &middot; <a href="https://wa.me/919177787635" style="color:${BRAND_NAVY};text-decoration:none;">WhatsApp +91 91777 87635</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function renderAdminInquiry(p: InquiryEmailPayload): RenderedEmail {
    const subject = `New enquiry from ${p.name} [#${p.id}]`;

    const rows: { label: string; value: string }[] = [];
    if (p.serviceType) rows.push({ label: "Service / Package", value: p.serviceType });
    rows.push({ label: "Name", value: p.name });
    if (p.phone) rows.push({ label: "Phone", value: p.phone });
    if (p.email) rows.push({ label: "Email", value: p.email });
    if (p.message) rows.push({ label: "Message", value: p.message });
    rows.push({ label: "Submitted at", value: fmtDate(p.createdAt) });
    rows.push({ label: "Inquiry ID", value: `#${p.id}` });

    const rowsHtml = rows
        .map(
            (r) => `<tr>
        <td style="padding:10px 14px;background:${BG_SOFT};border-bottom:1px solid ${BORDER};font-size:12px;font-weight:600;color:${TEXT_MUTED};text-transform:uppercase;letter-spacing:0.5px;width:140px;vertical-align:top;">${escapeHtml(r.label)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid ${BORDER};font-size:14px;color:${TEXT_DARK};white-space:pre-wrap;">${escapeHtml(r.value)}</td>
      </tr>`,
        )
        .join("");

    const body = `
        <tr><td style="padding:24px 28px 8px 28px;">
          <div style="font-size:16px;color:${TEXT_DARK};">A new enquiry has just come in. Details below — reply directly to this email to reach <strong>${escapeHtml(p.name)}</strong>.</div>
        </td></tr>
        <tr><td style="padding:8px 28px 24px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:8px;overflow:hidden;">${rowsHtml}</table>
        </td></tr>
        <tr><td style="padding:0 28px 24px 28px;">
          <a href="/admin/inquiries" style="display:inline-block;padding:10px 18px;background:${BRAND_NAVY};color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Open Admin Inbox</a>
        </td></tr>`;

    const text = [
        `New enquiry [#${p.id}]`,
        "",
        ...rows.map((r) => `${r.label}: ${r.value}`),
        "",
        "Reply to this email to contact the customer.",
    ].join("\n");

    return { subject, html: emailShell("New enquiry received", body), text };
}

export function renderCustomerAck(p: InquiryEmailPayload): RenderedEmail {
    const subject = "We received your enquiry — Origin Tours & Travels";
    const firstName = p.name.split(/\s+/)[0] || p.name;
    const service = p.serviceType ? `<strong>${escapeHtml(p.serviceType)}</strong>` : "your travel plans";

    const body = `
        <tr><td style="padding:28px 28px 8px 28px;">
          <div style="font-size:18px;font-weight:700;color:${TEXT_DARK};margin-bottom:8px;">Thank you, ${escapeHtml(firstName)} — we got your enquiry.</div>
          <div style="font-size:14px;color:${TEXT_MUTED};line-height:1.6;">
            We've received your message about ${service}. Our team will review the details and get back to you within <strong>24 hours</strong> (usually much sooner).
          </div>
        </td></tr>
        <tr><td style="padding:16px 28px 8px 28px;">
          <div style="font-size:13px;font-weight:600;color:${TEXT_MUTED};text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">What happens next</div>
          <ol style="margin:0;padding-left:18px;font-size:14px;color:${TEXT_DARK};line-height:1.7;">
            <li>One of our travel specialists will call or email you.</li>
            <li>We'll share a tailored itinerary, pricing, and available dates.</li>
            <li>Once you're happy, we lock in bookings, visas, and tickets.</li>
          </ol>
        </td></tr>
        <tr><td style="padding:20px 28px 8px 28px;">
          <div style="font-size:13px;color:${TEXT_MUTED};margin-bottom:10px;">Need to talk to us sooner?</div>
          <a href="https://wa.me/919177787635" style="display:inline-block;padding:12px 22px;background:#25D366;color:#ffffff;text-decoration:none;border-radius:50px;font-weight:700;font-size:14px;">Chat on WhatsApp</a>
          <span style="display:inline-block;margin-left:12px;font-size:14px;color:${TEXT_DARK};">or call <a href="tel:+919177787635" style="color:${BRAND_NAVY};text-decoration:none;font-weight:600;">+91 91777 87635</a></span>
        </td></tr>
        <tr><td style="padding:18px 28px 28px 28px;">
          <div style="font-size:12px;color:${TEXT_MUTED};line-height:1.6;">
            This is an automated confirmation — please don't reply to this address. We'll reach out from a personal email shortly.
          </div>
        </td></tr>`;

    const text = [
        `Thank you, ${firstName} — we got your enquiry.`,
        "",
        `We've received your message${p.serviceType ? ` about ${p.serviceType}` : ""}. Our team will review the details and get back to you within 24 hours.`,
        "",
        "What happens next:",
        "  1. A travel specialist will call or email you.",
        "  2. We'll share a tailored itinerary, pricing, and available dates.",
        "  3. Once you're happy, we lock in bookings, visas, and tickets.",
        "",
        "Need to talk to us sooner?",
        "  WhatsApp: https://wa.me/919177787635",
        "  Phone:    +91 91777 87635",
        "",
        "— Origin Tours & Travels",
    ].join("\n");

    return { subject, html: emailShell("Enquiry received", body), text };
}
