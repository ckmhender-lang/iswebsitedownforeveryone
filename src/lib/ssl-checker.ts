import * as tls from "tls";
import { URL } from "url";

export interface SslCheckResult {
  status: "VALID" | "EXPIRING_SOON" | "EXPIRED" | "ERROR";
  issuer?: string;
  subject?: string;
  validFrom?: Date;
  validTo?: Date;
  daysUntilExpiry?: number;
  error?: string;
}

export async function checkSsl(url: string): Promise<SslCheckResult> {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") {
      return { status: "ERROR", error: "Not an HTTPS URL — SSL not applicable" };
    }

    const hostname = parsed.hostname;
    const port = parseInt(parsed.port) || 443;

    return new Promise((resolve) => {
      const socket = tls.connect(
        {
          host: hostname,
          port,
          servername: hostname,
          // Allow inspecting expired/self-signed certs
          rejectUnauthorized: false,
        },
        () => {
          const cert = socket.getPeerCertificate();
          socket.destroy();

          if (!cert || !cert.valid_to) {
            return resolve({ status: "ERROR", error: "No certificate found" });
          }

          const validFrom = new Date(cert.valid_from);
          const validTo = new Date(cert.valid_to);
          const now = new Date();
          const daysUntilExpiry = Math.floor(
            (validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          const issuer =
            (cert.issuer as Record<string, string>)?.O ||
            (cert.issuer as Record<string, string>)?.CN ||
            "Unknown";
          const subject =
            (cert.subject as Record<string, string>)?.CN || hostname;

          let status: "VALID" | "EXPIRING_SOON" | "EXPIRED" = "VALID";
          if (daysUntilExpiry < 0) status = "EXPIRED";
          else if (daysUntilExpiry <= 30) status = "EXPIRING_SOON";

          resolve({ status, issuer, subject, validFrom, validTo, daysUntilExpiry });
        }
      );

      socket.on("error", (err) => {
        resolve({ status: "ERROR", error: err.message });
      });

      socket.setTimeout(10000, () => {
        socket.destroy();
        resolve({ status: "ERROR", error: "SSL check timed out" });
      });
    });
  } catch (err) {
    return {
      status: "ERROR",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
