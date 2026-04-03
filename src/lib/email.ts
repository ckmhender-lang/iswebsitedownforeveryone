import { Resend } from "resend";
import { render } from "@react-email/render";
import { VerificationEmail } from "@/emails/verification-email";
import { PasswordResetEmail } from "@/emails/password-reset-email";
import { AlertEmail } from "@/emails/alert-email";
import { SslAlertEmail } from "@/emails/ssl-alert-email";

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const { error } = await resend.emails.send({ from: EMAIL_FROM, to, subject, html });
  if (error) throw new Error(`Email send failed: ${error.message}`);
}



export async function sendVerificationEmail({
  to,
  name,
  verifyUrl,
}: {
  to: string;
  name: string;
  verifyUrl: string;
}) {
  const html = await render(VerificationEmail({ name, verifyUrl }));
  await sendEmail({ to, subject: "Verify your email — iswebsitedownforeveryone.com", html });
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  const html = await render(PasswordResetEmail({ name, resetUrl }));
  await sendEmail({ to, subject: "Reset your password — iswebsitedownforeveryone.com", html });
}

interface SendAlertEmailParams {
  to: string;
  monitorName: string;
  monitorUrl: string;
  status: "DOWN" | "UP";
  checkedAt: Date;
  error?: string;
}

export async function sendAlertEmail({
  to,
  monitorName,
  monitorUrl,
  status,
  checkedAt,
  error,
}: SendAlertEmailParams) {
  const isDown = status === "DOWN";
  const subject = isDown ? `🔴 ${monitorName} is DOWN` : `🟢 ${monitorName} is back UP`;
  const html = await render(AlertEmail({ monitorName, monitorUrl, status, checkedAt, error }));
  await sendEmail({ to, subject, html });
}

interface SendSslAlertEmailParams {
  to: string;
  monitorName: string;
  monitorUrl: string;
  sslStatus: "EXPIRING_SOON" | "EXPIRED" | "ERROR";
  daysUntilExpiry?: number;
  validTo?: Date;
  issuer?: string;
  error?: string;
}

export async function sendSslAlertEmail({
  to,
  monitorName,
  monitorUrl,
  sslStatus,
  daysUntilExpiry,
  validTo,
  issuer,
  error,
}: SendSslAlertEmailParams) {
  const subject =
    sslStatus === "EXPIRED"
      ? `🔴 SSL Certificate EXPIRED — ${monitorName}`
      : sslStatus === "ERROR"
      ? `⚠️ SSL Check Failed — ${monitorName}`
      : `🟡 SSL Expiring in ${daysUntilExpiry}d — ${monitorName}`;
  const html = await render(
    SslAlertEmail({ monitorName, monitorUrl, sslStatus, daysUntilExpiry, validTo, issuer, error })
  );
  await sendEmail({ to, subject, html });
}
