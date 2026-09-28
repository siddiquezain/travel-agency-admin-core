import { prisma } from "@/core/lib/prisma";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const setting = await prisma.siteSetting.upsert({
        where: { id: 1 },
        create: { id: 1 },
        update: {},
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Manage company info, contact details, homepage sliders, and outbound email (SMTP).
                </p>
            </div>
            <SettingsForm initial={JSON.parse(JSON.stringify(setting))} />
        </div>
    );
}
