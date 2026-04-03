import type { Monitor, Check, Incident, User, SslCheck } from "@prisma/client";

export type MonitorWithCounts = Monitor & {
  _count: { checks: number; incidents: number };
  sslCheck: SslCheck | null;
};

export type MonitorWithChecks = Monitor & {
  checks: Check[];
  incidents: Incident[];
  sslCheck: SslCheck | null;
};

export type UserWithMonitors = User & {
  monitors: Monitor[];
};

export type DashboardStats = {
  total: number;
  up: number;
  down: number;
  checksToday: number;
  openIncidents: number;
};
