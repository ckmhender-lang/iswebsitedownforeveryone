import crypto from "crypto";
import { prisma } from "./prisma";

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createEmailVerificationToken(email: string): Promise<string> {
  const token = generateToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  });

  return token;
}

export async function verifyEmailToken(
  token: string
): Promise<{ success: boolean; error?: string }> {
  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record) return { success: false, error: "Invalid or expired verification link." };
  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return { success: false, error: "This link has expired. Please register again." };
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });
  await prisma.verificationToken.delete({ where: { token } });

  return { success: true };
}

export async function createPasswordResetToken(email: string): Promise<string> {
  const token = generateToken();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h

  await prisma.passwordResetToken.deleteMany({ where: { email } });
  await prisma.passwordResetToken.create({
    data: { email, token, expires },
  });

  return token;
}

export async function validatePasswordResetToken(
  token: string
): Promise<{ valid: boolean; email?: string; error?: string }> {
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!record) return { valid: false, error: "Invalid or expired link." };
  if (record.expires < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } });
    return { valid: false, error: "This link has expired. Please request a new one." };
  }

  return { valid: true, email: record.email };
}
