import { Metadata } from "next";
import { auth } from "@/lib/auth";
import {
  countChecksForUserSince,
  countOpenIncidentsForUser,
  listMonitorsForUser,
} from "@/lib/local-store";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { MonitorList } from "@/components/dashboard/monitor-list";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const monitors = listMonitorsForUser(userId).slice(0, 20);
  const totalChecksToday = countChecksForUserSince(userId, new Date(Date.now() - 86400000));
  const openIncidents = countOpenIncidentsForUser(userId);

  const upCount = monitors.filter((m: { lastStatus: string | null }) => m.lastStatus === "UP").length;
  const downCount = monitors.filter((m: { lastStatus: string | null }) => m.lastStatus === "DOWN").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Overview of all your monitors</p>
      </div>

      <StatsCards
        total={monitors.length}
        up={upCount}
        down={downCount}
        checksToday={totalChecksToday}
        openIncidents={openIncidents}
      />

      <MonitorList monitors={monitors} />
    </div>
  );
}
