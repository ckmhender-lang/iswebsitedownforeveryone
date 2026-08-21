import { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getMonitorWithDetailsForUser } from "@/lib/local-store";
import { MonitorDetail } from "@/components/monitors/monitor-detail";

export const metadata: Metadata = { title: "Monitor Detail" };

export default async function MonitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const monitor = getMonitorWithDetailsForUser(id, userId);

  if (!monitor) notFound();

  return <MonitorDetail monitor={monitor} />;
}
