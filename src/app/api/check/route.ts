import { NextRequest, NextResponse } from "next/server";
import { checkWebsite } from "@/lib/checker";
import { checkSsl } from "@/lib/ssl-checker";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  url: z.string().url("Invalid URL"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = schema.parse(body);

    // Run website connectivity check
    const result = await checkWebsite(url);

    // Run SSL check if it is HTTPS
    let sslResult = null;
    if (url.startsWith("https://")) {
      try {
        sslResult = await checkSsl(url);
      } catch (sslErr) {
        console.error("SSL Check failed:", sslErr);
      }
    }

    // Lookup existing monitor database record to extract uptime percentage
    let uptime = null;
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.replace(/^www\./, "");
      const monitor = await prisma.monitor.findFirst({
        where: {
          url: {
            contains: hostname,
          },
          status: "ACTIVE",
        },
        select: {
          uptime: true,
        },
      });
      if (monitor) {
        uptime = monitor.uptime;
      }
    } catch (dbErr) {
      console.error("Database query failed:", dbErr);
    }

    return NextResponse.json({
      ...result,
      ssl: sslResult,
      uptime,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}
