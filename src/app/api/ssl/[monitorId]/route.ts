import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkSsl } from "@/lib/ssl-checker";

// GET — return current SSL info for a monitor
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ monitorId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { monitorId } = await params;

  const monitor = await prisma.monitor.findFirst({
    where: { id: monitorId, userId: session.user.id as string },
    include: { sslCheck: true },
  });

  if (!monitor) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  return NextResponse.json(monitor.sslCheck ?? null);
}

// POST — force-refresh SSL check for a monitor
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ monitorId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { monitorId } = await params;

  const monitor = await prisma.monitor.findFirst({
    where: { id: monitorId, userId: session.user.id as string },
  });

  if (!monitor) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  const result = await checkSsl(monitor.url);

  const sslCheck = await prisma.sslCheck.upsert({
    where: { monitorId },
    create: {
      monitorId,
      status: result.status,
      issuer: result.issuer,
      subject: result.subject,
      validFrom: result.validFrom,
      validTo: result.validTo,
      daysUntilExpiry: result.daysUntilExpiry,
      error: result.error,
      lastCheckedAt: new Date(),
    },
    update: {
      status: result.status,
      issuer: result.issuer,
      subject: result.subject,
      validFrom: result.validFrom,
      validTo: result.validTo,
      daysUntilExpiry: result.daysUntilExpiry,
      error: result.error,
      lastCheckedAt: new Date(),
    },
  });

  return NextResponse.json(sslCheck);
}
