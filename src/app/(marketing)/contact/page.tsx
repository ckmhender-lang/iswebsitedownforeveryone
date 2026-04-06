"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, ArrowDown, Send, CheckCircle2, Loader2 } from "lucide-react";

const SITE = "iswebsitedownforeveryone.com";

const SUBJECTS = [
  "General Question",
  "Report a Bug",
  "Suggest a Feature",
  "Privacy / Data Request",
  "Business Enquiry",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send");
      setSuccess(true);
      setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-apple-core">
      {/* Nav */}
      <header className="border-b border-black/10 backdrop-blur-sm sticky top-0 z-50 bg-apple-core/90">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} className="absolute inset-0" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <ArrowUp className="h-3 w-3 text-green-500 -mb-0.5 drop-shadow" strokeWidth={3} />
                <ArrowDown className="h-3 w-3 text-red-500 -mt-0.5 drop-shadow" strokeWidth={3} />
              </div>
            </div>
            <span className="font-bold text-xl text-slate-900">{SITE}</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">Sign In</Link>
            <Link href="/register" className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors">
              Get Started Free
            </Link>
          </nav>
        </div>
      </header>

      <main className="container py-16 max-w-xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Contact Us</h1>
        <p className="text-slate-500 mb-8">
          Have a question, spotted a bug, or want to share feedback? Fill in the form below and
          we&apos;ll get back to you as soon as possible.
        </p>

        <div className="rounded-2xl border border-black/10 bg-white/60 backdrop-blur-sm p-8 shadow-sm">
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Please note: {SITE} is not affiliated with any of the websites it monitors. For
            issues with a specific website, contact that website&apos;s support team directly.
          </p>

          {success ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <CheckCircle2 className="h-14 w-14 text-green-500" />
              <h2 className="text-xl font-bold text-slate-900">Message sent!</h2>
              <p className="text-slate-500 text-sm">Thanks for reaching out. We&apos;ll reply to your email shortly.</p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name <span className="text-red-500">*</span></label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Jane Smith"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="jane@example.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject <span className="text-red-500">*</span></label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                >
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us how we can help…"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="border-t border-black/10 py-8 mt-16">
        <div className="container text-center text-sm text-slate-500 flex flex-col items-center gap-2">
          <span>
            © {new Date().getFullYear()} {SITE}.{" "}
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
