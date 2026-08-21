import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMonitorByIdForUser, getSslCheck, upsertSslCheck } from "@/lib/local-store";
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

  const monitor = getMonitorByIdForUser(monitorId, session.user.id);

  if (!monitor) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  return NextResponse.json(getSslCheck(monitor.id));
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

  const monitor = getMonitorByIdForUser(monitorId, session.user.id);

  if (!monitor) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  const result = await checkSsl(monitor.url);

  const sslCheck = upsertSslCheck(monitorId, {
    status: result.status,
    issuer: result.issuer ?? null,
    subject: result.subject ?? null,
    validFrom: result.validFrom ?? null,
    validTo: result.validTo ?? null,
    daysUntilExpiry: result.daysUntilExpiry ?? null,
    error: result.error ?? null,
    lastCheckedAt: new Date(),
  });

  return NextResponse.json(sslCheck);
}
