import {
  createEmailVerificationToken as createEmailVerificationTokenInStore,
  createPasswordResetToken as createPasswordResetTokenInStore,
  validatePasswordResetToken as validatePasswordResetTokenInStore,
  verifyEmailToken as verifyEmailTokenInStore,
} from "./local-store";

export async function createEmailVerificationToken(email: string): Promise<string> {
  return createEmailVerificationTokenInStore(email);
}

export async function verifyEmailToken(
  token: string
): Promise<{ success: boolean; error?: string }> {
  return verifyEmailTokenInStore(token);
}

export async function createPasswordResetToken(email: string): Promise<string> {
  return createPasswordResetTokenInStore(email);
}

export async function validatePasswordResetToken(
  token: string
): Promise<{ valid: boolean; email?: string; error?: string }> {
  return validatePasswordResetTokenInStore(token);
}
