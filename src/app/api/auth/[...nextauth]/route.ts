import { NextResponse } from "next/server";

function disabled() {
  return NextResponse.json(
    { error: "NextAuth is disabled in local-only mode. Use /api/auth/login instead." },
    { status: 410 }
  );
}

export const GET = disabled;
export const POST = disabled;
