import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createEmailVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = schema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Try to send verification email. If sending fails (e.g. unverified Resend
    // domain), auto-verify the user so they are never locked out.
    let emailSent = false;
    let verificationToken: string | null = null;
    try {
      verificationToken = await createEmailVerificationToken(email);
      emailSent = true;
    } catch (tokenErr) {
      console.error("Failed to create verification token:", tokenErr);
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        // Auto-verify immediately if we couldn't even create a token
        emailVerified: verificationToken ? null : new Date(),
      },
    });

    if (verificationToken) {
      try {
        await sendVerificationEmail({
          to: email,
          name,
          verifyUrl: `${appUrl}/verify-email?token=${verificationToken}`,
        });
      } catch (mailErr) {
        console.error("Verification email failed to send:", mailErr);
        // Auto-verify so the user is not permanently locked out
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
        emailSent = false;
      }
    }

    return NextResponse.json({ success: true, emailSent }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
