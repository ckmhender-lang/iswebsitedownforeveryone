import { NextRequest, NextResponse } from "next/server";

const POPULAR_DOMAINS = [
  "google.com", "youtube.com", "facebook.com", "twitter.com", "x.com",
  "instagram.com", "tiktok.com", "reddit.com", "linkedin.com", "pinterest.com",
  "snapchat.com", "whatsapp.com", "telegram.org", "discord.com", "slack.com",
  "github.com", "gitlab.com", "bitbucket.org", "stackoverflow.com", "dev.to",
  "npmjs.com", "pypi.org", "packagist.org",
  "amazon.com", "ebay.com", "etsy.com", "shopify.com", "aliexpress.com",
  "walmart.com", "target.com", "bestbuy.com", "newegg.com",
  "netflix.com", "spotify.com", "twitch.tv", "hulu.com", "disneyplus.com",
  "apple.com", "microsoft.com", "office.com", "live.com",
  "outlook.com", "yahoo.com", "hotmail.com", "protonmail.com",
  "cloudflare.com", "vercel.com", "netlify.com", "heroku.com",
  "digitalocean.com", "linode.com", "aws.amazon.com",
  "wikipedia.org", "bbc.com", "cnn.com", "nytimes.com", "theguardian.com",
  "medium.com", "substack.com", "wordpress.com", "wix.com", "squarespace.com",
  "dropbox.com", "zoom.us", "paypal.com", "stripe.com",
  "openai.com", "anthropic.com", "huggingface.co",
];

const TLDS = [".com", ".net", ".org", ".io", ".co", ".app", ".dev", ".ai"];

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") ?? "";
  const trimmed = query.trim().toLowerCase().replace(/^https?:\/\//, "");

  if (!trimmed || trimmed.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const suggestions = new Set<string>();

  // Prefix match against popular domains first
  for (const domain of POPULAR_DOMAINS) {
    if (domain.startsWith(trimmed)) {
      suggestions.add(domain);
    }
    if (suggestions.size >= 8) break;
  }

  // If no dot typed yet, suggest input + common TLDs
  if (!trimmed.includes(".") && suggestions.size < 8) {
    for (const tld of TLDS) {
      const candidate = trimmed + tld;
      if (!suggestions.has(candidate)) {
        suggestions.add(candidate);
      }
      if (suggestions.size >= 8) break;
    }
  }

  // Substring fallback to fill up to 8
  if (suggestions.size < 4) {
    for (const domain of POPULAR_DOMAINS) {
      if (domain.includes(trimmed) && !suggestions.has(domain)) {
        suggestions.add(domain);
      }
      if (suggestions.size >= 8) break;
    }
  }

  return NextResponse.json({ suggestions: Array.from(suggestions).slice(0, 8) });
}
