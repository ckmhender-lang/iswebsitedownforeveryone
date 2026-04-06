import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckerForm } from "@/components/checker-form";
import { Shield, Zap, BarChart3, ArrowUp, ArrowDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Is Website Down Right Now? Check Instantly – Free Tool",
  description:
    "Is a website down right now? Use our free real-time checker to find out in seconds if any site is down for everyone or just you. Live uptime monitoring tool.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-apple-core">
      {/* Nav */}
      <header className="border-b border-black/10 backdrop-blur-sm sticky top-0 z-50 bg-apple-core/90">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="relative w-8 h-8 flex-shrink-0">
              {/* logo.svg as background */}
              <Image src="/logo.svg" alt="Logo" width={32} height={32} className="absolute inset-0" />
              {/* arrows overlaid */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <ArrowUp className="h-3 w-3 text-green-500 -mb-0.5 drop-shadow" strokeWidth={3} />
                <ArrowDown className="h-3 w-3 text-red-500 -mt-0.5 drop-shadow" strokeWidth={3} />
              </div>
            </div>
            <span className="font-bold text-xl text-slate-900">iswebsitedownforeveryone.com</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get Started Free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Real-time website monitoring
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
            Is website, App or API {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              down right now?
            </span>
          </h1>

          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Instantly check if a website is down for all or  everyone or just you. Set up
            monitors and get alerted the moment something goes wrong.
          </p>

          <CheckerForm />
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="h-6 w-6 text-yellow-400" />,
              title: "Instant Checks",
              description:
                "Get real-time results in under 3 seconds. See HTTP status, response time, and if it's a global or local issue.",
            },
            {
              icon: <Shield className="h-6 w-6 text-green-400" />,
              title: "24/7 Monitoring",
              description:
                "Set up monitors that check your sites every 1–60 minutes. Get email or webhook alerts the moment downtime is detected.",
            },
            {
              icon: <BarChart3 className="h-6 w-6 text-blue-400" />,
              title: "Uptime Analytics",
              description:
                "View uptime history, average response times, and incident logs to understand your site's reliability over time.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-black/10 bg-white/40 p-6 backdrop-blur-sm"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-black/5">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20 text-center">
        <div className="mx-auto max-w-2xl rounded-2xl border border-blue-500/30 bg-blue-500/10 p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Start monitoring for free
          </h2>
          <p className="text-slate-600 mb-8">
            Monitor up to 10 websites. No credit card required.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* SEO – Common searches */}
      <section className="container py-16">
        <h2 className="text-center text-2xl font-bold text-slate-900 mb-3">
          What people search for
        </h2>
        <p className="text-center text-slate-500 text-sm mb-10">
          We answer all of these questions instantly and for free.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {[
            "Is a Website Down Right Now? Check Instantly",
            "Website Down Checker – Find Out in Seconds",
            "Check If Any Website Is Down Right Now",
            "Is It Just You or Is the Website Down?",
            "Real-Time Website Status Checker",
            "Check Website Availability Instantly (Free Tool)",
            "Website Not Working? Check Status Now",
            "Live Website Uptime Checker – Fast & Free",
            "Is This Site Down for Everyone or Just Me?",
            "Instant Website Downtime Checker Tool",
          ].map((phrase) => (
            <div
              key={phrase}
              className="flex items-center gap-2 rounded-xl border border-black/10 bg-white/40 px-4 py-3 text-sm text-slate-700 backdrop-blur-sm"
            >
              <span className="text-blue-500 text-base">🔍</span>
              {phrase}
            </div>
          ))}
        </div>
      </section>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "iswebsitedownforeveryone.com",
            url: process.env.NEXT_PUBLIC_APP_URL ?? "https://iswebsitedownforeveryone.com",
            description:
              "Free real-time tool to check if any website is down for everyone or just you. Instant website status checker with uptime monitoring.",
            applicationCategory: "UtilityApplication",
            operatingSystem: "All",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            featureList: [
              "Real-time website status check",
              "Uptime monitoring",
              "Email alerts for downtime",
              "Response time tracking",
              "Incident history logs",
            ],
          }),
        }}
      />

      <footer className="border-t border-black/10 py-8">
        <div className="container text-center text-sm text-slate-500 flex flex-col items-center gap-2">
          <span>
            © {new Date().getFullYear()} iswebsitedownforeveryone.com.{" "}
            <Link href="/privacy-policy" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
            {" · "}
            <Link href="/contact" className="hover:text-slate-700 transition-colors">Contact</Link>
          </span>
          <p className="text-xs text-slate-400">
            This website is not affiliated with, sponsored by, or endorsed by any of the services it monitors.
          </p>
        </div>
      </footer>
    </div>
  );
}
