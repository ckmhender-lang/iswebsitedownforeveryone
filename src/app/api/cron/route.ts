import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkWebsite } from "@/lib/checker";
import { checkSsl } from "@/lib/ssl-checker";
import { sendAlertEmail, sendSslAlertEmail } from "@/lib/email";

// Called by Vercel Cron or an external scheduler
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const monitors = await prisma.monitor.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { lastCheckAt: null },
        { lastCheckAt: { lt: new Date(now.getTime() - 60 * 1000) } },
      ],
    },
    include: { sslCheck: true },
    take: 50,
  });

  // Respect each monitor's configured interval (in minutes)
  const due = monitors.filter((m) => {
    if (!m.lastCheckAt) return true;
    return now.getTime() - m.lastCheckAt.getTime() >= m.interval * 60 * 1000;
  });

  const isDown = (s: string) => s === "DOWN" || s === "TIMEOUT" || s === "DEGRADED";

  const results = await Promise.allSettled(
    due.map(async (monitor) => {
      // ── Uptime check ──────────────────────────────────────────
      const result = await checkWebsite(monitor.url, monitor.timeout * 1000);

      await prisma.check.create({
        data: {
          monitorId: monitor.id,
          status: result.status,
          statusCode: result.statusCode,
          responseTime: result.responseTime,
          errorMessage: result.error,
        },
      });

      const wasDown = isDown(monitor.lastStatus ?? "");
      const nowDown = isDown(result.status);
      const uptimeStatusChanged = (!wasDown && nowDown) || (wasDown && !nowDown);

      if (nowDown && !wasDown) {
        await prisma.incident.create({
          data: { monitorId: monitor.id, cause: result.error },
        });
      } else if (!nowDown && wasDown) {
        await prisma.incident.updateMany({
          where: { monitorId: monitor.id, status: "OPEN" },
          data: { status: "RESOLVED", resolvedAt: now },
        });
      }

      if (uptimeStatusChanged) {
        const uptimeAlerts = await prisma.alert.findMany({
          where: {
            channel: "EMAIL",
            enabled: true,
            alertType: "UPTIME",
            OR: [
              { monitorId: monitor.id },
              { monitorId: null, userId: monitor.userId },
            ],
          },
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

      await prisma.monitor.update({
        where: { id: monitor.id },
        data: {
          lastCheckAt: now,
          lastStatus: result.status,
          responseTime: result.responseTime ?? undefined,
        },
      });

      // ── SSL check (at most once every 12h per monitor) ────────
      const sslLastChecked = monitor.sslCheck?.lastCheckedAt;
      const sslDue =
        !sslLastChecked ||
        now.getTime() - sslLastChecked.getTime() >= 12 * 60 * 60 * 1000;

      if (sslDue) {
        const sslResult = await checkSsl(monitor.url);
        const previousSslStatus = monitor.sslCheck?.status ?? null;

        await prisma.sslCheck.upsert({
          where: { monitorId: monitor.id },
          create: {
            monitorId: monitor.id,
            status: sslResult.status,
            issuer: sslResult.issuer,
            subject: sslResult.subject,
            validFrom: sslResult.validFrom,
            validTo: sslResult.validTo,
            daysUntilExpiry: sslResult.daysUntilExpiry,
            error: sslResult.error,
            lastCheckedAt: now,
          },
          update: {
            status: sslResult.status,
            issuer: sslResult.issuer,
            subject: sslResult.subject,
            validFrom: sslResult.validFrom,
            validTo: sslResult.validTo,
            daysUntilExpiry: sslResult.daysUntilExpiry,
            error: sslResult.error,
            lastCheckedAt: now,
          },
        });

        // Fire SSL alert when status worsens (VALID→EXPIRING_SOON, VALID/EXPIRING→EXPIRED, or new ERROR)
        const sslWorsened =
          sslResult.status !== "VALID" && sslResult.status !== previousSslStatus;

        if (sslWorsened) {
          const sslAlerts = await prisma.alert.findMany({
            where: {
              channel: "EMAIL",
              enabled: true,
              alertType: "SSL",
              OR: [
                { monitorId: monitor.id },
                { monitorId: null, userId: monitor.userId },
              ],
            },
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
        }
      }
    })
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  return NextResponse.json({ checked: due.length, succeeded });
}

