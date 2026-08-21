import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { listAlertsForUser, listMonitorsForUser } from "@/lib/local-store";
import { EmailAlertForm } from "@/components/alerts/email-alert-form";

export const metadata: Metadata = { title: "Alerts" };

export default async function AlertsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const alerts = listAlertsForUser(userId).filter((a) => a.channel === "EMAIL");
  const monitors = listMonitorsForUser(userId)
    .map((m) => ({ id: m.id, name: m.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const emailAlerts = alerts.map((a) => ({
    id: a.id,
    target: a.target,
    enabled: a.enabled,
    monitorId: a.monitorId,
    alertType: a.alertType,
  }));

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Alerts</h1>
        <p className="text-slate-600 mt-1">Get notified when your monitors go down</p>
      </div>

      <EmailAlertForm alerts={emailAlerts} monitors={monitors} />
    </div>
  );
}
