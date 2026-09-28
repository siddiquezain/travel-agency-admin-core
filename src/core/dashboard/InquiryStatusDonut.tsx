"use client";
import React from "react";
import Link from "next/link";

type Bucket = { status: string; count: number };

// Match the status options used in src/components/admin/InquiriesTable.tsx
const KNOWN_ORDER = ["Pending", "Contacted", "Converted", "Closed"] as const;

const PALETTE: Record<string, { stroke: string; bg: string; text: string }> = {
    Pending: { stroke: "#F59E0B", bg: "bg-amber-50", text: "text-amber-700" },
    Contacted: { stroke: "#3B82F6", bg: "bg-blue-50", text: "text-blue-700" },
    Converted: { stroke: "#10B981", bg: "bg-emerald-50", text: "text-emerald-700" },
    Closed: { stroke: "#64748B", bg: "bg-slate-100", text: "text-slate-700" },
};

// Fallback colours for any unexpected status values (cycle through).
const FALLBACK_STROKES = ["#A855F7", "#EC4899", "#0EA5E9", "#F97316", "#14B8A6"];

function colourFor(status: string, idx: number) {
    return (
        PALETTE[status] ?? {
            stroke: FALLBACK_STROKES[idx % FALLBACK_STROKES.length],
            bg: "bg-slate-100",
            text: "text-slate-700",
        }
    );
}

function sortBuckets(buckets: Bucket[]): Bucket[] {
    return [...buckets].sort((a, b) => {
        const ai = KNOWN_ORDER.indexOf(a.status as (typeof KNOWN_ORDER)[number]);
        const bi = KNOWN_ORDER.indexOf(b.status as (typeof KNOWN_ORDER)[number]);
        if (ai === -1 && bi === -1) return a.status.localeCompare(b.status);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
    });
}

export default function InquiryStatusDonut({ buckets }: { buckets: Bucket[] }) {
    const ordered = sortBuckets(buckets);
    const total = ordered.reduce((sum, b) => sum + b.count, 0);
    const converted = ordered.find((b) => b.status === "Converted")?.count ?? 0;
    const conversionPct = total > 0 ? Math.round((converted / total) * 100) : 0;

    // Donut geometry — single circle with multiple dasharray-segmented strokes.
    const R = 75;
    const STROKE = 28;
    const CIRCUMFERENCE = 2 * Math.PI * R;

    const nonZero = ordered.filter((b) => b.count > 0);
    const gap = nonZero.length > 1 ? 1.5 : 0;
    const segments = nonZero.reduce<{
        offset: number;
        items: {
            stroke: string;
            bg: string;
            text: string;
            status: string;
            count: number;
            fraction: number;
            dasharray: string;
            dashoffset: number;
        }[];
    }>(
        (acc, b, idx) => {
            const fraction = total === 0 ? 0 : b.count / total;
            const arc = fraction * CIRCUMFERENCE;
            const drawArc = Math.max(arc - gap, 0);
            acc.items.push({
                ...colourFor(b.status, idx),
                status: b.status,
                count: b.count,
                fraction,
                dasharray: `${drawArc} ${CIRCUMFERENCE - drawArc}`,
                dashoffset: -acc.offset,
            });
            return { offset: acc.offset + arc, items: acc.items };
        },
        { offset: 0, items: [] },
    ).items;

    return (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">Inquiry status</h3>
                    <p className="text-xs text-slate-500 mt-0.5">All time</p>
                </div>
                <Link
                    href="/admin/inquiries"
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                >
                    View all →
                </Link>
            </div>

            {total === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">
                    No inquiries yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-6 items-center">
                    <div className="relative w-[180px] h-[180px] mx-auto sm:mx-0">
                        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                            <circle
                                cx="100"
                                cy="100"
                                r={R}
                                fill="none"
                                stroke="#F1F5F9"
                                strokeWidth={STROKE}
                            />
                            {segments.map((s) => (
                                <circle
                                    key={s.status}
                                    cx="100"
                                    cy="100"
                                    r={R}
                                    fill="none"
                                    stroke={s.stroke}
                                    strokeWidth={STROKE}
                                    strokeDasharray={s.dasharray}
                                    strokeDashoffset={s.dashoffset}
                                    strokeLinecap="butt"
                                >
                                    <title>
                                        {s.status}: {s.count} ({Math.round(s.fraction * 100)}%)
                                    </title>
                                </circle>
                            ))}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-slate-900">
                                {conversionPct}%
                            </span>
                            <span className="text-[10px] uppercase tracking-wide text-slate-500">
                                Conversion
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5">
                                {converted} / {total}
                            </span>
                        </div>
                    </div>

                    <ul className="space-y-2">
                        {ordered.map((b, idx) => {
                            const c = colourFor(b.status, idx);
                            const pct = total > 0 ? Math.round((b.count / total) * 100) : 0;
                            return (
                                <li
                                    key={b.status}
                                    className="flex items-center justify-between gap-3 text-sm"
                                >
                                    <span className="flex items-center gap-2 min-w-0">
                                        <span
                                            className="inline-block h-3 w-3 rounded-sm shrink-0"
                                            style={{ backgroundColor: c.stroke }}
                                            aria-hidden="true"
                                        />
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}
                                        >
                                            {b.status}
                                        </span>
                                    </span>
                                    <span className="flex items-baseline gap-2 text-slate-700">
                                        <span className="font-semibold tabular-nums">{b.count}</span>
                                        <span className="text-xs text-slate-400 tabular-nums w-9 text-right">
                                            {pct}%
                                        </span>
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
