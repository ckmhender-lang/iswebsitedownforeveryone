import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckerForm } from "@/components/checker-form";
import { Shield, Zap, BarChart3, ArrowUp, ArrowDown, Lock, CheckCircle2, AlertTriangle, Clock4 } from "lucide-react";

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

      {/* SSL Certificate Monitoring */}
      <section className="container py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-1 shadow-2xl">
          {/* glow rings */}
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

          <div className="relative rounded-[22px] bg-slate-900/80 backdrop-blur-sm px-8 py-12 md:px-16 md:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left – copy */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-sm text-green-400 mb-6">
                  <Lock className="h-3.5 w-3.5" />
                  SSL Certificate Monitoring
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                  Never let an expired SSL{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                    break your site
                  </span>
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-8">
                  We automatically check your SSL certificates and alert you before they expire.
                  Know your issuer, expiry date, and days remaining — all in your dashboard.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-white font-semibold px-7 py-3 rounded-xl transition-all shadow-lg shadow-green-500/20"
                >
                  <Lock className="h-4 w-4" />
                  Monitor SSL for Free
                </Link>
              </div>

              {/* Right – mock SSL card */}
              <div className="flex flex-col gap-4">
                {/* Valid cert */}
                <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/15 flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm">github.com</p>
                    <p className="text-green-400 text-xs mt-0.5">Valid · Expires in 284 days</p>
                    <p className="text-slate-500 text-xs">Issued by DigiCert Inc</p>
                  </div>
                  <span className="ml-auto text-xs font-semibold bg-green-500/20 text-green-400 px-3 py-1 rounded-full flex-shrink-0">VALID</span>
                </div>

                {/* Expiring soon */}
                <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/15 flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm">myshop.example.com</p>
                    <p className="text-yellow-400 text-xs mt-0.5">⚠ Expiring soon · 18 days left</p>
                    <p className="text-slate-500 text-xs">Issued by Let&apos;s Encrypt</p>
                  </div>
                  <span className="ml-auto text-xs font-semibold bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full flex-shrink-0">EXPIRING</span>
                </div>

                {/* Alert sent */}
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-center gap-3">
                  <Clock4 className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <p className="text-slate-400 text-xs">
                    📧 <span className="text-blue-300 font-medium">SSL alert sent</span> to you@example.com — &quot;myshop.example.com expires in 18 days&quot;
                  </p>
                </div>
              </div>

            </div>
          </div>
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
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-700 mb-4">
            🔍 Common Questions
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">What people search for</h2>
          <p className="text-slate-500 text-sm">We answer all of these questions instantly and for free.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
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
            "SSL Certificate Expiry Checker",
            "Monitor Website Uptime 24/7 Free",
          ].map((phrase) => (
            <div
              key={phrase}
              className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/60 px-4 py-3.5 text-sm text-slate-700 backdrop-blur-sm hover:border-blue-300 hover:bg-blue-50/60 transition-colors group"
            >
              <span className="text-blue-500 text-base flex-shrink-0 group-hover:scale-110 transition-transform">🔍</span>
              <span className="group-hover:text-blue-700 transition-colors">{phrase}</span>
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
