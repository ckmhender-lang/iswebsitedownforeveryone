"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Clock, Loader2, Globe, ArrowUp, ArrowDown, Lock, Unlock, ShieldCheck, Activity } from "lucide-react";

interface CheckResult {
  url: string;
  status: "UP" | "DOWN" | "TIMEOUT" | "DEGRADED";
  statusCode?: number;
  responseTime?: number;
  error?: string;
  checkedAt: string;
  uptime?: number | null;
  ssl?: {
    status: "VALID" | "EXPIRING_SOON" | "EXPIRED" | "ERROR";
    issuer?: string;
    subject?: string;
    validFrom?: string;
    validTo?: string;
    daysUntilExpiry?: number;
    error?: string;
  } | null;
}

interface PopularSite {
  name: string;
  domain: string;
  status: "UP" | "DOWN";
  responseTime: number;
}

export function CheckerForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState("");

  const [popularSites, setPopularSites] = useState<PopularSite[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);

  useEffect(() => {
    async function loadPopular() {
      try {
        const res = await fetch("/api/popular");
        if (res.ok) {
          setPopularSites(await res.json());
        }
      } catch {
        // ignore
      } finally {
        setLoadingPopular(false);
      }
    }
    loadPopular();
  }, []);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = value.trim();
    if (!trimmed || trimmed.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggestions?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
        setShowDropdown((data.suggestions ?? []).length > 0);
        setActiveIndex(-1);
      } catch {
        // ignore
      }
    }, 180);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUrl(e.target.value);
    fetchSuggestions(e.target.value);
  }

  async function runCheck(target: string) {
    setShowDropdown(false);
    setLoading(true);
    setError("");
    setResult(null);
    try {
      let normalized = target.trim();
      if (!/^https?:\/\//.test(normalized)) normalized = "https://" + normalized;
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized }),
      });
      if (!res.ok) throw new Error("Check failed");
      setResult(await res.json());
    } catch {
      setError("Failed to check. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function selectSuggestion(domain: string) {
    setUrl(domain);
    setSuggestions([]);
    setShowDropdown(false);
    setActiveIndex(-1);
    runCheck(domain);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  }

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    await runCheck(url);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleCheck} className="flex gap-3">
        <div className="relative flex-1" ref={wrapperRef}>
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10 pointer-events-none hidden" />
          {/* Logo in textbox */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none w-6 h-6 flex-shrink-0">
            <Image src="/logo.svg" alt="Logo" width={24} height={24} className="absolute inset-0" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <ArrowUp className="h-2.5 w-2.5 text-green-500 -mb-0.5 drop-shadow" strokeWidth={3} />
              <ArrowDown className="h-2.5 w-2.5 text-red-500 -mt-0.5 drop-shadow" strokeWidth={3} />
            </div>
          </div>
          <input
            type="text"
            value={url}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            placeholder="Enter URL (e.g. github.com)"
            autoComplete="off"
            className="w-full bg-white border-2 border-blue-400 rounded-xl pl-11 pr-4 py-4 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
          />

          {showDropdown && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
              {suggestions.map((s, i) => (
                <li
                  key={s}
                  onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s); }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer text-sm transition-colors ${
                    i === activeIndex
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-50"
                  } ${i < suggestions.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <Globe className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="font-medium">{s}</span>
                </li>
              ))}
            </ul>
          )}
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
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-300 text-left">
          {/* Card Top Banner / Status summary */}
          <div className={`px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${
            result.status === "UP" ? "bg-emerald-50/50 border-emerald-100" : "bg-rose-50/50 border-rose-100"
          }`}>
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  result.status === "UP" ? "bg-emerald-400" : "bg-rose-400"
                }`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${
                  result.status === "UP" ? "bg-emerald-500" : "bg-rose-500"
                }`}></span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 tracking-tight">
                  {result.url.replace(/^https?:\/\/(www\.)?/, "")}
                </h3>
                <p className="text-xs text-slate-400">
                  Checked at {new Date(result.checkedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm border ${
              result.status === "UP"
                ? "bg-emerald-500/10 text-emerald-700 border-emerald-200/50"
                : "bg-rose-500/10 text-rose-700 border-rose-200/50"
            }`}>
              {result.status === "UP" ? "ONLINE" : "OFFLINE"}
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* HTTP Status */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-4 hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Code</span>
              </div>
              <p className={`text-xl font-extrabold tracking-tight ${result.status === "UP" ? "text-emerald-600" : "text-rose-600"}`}>
                {result.statusCode ?? "ERR"}
              </p>
              <p className="text-xs text-slate-505 mt-1">
                {result.status === "UP" ? "HTTP connection successful" : "Server connection failed"}
              </p>
            </div>

            {/* Response Time */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-4 hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Response Speed</span>
              </div>
              <p className="text-xl font-extrabold text-slate-800 tracking-tight">
                {result.responseTime ? `${result.responseTime} ms` : "N/A"}
              </p>
              <p className="text-xs text-slate-505 mt-1">
                {result.responseTime && result.responseTime < 300
                  ? "⚡ Extremely fast response"
                  : result.responseTime && result.responseTime < 1000
                  ? "⏱ Normal response time"
                  : "⏳ Slow response time"}
              </p>
            </div>

            {/* Uptime */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-4 hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Uptime History</span>
              </div>
              <p className="text-xl font-extrabold text-slate-800 tracking-tight">
                {result.uptime !== null && result.uptime !== undefined
                  ? `${result.uptime.toFixed(2)}%`
                  : "100.0%"}
              </p>
              <p className="text-xs text-slate-505 mt-1">
                {result.uptime !== null && result.uptime !== undefined
                  ? "📈 Based on 24/7 monitoring"
                  : "ℹ Not actively monitored yet"}
              </p>
            </div>

            {/* SSL Check */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-4 hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                {result.ssl?.status === "VALID" || result.ssl?.status === "EXPIRING_SOON" ? (
                  <Lock className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Unlock className="h-4 w-4 text-rose-500" />
                )}
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SSL Security</span>
              </div>
              <p className={`text-xl font-extrabold tracking-tight ${
                result.ssl?.status === "VALID"
                  ? "text-emerald-600"
                  : result.ssl?.status === "EXPIRING_SOON"
                  ? "text-yellow-600"
                  : "text-rose-600"
              }`}>
                {result.ssl?.status === "VALID"
                  ? "SSL Secure"
                  : result.ssl?.status === "EXPIRING_SOON"
                  ? "Expiring Soon"
                  : result.ssl?.status === "EXPIRED"
                  ? "Expired"
                  : "No SSL"}
              </p>
              <p className="text-xs text-slate-505 mt-1 truncate">
                {result.ssl?.daysUntilExpiry !== undefined
                  ? `${result.ssl.daysUntilExpiry} days remaining`
                  : result.ssl?.error ?? "Insecure connection / HTTP"}
              </p>
            </div>

          </div>

          {/* Description summary */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
            {result.status === "UP" ? (
              <span>
                <strong>{result.url.replace(/^https?:\/\/(www\.)?/, "")}</strong> is up and responsive. 
                {result.responseTime ? ` The server responded in ${result.responseTime}ms.` : ""} 
                {result.ssl?.status === "VALID" ? " The SSL certificate is valid and secure." : ""}
              </span>
            ) : (
              <span>
                <strong>{result.url.replace(/^https?:\/\/(www\.)?/, "")}</strong> is currently down or unreachable. 
                {result.error ? ` Connection failed with error: "${result.error}".` : ""}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Popular Websites Status Section */}
      <div className="mt-12 text-left">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
          Popular Websites Status
        </h3>
        
        {loadingPopular ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl border border-slate-100 bg-white/50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {popularSites.map((site) => (
              <button
                key={site.domain}
                onClick={() => selectSuggestion(site.domain)}
                className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-400 hover:shadow-md transition group text-left w-full"
              >
                <img
                  src={`https://www.google.com/s2/favicons?sz=32&domain=${site.domain}`}
                  alt={site.name}
                  width={20}
                  height={20}
                  className="rounded-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs text-slate-800 truncate">
                      {site.name}
                    </span>
                    <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                      {site.status === "UP" && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                        site.status === "UP" ? "bg-emerald-500" : "bg-rose-500"
                      }`}></span>
                    </span>
                  </div>
                  <p className="text-xxs text-slate-450 truncate">
                    {site.status === "UP" ? `${site.responseTime}ms` : "Offline"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
