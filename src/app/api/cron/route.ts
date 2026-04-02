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

  const monitors = await prisma.monitor.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { lastCheckAt: null },
        {
          lastCheckAt: {
            lt: new Date(now.getTime() - 60000), // at least 1 min ago
          },
        },
      ],
    },
    take: 50,
  });

  const results = await Promise.allSettled(
    monitors.map(async (monitor) => {
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

      // Handle incidents + send email alerts
      const statusChanged =
        (result.status === "DOWN" && monitor.lastStatus !== "DOWN") ||
        (result.status === "UP" && monitor.lastStatus === "DOWN");

      if (result.status === "DOWN" && monitor.lastStatus !== "DOWN") {
        await prisma.incident.create({
          data: { monitorId: monitor.id, cause: result.error },
        });
      } else if (result.status === "UP" && monitor.lastStatus === "DOWN") {
        await prisma.incident.updateMany({
          where: { monitorId: monitor.id, status: "OPEN" },
          data: { status: "RESOLVED", resolvedAt: now },
        });
      }

      // Send email alerts on status change
      if (statusChanged && (result.status === "DOWN" || result.status === "UP")) {
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
              status: result.status as "DOWN" | "UP",
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
  return NextResponse.json({ checked: monitors.length, succeeded });
}
