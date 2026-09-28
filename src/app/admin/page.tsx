import React from "react";
import { prisma } from "@/lib/prisma";
import { DashboardInquiries } from "@/core/dashboard/DashboardInquiries";
import InquiryStatusDonut from "@/core/dashboard/InquiryStatusDonut";
import DashboardKpis, { type KpiData, type WindowKey } from "@/core/dashboard/DashboardKpis";

const DAY = 24 * 60 * 60 * 1000;

const WINDOWS: { key: WindowKey; days: number }[] = [
    { key: "1d", days: 1 },
    { key: "7d", days: 7 },
    { key: "30d", days: 30 },
];

async function loadWindowedKpis(): Promise<KpiData> {
    const now = Date.now();

    const windowEntries = await Promise.all(
        WINDOWS.map(async ({ key, days }) => {
            const since = new Date(now - days * DAY);
            const priorSince = new Date(now - 2 * days * DAY);

            const [inqCur, inqPri, convCur, convPri] = await Promise.all([
                prisma.inquiry.count({ where: { createdAt: { gte: since } } }),
                prisma.inquiry.count({
                    where: { createdAt: { gte: priorSince, lt: since } },
                }),
                prisma.inquiry.count({
                    where: { createdAt: { gte: since }, status: "Converted" },
                }),
                prisma.inquiry.count({
                    where: { createdAt: { gte: priorSince, lt: since }, status: "Converted" },
                }),
            ]);

            return [
                key,
                {
                    label: key,
                    inquiries: { current: inqCur, prior: inqPri },
                    converted: { current: convCur, prior: convPri },
                },
            ] as const;
        }),
    );

    const [activeTours, activeVisas] = await Promise.all([
        prisma.tour.count({ where: { isActive: true } }),
        prisma.visa.count({ where: { isActive: true } }),
    ]);

    const windows = Object.fromEntries(windowEntries) as KpiData["windows"];

    return { windows, activeTours, activeVisas };
}

export default async function Dashboard() {
    const [kpis, statusGroups, recentInquiries] = await Promise.all([
        loadWindowedKpis(),
        prisma.inquiry.groupBy({
            by: ["status"],
            _count: { _all: true },
        }),
        prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    ]);

    const statusBuckets = statusGroups
        .map((g) => ({ status: g.status, count: g._count._all }))
        .sort((a, b) => b.count - a.count);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Overview of your travel agency&apos;s performance and recent activities.
                </p>
            </div>

            <DashboardKpis data={kpis} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-1">
                    <InquiryStatusDonut buckets={statusBuckets} />
                </div>
                <div className="lg:col-span-2">
                    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-6">
                        <DashboardInquiries inquiries={JSON.parse(JSON.stringify(recentInquiries))} />
                    </div>
                </div>
            </div>
        </div>
    );
}
