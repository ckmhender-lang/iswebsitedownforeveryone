import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { findUserByEmail } from "@/lib/local-store";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const { email } = schema.parse(await req.json());

    // Always return success to avoid leaking whether an email exists
    const user = findUserByEmail(email);
    if (user && user.password) {
      const token = await createPasswordResetToken(email);
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      try {
        await sendPasswordResetEmail({
          to: email,
          name: user.name ?? email,
          resetUrl: `${appUrl}/reset-password?token=${token}`,
        });
      } catch {
        console.info(`Local reset token for ${email}: ${appUrl}/reset-password?token=${token}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
