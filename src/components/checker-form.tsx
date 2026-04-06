"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { CheckCircle2, XCircle, Clock, Loader2, Globe, ArrowUp, ArrowDown } from "lucide-react";

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
