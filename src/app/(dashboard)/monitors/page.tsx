import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MonitorGrid } from "@/components/monitors/monitor-grid";
import { AddMonitorButton } from "@/components/monitors/add-monitor-button";

export const metadata: Metadata = { title: "Monitors" };

export default async function MonitorsPage() {
  const session = await auth();
  const userId = session!.user!.id as string;

  const monitors = await prisma.monitor.findMany({
    where: { userId, status: { not: "DELETED" } },
    include: {
      _count: { select: { checks: true, incidents: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monitors</h1>
          <p className="text-slate-600 mt-1">{monitors.length} monitors configured</p>
        </div>
        <AddMonitorButton />
      </div>

      <MonitorGrid monitors={monitors} />
    </div>
  );
}
