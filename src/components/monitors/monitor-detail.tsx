"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { MonitorWithChecks } from "@/types";
import { getStatusBg, getStatusColor, formatResponseTime } from "@/lib/utils";
import {
  ArrowLeft,
  Trash2,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Props {
  monitor: MonitorWithChecks;
}

export function MonitorDetail({ monitor }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(monitor.status);

  async function togglePause() {
    const newStatus = status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    const res = await fetch(`/api/monitors/${monitor.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setStatus(newStatus);
      toast.success(newStatus === "ACTIVE" ? "Monitor resumed" : "Monitor paused");
      router.refresh();
    }
  }

  async function deleteMonitor() {
    if (!confirm("Delete this monitor? This cannot be undone.")) return;
    const res = await fetch(`/api/monitors/${monitor.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Monitor deleted");
      router.push("/monitors");
    }
  }

  const recentChecks = monitor.checks.slice(0, 30);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/monitors" className="text-slate-400 hover:text-slate-900 mt-1">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900">{monitor.name}</h1>
            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${getStatusBg(monitor.lastStatus)}`}>
              {monitor.lastStatus ?? "Pending"}
            </span>
          </div>
          <a
            href={monitor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-blue-400 mt-1 block"
          >
            {monitor.url}
          </a>
        </div>
        <div className="flex gap-2">
          <button
            onClick={togglePause}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-sm"
          >
            {status === "ACTIVE" ? (
              <><PauseCircle className="h-4 w-4" /> Pause</>
            ) : (
              <><PlayCircle className="h-4 w-4" /> Resume</>
            )}
          </button>
          <button
            onClick={deleteMonitor}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition text-sm"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Avg Response", value: formatResponseTime(monitor.responseTime) },
          { label: "Interval", value: `${monitor.interval}m` },
          { label: "Open Incidents", value: monitor.incidents.filter(i => i.status === "OPEN").length },
          { label: "Total Checks", value: monitor.checks.length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border-2 border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className="text-xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent checks */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Recent Checks</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {recentChecks.length === 0 && (
            <p className="px-6 py-8 text-slate-500 text-sm text-center">No checks yet</p>
          )}
          {recentChecks.map((check) => (
            <div key={check.id} className="flex items-center gap-4 px-6 py-3">
              {check.status === "UP" ? (
                <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              )}
              <span className={`text-sm font-medium ${getStatusColor(check.status)}`}>
                {check.status}
              </span>
              {check.statusCode && (
                <span className="text-xs text-slate-500">HTTP {check.statusCode}</span>
              )}
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {formatResponseTime(check.responseTime)}
              </span>
              <span className="ml-auto text-xs text-slate-600">
                {formatDistanceToNow(new Date(check.checkedAt), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Incidents */}
      {monitor.incidents.length > 0 && (
        <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Incident History</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {monitor.incidents.map((inc) => (
              <div key={inc.id} className="flex items-center gap-4 px-6 py-4">
                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${
                  inc.status === "OPEN"
                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                    : "border-green-500/20 bg-green-500/10 text-green-400"
                }`}>
                  {inc.status}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate">{inc.cause ?? "Unknown cause"}</p>
                  <p className="text-xs text-slate-500">
                    Started {formatDistanceToNow(new Date(inc.startedAt), { addSuffix: true })}
                    {inc.resolvedAt && ` · Resolved ${formatDistanceToNow(new Date(inc.resolvedAt), { addSuffix: true })}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
