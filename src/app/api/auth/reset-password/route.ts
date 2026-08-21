import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { validatePasswordResetToken } from "@/lib/tokens";
import { consumePasswordResetToken, updateUserPassword } from "@/lib/local-store";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const { token, password } = schema.parse(await req.json());

    const result = await validatePasswordResetToken(token);
    if (!result.valid || !result.email) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const updated = updateUserPassword(result.email, hashed);
    if (!updated) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    consumePasswordResetToken(token);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Password reset failed" }, { status: 500 });
  }
}
