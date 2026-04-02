import { Metadata } from "next";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account preferences</p>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white/40 p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Account</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Name</p>
            <p className="text-slate-900 mt-1">{session?.user?.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-slate-500">Email</p>
            <p className="text-slate-900 mt-1">{session?.user?.email ?? "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
