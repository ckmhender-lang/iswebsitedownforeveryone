import Link from "next/link";
import type { MonitorWithCounts } from "@/types";
import { getStatusBg, formatResponseTime, formatUptime } from "@/lib/utils";
import { Activity, ExternalLink } from "lucide-react";

interface MonitorGridProps {
  monitors: MonitorWithCounts[];
}

export function MonitorGrid({ monitors }: MonitorGridProps) {
  if (monitors.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-16 text-center">
        <Activity className="h-10 w-10 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 font-medium">No monitors yet</p>
        <p className="text-slate-500 text-sm mt-1">Click &quot;Add Monitor&quot; to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {monitors.map((m) => (
        <Link
          key={m.id}
          href={`/monitors/${m.id}`}
          className="rounded-2xl border-2 border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all group shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 mr-3">
              <h3 className="font-semibold text-slate-900 truncate">{m.name}</h3>
              <p className="text-xs text-slate-500 truncate mt-0.5">{m.url}</p>
            </div>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium flex-shrink-0 ${getStatusBg(m.lastStatus)}`}
            >
              {m.lastStatus ?? "Pending"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-2">
              <p className="text-xs text-slate-500">Uptime</p>
              <p className="text-sm font-semibold text-slate-900">{formatUptime(m.uptime)}</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-2">
              <p className="text-xs text-slate-500">Response</p>
              <p className="text-sm font-semibold text-slate-900">{formatResponseTime(m.responseTime)}</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-2">
              <p className="text-xs text-slate-500">Checks</p>
              <p className="text-sm font-semibold text-slate-900">{m._count.checks}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <span>Every {m.interval}m</span>
            <ExternalLink className="h-3.5 w-3.5 group-hover:text-slate-400 transition-colors" />
          </div>
        </Link>
      ))}
    </div>
  );
}
