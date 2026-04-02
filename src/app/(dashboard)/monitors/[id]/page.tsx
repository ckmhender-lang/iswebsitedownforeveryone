import { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MonitorDetail } from "@/components/monitors/monitor-detail";

export const metadata: Metadata = { title: "Monitor Detail" };

export default async function MonitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user!.id as string;

  const monitor = await prisma.monitor.findFirst({
    where: { id, userId },
    include: {
      checks: {
        orderBy: { checkedAt: "desc" },
        take: 100,
      },
      incidents: {
        orderBy: { startedAt: "desc" },
        take: 20,
      },
    },
  });

  if (!monitor) notFound();

  return <MonitorDetail monitor={monitor} />;
}
