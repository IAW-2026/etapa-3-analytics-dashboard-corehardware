import { NextRequest, NextResponse } from "next/server";
import { syncDashboard } from "@/lib/jobs/sync-dashboard";
import { syncOrdersAnalytics } from "@/lib/jobs/sync-orders-analytics";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [dashboardResult, ordersAnalyticsResult] = await Promise.allSettled([
    syncDashboard(),
    syncOrdersAnalytics(),
  ]);

  const dashboard =
    dashboardResult.status === "fulfilled"
      ? { ok: true, result: dashboardResult.value }
      : { ok: false, error: dashboardResult.reason instanceof Error ? dashboardResult.reason.message : "Error desconocido" };

  const ordersAnalytics =
    ordersAnalyticsResult.status === "fulfilled"
      ? { ok: true, result: ordersAnalyticsResult.value }
      : { ok: false, error: ordersAnalyticsResult.reason instanceof Error ? ordersAnalyticsResult.reason.message : "Error desconocido" };

  const status = dashboard.ok && ordersAnalytics.ok ? 200 : 500;

  return NextResponse.json({ dashboard, ordersAnalytics }, { status });
}