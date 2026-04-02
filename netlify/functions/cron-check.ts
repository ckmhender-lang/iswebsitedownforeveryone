// Netlify scheduled function — calls /api/cron every 5 minutes
// Schedule is defined in netlify.toml: "*/5 * * * *"
import type { Handler } from "@netlify/functions";

const handler: Handler = async () => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.URL || "http://localhost:3000";
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error("CRON_SECRET not set");
    return { statusCode: 500, body: "CRON_SECRET not configured" };
  }

  const res = await fetch(`${appUrl}/api/cron`, {
    headers: { Authorization: `Bearer ${secret}` },
  });

  const body = await res.text();
  console.log(`Cron result: ${res.status} ${body}`);

  return { statusCode: res.status, body };
};

export { handler };
