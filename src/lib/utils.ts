import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatResponseTime(ms: number | null | undefined): string {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatUptime(uptime: number | null | undefined): string {
  if (uptime == null) return "—";
  return `${uptime.toFixed(2)}%`;
}

export function getStatusColor(status: string | null | undefined) {
  switch (status) {
    case "UP": return "text-green-400";
    case "DOWN": return "text-red-400";
    case "DEGRADED": return "text-yellow-400";
    case "TIMEOUT": return "text-orange-400";
    default: return "text-slate-400";
  }
}

export function getStatusBg(status: string | null | undefined) {
  switch (status) {
    case "UP": return "bg-green-500/10 text-green-400 border-green-500/20";
    case "DOWN": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "DEGRADED": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "TIMEOUT": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}
