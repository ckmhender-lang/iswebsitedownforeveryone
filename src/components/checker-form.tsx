"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Loader2, Globe } from "lucide-react";

interface CheckResult {
  url: string;
  status: "UP" | "DOWN" | "ERROR";
  statusCode?: number;
  responseTime?: number;
  error?: string;
  checkedAt: string;
}

export function CheckerForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState("");

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      let target = url.trim();
      if (!/^https?:\/\//.test(target)) {
        target = "https://" + target;
      }

      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });

      if (!res.ok) throw new Error("Check failed");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Failed to check. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleCheck} className="flex gap-3">
        <div className="relative flex-1">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL (e.g. github.com)"
            className="w-full bg-white border-2 border-blue-400 rounded-xl pl-12 pr-4 py-4 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-xl transition-colors flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Check Now"
          )}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-400 text-sm">{error}</p>
      )}

      {result && (
        <div className={`mt-6 rounded-2xl border-2 p-6 shadow-lg transition-all ${
          result.status === "UP"
            ? "border-green-400 bg-green-50"
            : "border-red-400 bg-red-50"
        }`}>
          <div className="flex items-center gap-4">
            {result.status === "UP" ? (
              <CheckCircle2 className="h-10 w-10 text-green-500 flex-shrink-0" />
            ) : (
              <XCircle className="h-10 w-10 text-red-500 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-xl font-bold ${result.status === "UP" ? "text-green-700" : "text-red-700"}`}>
                {result.status === "UP"
                  ? "✅ Website is UP!"
                  : "❌ Website is DOWN!"}
              </p>
              <p className="text-slate-500 text-sm truncate">{result.url}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {result.statusCode && (
              <div className={`rounded-xl p-3 border ${result.status === "UP" ? "bg-green-100 border-green-200" : "bg-red-100 border-red-200"}`}>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">HTTP Status</p>
                <p className={`text-lg font-semibold ${result.status === "UP" ? "text-green-800" : "text-red-800"}`}>{result.statusCode}</p>
              </div>
            )}
            {result.responseTime && (
              <div className={`rounded-xl p-3 border ${result.status === "UP" ? "bg-green-100 border-green-200" : "bg-red-100 border-red-200"}`}>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Response Time</p>
                <p className={`text-lg font-semibold flex items-center gap-1 ${result.status === "UP" ? "text-green-800" : "text-red-800"}`}>
                  <Clock className="h-4 w-4 text-slate-500" />
                  {result.responseTime}ms
                </p>
              </div>
            )}
            <div className={`rounded-xl p-3 border ${result.status === "UP" ? "bg-green-100 border-green-200" : "bg-red-100 border-red-200"}`}>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Checked At</p>
              <p className={`text-sm font-semibold ${result.status === "UP" ? "text-green-800" : "text-red-800"}`}>
                {new Date(result.checkedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {result.error && (
            <p className="mt-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg p-3">
              {result.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
