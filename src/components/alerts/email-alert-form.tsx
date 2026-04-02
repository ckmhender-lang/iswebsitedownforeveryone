"use client";

import { useState } from "react";
import { Mail, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EmailAlert {
  id: string;
  target: string;
  enabled: boolean;
  monitorId: string | null;
}

interface EmailAlertFormProps {
  alerts: EmailAlert[];
  monitors: { id: string; name: string }[];
}

export function EmailAlertForm({ alerts: initialAlerts, monitors }: EmailAlertFormProps) {
  const [alerts, setAlerts] = useState<EmailAlert[]>(initialAlerts);
  const [email, setEmail] = useState("");
  const [monitorId, setMonitorId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "EMAIL",
          target: email,
          monitorId: monitorId || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to create alert");

      const newAlert = await res.json();
      setAlerts((prev) => [...prev, newAlert]);
      setEmail("");
      setMonitorId("");
      toast.success("Email alert added");
    } catch {
      toast.error("Failed to add alert");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/alerts?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      setAlerts((prev) => prev.filter((a) => a.id !== id));
      toast.success("Alert removed");
    } catch {
      toast.error("Failed to remove alert");
    }
  }

  async function handleToggle(id: string, enabled: boolean) {
    try {
      const res = await fetch("/api/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, enabled: !enabled }),
      });
      if (!res.ok) throw new Error("Failed to update");

      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, enabled: !enabled } : a))
      );
    } catch {
      toast.error("Failed to update alert");
    }
  }

  return (
    <div className="space-y-6">
      {/* Add new email alert */}
      <form onSubmit={handleAdd} className="rounded-2xl border-2 border-blue-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-600" />
          Add Email Alert
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-white border-2 border-blue-400 rounded-lg px-4 py-2.5 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Monitor (optional — leave blank for all)
            </label>
            <select
              value={monitorId}
              onChange={(e) => setMonitorId(e.target.value)}
              className="w-full bg-white border-2 border-blue-400 rounded-lg px-4 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">All monitors</option>
              {monitors.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Alert
          </button>
        </div>
      </form>

      {/* Existing alerts list */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Active Email Alerts
        </h3>

        {alerts.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">
            No email alerts configured yet.
          </p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{alert.target}</p>
                    <p className="text-xs text-slate-500">
                      {alert.monitorId
                        ? monitors.find((m) => m.id === alert.monitorId)?.name ?? "Specific monitor"
                        : "All monitors"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(alert.id, alert.enabled)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      alert.enabled
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {alert.enabled ? "On" : "Off"}
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
