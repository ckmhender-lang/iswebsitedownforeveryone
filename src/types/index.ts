import type { LocalCheck, LocalIncident, LocalMonitor, LocalSslCheck, LocalUser } from "@/lib/local-store";

export type MonitorWithCounts = LocalMonitor & {
  _count: { checks: number; incidents: number };
  sslCheck: LocalSslCheck | null;
};

export type MonitorWithChecks = LocalMonitor & {
  checks: LocalCheck[];
  incidents: LocalIncident[];
  sslCheck: LocalSslCheck | null;
};

export type UserWithMonitors = LocalUser & {
  monitors: LocalMonitor[];
};

export type DashboardStats = {
  total: number;
  up: number;
  down: number;
  checksToday: number;
  openIncidents: number;
};
