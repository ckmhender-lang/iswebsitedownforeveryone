import Link from "next/link";
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";
import { verifyEmailToken } from "@/lib/tokens";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <Layout>
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Link</h1>
        <p className="text-slate-600 mb-6">No verification token found in the link.</p>
        <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium text-sm">
          Back to Sign In
        </Link>
      </Layout>
    );
  }

  const result = await verifyEmailToken(token);

  return (
    <Layout>
      {result.success ? (
        <>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h1>
          <p className="text-slate-600 mb-6">
            Your email has been confirmed. You can now sign in to your account.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Sign In
          </Link>
        </>
      ) : (
        <>
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h1>
          <p className="text-slate-600 mb-6">{result.error}</p>
          <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium text-sm">
            Register again
          </Link>
        </>
      )}
    </Layout>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-apple-core p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-900">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            <span className="text-2xl font-bold">iswebsitedownforeveryone.com</span>
          </Link>
        </div>
        <div className="rounded-2xl border-2 border-blue-200 bg-white p-8 shadow-sm text-center">
          {children}
        </div>
      </div>
    </div>
  );
}
