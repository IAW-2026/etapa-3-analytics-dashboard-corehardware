import { toSafeNumber } from "@/lib/utils/numbers";
import {
  APP_DISPLAY_NAME,
  APP_HREF,
  APP_KEY_METRIC,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_TONE,
  SYNC_STATUS_TO_HEALTH,
} from "./constants";
import type {
  ApiSyncStatus,
  AppSummarySnapshot,
  DashboardSnapshot,
  OrderStatusSnapshot,
  SourceApp,
} from "@prisma/client";
import type {
  ApiHealthRow,
  AppSummaryRow,
  DashboardKpis,
  KpiValue,
  OrderStatusDistribution,
  TrendPoint,
} from "./types";

function calculateChangePct(current: number, previous: number): number | undefined {
  if (previous === 0) return undefined;
  return ((current - previous) / previous) * 100;
}

function buildKpiValue(current: number, previous: number | undefined): KpiValue {
  return {
    value: current,
    changePct: previous === undefined ? undefined : calculateChangePct(current, previous),
  };
}

export function buildKpis(
  latest: DashboardSnapshot | null,
  previous: DashboardSnapshot | null,
): DashboardKpis {
  const empty: KpiValue = { value: 0 };

  if (!latest) {
    return {
      gmv: empty,
      totalOrders: empty,
      pendingShipments: empty,
      accreditedAmount: empty,
      activeUsers: empty,
    };
  }

  return {
    gmv: buildKpiValue(toSafeNumber(latest.gmv), previous ? toSafeNumber(previous.gmv) : undefined),
    totalOrders: buildKpiValue(latest.orders, previous?.orders),
    pendingShipments: buildKpiValue(latest.pendingShipping, previous?.pendingShipping),
    accreditedAmount: buildKpiValue(
      toSafeNumber(latest.settled),
      previous ? toSafeNumber(previous.settled) : undefined,
    ),
    activeUsers: buildKpiValue(latest.activeUsers, previous?.activeUsers),
  };
}

export function buildTrendPoints(snapshots: DashboardSnapshot[]): TrendPoint[] {
  return snapshots.map((snapshot) => ({
    date: snapshot.date.toISOString().slice(0, 10),
    gmv: toSafeNumber(snapshot.gmv),
    orders: snapshot.orders,
  }));
}

export function buildOrderStatusDistribution(rows: OrderStatusSnapshot[]): OrderStatusDistribution {
  return rows
    .filter((row) => row.count > 0)
    .map((row) => ({
      status: ORDER_STATUS_LABEL[row.status] ?? row.status,
      value: row.count,
      tone: ORDER_STATUS_TONE[row.status] ?? "neutral",
    }));
}

function secondsSince(date: Date): number {
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
}

export function buildApiHealth(syncStatuses: ApiSyncStatus[]): ApiHealthRow[] {
  return syncStatuses.map((row) => ({
    app: APP_DISPLAY_NAME[row.app],
    status: SYNC_STATUS_TO_HEALTH[row.status],
    message: row.message ?? undefined,
    lastSyncSecondsAgo: secondsSince(row.lastSyncedAt),
  }));
}

function formatMetricValue(metric: string, value: number): string {
  const isCurrency = metric === "montoAcreditado" || metric === "gmv" || metric === "montoVentas";

  if (isCurrency) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat("es-AR").format(value);
}

export function buildAppSummary(
  syncStatuses: ApiSyncStatus[],
  summaryRows: AppSummarySnapshot[],
): AppSummaryRow[] {
  return syncStatuses.map((sync) => {
    const keyMetric = APP_KEY_METRIC[sync.app];
    const metricRow = summaryRows.find(
      (row) => row.app === sync.app && row.metric === keyMetric.metric,
    );
    const metricValue = metricRow ? toSafeNumber(metricRow.value) : 0;

    return {
      app: APP_DISPLAY_NAME[sync.app],
      metricLabel: keyMetric.label,
      metricValue: formatMetricValue(keyMetric.metric, metricValue),
      status: SYNC_STATUS_TO_HEALTH[sync.status],
      lastSyncSecondsAgo: secondsSince(sync.lastSyncedAt),
      href: APP_HREF[sync.app],
    };
  });
}