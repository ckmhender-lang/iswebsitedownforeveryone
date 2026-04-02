/**
 * IsWebsiteDown - Project Initializer
 * Run: node init.js
 * Creates all directories and source files for the project.
 */
const fs = require('fs');
const path = require('path');

const base = __dirname;

function write(filePath, content) {
  const full = path.join(base, filePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log(' ✓', filePath);
}

// ============================================================
// PRISMA SCHEMA
// ============================================================

write('prisma/schema.prisma', `// Prisma schema for IsWebsiteDown
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  USER
  ADMIN
}

enum MonitorStatus {
  ACTIVE
  PAUSED
  DELETED
}

enum CheckStatus {
  UP
  DOWN
  DEGRADED
  TIMEOUT
}

enum IncidentStatus {
  OPEN
  RESOLVED
}

enum AlertChannel {
  EMAIL
  WEBHOOK
  SLACK
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          UserRole  @default(USER)
  accounts      Account[]
  sessions      Session[]
  monitors      Monitor[]
  alerts        Alert[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
  @@map("verification_tokens")
}

model Monitor {
  id           String        @id @default(cuid())
  userId       String
  name         String
  url          String
  status       MonitorStatus @default(ACTIVE)
  interval     Int           @default(5)
  timeout      Int           @default(30)
  lastCheckAt  DateTime?
  lastStatus   CheckStatus?
  uptime       Float?
  responseTime Float?
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  checks       Check[]
  incidents    Incident[]
  alerts       Alert[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  @@index([userId])
  @@index([status])
  @@map("monitors")
}

model Check {
  id           String      @id @default(cuid())
  monitorId    String
  status       CheckStatus
  responseTime Int?
  statusCode   Int?
  errorMessage String?
  checkedAt    DateTime    @default(now())
  monitor      Monitor     @relation(fields: [monitorId], references: [id], onDelete: Cascade)
  @@index([monitorId])
  @@index([checkedAt])
  @@map("checks")
}

model Incident {
  id         String         @id @default(cuid())
  monitorId  String
  status     IncidentStatus @default(OPEN)
  cause      String?
  startedAt  DateTime       @default(now())
  resolvedAt DateTime?
  duration   Int?
  monitor    Monitor        @relation(fields: [monitorId], references: [id], onDelete: Cascade)
  @@index([monitorId])
  @@map("incidents")
}

model Alert {
  id        String       @id @default(cuid())
  userId    String
  monitorId String?
  channel   AlertChannel
  target    String
  enabled   Boolean      @default(true)
  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  monitor   Monitor?     @relation(fields: [monitorId], references: [id], onDelete: Cascade)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  @@map("alerts")
}
`);

// ============================================================
// GLOBALS CSS
// ============================================================
write('src/app/globals.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`);

// ============================================================
// ROOT LAYOUT
// ============================================================
write('src/app/layout.tsx', `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "IsWebsiteDown - Website Status Checker",
    template: "%s | IsWebsiteDown",
  },
  description:
    "Check if any website is down or having issues right now. Monitor uptime, response times, and get instant alerts.",
  keywords: ["website down", "is it down", "uptime monitor", "website status"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "IsWebsiteDown",
    description: "Check if any website is down right now.",
    siteName: "IsWebsiteDown",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
`);

// ============================================================
// LANDING PAGE (Public Checker)
// ============================================================
write('src/app/page.tsx', `import { Metadata } from "next";
import Link from "next/link";
import { CheckerForm } from "@/components/checker-form";
import { Activity, Shield, Zap, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "IsWebsiteDown - Check if Any Website is Down",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Nav */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-400" />
            <span className="font-bold text-xl text-white">IsWebsiteDown</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-slate-300 hover:text-white transition-colors"
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Real-time website monitoring
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
            Is any website{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              down right now?
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Instantly check if a website is down for everyone or just you. Set up
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
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20 text-center">
        <div className="mx-auto max-w-2xl rounded-2xl border border-blue-500/30 bg-blue-500/10 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start monitoring for free
          </h2>
          <p className="text-slate-400 mb-8">
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

      <footer className="border-t border-white/10 py-8">
        <div className="container text-center text-sm text-slate-500">
          © {new Date().getFullYear()} IsWebsiteDown. Built with Next.js.
        </div>
      </footer>
    </div>
  );
}
`);

// ============================================================
// CHECKER FORM COMPONENT (main hero component)
// ============================================================
write('src/components/checker-form.tsx', `"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Loader2, Globe } from "lucide-react";

interface CheckResult {
  url: string;
  status: "UP" | "DOWN" | "ERROR";
  statusCode?: number;
  responseTime?: number;
  error?: string;
  checkedAt: string;
}

export function CheckerForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState("");

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      let target = url.trim();
      if (!/^https?:\\/\\//.test(target)) {
        target = "https://" + target;
      }

      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });

      if (!res.ok) throw new Error("Check failed");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Failed to check. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleCheck} className="flex gap-3">
        <div className="relative flex-1">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL (e.g. github.com)"
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-xl transition-colors flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Check Now"
          )}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-400 text-sm">{error}</p>
      )}

      {result && (
        <div className={\`mt-6 rounded-2xl border p-6 backdrop-blur-sm transition-all \${
          result.status === "UP"
            ? "border-green-500/30 bg-green-500/10"
            : "border-red-500/30 bg-red-500/10"
        }\`}>
          <div className="flex items-center gap-4">
            {result.status === "UP" ? (
              <CheckCircle2 className="h-10 w-10 text-green-400 flex-shrink-0" />
            ) : (
              <XCircle className="h-10 w-10 text-red-400 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xl font-bold text-white">
                {result.status === "UP"
                  ? "✅ Website is UP!"
                  : "❌ Website is DOWN!"}
              </p>
              <p className="text-slate-400 text-sm truncate">{result.url}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {result.statusCode && (
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">HTTP Status</p>
                <p className="text-lg font-semibold text-white">{result.statusCode}</p>
              </div>
            )}
            {result.responseTime && (
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Response Time</p>
                <p className="text-lg font-semibold text-white flex items-center gap-1">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {result.responseTime}ms
                </p>
              </div>
            )}
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Checked At</p>
              <p className="text-sm font-semibold text-white">
                {new Date(result.checkedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {result.error && (
            <p className="mt-3 text-sm text-red-300 bg-red-500/10 rounded-lg p-3">
              {result.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
`);

// ============================================================
// AUTH PAGES
// ============================================================
write('src/app/(auth)/login/page.tsx', `import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Activity } from "lucide-react";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white">
            <Activity className="h-7 w-7 text-blue-400" />
            <span className="text-2xl font-bold">IsWebsiteDown</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-slate-400">Sign in to your account</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <LoginForm />
          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
`);

write('src/app/(auth)/register/page.tsx', `import { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Activity } from "lucide-react";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white">
            <Activity className="h-7 w-7 text-blue-400" />
            <span className="text-2xl font-bold">IsWebsiteDown</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-slate-400">Start monitoring for free — no card required</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
`);

// ============================================================
// AUTH FORM COMPONENTS
// ============================================================
write('src/components/auth/login-form.tsx', `"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Signed in!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Email
        </label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Password
        </label>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: form.password })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Sign In
      </button>
    </form>
  );
}
`);

write('src/components/auth/register-form.tsx', `"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
        <input
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Min 8 characters"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Create Account
      </button>
    </form>
  );
}
`);

// ============================================================
// DASHBOARD LAYOUT
// ============================================================
write('src/app/(dashboard)/layout.tsx', `import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
`);

// ============================================================
// DASHBOARD PAGE
// ============================================================
write('src/app/(dashboard)/dashboard/page.tsx', `import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { MonitorList } from "@/components/dashboard/monitor-list";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id as string;

  const [monitors, totalChecksToday, openIncidents] = await Promise.all([
    prisma.monitor.findMany({
      where: { userId, status: { not: "DELETED" } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.check.count({
      where: {
        monitor: { userId },
        checkedAt: { gte: new Date(Date.now() - 86400000) },
      },
    }),
    prisma.incident.count({
      where: { monitor: { userId }, status: "OPEN" },
    }),
  ]);

  const upCount = monitors.filter((m) => m.lastStatus === "UP").length;
  const downCount = monitors.filter((m) => m.lastStatus === "DOWN").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of all your monitors</p>
      </div>

      <StatsCards
        total={monitors.length}
        up={upCount}
        down={downCount}
        checksToday={totalChecksToday}
        openIncidents={openIncidents}
      />

      <MonitorList monitors={monitors} />
    </div>
  );
}
`);

// ============================================================
// MONITORS PAGE
// ============================================================
write('src/app/(dashboard)/monitors/page.tsx', `import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MonitorGrid } from "@/components/monitors/monitor-grid";
import { AddMonitorButton } from "@/components/monitors/add-monitor-button";

export const metadata: Metadata = { title: "Monitors" };

export default async function MonitorsPage() {
  const session = await auth();
  const userId = session!.user!.id as string;

  const monitors = await prisma.monitor.findMany({
    where: { userId, status: { not: "DELETED" } },
    include: {
      _count: { select: { checks: true, incidents: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Monitors</h1>
          <p className="text-slate-400 mt-1">{monitors.length} monitors configured</p>
        </div>
        <AddMonitorButton />
      </div>

      <MonitorGrid monitors={monitors} />
    </div>
  );
}
`);

// ============================================================
// MONITOR DETAIL PAGE
// ============================================================
write('src/app/(dashboard)/monitors/[id]/page.tsx', `import { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MonitorDetail } from "@/components/monitors/monitor-detail";

export const metadata: Metadata = { title: "Monitor Detail" };

export default async function MonitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user!.id as string;

  const monitor = await prisma.monitor.findFirst({
    where: { id, userId },
    include: {
      checks: {
        orderBy: { checkedAt: "desc" },
        take: 100,
      },
      incidents: {
        orderBy: { startedAt: "desc" },
        take: 20,
      },
    },
  });

  if (!monitor) notFound();

  return <MonitorDetail monitor={monitor} />;
}
`);

// ============================================================
// API: PUBLIC CHECK
// ============================================================
write('src/app/api/check/route.ts', `import { NextRequest, NextResponse } from "next/server";
import { checkWebsite } from "@/lib/checker";
import { z } from "zod";

const schema = z.object({
  url: z.string().url("Invalid URL"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = schema.parse(body);

    const result = await checkWebsite(url);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}
`);

// ============================================================
// API: MONITORS CRUD
// ============================================================
write('src/app/api/monitors/route.ts', `import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url(),
  interval: z.number().int().min(1).max(1440).default(5),
  timeout: z.number().int().min(5).max(60).default(30),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const monitors = await prisma.monitor.findMany({
    where: { userId: session.user!.id as string, status: { not: "DELETED" } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(monitors);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const count = await prisma.monitor.count({
      where: { userId: session.user!.id as string, status: { not: "DELETED" } },
    });

    if (count >= 10) {
      return NextResponse.json(
        { error: "Free plan limit: 10 monitors" },
        { status: 403 }
      );
    }

    const monitor = await prisma.monitor.create({
      data: { ...data, userId: session.user!.id as string },
    });

    return NextResponse.json(monitor, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create monitor" }, { status: 500 });
  }
}
`);

write('src/app/api/monitors/[id]/route.ts', `import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  interval: z.number().int().min(1).max(1440).optional(),
  timeout: z.number().int().min(5).max(60).optional(),
  status: z.enum(["ACTIVE", "PAUSED"]).optional(),
});

async function getMonitor(id: string, userId: string) {
  return prisma.monitor.findFirst({
    where: { id, userId, status: { not: "DELETED" } },
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const monitor = await getMonitor(id, session.user!.id as string);
  if (!monitor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(monitor);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const monitor = await getMonitor(id, session.user!.id as string);
  if (!monitor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);
    const updated = await prisma.monitor.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const monitor = await getMonitor(id, session.user!.id as string);
  if (!monitor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.monitor.update({ where: { id }, data: { status: "DELETED" } });
  return NextResponse.json({ success: true });
}
`);

// ============================================================
// API: AUTH REGISTER
// ============================================================
write('src/app/api/auth/register/route.ts', `import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = schema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { name, email, password: hashed },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
`);

// ============================================================
// API: NEXTAUTH
// ============================================================
write('src/app/api/auth/[...nextauth]/route.ts', `import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
`);

// ============================================================
// API: CRON JOB
// ============================================================
write('src/app/api/cron/route.ts', `import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkWebsite } from "@/lib/checker";

// Called by Vercel Cron or an external scheduler
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const monitors = await prisma.monitor.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { lastCheckAt: null },
        {
          lastCheckAt: {
            lt: new Date(now.getTime() - 60000), // at least 1 min ago
          },
        },
      ],
    },
    take: 50,
  });

  const results = await Promise.allSettled(
    monitors.map(async (monitor) => {
      const result = await checkWebsite(monitor.url, monitor.timeout * 1000);

      await prisma.check.create({
        data: {
          monitorId: monitor.id,
          status: result.status,
          statusCode: result.statusCode,
          responseTime: result.responseTime,
          errorMessage: result.error,
        },
      });

      // Handle incidents
      if (result.status === "DOWN" && monitor.lastStatus !== "DOWN") {
        await prisma.incident.create({
          data: { monitorId: monitor.id, cause: result.error },
        });
      } else if (result.status === "UP" && monitor.lastStatus === "DOWN") {
        await prisma.incident.updateMany({
          where: { monitorId: monitor.id, status: "OPEN" },
          data: { status: "RESOLVED", resolvedAt: now },
        });
      }

      await prisma.monitor.update({
        where: { id: monitor.id },
        data: {
          lastCheckAt: now,
          lastStatus: result.status,
          responseTime: result.responseTime ?? undefined,
        },
      });
    })
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  return NextResponse.json({ checked: monitors.length, succeeded });
}
`);

// ============================================================
// LIB: PRISMA CLIENT
// ============================================================
write('src/lib/prisma.ts', `import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
`);

// ============================================================
// LIB: AUTH
// ============================================================
write('src/lib/auth.ts', `import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(1) })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});
`);

// ============================================================
// LIB: CHECKER
// ============================================================
write('src/lib/checker.ts', `export interface CheckResult {
  url: string;
  status: "UP" | "DOWN" | "TIMEOUT" | "ERROR";
  statusCode?: number;
  responseTime?: number;
  error?: string;
  checkedAt: string;
}

export async function checkWebsite(
  url: string,
  timeoutMs = 30000
): Promise<CheckResult> {
  const start = Date.now();
  const checkedAt = new Date().toISOString();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "IsWebsiteDown-Monitor/1.0 (+https://iswebsitedown.app/bot)",
      },
      redirect: "follow",
    });

    clearTimeout(timer);
    const responseTime = Date.now() - start;

    const isUp = response.status < 500;

    return {
      url,
      status: isUp ? "UP" : "DOWN",
      statusCode: response.status,
      responseTime,
      checkedAt,
    };
  } catch (err: unknown) {
    const elapsed = Date.now() - start;
    const isTimeout =
      err instanceof Error && err.name === "AbortError";

    return {
      url,
      status: isTimeout ? "TIMEOUT" : "DOWN",
      responseTime: elapsed,
      error: isTimeout
        ? \`Timed out after \${timeoutMs}ms\`
        : err instanceof Error
        ? err.message
        : "Unknown error",
      checkedAt,
    };
  }
}
`);

// ============================================================
// LIB: UTILS
// ============================================================
write('src/lib/utils.ts', `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatResponseTime(ms: number | null | undefined): string {
  if (ms == null) return "—";
  if (ms < 1000) return \`\${ms}ms\`;
  return \`\${(ms / 1000).toFixed(2)}s\`;
}

export function formatUptime(uptime: number | null | undefined): string {
  if (uptime == null) return "—";
  return \`\${uptime.toFixed(2)}%\`;
}

export function getStatusColor(status: string | null | undefined) {
  switch (status) {
    case "UP": return "text-green-400";
    case "DOWN": return "text-red-400";
    case "DEGRADED": return "text-yellow-400";
    case "TIMEOUT": return "text-orange-400";
    default: return "text-slate-400";
  }
}

export function getStatusBg(status: string | null | undefined) {
  switch (status) {
    case "UP": return "bg-green-500/10 text-green-400 border-green-500/20";
    case "DOWN": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "DEGRADED": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "TIMEOUT": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}
`);

// ============================================================
// TYPES
// ============================================================
write('src/types/index.ts', `import type { Monitor, Check, Incident, Alert, User } from "@prisma/client";

export type MonitorWithCounts = Monitor & {
  _count: { checks: number; incidents: number };
};

export type MonitorWithChecks = Monitor & {
  checks: Check[];
  incidents: Incident[];
};

export type UserWithMonitors = User & {
  monitors: Monitor[];
};

export type DashboardStats = {
  total: number;
  up: number;
  down: number;
  checksToday: number;
  openIncidents: number;
};
`);

// ============================================================
// LAYOUT COMPONENTS
// ============================================================
write('src/components/layout/sidebar.tsx', `"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Activity,
  LayoutDashboard,
  Monitor,
  Bell,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/monitors", label: "Monitors", icon: Monitor },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  user: { name?: string | null; email?: string | null; image?: string | null } | undefined;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-white/10 flex flex-col bg-slate-900/50">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-400" />
          <span className="font-bold text-white">IsWebsiteDown</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-blue-600/20 text-blue-400"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-blue-600/30 flex items-center justify-center">
            <User className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name ?? "User"}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
`);

// ============================================================
// DASHBOARD COMPONENTS
// ============================================================
write('src/components/dashboard/stats-cards.tsx', `import { Activity, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { DashboardStats } from "@/types";

export function StatsCards(stats: DashboardStats) {
  const cards = [
    {
      label: "Total Monitors",
      value: stats.total,
      icon: <Activity className="h-5 w-5 text-blue-400" />,
      color: "border-blue-500/20 bg-blue-500/5",
    },
    {
      label: "Monitors Up",
      value: stats.up,
      icon: <CheckCircle2 className="h-5 w-5 text-green-400" />,
      color: "border-green-500/20 bg-green-500/5",
    },
    {
      label: "Monitors Down",
      value: stats.down,
      icon: <AlertTriangle className="h-5 w-5 text-red-400" />,
      color: "border-red-500/20 bg-red-500/5",
    },
    {
      label: "Checks Today",
      value: stats.checksToday,
      icon: <TrendingUp className="h-5 w-5 text-purple-400" />,
      color: "border-purple-500/20 bg-purple-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={\`rounded-xl border p-5 \${c.color}\`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">{c.label}</span>
            {c.icon}
          </div>
          <p className="text-3xl font-bold text-white">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
`);

write('src/components/dashboard/monitor-list.tsx', `import Link from "next/link";
import type { Monitor } from "@prisma/client";
import { getStatusBg, formatResponseTime } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface MonitorListProps {
  monitors: Monitor[];
}

export function MonitorList({ monitors }: MonitorListProps) {
  if (monitors.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
        <p className="text-slate-400">No monitors yet.</p>
        <Link
          href="/monitors"
          className="mt-4 inline-block text-blue-400 hover:text-blue-300 text-sm"
        >
          Add your first monitor →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10">
        <h2 className="font-semibold text-white">Recent Monitors</h2>
      </div>
      <div className="divide-y divide-white/5">
        {monitors.slice(0, 10).map((m) => (
          <Link
            key={m.id}
            href={\`/monitors/\${m.id}\`}
            className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
          >
            <span
              className={\`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium \${getStatusBg(m.lastStatus)}\`}
            >
              {m.lastStatus ?? "Pending"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{m.name}</p>
              <p className="text-xs text-slate-500 truncate">{m.url}</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400">{formatResponseTime(m.responseTime)}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-600 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
`);

// ============================================================
// MONITOR COMPONENTS
// ============================================================
write('src/components/monitors/monitor-grid.tsx', `import Link from "next/link";
import type { MonitorWithCounts } from "@/types";
import { getStatusBg, formatResponseTime, formatUptime } from "@/lib/utils";
import { Activity, ExternalLink } from "lucide-react";

interface MonitorGridProps {
  monitors: MonitorWithCounts[];
}

export function MonitorGrid({ monitors }: MonitorGridProps) {
  if (monitors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/20 p-16 text-center">
        <Activity className="h-10 w-10 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 font-medium">No monitors yet</p>
        <p className="text-slate-600 text-sm mt-1">Click "Add Monitor" to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {monitors.map((m) => (
        <Link
          key={m.id}
          href={\`/monitors/\${m.id}\`}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 mr-3">
              <h3 className="font-semibold text-white truncate">{m.name}</h3>
              <p className="text-xs text-slate-500 truncate mt-0.5">{m.url}</p>
            </div>
            <span
              className={\`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium flex-shrink-0 \${getStatusBg(m.lastStatus)}\`}
            >
              {m.lastStatus ?? "Pending"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-white/5 p-2">
              <p className="text-xs text-slate-500">Uptime</p>
              <p className="text-sm font-semibold text-white">{formatUptime(m.uptime)}</p>
            </div>
            <div className="rounded-lg bg-white/5 p-2">
              <p className="text-xs text-slate-500">Response</p>
              <p className="text-sm font-semibold text-white">{formatResponseTime(m.responseTime)}</p>
            </div>
            <div className="rounded-lg bg-white/5 p-2">
              <p className="text-xs text-slate-500">Checks</p>
              <p className="text-sm font-semibold text-white">{m._count.checks}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <span>Every {m.interval}m</span>
            <ExternalLink className="h-3.5 w-3.5 group-hover:text-slate-400 transition-colors" />
          </div>
        </Link>
      ))}
    </div>
  );
}
`);

write('src/components/monitors/add-monitor-button.tsx', `"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Loader2, X } from "lucide-react";

export function AddMonitorButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", url: "", interval: 5 });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/monitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success("Monitor added!");
      setOpen(false);
      setForm({ name: "", url: "", interval: 5 });
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add monitor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
      >
        <Plus className="h-4 w-4" />
        Add Monitor
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Add Monitor</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="My Website"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">URL</label>
                <input
                  required
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Check Interval
                </label>
                <select
                  value={form.interval}
                  onChange={(e) => setForm({ ...form, interval: Number(e.target.value) })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  {[1, 5, 10, 15, 30, 60].map((v) => (
                    <option key={v} value={v} className="bg-slate-900">
                      Every {v} minute{v > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 rounded-lg border border-white/20 text-slate-300 hover:text-white hover:bg-white/5 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Add Monitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
`);

write('src/components/monitors/monitor-detail.tsx', `"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { MonitorWithChecks } from "@/types";
import { getStatusBg, getStatusColor, formatResponseTime } from "@/lib/utils";
import {
  ArrowLeft,
  Trash2,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Props {
  monitor: MonitorWithChecks;
}

export function MonitorDetail({ monitor }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(monitor.status);

  async function togglePause() {
    const newStatus = status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    const res = await fetch(\`/api/monitors/\${monitor.id}\`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setStatus(newStatus);
      toast.success(newStatus === "ACTIVE" ? "Monitor resumed" : "Monitor paused");
      router.refresh();
    }
  }

  async function deleteMonitor() {
    if (!confirm("Delete this monitor? This cannot be undone.")) return;
    const res = await fetch(\`/api/monitors/\${monitor.id}\`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Monitor deleted");
      router.push("/monitors");
    }
  }

  const recentChecks = monitor.checks.slice(0, 30);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/monitors" className="text-slate-400 hover:text-white mt-1">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{monitor.name}</h1>
            <span className={\`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium \${getStatusBg(monitor.lastStatus)}\`}>
              {monitor.lastStatus ?? "Pending"}
            </span>
          </div>
          <a
            href={monitor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-blue-400 mt-1 block"
          >
            {monitor.url}
          </a>
        </div>
        <div className="flex gap-2">
          <button
            onClick={togglePause}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/20 text-slate-300 hover:text-white hover:bg-white/5 transition text-sm"
          >
            {status === "ACTIVE" ? (
              <><PauseCircle className="h-4 w-4" /> Pause</>
            ) : (
              <><PlayCircle className="h-4 w-4" /> Resume</>
            )}
          </button>
          <button
            onClick={deleteMonitor}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition text-sm"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Avg Response", value: formatResponseTime(monitor.responseTime) },
          { label: "Interval", value: \`\${monitor.interval}m\` },
          { label: "Open Incidents", value: monitor.incidents.filter(i => i.status === "OPEN").length },
          { label: "Total Checks", value: monitor.checks.length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className="text-xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent checks */}
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="font-semibold text-white">Recent Checks</h2>
        </div>
        <div className="divide-y divide-white/5">
          {recentChecks.length === 0 && (
            <p className="px-6 py-8 text-slate-500 text-sm text-center">No checks yet</p>
          )}
          {recentChecks.map((check) => (
            <div key={check.id} className="flex items-center gap-4 px-6 py-3">
              {check.status === "UP" ? (
                <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              )}
              <span className={\`text-sm font-medium \${getStatusColor(check.status)}\`}>
                {check.status}
              </span>
              {check.statusCode && (
                <span className="text-xs text-slate-500">HTTP {check.statusCode}</span>
              )}
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {formatResponseTime(check.responseTime)}
              </span>
              <span className="ml-auto text-xs text-slate-600">
                {formatDistanceToNow(new Date(check.checkedAt), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Incidents */}
      {monitor.incidents.length > 0 && (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="font-semibold text-white">Incident History</h2>
          </div>
          <div className="divide-y divide-white/5">
            {monitor.incidents.map((inc) => (
              <div key={inc.id} className="flex items-center gap-4 px-6 py-4">
                <span className={\`inline-flex items-center rounded-md border px-2 py-0.5 text-xs \${
                  inc.status === "OPEN"
                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                    : "border-green-500/20 bg-green-500/10 text-green-400"
                }\`}>
                  {inc.status}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate">{inc.cause ?? "Unknown cause"}</p>
                  <p className="text-xs text-slate-500">
                    Started {formatDistanceToNow(new Date(inc.startedAt), { addSuffix: true })}
                    {inc.resolvedAt && \` · Resolved \${formatDistanceToNow(new Date(inc.resolvedAt), { addSuffix: true })}\`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
`);

// ============================================================
// ALERTS PAGE
// ============================================================
write('src/app/(dashboard)/alerts/page.tsx', `import { Metadata } from "next";

export const metadata: Metadata = { title: "Alerts" };

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Alerts</h1>
        <p className="text-slate-400 mt-1">Configure notification channels</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-slate-400">Alert configuration coming soon.</p>
        <p className="text-slate-600 text-sm mt-2">
          Email, Slack, and webhook alerts will be configured here.
        </p>
      </div>
    </div>
  );
}
`);

// ============================================================
// SETTINGS PAGE
// ============================================================
write('src/app/(dashboard)/settings/page.tsx', `import { Metadata } from "next";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account preferences</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h2 className="font-semibold text-white">Account</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Name</p>
            <p className="text-white mt-1">{session?.user?.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-slate-500">Email</p>
            <p className="text-white mt-1">{session?.user?.email ?? "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
`);

// ============================================================
// .gitignore
// ============================================================
write('.gitignore', `# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
prisma/dev.db
prisma/dev.db-journal
`);

// ============================================================
// components.json (shadcn/ui config)
// ============================================================
write('components.json', `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
`);

// ============================================================
// next-env.d.ts
// ============================================================
write('next-env.d.ts', `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
`);

// ============================================================
// Done
// ============================================================
console.log('');
console.log('========================================');
console.log(' Project files created successfully!');
console.log('========================================');
console.log('');
console.log('Next steps:');
console.log('  1. npm install');
console.log('  2. Copy .env.example -> .env.local and fill in values');
console.log('  3. npx prisma db push');
console.log('  4. npm run dev');
console.log('');
