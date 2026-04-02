import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url(),
  interval: z.number().int().min(1).max(1440).default(5),
  timeout: z.number().int().min(5).max(60).default(30),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const monitors = await prisma.monitor.findMany({
    where: { userId: session.user!.id as string, status: { not: "DELETED" } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(monitors);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const count = await prisma.monitor.count({
      where: { userId: session.user!.id as string, status: { not: "DELETED" } },
    });

    if (count >= 10) {
      return NextResponse.json(
        { error: "Free plan limit: 10 monitors" },
        { status: 403 }
      );
    }

    const monitor = await prisma.monitor.create({
      data: { ...data, userId: session.user!.id as string },
    });

    // Auto-create an email alert for the monitor owner so they receive notifications
    const user = await prisma.user.findUnique({
      where: { id: session.user!.id as string },
      select: { email: true },
    });
    if (user?.email) {
      await prisma.alert.create({
        data: {
          userId: session.user!.id as string,
          monitorId: monitor.id,
          channel: "EMAIL",
          target: user.email,
        },
      });
    }

    return NextResponse.json(monitor, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create monitor" }, { status: 500 });
  }
}
