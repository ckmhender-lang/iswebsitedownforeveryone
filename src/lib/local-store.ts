import crypto from "crypto";

export type CheckStatus = "UP" | "DOWN" | "TIMEOUT" | "DEGRADED";
export type MonitorStatus = "ACTIVE" | "PAUSED" | "DELETED";
export type IncidentStatus = "OPEN" | "RESOLVED";
export type AlertChannel = "EMAIL" | "WEBHOOK" | "SLACK";
export type AlertType = "UPTIME" | "SSL";
export type SslStatus = "VALID" | "EXPIRING_SOON" | "EXPIRED" | "ERROR";

export interface LocalUser {
  id: string;
  name: string | null;
  email: string;
  password: string | null;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalMonitor {
  id: string;
  userId: string;
  name: string;
  url: string;
  interval: number;
  timeout: number;
  status: MonitorStatus;
  lastCheckAt: Date | null;
  lastStatus: CheckStatus | null;
  responseTime: number | null;
  uptime: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalCheck {
  id: string;
  monitorId: string;
  status: CheckStatus;
  responseTime: number | null;
  statusCode: number | null;
  errorMessage: string | null;
  checkedAt: Date;
}

export interface LocalIncident {
  id: string;
  monitorId: string;
  status: IncidentStatus;
  cause: string | null;
  startedAt: Date;
  resolvedAt: Date | null;
}

export interface LocalAlert {
  id: string;
  userId: string;
  monitorId: string | null;
  channel: AlertChannel;
  target: string;
  enabled: boolean;
  alertType: AlertType;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalSslCheck {
  monitorId: string;
  status: SslStatus;
  issuer: string | null;
  subject: string | null;
  validFrom: Date | null;
  validTo: Date | null;
  daysUntilExpiry: number | null;
  error: string | null;
  lastCheckedAt: Date;
}

interface VerificationTokenRecord {
  identifier: string;
  token: string;
  expires: Date;
}

interface PasswordResetTokenRecord {
  email: string;
  token: string;
  expires: Date;
}

interface SessionRecord {
  token: string;
  userId: string;
  expires: Date;
}

type LocalStore = {
  users: LocalUser[];
  monitors: LocalMonitor[];
  checks: LocalCheck[];
  incidents: LocalIncident[];
  alerts: LocalAlert[];
  sslChecks: LocalSslCheck[];
  verificationTokens: VerificationTokenRecord[];
  passwordResetTokens: PasswordResetTokenRecord[];
  sessions: SessionRecord[];
};

const globalStore = globalThis as unknown as { __localStore?: LocalStore };

const store: LocalStore =
  globalStore.__localStore ??
  (globalStore.__localStore = {
    users: [],
    monitors: [],
    checks: [],
    incidents: [],
    alerts: [],
    sslChecks: [],
    verificationTokens: [],
    passwordResetTokens: [],
    sessions: [],
  });

export function generateId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : crypto.randomBytes(16).toString("hex");
}

export function listUsers(): LocalUser[] {
  return [...store.users];
}

export function findUserByEmail(email: string): LocalUser | null {
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function findUserById(id: string): LocalUser | null {
  return store.users.find((u) => u.id === id) ?? null;
}

export function createUser(input: {
  name: string;
  email: string;
  password: string;
  emailVerified?: Date | null;
}): LocalUser {
  const now = new Date();
  const user: LocalUser = {
    id: generateId(),
    name: input.name,
    email: input.email,
    password: input.password,
    emailVerified: input.emailVerified ?? now,
    image: null,
    createdAt: now,
    updatedAt: now,
  };
  store.users.push(user);
  return user;
}

export function updateUserPassword(email: string, hashedPassword: string): boolean {
  const user = findUserByEmail(email);
  if (!user) return false;
  user.password = hashedPassword;
  user.updatedAt = new Date();
  return true;
}

export function createSession(userId: string): string {
  const token = generateId();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  store.sessions.push({ token, userId, expires });
  return token;
}

export function getSessionUser(sessionToken: string | undefined): LocalUser | null {
  if (!sessionToken) return null;
  const session = store.sessions.find((s) => s.token === sessionToken);
  if (!session) return null;
  if (session.expires < new Date()) {
    store.sessions = store.sessions.filter((s) => s.token !== sessionToken);
    return null;
  }
  return findUserById(session.userId);
}

export function deleteSession(sessionToken: string | undefined): void {
  if (!sessionToken) return;
  store.sessions = store.sessions.filter((s) => s.token !== sessionToken);
}

export function createEmailVerificationToken(email: string): string {
  const token = generateId();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  store.verificationTokens = store.verificationTokens.filter((t) => t.identifier !== email);
  store.verificationTokens.push({ identifier: email, token, expires });
  return token;
}

export function verifyEmailToken(token: string): { success: boolean; error?: string } {
  const record = store.verificationTokens.find((t) => t.token === token);
  if (!record) return { success: false, error: "Invalid or expired verification link." };
  if (record.expires < new Date()) {
    store.verificationTokens = store.verificationTokens.filter((t) => t.token !== token);
    return { success: false, error: "This link has expired. Please register again." };
  }

  const user = findUserByEmail(record.identifier);
  if (user) {
    user.emailVerified = new Date();
    user.updatedAt = new Date();
  }
  store.verificationTokens = store.verificationTokens.filter((t) => t.token !== token);
  return { success: true };
}

export function createPasswordResetToken(email: string): string {
  const token = generateId();
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  store.passwordResetTokens = store.passwordResetTokens.filter((t) => t.email !== email);
  store.passwordResetTokens.push({ email, token, expires });
  return token;
}

export function validatePasswordResetToken(
  token: string
): { valid: boolean; email?: string; error?: string } {
  const record = store.passwordResetTokens.find((t) => t.token === token);
  if (!record) return { valid: false, error: "Invalid or expired link." };
  if (record.expires < new Date()) {
    store.passwordResetTokens = store.passwordResetTokens.filter((t) => t.token !== token);
    return { valid: false, error: "This link has expired. Please request a new one." };
  }
  return { valid: true, email: record.email };
}

export function consumePasswordResetToken(token: string): void {
  store.passwordResetTokens = store.passwordResetTokens.filter((t) => t.token !== token);
}

export function listMonitorsForUser(userId: string): LocalMonitor[] {
  return store.monitors
    .filter((m) => m.userId === userId && m.status !== "DELETED")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function listActiveMonitors(): LocalMonitor[] {
  return store.monitors.filter((m) => m.status === "ACTIVE");
}

export function findActiveMonitorByHostname(hostname: string): LocalMonitor | null {
  return (
    store.monitors.find((m) => {
      if (m.status !== "ACTIVE") return false;
      try {
        const monitorHost = new URL(m.url).hostname.replace(/^www\./, "");
        return monitorHost === hostname;
      } catch {
        return false;
      }
    }) ?? null
  );
}

export function countMonitorsForUser(userId: string): number {
  return store.monitors.filter((m) => m.userId === userId && m.status !== "DELETED").length;
}

export function createMonitor(input: {
  userId: string;
  name: string;
  url: string;
  interval: number;
  timeout: number;
}): LocalMonitor {
  const now = new Date();
  const monitor: LocalMonitor = {
    id: generateId(),
    userId: input.userId,
    name: input.name,
    url: input.url,
    interval: input.interval,
    timeout: input.timeout,
    status: "ACTIVE",
    lastCheckAt: null,
    lastStatus: null,
    responseTime: null,
    uptime: null,
    createdAt: now,
    updatedAt: now,
  };
  store.monitors.push(monitor);
  return monitor;
}

export function getMonitorByIdForUser(id: string, userId: string): LocalMonitor | null {
  return (
    store.monitors.find((m) => m.id === id && m.userId === userId && m.status !== "DELETED") ?? null
  );
}

export function updateMonitor(
  id: string,
  data: Partial<Pick<LocalMonitor, "name" | "interval" | "timeout" | "status">>
): LocalMonitor | null {
  const monitor = store.monitors.find((m) => m.id === id);
  if (!monitor) return null;
  Object.assign(monitor, data, { updatedAt: new Date() });
  return monitor;
}

export function deleteMonitorSoft(id: string): boolean {
  const monitor = store.monitors.find((m) => m.id === id);
  if (!monitor) return false;
  monitor.status = "DELETED";
  monitor.updatedAt = new Date();
  return true;
}

export function listChecksForMonitor(monitorId: string, limit?: number): LocalCheck[] {
  const rows = store.checks
    .filter((c) => c.monitorId === monitorId)
    .sort((a, b) => b.checkedAt.getTime() - a.checkedAt.getTime());
  return typeof limit === "number" ? rows.slice(0, limit) : rows;
}

export function listIncidentsForMonitor(monitorId: string, limit?: number): LocalIncident[] {
  const rows = store.incidents
    .filter((i) => i.monitorId === monitorId)
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  return typeof limit === "number" ? rows.slice(0, limit) : rows;
}

export function listMonitorsWithCountsForUser(userId: string): Array<
  LocalMonitor & { _count: { checks: number; incidents: number }; sslCheck: LocalSslCheck | null }
> {
  return listMonitorsForUser(userId).map((monitor) => ({
    ...monitor,
    _count: {
      checks: store.checks.filter((c) => c.monitorId === monitor.id).length,
      incidents: store.incidents.filter((i) => i.monitorId === monitor.id).length,
    },
    sslCheck: getSslCheck(monitor.id),
  }));
}

export function getMonitorWithDetailsForUser(
  monitorId: string,
  userId: string
): (LocalMonitor & {
  checks: LocalCheck[];
  incidents: LocalIncident[];
  sslCheck: LocalSslCheck | null;
}) | null {
  const monitor = getMonitorByIdForUser(monitorId, userId);
  if (!monitor) return null;
  return {
    ...monitor,
    checks: listChecksForMonitor(monitor.id, 100),
    incidents: listIncidentsForMonitor(monitor.id, 20),
    sslCheck: getSslCheck(monitor.id),
  };
}

function recomputeUptime(monitorId: string): number | null {
  const checks = store.checks.filter((c) => c.monitorId === monitorId);
  if (checks.length === 0) return null;
  const upCount = checks.filter((c) => c.status === "UP").length;
  return (upCount / checks.length) * 100;
}

export function addCheck(input: {
  monitorId: string;
  status: CheckStatus;
  statusCode?: number;
  responseTime?: number;
  errorMessage?: string;
  checkedAt?: Date;
}): LocalCheck {
  const check: LocalCheck = {
    id: generateId(),
    monitorId: input.monitorId,
    status: input.status,
    statusCode: input.statusCode ?? null,
    responseTime: input.responseTime ?? null,
    errorMessage: input.errorMessage ?? null,
    checkedAt: input.checkedAt ?? new Date(),
  };
  store.checks.push(check);

  const monitor = store.monitors.find((m) => m.id === input.monitorId);
  if (monitor) {
    monitor.lastCheckAt = check.checkedAt;
    monitor.lastStatus = check.status;
    monitor.responseTime = check.responseTime;
    monitor.uptime = recomputeUptime(monitor.id);
    monitor.updatedAt = new Date();
  }
  return check;
}

export function openIncident(monitorId: string, cause?: string): LocalIncident {
  const incident: LocalIncident = {
    id: generateId(),
    monitorId,
    status: "OPEN",
    cause: cause ?? null,
    startedAt: new Date(),
    resolvedAt: null,
  };
  store.incidents.push(incident);
  return incident;
}

export function resolveOpenIncidents(monitorId: string): number {
  let count = 0;
  for (const incident of store.incidents) {
    if (incident.monitorId === monitorId && incident.status === "OPEN") {
      incident.status = "RESOLVED";
      incident.resolvedAt = new Date();
      count++;
    }
  }
  return count;
}

export function countChecksForUserSince(userId: string, since: Date): number {
  const userMonitorIds = new Set(
    store.monitors.filter((m) => m.userId === userId).map((m) => m.id)
  );
  return store.checks.filter((c) => userMonitorIds.has(c.monitorId) && c.checkedAt >= since).length;
}

export function countOpenIncidentsForUser(userId: string): number {
  const userMonitorIds = new Set(
    store.monitors.filter((m) => m.userId === userId).map((m) => m.id)
  );
  return store.incidents.filter((i) => userMonitorIds.has(i.monitorId) && i.status === "OPEN").length;
}

export function listAlertsForUser(userId: string): LocalAlert[] {
  return store.alerts
    .filter((a) => a.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function createAlert(input: {
  userId: string;
  channel: AlertChannel;
  target: string;
  monitorId?: string | null;
  alertType?: AlertType;
}): LocalAlert {
  const now = new Date();
  const alert: LocalAlert = {
    id: generateId(),
    userId: input.userId,
    channel: input.channel,
    target: input.target,
    monitorId: input.monitorId ?? null,
    alertType: input.alertType ?? "UPTIME",
    enabled: true,
    createdAt: now,
    updatedAt: now,
  };
  store.alerts.push(alert);
  return alert;
}

export function updateAlertEnabled(id: string, userId: string, enabled: boolean): boolean {
  const alert = store.alerts.find((a) => a.id === id && a.userId === userId);
  if (!alert) return false;
  alert.enabled = enabled;
  alert.updatedAt = new Date();
  return true;
}

export function deleteAlert(id: string, userId: string): boolean {
  const before = store.alerts.length;
  store.alerts = store.alerts.filter((a) => !(a.id === id && a.userId === userId));
  return store.alerts.length !== before;
}

export function listMatchingAlerts(input: {
  monitorId: string;
  userId: string;
  channel: AlertChannel;
  alertType: AlertType;
}): LocalAlert[] {
  return store.alerts.filter(
    (a) =>
      a.channel === input.channel &&
      a.alertType === input.alertType &&
      a.enabled &&
      a.userId === input.userId &&
      (a.monitorId === input.monitorId || a.monitorId === null)
  );
}

export function getSslCheck(monitorId: string): LocalSslCheck | null {
  return store.sslChecks.find((s) => s.monitorId === monitorId) ?? null;
}

export function upsertSslCheck(
  monitorId: string,
  data: Omit<LocalSslCheck, "monitorId">
): LocalSslCheck {
  const existing = store.sslChecks.find((s) => s.monitorId === monitorId);
  if (existing) {
    Object.assign(existing, data);
    return existing;
  }
  const created: LocalSslCheck = { monitorId, ...data };
  store.sslChecks.push(created);
  return created;
}
