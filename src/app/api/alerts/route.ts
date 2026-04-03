import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  channel: z.enum(["EMAIL", "WEBHOOK", "SLACK"]),
  target: z.string().min(1),
  monitorId: z.string().nullable().optional(),
  alertType: z.enum(["UPTIME", "SSL"]).optional().default("UPTIME"),
});

const updateSchema = z.object({
  id: z.string(),
  enabled: z.boolean(),
});

// GET — list user's alerts
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(alerts);
}

// POST — create a new alert
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const alert = await prisma.alert.create({
    data: {
      userId: session.user.id,
      channel: parsed.data.channel,
      target: parsed.data.target,
      monitorId: parsed.data.monitorId ?? null,
      alertType: parsed.data.alertType,
    },
  });

  return NextResponse.json(alert, { status: 201 });
}

// PATCH — toggle enabled/disabled
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const alert = await prisma.alert.updateMany({
    where: { id: parsed.data.id, userId: session.user.id },
    data: { enabled: parsed.data.enabled },
  });

  if (alert.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

// DELETE — remove an alert
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const result = await prisma.alert.deleteMany({
    where: { id, userId: session.user.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
