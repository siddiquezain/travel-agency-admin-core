"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Send, Building2, Phone, Mail, ShieldAlert, Loader2, Images, PlusCircle, MinusCircle } from "lucide-react";
import { ImageUploader } from "./ImageUploader";

type Setting = {
    companyName: string;
    tagline: string | null;
    supportEmail: string | null;
    supportPhone: string | null;
    whatsapp: string | null;
    addressLine: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
    smtpHost: string | null;
    smtpPort: number | null;
    smtpUser: string | null;
    smtpPass: string | null;
    smtpSecure: boolean;
    inquiryFrom: string | null;
    inquiryTo: string | null;
    heroSlides: unknown;
    sliderAutoplay: boolean;
    sliderInterval: number;
    sliderSpeed: number;
    sliderLoop: boolean;
    sliderShowDots: boolean;
    sliderShowArrows: boolean;
    sliderPauseOnHover: boolean;
};

type HeroSlide = {
    image: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
};

type FormState = {
    companyName: string;
    tagline: string;
    supportEmail: string;
    supportPhone: string;
    whatsapp: string;
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    smtpPass: string;
    smtpSecure: boolean;
    inquiryFrom: string;
    inquiryTo: string;
    heroSlides: HeroSlide[];
    sliderAutoplay: boolean;
    sliderInterval: string;
    sliderSpeed: string;
    sliderLoop: boolean;
    sliderShowDots: boolean;
    sliderShowArrows: boolean;
    sliderPauseOnHover: boolean;
};

const tabs = [
    { id: "general", label: "General", icon: Building2 },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "sliders", label: "Sliders", icon: Images },
    { id: "smtp", label: "Outbound Email", icon: Mail },
] as const;
type TabId = (typeof tabs)[number]["id"];

const inputCls =
    "block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600 sm:text-sm";
const labelCls = "block text-sm font-medium text-slate-700 mb-1";

function toForm(s: Setting): FormState {
    return {
        companyName: s.companyName ?? "",
        tagline: s.tagline ?? "",
        supportEmail: s.supportEmail ?? "",
        supportPhone: s.supportPhone ?? "",
        whatsapp: s.whatsapp ?? "",
        addressLine: s.addressLine ?? "",
        city: s.city ?? "",
        state: s.state ?? "",
        postalCode: s.postalCode ?? "",
        country: s.country ?? "",
        smtpHost: s.smtpHost ?? "",
        smtpPort: s.smtpPort != null ? String(s.smtpPort) : "",
        smtpUser: s.smtpUser ?? "",
        smtpPass: s.smtpPass ?? "",
        smtpSecure: !!s.smtpSecure,
        inquiryFrom: s.inquiryFrom ?? "",
        inquiryTo: s.inquiryTo ?? "",
        heroSlides: normSlides(s.heroSlides),
        sliderAutoplay: s.sliderAutoplay ?? true,
        sliderInterval: String(s.sliderInterval ?? 5000),
        sliderSpeed: String(s.sliderSpeed ?? 600),
        sliderLoop: s.sliderLoop ?? true,
        sliderShowDots: s.sliderShowDots ?? true,
        sliderShowArrows: s.sliderShowArrows ?? true,
        sliderPauseOnHover: s.sliderPauseOnHover ?? true,
    };
}

function normSlides(value: unknown): HeroSlide[] {
    if (!Array.isArray(value)) return [];
    return value.map((s) => {
        const o = (s && typeof s === "object" ? s : {}) as Record<string, unknown>;
        return {
            image: typeof o.image === "string" ? o.image : "",
            title: typeof o.title === "string" ? o.title : "",
            subtitle: typeof o.subtitle === "string" ? o.subtitle : "",
            ctaLabel: typeof o.ctaLabel === "string" ? o.ctaLabel : "",
            ctaHref: typeof o.ctaHref === "string" ? o.ctaHref : "",
        };
    });
}

export default function SettingsForm({ initial }: { initial: Setting }) {
    const router = useRouter();
    const [tab, setTab] = useState<TabId>("general");
    const [form, setForm] = useState<FormState>(toForm(initial));
    const [saving, startSaving] = useTransition();
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);

    const [testTo, setTestTo] = useState(initial.inquiryTo ?? initial.supportEmail ?? "");
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

    function set<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
        setSaved(false);
    }

    function updateSlide(idx: number, key: keyof HeroSlide, value: string) {
        set("heroSlides", form.heroSlides.map((s, i) => (i === idx ? { ...s, [key]: value } : s)));
    }
    function addSlide() {
        set("heroSlides", [...form.heroSlides, { image: "", title: "", subtitle: "", ctaLabel: "", ctaHref: "" }]);
    }
    function removeSlide(idx: number) {
        set("heroSlides", form.heroSlides.filter((_, i) => i !== idx));
    }

    async function save() {
        if (!form.companyName.trim()) {
            setError("Company name is required.");
            return;
        }
        setError("");
        const body = {
            ...form,
            smtpPort: form.smtpPort.trim() === "" ? null : Number(form.smtpPort),
            sliderInterval: Number(form.sliderInterval) || 5000,
            sliderSpeed: Number(form.sliderSpeed) || 600,
        };
        const res = await fetch("/api/admin/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            setError(d.error || "Failed to save");
            return;
        }
        setSaved(true);
        startSaving(() => router.refresh());
    }

    async function testSmtp() {
        setTesting(true);
        setTestResult(null);
        try {
            const res = await fetch("/api/admin/settings/smtp/test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: testTo }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.ok) {
                setTestResult({ ok: true, message: `Test email sent to ${testTo}.` });
            } else {
                setTestResult({ ok: false, message: data.error || "Test failed." });
            }
        } catch (e) {
            setTestResult({ ok: false, message: (e as Error).message });
        } finally {
            setTesting(false);
        }
    }

    return (
        <div className="bg-white shadow-sm ring-1 ring-slate-200 sm:rounded-xl">
            <div className="border-b border-slate-200 px-4 sm:px-6">
                <nav className="-mb-px flex gap-4 overflow-x-auto" aria-label="Settings tabs">
                    {tabs.map((t) => {
                        const Icon = t.icon;
                        const active = tab === t.id;
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setTab(t.id)}
                                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${active
                                        ? "border-emerald-600 text-emerald-700"
                                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {t.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="p-6 md:p-8 space-y-6">
                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
                        {error}
                    </div>
                )}
                {saved && !error && (
                    <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700 ring-1 ring-emerald-200">
                        Settings saved.
                    </div>
                )}

                {tab === "general" && (
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className={labelCls}>Company Name <span className="text-red-500">*</span></label>
                            <input
                                className={inputCls}
                                value={form.companyName}
                                onChange={(e) => set("companyName", e.target.value)}
                                placeholder="Your Agency Name"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>Tagline</label>
                            <input
                                className={inputCls}
                                value={form.tagline}
                                onChange={(e) => set("tagline", e.target.value)}
                                placeholder="Your Travel Partner"
                            />
                        </div>
                    </div>
                )}

                {tab === "contact" && (
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Support Email</label>
                            <input
                                type="email"
                                className={inputCls}
                                value={form.supportEmail}
                                onChange={(e) => set("supportEmail", e.target.value)}
                                placeholder="support@example.com"
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Support Phone</label>
                            <input
                                className={inputCls}
                                value={form.supportPhone}
                                onChange={(e) => set("supportPhone", e.target.value)}
                                placeholder="+1 000 000 0000"
                            />
                        </div>
                        <div>
                            <label className={labelCls}>WhatsApp</label>
                            <input
                                className={inputCls}
                                value={form.whatsapp}
                                onChange={(e) => set("whatsapp", e.target.value)}
                                placeholder="+10000000000"
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Country</label>
                            <input
                                className={inputCls}
                                value={form.country}
                                onChange={(e) => set("country", e.target.value)}
                                placeholder="Your Country"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>Street / Address Line</label>
                            <input
                                className={inputCls}
                                value={form.addressLine}
                                onChange={(e) => set("addressLine", e.target.value)}
                                placeholder="123 Main Street"
                            />
                        </div>
                        <div>
                            <label className={labelCls}>City</label>
                            <input
                                className={inputCls}
                                value={form.city}
                                onChange={(e) => set("city", e.target.value)}
                                placeholder="Your City"
                            />
                        </div>
                        <div>
                            <label className={labelCls}>State</label>
                            <input
                                className={inputCls}
                                value={form.state}
                                onChange={(e) => set("state", e.target.value)}
                                placeholder="Your State / Region"
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Postal Code</label>
                            <input
                                className={inputCls}
                                value={form.postalCode}
                                onChange={(e) => set("postalCode", e.target.value)}
                                placeholder="00000"
                            />
                        </div>
                    </div>
                )}

                {tab === "sliders" && (
                    <div className="space-y-8">
                        {/* Carousel timing */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-800 mb-1">Carousel timing</h4>
                            <p className="text-xs text-slate-500 mb-4">
                                Applies to the homepage hero slider and the featured tour, Umrah,
                                visa, and attestation carousels.
                            </p>
                            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                <div className="flex items-center gap-2 sm:col-span-2">
                                    <input
                                        id="sliderAutoplay"
                                        type="checkbox"
                                        checked={form.sliderAutoplay}
                                        onChange={(e) => set("sliderAutoplay", e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                                    />
                                    <label htmlFor="sliderAutoplay" className="text-sm text-slate-700">
                                        Autoplay — automatically advance slides
                                    </label>
                                </div>
                                <div>
                                    <label className={labelCls}>Slide interval (ms)</label>
                                    <input
                                        type="number"
                                        min={1000}
                                        max={30000}
                                        step={500}
                                        className={inputCls}
                                        value={form.sliderInterval}
                                        onChange={(e) => set("sliderInterval", e.target.value)}
                                        placeholder="5000"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">How long each slide stays (1000–30000).</p>
                                </div>
                                <div>
                                    <label className={labelCls}>Transition speed (ms)</label>
                                    <input
                                        type="number"
                                        min={100}
                                        max={3000}
                                        step={50}
                                        className={inputCls}
                                        value={form.sliderSpeed}
                                        onChange={(e) => set("sliderSpeed", e.target.value)}
                                        placeholder="600"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Slide-change animation duration (100–3000).</p>
                                </div>
                                <div className="flex items-center gap-2 sm:col-span-2">
                                    <input
                                        id="sliderLoop"
                                        type="checkbox"
                                        checked={form.sliderLoop}
                                        onChange={(e) => set("sliderLoop", e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                                    />
                                    <label htmlFor="sliderLoop" className="text-sm text-slate-700">
                                        Loop — restart from the first slide after the last
                                    </label>
                                </div>
                                <div className="flex items-center gap-2 sm:col-span-2">
                                    <input
                                        id="sliderShowDots"
                                        type="checkbox"
                                        checked={form.sliderShowDots}
                                        onChange={(e) => set("sliderShowDots", e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                                    />
                                    <label htmlFor="sliderShowDots" className="text-sm text-slate-700">
                                        Pagination dots — show the dot indicators under carousels
                                    </label>
                                </div>
                                <div className="flex items-center gap-2 sm:col-span-2">
                                    <input
                                        id="sliderShowArrows"
                                        type="checkbox"
                                        checked={form.sliderShowArrows}
                                        onChange={(e) => set("sliderShowArrows", e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                                    />
                                    <label htmlFor="sliderShowArrows" className="text-sm text-slate-700">
                                        Navigation arrows — show prev/next arrows on the featured carousels
                                    </label>
                                </div>
                                <div className="flex items-center gap-2 sm:col-span-2">
                                    <input
                                        id="sliderPauseOnHover"
                                        type="checkbox"
                                        checked={form.sliderPauseOnHover}
                                        onChange={(e) => set("sliderPauseOnHover", e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                                    />
                                    <label htmlFor="sliderPauseOnHover" className="text-sm text-slate-700">
                                        Pause on hover — pause autoplay while the cursor is over a carousel
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Hero slides */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-semibold text-slate-800">Hero slides</h4>
                                <button
                                    type="button"
                                    onClick={addSlide}
                                    className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-800"
                                >
                                    <PlusCircle className="h-4 w-4" /> Add slide
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mb-4">
                                Add slides to turn the homepage hero into an image carousel.
                                Leave empty to keep the default video hero.
                            </p>

                            {form.heroSlides.length === 0 ? (
                                <div className="rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                                    No slides — the homepage shows the default video hero.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {form.heroSlides.map((slide, i) => (
                                        <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                    Slide {i + 1}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSlide(i)}
                                                    className="flex items-center text-red-400 hover:text-red-600"
                                                    aria-label={`Remove slide ${i + 1}`}
                                                >
                                                    <MinusCircle className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div>
                                                <label className={labelCls}>Background image</label>
                                                <ImageUploader
                                                    category="hero"
                                                    maxFiles={1}
                                                    images={slide.image ? [slide.image] : []}
                                                    onChange={(imgs) => updateSlide(i, "image", imgs[0] ?? "")}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                                                <div className="sm:col-span-2">
                                                    <label className={labelCls}>Heading</label>
                                                    <input
                                                        className={inputCls}
                                                        value={slide.title}
                                                        onChange={(e) => updateSlide(i, "title", e.target.value)}
                                                        placeholder="Discover Your Next Journey"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className={labelCls}>Subtext</label>
                                                    <input
                                                        className={inputCls}
                                                        value={slide.subtitle}
                                                        onChange={(e) => updateSlide(i, "subtitle", e.target.value)}
                                                        placeholder="Curated holiday packages across 50+ countries"
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Button label</label>
                                                    <input
                                                        className={inputCls}
                                                        value={slide.ctaLabel}
                                                        onChange={(e) => updateSlide(i, "ctaLabel", e.target.value)}
                                                        placeholder="Explore Tours"
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Button link</label>
                                                    <input
                                                        className={inputCls}
                                                        value={slide.ctaHref}
                                                        onChange={(e) => updateSlide(i, "ctaHref", e.target.value)}
                                                        placeholder="/tours"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {tab === "smtp" && (
                    <div className="space-y-6">
                        <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200 flex items-start gap-2">
                            <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
                            <div>
                                Credentials stored here override any <code>SMTP_*</code> env vars. The password is stored in the database — restrict DB access accordingly. Leave fields blank to fall back to env config.
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div>
                                <label className={labelCls}>SMTP Host</label>
                                <input
                                    className={inputCls}
                                    value={form.smtpHost}
                                    onChange={(e) => set("smtpHost", e.target.value)}
                                    placeholder="smtp.gmail.com"
                                />
                            </div>
                            <div>
                                <label className={labelCls}>Port</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={65535}
                                    className={inputCls}
                                    value={form.smtpPort}
                                    onChange={(e) => set("smtpPort", e.target.value)}
                                    placeholder="587"
                                />
                            </div>
                            <div>
                                <label className={labelCls}>SMTP User</label>
                                <input
                                    className={inputCls}
                                    value={form.smtpUser}
                                    onChange={(e) => set("smtpUser", e.target.value)}
                                    placeholder="bookings@youragency.example"
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label className={labelCls}>SMTP Password / App Password</label>
                                <input
                                    type="password"
                                    className={inputCls}
                                    value={form.smtpPass}
                                    onChange={(e) => set("smtpPass", e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="flex items-center gap-2 sm:col-span-2">
                                <input
                                    id="smtpSecure"
                                    type="checkbox"
                                    checked={form.smtpSecure}
                                    onChange={(e) => set("smtpSecure", e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                                />
                                <label htmlFor="smtpSecure" className="text-sm text-slate-700">
                                    Use TLS (secure) — leave off for STARTTLS on port 587
                                </label>
                            </div>
                            <div>
                                <label className={labelCls}>From address</label>
                                <input
                                    className={inputCls}
                                    value={form.inquiryFrom}
                                    onChange={(e) => set("inquiryFrom", e.target.value)}
                                    placeholder='"Your Agency" <bookings@youragency.example>'
                                />
                            </div>
                            <div>
                                <label className={labelCls}>Inquiry recipient (admin inbox)</label>
                                <input
                                    type="email"
                                    className={inputCls}
                                    value={form.inquiryTo}
                                    onChange={(e) => set("inquiryTo", e.target.value)}
                                    placeholder="bookings@youragency.example"
                                />
                            </div>
                        </div>

                        <div className="rounded-md border border-slate-200 p-4 bg-slate-50">
                            <h4 className="text-sm font-semibold text-slate-800 mb-2">Send a test email</h4>
                            <p className="text-xs text-slate-500 mb-3">
                                Uses the values currently saved in this page. Save first if you just made changes.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    className={inputCls + " flex-1"}
                                    value={testTo}
                                    onChange={(e) => setTestTo(e.target.value)}
                                    placeholder="recipient@example.com"
                                />
                                <button
                                    type="button"
                                    onClick={testSmtp}
                                    disabled={testing || !testTo}
                                    className="flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    Send test
                                </button>
                            </div>
                            {testResult && (
                                <div
                                    className={`mt-3 rounded-md p-2 text-sm ring-1 ${testResult.ok
                                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                            : "bg-red-50 text-red-700 ring-red-200"
                                        }`}
                                >
                                    {testResult.message}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end gap-x-4 border-t border-slate-200 px-6 py-4">
                <button
                    type="button"
                    onClick={() => setForm(toForm(initial))}
                    className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-60"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save settings
                </button>
            </div>
        </div>
    );
}
