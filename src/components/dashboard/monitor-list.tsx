import Link from "next/link";
import type { Monitor } from "@prisma/client";
import { getStatusBg, formatResponseTime } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface MonitorListProps {
  monitors: Monitor[];
}

export function MonitorList({ monitors }: MonitorListProps) {
  if (monitors.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-12 text-center">
        <p className="text-slate-500">No monitors yet.</p>
        <Link
          href="/monitors"
          className="mt-4 inline-block text-blue-400 hover:text-blue-300 text-sm"
        >
          Add your first monitor →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="font-semibold text-slate-900">Recent Monitors</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {monitors.slice(0, 10).map((m) => (
          <Link
            key={m.id}
            href={`/monitors/${m.id}`}
            className="flex items-center gap-4 px-6 py-4 hover:bg-blue-50/50 transition-colors"
          >
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${getStatusBg(m.lastStatus)}`}
            >
              {m.lastStatus ?? "Pending"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{m.name}</p>
              <p className="text-xs text-slate-500 truncate">{m.url}</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400">{formatResponseTime(m.responseTime)}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-600 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
