import type { KpiValue } from "../types";

export type DateFallbackInfo = {
  requestedDate: string; // YYYY-MM-DD, lo que pidió el usuario (o hoy por default)
  actualDate: string | null; // YYYY-MM-DD del snapshot realmente mostrado (null si no hay ningún dato en toda la historia)
  isFallback: boolean;
};

// KpiValue + una bandera que distingue "no hubo período anterior con datos"
// de "el período anterior existió pero dio un cambio de 0%". Sin esto,
// calculateChangePct no puede diferenciar ambos casos (los dos devuelven
// changePct: undefined por el guard de división por cero).
export type ComparableKpiValue = KpiValue & { hasPreviousData: boolean };

export type RevenueKpis = {
  revenueProductos: ComparableKpiValue;
  revenueEnvio: ComparableKpiValue;
  revenueTotal: ComparableKpiValue;
  ordersCount: ComparableKpiValue;
  ticketPromedio: ComparableKpiValue;
};

export type TopSellerRow = {
  sellerId: string;
  sellerName: string;
  orders: number;
  revenue: number;
};

export type TopProductRow = {
  productId: string;
  productName: string;
  quantity: number;
};

export type NewBuyersKpi = ComparableKpiValue;

export type OrdersSummaryData = {
  dateInfo: DateFallbackInfo;
  revenue: RevenueKpis;
  topSellers: TopSellerRow[];
  topProducts: TopProductRow[];
  newBuyers: NewBuyersKpi;
};