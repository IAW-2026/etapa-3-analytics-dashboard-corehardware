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
  statusKey: string; // enum crudo (ej. "EN_CAMINO"), para lookup de color por estado
  value: number;
  tone: Tone;
};

export type OrderStatusDistribution = OrderStatusEntry[];

// Alias semánticos: mismo shape que OrderStatusDistribution, pero cada uno
// representa un subconjunto de estados (ver PAYMENT_STATUSES /
// FULFILLMENT_STATUSES en constants.ts).
export type PaymentStatusDistribution = OrderStatusEntry[];
export type FulfillmentStatusDistribution = OrderStatusEntry[];

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