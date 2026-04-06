import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, ArrowDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy – iswebsitedownforeveryone.com",
  description:
    "Read the privacy policy for iswebsitedownforeveryone.com. Learn how we collect, use, and protect your data when you use our website monitoring service.",
};

const LAST_UPDATED = "April 6, 2025";
const SITE = "iswebsitedownforeveryone.com";
const EMAIL = "admin@iswebsitedownforeveryone.com";

export default function PrivacyPolicyPage() {
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
            <Link href="/login" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">
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

      <main className="container py-16 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-slate max-w-none space-y-10">

          <section>
            <p className="text-slate-600 leading-relaxed">
              Your privacy is important to us. This Privacy Policy explains how{" "}
              <strong>{SITE}</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and
              protects your information when you visit our website or use our
              website monitoring service. By using {SITE}, you agree to the
              practices described in this policy.
            </p>
          </section>

          <Section title="1. Information We Collect">
            <SubSection title="a) Information You Provide">
              <p>When you create a free account, we collect:</p>
              <ul>
                <li><strong>Email address</strong> — used for account authentication and sending monitoring alerts.</li>
                <li><strong>Password</strong> — stored as a salted hash; we never store your plain-text password.</li>
                <li><strong>Monitor configuration</strong> — the URLs you add for monitoring, check intervals, and alert preferences.</li>
              </ul>
            </SubSection>

            <SubSection title="b) Information Collected Automatically">
              <p>
                Like most web services, we automatically collect certain technical
                data when you visit or interact with our site:
              </p>
              <ul>
                <li>IP address and approximate geographic region</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Referring URL and exit pages</li>
                <li>Pages visited and time spent on pages</li>
                <li>Date and time of requests</li>
              </ul>
              <p>
                This data is used in aggregate to understand how visitors use our
                site, diagnose technical issues, and improve our service. It is
                not linked to personally identifiable information.
              </p>
            </SubSection>

            <SubSection title="c) Monitoring Data">
              <p>
                When you add a website to monitor, our servers periodically send
                HTTP requests to that URL to check its availability, response
                time, and SSL certificate status. We store these results in our
                database to power your dashboard, uptime history, and alerts.
              </p>
            </SubSection>
          </Section>

          <Section title="2. Cookies">
            <p>
              We use a minimal session cookie to keep you logged in to your
              account. This cookie is strictly necessary for the service to
              function and does not track your browsing activity on other
              websites.
            </p>
            <p>
              We also use <strong>Google AdSense</strong> to display
              advertisements on our site. Google may use cookies (including the
              DART cookie) to serve ads based on your visits to this and other
              websites. You can opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Ads Settings
              </a>
              .
            </p>
            <p>
              We have no access to or control over the cookies set by third-party
              advertising partners.
            </p>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul>
              <li>To create and manage your account</li>
              <li>To verify your email address and authenticate logins</li>
              <li>To perform website availability and SSL certificate checks on your behalf</li>
              <li>To send email alerts when a monitored site goes down, recovers, or its SSL certificate is expiring</li>
              <li>To send transactional emails such as password reset and email verification</li>
              <li>To analyze usage trends and improve our service</li>
              <li>To display relevant advertising via Google AdSense</li>
            </ul>
            <p>
              We do <strong>not</strong> sell, rent, or share your personal
              information with third parties for marketing purposes.
            </p>
          </Section>

          <Section title="4. Email Communications">
            <p>
              We use <strong>Resend</strong> (resend.com) as our email delivery
              provider. Your email address is transmitted to Resend solely for
              the purpose of delivering transactional messages you have
              requested (account verification, password reset, downtime alerts).
              Resend does not use your email for their own marketing purposes.
              You can review Resend&apos;s privacy policy at{" "}
              <a
                href="https://resend.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                resend.com/legal/privacy-policy
              </a>
              .
            </p>
            <p>
              You can disable email alerts at any time from your account&apos;s
              Alerts settings page.
            </p>
          </Section>

          <Section title="5. Data Storage & Security">
            <p>
              Your data is stored in a managed PostgreSQL database hosted by
              Prisma Data Platform. We apply industry-standard security
              measures including encrypted connections (TLS/SSL), hashed
              passwords, and access controls to protect your information.
            </p>
            <p>
              While we take reasonable steps to safeguard your data, no method
              of transmission or storage over the internet is 100% secure. We
              cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We retain your account data for as long as your account is active.
              Monitor check history is retained for up to 90 days. If you delete
              your account, we will remove your personal data from our systems
              within 30 days, except where retention is required by law.
            </p>
          </Section>

          <Section title="7. Third-Party Links">
            <p>
              Our site may contain links to external websites. We are not
              responsible for the content or privacy practices of those sites.
              We encourage you to review the privacy policy of any website you
              visit that may collect your personal information.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              {SITE} is not directed at children under the age of 13. We do not
              knowingly collect personal information from children. If you
              believe a child has provided us with personal data, please contact
              us and we will delete it promptly.
            </p>
          </Section>

          <Section title="9. Your Rights">
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Object to or restrict certain processing of your data</li>
              <li>Data portability</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{" "}
              <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline">
                {EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do,
              we will revise the &quot;Last updated&quot; date at the top of this page. We
              encourage you to review this page periodically to stay informed
              about how we protect your information. Continued use of the
              service after any changes constitutes your acceptance of the
              updated policy.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              If you have any questions or concerns about this Privacy Policy or
              how we handle your data, please contact us at:
            </p>
            <address className="not-italic mt-2 text-slate-700">
              <strong>{SITE}</strong>
              <br />
              Email:{" "}
              <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline">
                {EMAIL}
              </a>
            </address>
          </Section>

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-3 mt-8">{title}</h2>
      <div className="text-slate-600 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
      <div className="space-y-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}
