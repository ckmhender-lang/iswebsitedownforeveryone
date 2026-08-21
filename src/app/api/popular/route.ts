import { NextResponse } from "next/server";
import { checkWebsite } from "@/lib/checker";

const POPULAR_SITES = [
  { name: "Google", domain: "google.com", url: "https://www.google.com" },
  { name: "YouTube", domain: "youtube.com", url: "https://www.youtube.com" },
  { name: "Facebook", domain: "facebook.com", url: "https://www.facebook.com" },
  { name: "Instagram", domain: "instagram.com", url: "https://www.instagram.com" },
  { name: "X (Twitter)", domain: "twitter.com", url: "https://twitter.com" },
  { name: "Netflix", domain: "netflix.com", url: "https://www.netflix.com" },
  { name: "Amazon", domain: "amazon.com", url: "https://www.amazon.com" },
  { name: "Wikipedia", domain: "wikipedia.org", url: "https://www.wikipedia.org" },
  { name: "Reddit", domain: "reddit.com", url: "https://www.reddit.com" },
  { name: "Yahoo", domain: "yahoo.com", url: "https://www.yahoo.com" }
];

export async function GET() {
  try {
    // Perform checks in parallel with a short timeout
    const results = await Promise.all(
      POPULAR_SITES.map(async (site) => {
        try {
          // Local-only status check (no database dependency)
          const check = await checkWebsite(site.url, 1500);
          return {
            name: site.name,
            domain: site.domain,
            status: check.status === "UP" ? "UP" : "DOWN",
            responseTime: check.responseTime ?? 0,
          };
        } catch {
          return {
            name: site.name,
            domain: site.domain,
            status: "DOWN",
            responseTime: 0,
          };
        }
      })
    );

    return NextResponse.json(results);
  } catch (err) {
    console.error("Popular sites status error:", err);
    return NextResponse.json({ error: "Failed to fetch popular sites" }, { status: 500 });
  }
}
