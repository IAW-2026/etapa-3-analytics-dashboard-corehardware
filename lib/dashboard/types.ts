import type { Tone } from "@/styles/theme";

export type KpiValue = {
  value: number;
  changePct?: number;
};

export type DashboardKpis = {
  gmv: KpiValue;
  totalOrders: KpiValue;
  pendingShipments: KpiValue;
  accreditedAmount: KpiValue;
  activeUsers: KpiValue;
};

export type TrendPoint = {
  date: string;
  gmv: number;
  orders: number;
};

export type OrderStatusEntry = {
  status: string;
  value: number;
  tone: Tone;
};

export type OrderStatusDistribution = OrderStatusEntry[];

export type ApiHealthStatus = "online" | "degraded" | "offline";

export type ApiHealthRow = {
  app: string;
  status: ApiHealthStatus;
  message?: string;
  lastSyncSecondsAgo: number;
};

export type AppSummaryRow = {
  app: string;
  metricLabel: string;
  metricValue: string;
  status: ApiHealthStatus;
  lastSyncSecondsAgo: number;
  href: string;
};