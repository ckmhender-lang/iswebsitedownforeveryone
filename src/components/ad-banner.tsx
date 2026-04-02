"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "leaderboard" | "banner";
  className?: string;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const isDev = process.env.NODE_ENV === "development";
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-9067245339941132";

export function AdBanner({ slot, format = "auto", className = "", label = "Advertisement" }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (isDev || pushed.current) return;

    const el = containerRef.current;
    if (!el) return;

    const tryPush = () => {
      if (pushed.current) return;
      // Only push once the container has a real painted width
      if (el.offsetWidth === 0) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        // adsbygoogle not ready yet — ResizeObserver will retry
      }
    };

    // Try immediately in case it already has width
    tryPush();

    if (!pushed.current) {
      // Watch for the element to gain width (e.g. after layout paint)
      const ro = new ResizeObserver(() => {
        tryPush();
        if (pushed.current) ro.disconnect();
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, []);

  if (isDev) {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">{label}</span>
        <div className="w-full h-[90px] rounded-xl border-2 border-dashed border-slate-300 bg-slate-100/60 flex items-center justify-center text-slate-400 text-sm gap-2">
          <span className="text-lg">📢</span>
          <span>AdSense — slot: <code className="font-mono text-xs">{slot}</code></span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`flex flex-col items-center gap-1 w-full ${className}`}>
      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">{label}</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "90px" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
