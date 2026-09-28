"use client";
import React, { useState } from "react";
import { FileText, TrendingUp, Percent, Compass, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export type WindowKey = "1d" | "7d" | "30d";

export type KpiBuckets = {
    label: string;
    inquiries: { current: number; prior: number };
    converted: { current: number; prior: number };
};

export type KpiData = {
    windows: Record<WindowKey, KpiBuckets>;
    activeTours: number;
    activeVisas: number;
};

const WINDOW_LABELS: Record<WindowKey, string> = {
    "1d": "Today",
    "7d": "Last 7 days",
    "30d": "Last 30 days",
};

function delta(current: number, prior: number): { dir: "up" | "down" | "flat"; pct: number | null; absolute: number } {
    const absolute = current - prior;
    if (prior === 0 && current === 0) return { dir: "flat", pct: null, absolute: 0 };
    if (prior === 0) return { dir: "up", pct: null, absolute };
    const pct = ((current - prior) / prior) * 100;
    if (pct > 0.5) return { dir: "up", pct, absolute };
    if (pct < -0.5) return { dir: "down", pct, absolute };
    return { dir: "flat", pct, absolute };
}

function DeltaBadge({
    dir,
    pct,
    positiveIsGood = true,
}: {
    dir: "up" | "down" | "flat";
    pct: number | null;
    positiveIsGood?: boolean;
}) {
    const good = dir === "flat" ? null : (dir === "up") === positiveIsGood;
    const colour =
        dir === "flat"
            ? "text-slate-400 bg-slate-100"
            : good
                ? "text-emerald-700 bg-emerald-50"
                : "text-red-700 bg-red-50";
    const Icon = dir === "up" ? ArrowUpRight : dir === "down" ? ArrowDownRight : Minus;
    const label =
        pct === null
            ? dir === "flat"
                ? "—"
                : "new"
            : `${dir === "down" ? "" : dir === "up" ? "+" : ""}${Math.abs(pct).toFixed(0)}%`;
    return (
        <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${colour}`}>
            <Icon className="h-3 w-3" />
            {label}
        </span>
    );
}

type StatProps = {
    name: string;
    Icon: React.ComponentType<{ className?: string }>;
    value: string;
    sub?: string;
    delta?: { dir: "up" | "down" | "flat"; pct: number | null };
    positiveIsGood?: boolean;
};

function StatCard({ name, Icon, value, sub, delta, positiveIsGood = true }: StatProps) {
    return (
        <div className="relative overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-slate-200 sm:px-6 sm:pt-6 transition-all hover:shadow-md">
            <div className="absolute rounded-md bg-emerald-50 p-3">
                <Icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-slate-500">{name}</p>
            <div className="ml-16 pb-1 sm:pb-2 mt-1 flex items-baseline gap-2 flex-wrap">
                <p className="text-2xl font-semibold text-slate-900">{value}</p>
                {delta && <DeltaBadge dir={delta.dir} pct={delta.pct} positiveIsGood={positiveIsGood} />}
            </div>
            {sub && <p className="ml-16 text-xs text-slate-500">{sub}</p>}
        </div>
    );
}

function rate(current: number, total: number): number {
    if (total === 0) return 0;
    return (current / total) * 100;
}

export default function DashboardKpis({ data }: { data: KpiData }) {
    const [win, setWin] = useState<WindowKey>("30d");
    const bucket = data.windows[win];

    const dInq = delta(bucket.inquiries.current, bucket.inquiries.prior);
    const dConv = delta(bucket.converted.current, bucket.converted.prior);
    const curRate = rate(bucket.converted.current, bucket.inquiries.current);
    const priRate = rate(bucket.converted.prior, bucket.inquiries.prior);
    const dRate = delta(curRate, priRate);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="sr-only">Key metrics</h3>
                <div
                    role="tablist"
                    aria-label="Reporting window"
                    className="inline-flex rounded-md bg-slate-100 p-1 text-xs font-medium"
                >
                    {(Object.keys(WINDOW_LABELS) as WindowKey[]).map((k) => (
                        <button
                            key={k}
                            role="tab"
                            aria-selected={win === k}
                            type="button"
                            onClick={() => setWin(k)}
                            className={`px-3 py-1.5 rounded transition-colors ${win === k
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            {WINDOW_LABELS[k]}
                        </button>
                    ))}
                </div>
                <span className="text-xs text-slate-500">
                    vs prior {win === "1d" ? "day" : win === "7d" ? "7 days" : "30 days"}
                </span>
            </div>

            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    name="New Inquiries"
                    Icon={FileText}
                    value={bucket.inquiries.current.toLocaleString()}
                    sub={`prior: ${bucket.inquiries.prior.toLocaleString()}`}
                    delta={{ dir: dInq.dir, pct: dInq.pct }}
                />
                <StatCard
                    name="Conversions"
                    Icon={TrendingUp}
                    value={bucket.converted.current.toLocaleString()}
                    sub={`prior: ${bucket.converted.prior.toLocaleString()}`}
                    delta={{ dir: dConv.dir, pct: dConv.pct }}
                />
                <StatCard
                    name="Conversion Rate"
                    Icon={Percent}
                    value={`${curRate.toFixed(1)}%`}
                    sub={`prior: ${priRate.toFixed(1)}%`}
                    delta={{ dir: dRate.dir, pct: dRate.pct }}
                />
                <StatCard
                    name="Active Listings"
                    Icon={Compass}
                    value={(data.activeTours + data.activeVisas).toLocaleString()}
                    sub={`${data.activeTours} tours · ${data.activeVisas} visas`}
                />
            </dl>
        </div>
    );
}
