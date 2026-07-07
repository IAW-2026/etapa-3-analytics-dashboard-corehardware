import { getTodayUTC } from "@/lib/utils/date";
import { fetchAllSources } from "@/lib/sync/fetchers";
import { evaluateAndPersistSyncStatus } from "@/lib/sync/sync-status";
import {
  calculateDashboardMetrics,
  calculateOrderStatusCounts,
  calculateAppSummaryMetrics,
} from "@/lib/sync/metrics";
import {
  persistDashboardSnapshot,
  persistOrderStatusSnapshots,
  persistAppSummarySnapshots,
} from "@/lib/sync/persistence";

export async function syncDashboard() {
  const today = getTodayUTC();
  const results = await fetchAllSources();
  const syncStatus = await evaluateAndPersistSyncStatus(results);

  const compradores = results.compradores.status === "fulfilled" ? results.compradores.value : [];
  const pedidos = results.pedidos.status === "fulfilled" ? results.pedidos.value : [];
  const ventas = results.ventas.status === "fulfilled" ? results.ventas.value : [];
  const envios = results.envios.status === "fulfilled" ? results.envios.value.items : [];
  const pagos = results.pagos.status === "fulfilled" ? results.pagos.value : [];

  const dashboardMetrics = calculateDashboardMetrics(pedidos, compradores, envios, pagos);
  const orderStatusCounts = calculateOrderStatusCounts(pedidos);
  const appMetrics = calculateAppSummaryMetrics(compradores, pedidos, ventas, envios, pagos, dashboardMetrics);

  await persistDashboardSnapshot(today, dashboardMetrics);
  await persistOrderStatusSnapshots(today, orderStatusCounts);
  await persistAppSummarySnapshots(today, appMetrics);

  return syncStatus;
}