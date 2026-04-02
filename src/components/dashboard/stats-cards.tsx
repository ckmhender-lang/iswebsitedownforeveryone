import { Activity, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { DashboardStats } from "@/types";

export function StatsCards(stats: DashboardStats) {
  const cards = [
    {
      label: "Total Monitors",
      value: stats.total,
      icon: <Activity className="h-5 w-5 text-blue-400" />,
      color: "border-2 border-blue-300 bg-blue-50 shadow-sm",
    },
    {
      label: "Monitors Up",
      value: stats.up,
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      color: "border-2 border-green-300 bg-green-50 shadow-sm",
    },
    {
      label: "Monitors Down",
      value: stats.down,
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      color: "border-2 border-red-300 bg-red-50 shadow-sm",
    },
    {
      label: "Checks Today",
      value: stats.checksToday,
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
      color: "border-2 border-purple-300 bg-purple-50 shadow-sm",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`rounded-xl border p-5 ${c.color}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">{c.label}</span>
            {c.icon}
          </div>
          <p className="text-3xl font-bold text-slate-900">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
