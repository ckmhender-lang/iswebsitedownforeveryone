import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  interval: z.number().int().min(1).max(1440).optional(),
  timeout: z.number().int().min(5).max(60).optional(),
  status: z.enum(["ACTIVE", "PAUSED"]).optional(),
});

async function getMonitor(id: string, userId: string) {
  return prisma.monitor.findFirst({
    where: { id, userId, status: { not: "DELETED" } },
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const monitor = await getMonitor(id, session.user!.id as string);
  if (!monitor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(monitor);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const monitor = await getMonitor(id, session.user!.id as string);
  if (!monitor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);
    const updated = await prisma.monitor.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const monitor = await getMonitor(id, session.user!.id as string);
  if (!monitor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.monitor.update({ where: { id }, data: { status: "DELETED" } });
  return NextResponse.json({ success: true });
}
