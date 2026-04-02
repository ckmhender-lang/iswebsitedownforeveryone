import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createEmailVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const { email } = schema.parse(await req.json());

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to avoid leaking whether email exists
    if (!user || user.emailVerified) {
      return NextResponse.json({ success: true });
    }

    const token = await createEmailVerificationToken(email);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    await sendVerificationEmail({
      to: email,
      name: user.name ?? "there",
      verifyUrl: `${appUrl}/verify-email?token=${token}`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to resend" }, { status: 500 });
  }
}
