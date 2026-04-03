"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { MonitorWithChecks } from "@/types";
import type { SslCheck } from "@prisma/client";
import { getStatusBg, getStatusColor, formatResponseTime } from "@/lib/utils";
import {
  ArrowLeft,
  Trash2,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Props {
  monitor: MonitorWithChecks;
}

export function MonitorDetail({ monitor }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(monitor.status);
  const [ssl, setSsl] = useState<SslCheck | null>(monitor.sslCheck);
  const [sslLoading, setSslLoading] = useState(false);

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

  async function refreshSsl() {
    setSslLoading(true);
    try {
      const res = await fetch(`/api/ssl/${monitor.id}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to refresh SSL");
      const data = await res.json();
      setSsl(data);
      toast.success("SSL certificate refreshed");
    } catch {
      toast.error("SSL check failed");
    } finally {
      setSslLoading(false);
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

      {/* SSL Certificate */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            {ssl?.status === "VALID" ? (
              <ShieldCheck className="h-5 w-5 text-green-500" />
            ) : ssl?.status === "EXPIRING_SOON" ? (
              <ShieldAlert className="h-5 w-5 text-yellow-500" />
            ) : (
              <ShieldX className="h-5 w-5 text-red-400" />
            )}
            SSL Certificate
          </h2>
          <button
            onClick={refreshSsl}
            disabled={sslLoading}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${sslLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {!ssl ? (
          <div className="px-6 py-8 text-center">
            <p className="text-slate-500 text-sm mb-3">No SSL data yet</p>
            <button
              onClick={refreshSsl}
              disabled={sslLoading}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              {sslLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Check SSL Now
            </button>
          </div>
        ) : (
          <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${
                ssl.status === "VALID"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : ssl.status === "EXPIRING_SOON"
                  ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}>
                {ssl.status.replace("_", " ")}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Expires In</p>
              <p className="text-sm font-semibold text-slate-900">
                {ssl.daysUntilExpiry !== null && ssl.daysUntilExpiry !== undefined
                  ? ssl.daysUntilExpiry < 0
                    ? "Expired"
                    : `${ssl.daysUntilExpiry} days`
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Expiry Date</p>
              <p className="text-sm font-semibold text-slate-900">
                {ssl.validTo ? new Date(ssl.validTo).toLocaleDateString() : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Issuer</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{ssl.issuer ?? "—"}</p>
            </div>
            {ssl.error && (
              <div className="col-span-2 sm:col-span-4">
                <p className="text-xs text-red-500">{ssl.error}</p>
              </div>
            )}
            {ssl.lastCheckedAt && (
              <div className="col-span-2 sm:col-span-4">
                <p className="text-xs text-slate-400">
                  Last checked {formatDistanceToNow(new Date(ssl.lastCheckedAt), { addSuffix: true })}
                </p>
              </div>
            )}
          </div>
        )}
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
