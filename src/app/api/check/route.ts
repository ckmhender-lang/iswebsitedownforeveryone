import { NextRequest, NextResponse } from "next/server";
import { checkWebsite } from "@/lib/checker";
import { z } from "zod";

const schema = z.object({
  url: z.string().url("Invalid URL"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = schema.parse(body);

    const result = await checkWebsite(url);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}
