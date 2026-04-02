import type { Monitor, Check, Incident, User } from "@prisma/client";

export type MonitorWithCounts = Monitor & {
  _count: { checks: number; incidents: number };
};

export type MonitorWithChecks = Monitor & {
  checks: Check[];
  incidents: Incident[];
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
