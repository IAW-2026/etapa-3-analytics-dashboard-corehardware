import { getTodayUTC } from "@/lib/utils/date";
import { construirSnapshotsDelDia } from "@/lib/sync/aggregate";
import {
  persistDailyRevenueSnapshot,
  persistTopSellerSnapshots,
  persistTopProductSnapshots,
  persistNewBuyersSnapshot,
} from "@/lib/sync/persistence";

export async function syncOrdersAnalytics() {
  const today = getTodayUTC();
  const snapshots = await construirSnapshotsDelDia(today);

  await persistDailyRevenueSnapshot(snapshots.dailyRevenue);
  await persistTopSellerSnapshots(snapshots.topSellers);
  await persistTopProductSnapshots(snapshots.topProducts);
  await persistNewBuyersSnapshot(snapshots.newBuyers);

  return snapshots;
}