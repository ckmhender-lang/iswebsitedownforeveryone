import { NextResponse } from "next/server";
import { checkWebsite } from "@/lib/checker";
import { checkSsl } from "@/lib/ssl-checker";
import { sendAlertEmail, sendSslAlertEmail } from "@/lib/email";
import {
  addCheck,
  getSslCheck,
  listActiveMonitors,
  listMatchingAlerts,
  openIncident,
  resolveOpenIncidents,
  upsertSslCheck,
} from "@/lib/local-store";

function isDown(status: string | null | undefined): boolean {
  return status === "DOWN" || status === "TIMEOUT" || status === "DEGRADED";
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const monitors = listActiveMonitors();
  const due = monitors.filter((monitor) => {
    if (!monitor.lastCheckAt) return true;
    return now.getTime() - monitor.lastCheckAt.getTime() >= monitor.interval * 60 * 1000;
  });

  const results = await Promise.allSettled(
    due.map(async (monitor) => {
      const result = await checkWebsite(monitor.url, monitor.timeout * 1000);
      const wasDown = isDown(monitor.lastStatus);
      const nowDown = isDown(result.status);
      const uptimeStatusChanged = (!wasDown && nowDown) || (wasDown && !nowDown);

      addCheck({
        monitorId: monitor.id,
        status: result.status,
        statusCode: result.statusCode,
        responseTime: result.responseTime,
        errorMessage: result.error,
        checkedAt: now,
      });

      if (nowDown && !wasDown) {
        openIncident(monitor.id, result.error);
      } else if (!nowDown && wasDown) {
        resolveOpenIncidents(monitor.id);
      }

      if (uptimeStatusChanged) {
        const uptimeAlerts = listMatchingAlerts({
          channel: "EMAIL",
          monitorId: monitor.id,
          userId: monitor.userId,
          alertType: "UPTIME",
        });
        await Promise.allSettled(
          uptimeAlerts.map((alert) =>
            sendAlertEmail({
              to: alert.target,
              monitorName: monitor.name,
              monitorUrl: monitor.url,
              status: nowDown ? "DOWN" : "UP",
              checkedAt: now,
              error: result.error,
            })
          )
        );
      }

      const existingSsl = getSslCheck(monitor.id);
      const sslDue =
        !existingSsl ||
        now.getTime() - existingSsl.lastCheckedAt.getTime() >= 12 * 60 * 60 * 1000;

      if (!sslDue) return;

      const sslResult = await checkSsl(monitor.url);
      const previousSslStatus = existingSsl?.status ?? null;

      upsertSslCheck(monitor.id, {
        status: sslResult.status,
        issuer: sslResult.issuer ?? null,
        subject: sslResult.subject ?? null,
        validFrom: sslResult.validFrom ?? null,
        validTo: sslResult.validTo ?? null,
        daysUntilExpiry: sslResult.daysUntilExpiry ?? null,
        error: sslResult.error ?? null,
        lastCheckedAt: now,
      });

      const sslWorsened = sslResult.status !== "VALID" && sslResult.status !== previousSslStatus;
      if (!sslWorsened) return;

      const sslAlerts = listMatchingAlerts({
        channel: "EMAIL",
        monitorId: monitor.id,
        userId: monitor.userId,
        alertType: "SSL",
      });

      await Promise.allSettled(
        sslAlerts.map((alert) =>
          sendSslAlertEmail({
            to: alert.target,
            monitorName: monitor.name,
            monitorUrl: monitor.url,
            sslStatus: sslResult.status as "EXPIRING_SOON" | "EXPIRED" | "ERROR",
            daysUntilExpiry: sslResult.daysUntilExpiry,
            validTo: sslResult.validTo,
            issuer: sslResult.issuer,
            error: sslResult.error,
          })
        )
      );
    })
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  return NextResponse.json({ checked: due.length, succeeded });
}
