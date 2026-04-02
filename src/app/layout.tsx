import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Is Website Down Right Now? Check Instantly – iswebsitedownforeveryone.com",
    template: "%s | iswebsitedownforeveryone.com",
  },
  description:
    "Is a website down right now? Check instantly if any site is down for everyone or just you. Free real-time website status checker with uptime monitoring and instant alerts.",
  keywords: [
    "is website down",
    "website down checker",
    "is it down for everyone",
    "website status checker",
    "check if website is down",
    "is it just me or is the website down",
    "real-time website status",
    "website availability checker",
    "website not working",
    "live website uptime checker",
    "instant website downtime checker",
    "uptime monitor",
    "site down checker",
    "free website status tool",
    "check website availability",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "Is Website Down Right Now? Check Instantly – iswebsitedownforeveryone.com",
    description:
      "Free real-time tool to check if any website is down for everyone or just you. Instant results in seconds.",
    siteName: "iswebsitedownforeveryone.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Is Website Down Right Now? Check Instantly",
    description:
      "Free real-time tool to check if any website is down for everyone or just you. Instant results in seconds.",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9067245339941132"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} bg-apple-core`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
