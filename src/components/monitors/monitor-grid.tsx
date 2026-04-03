import Link from "next/link";
import type { MonitorWithCounts } from "@/types";
import { getStatusBg, formatResponseTime, formatUptime } from "@/lib/utils";
import { Activity, ExternalLink, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

interface MonitorGridProps {
  monitors: MonitorWithCounts[];
}

function SslBadge({ ssl }: { ssl: MonitorWithCounts["sslCheck"] }) {
  if (!ssl) return null;

  if (ssl.status === "VALID") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
        <ShieldCheck className="h-3 w-3" />
        SSL {ssl.daysUntilExpiry}d
      </span>
    );
  }
  if (ssl.status === "EXPIRING_SOON") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-yellow-200 bg-yellow-50 px-1.5 py-0.5 text-[10px] font-medium text-yellow-700">
        <ShieldAlert className="h-3 w-3" />
        SSL {ssl.daysUntilExpiry}d
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-700">
      <ShieldX className="h-3 w-3" />
      SSL {ssl.status === "EXPIRED" ? "EXPIRED" : "ERR"}
    </span>
  );
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
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${getStatusBg(m.lastStatus)}`}
              >
                {m.lastStatus ?? "Pending"}
              </span>
              <SslBadge ssl={m.sslCheck} />
            </div>
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
