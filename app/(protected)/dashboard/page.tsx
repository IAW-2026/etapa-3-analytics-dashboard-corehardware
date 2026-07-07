import { KpiStrip } from "@/components/dashboard/KpiStrip";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { OrderStatusDonut } from "@/components/dashboard/OrderStatusDonut";
import { ApiHealthPanel } from "@/components/dashboard/ApiHealthPanel";
import { AppSummaryTable } from "@/components/dashboard/AppSummaryTable";
import {
  getApiSyncStatuses,
  getLatestAppSummarySnapshots,
  getLatestDashboardSnapshot,
  getLatestOrderStatusSnapshots,
  getPreviousDashboardSnapshot,
  getTrendSnapshots,
} from "@/lib/dashboard/queries";
import {
  buildApiHealth,
  buildAppSummary,
  buildKpis,
  buildOrderStatusDistribution,
  buildTrendPoints,
} from "@/lib/dashboard/view-model";

// Sin esto, Next.js puede cachear esta página como estática en build time
// (Full Route Cache) y el dashboard quedaría mostrando datos congelados de
// build, no del sync real — el mismo tipo de problema de fetch/caching que
// ya te dio dolores de cabeza en Vercel.
export const dynamic = "force-dynamic";

const TREND_DAYS = 30;

export default async function DashboardHomePage() {
  const t0 = performance.now();
  const latestSnapshot = await getLatestDashboardSnapshot();
  const t1 = performance.now();
  console.log(`[timing] latestSnapshot: ${(t1 - t0).toFixed(1)}ms`);

  const [previousSnapshot, trendSnapshots, orderStatusRows, syncStatuses, appSummaryRows] =
    await Promise.all([
      latestSnapshot ? getPreviousDashboardSnapshot(latestSnapshot.date) : Promise.resolve(null),
      getTrendSnapshots(TREND_DAYS),
      getLatestOrderStatusSnapshots(),
      getApiSyncStatuses(),
      getLatestAppSummarySnapshots(),
    ]);
  const t2 = performance.now();
  console.log(`[timing] parallelQueries: ${(t2 - t1).toFixed(1)}ms`);
  console.log(`[timing] TOTAL handler: ${(t2 - t0).toFixed(1)}ms`);

  const kpis = buildKpis(latestSnapshot, previousSnapshot);
  const trendData = buildTrendPoints(trendSnapshots);
  const orderStatusDistribution = buildOrderStatusDistribution(orderStatusRows);
  const apiHealth = buildApiHealth(syncStatuses);
  const appSummary = buildAppSummary(syncStatuses, appSummaryRows);

  return (
    <div className="flex flex-col gap-6 p-6">
      <KpiStrip kpis={kpis} />
      <TrendChart data={trendData} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OrderStatusDonut data={orderStatusDistribution} />
        <ApiHealthPanel data={apiHealth} />
      </div>
      <AppSummaryTable data={appSummary} />
    </div>
  );
}