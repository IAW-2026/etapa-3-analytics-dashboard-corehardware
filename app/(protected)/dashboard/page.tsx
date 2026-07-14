import { TrendChart } from "@/components/dashboard/TrendChart";
import { ApiHealthPanel } from "@/components/dashboard/ApiHealthPanel";
import { AppSummaryTable } from "@/components/dashboard/AppSummaryTable";
import { OrdersDrillDownController } from "@/components/dashboard/OrdersDrillDownController";
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
  buildFulfillmentStatusDistribution,
  buildKpis,
  buildPaymentStatusDistribution,
  buildTrendPoints,
} from "@/lib/dashboard/view-model";

export const dynamic = "force-dynamic";

const TREND_DAYS = 30;

export default async function DashboardHomePage() {
  const latestSnapshot = await getLatestDashboardSnapshot();

  const [previousSnapshot, trendSnapshots, orderStatusRows, syncStatuses, appSummaryRows] =
    await Promise.all([
      latestSnapshot ? getPreviousDashboardSnapshot(latestSnapshot.date) : Promise.resolve(null),
      getTrendSnapshots(TREND_DAYS),
      getLatestOrderStatusSnapshots(),
      getApiSyncStatuses(),
      getLatestAppSummarySnapshots(),
    ]);

  const kpis = buildKpis(latestSnapshot, previousSnapshot);
  const trendData = buildTrendPoints(trendSnapshots);
  const fulfillmentDistribution = buildFulfillmentStatusDistribution(orderStatusRows);
  const paymentDistribution = buildPaymentStatusDistribution(orderStatusRows);
  const apiHealth = buildApiHealth(syncStatuses);
  const appSummary = buildAppSummary(syncStatuses, appSummaryRows);

  return (
    <div className="flex flex-col gap-6 p-6">
      <OrdersDrillDownController
        kpis={kpis}
        fulfillmentDistribution={fulfillmentDistribution}
        paymentDistribution={paymentDistribution}
      />
      <TrendChart data={trendData} />

      <ApiHealthPanel data={apiHealth} />
      <AppSummaryTable data={appSummary} />
    </div>
  );
}