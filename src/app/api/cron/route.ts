import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkWebsite } from "@/lib/checker";
import { sendAlertEmail } from "@/lib/email";

// Called by Vercel Cron or an external scheduler
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Fetch all active monitors that have never been checked OR were checked a while ago
  // We over-fetch and then filter by each monitor's individual interval below
  const monitors = await prisma.monitor.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { lastCheckAt: null },
        { lastCheckAt: { lt: new Date(now.getTime() - 60 * 1000) } },
      ],
    },
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
      const statusChanged = (!wasDown && nowDown) || (wasDown && !nowDown);

      // Open incident on first DOWN/TIMEOUT/DEGRADED
      if (nowDown && !wasDown) {
        await prisma.incident.create({
          data: { monitorId: monitor.id, cause: result.error },
        });
      } else if (!nowDown && wasDown) {
        // Resolve open incidents when site recovers
        await prisma.incident.updateMany({
          where: { monitorId: monitor.id, status: "OPEN" },
          data: { status: "RESOLVED", resolvedAt: now },
        });
      }

      // Send email alerts on status change (down or recovery)
      if (statusChanged) {
        const alerts = await prisma.alert.findMany({
          where: {
            channel: "EMAIL",
            enabled: true,
            OR: [
              { monitorId: monitor.id },
              { monitorId: null, userId: monitor.userId },
            ],
          },
        });

        await Promise.allSettled(
          alerts.map((alert) =>
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
    })
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  return NextResponse.json({ checked: due.length, succeeded });
}

