import type { SourceApp, SyncStatus } from "@prisma/client";
import type { Tone } from "@/styles/theme";
import type { ApiHealthStatus } from "./types";
import { chartCategoryColors } from "@/styles/theme";

export const CHANGE_PCT_COMPARISON_DAYS = 7;

export const SYNC_STATUS_TO_HEALTH: Record<SyncStatus, ApiHealthStatus> = {
  OK: "online",
  DEGRADED: "degraded",
  ERROR: "offline",
};

export const APP_DISPLAY_NAME: Record<SourceApp, string> = {
  BUYER: "Buyer",
  SELLER: "Seller",
  SHIPPING: "Shipping",
  PAYMENTS: "Payments",
};

export const APP_HREF: Record<SourceApp, string> = {
  BUYER: "/usuarios",
  SELLER: "/ventas",
  SHIPPING: "/logistica",
  PAYMENTS: "/finanzas",
};

// Una métrica representativa por app en la tabla resumen. El resto de las
// métricas de AppSummarySnapshot no se descartan, solo no se muestran aquí
// (quedan disponibles para el drill-down futuro pendiente).
export const APP_KEY_METRIC: Record<SourceApp, { metric: string; label: string }> = {
  BUYER: { metric: "totalPedidos", label: "Pedidos totales" },
  SELLER: { metric: "cantidadVentas", label: "Ventas totales" },
  SHIPPING: { metric: "pendientes", label: "Pendientes de envío" },
  PAYMENTS: { metric: "montoAcreditado", label: "Monto acreditado" },
};

export const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDIENTE_PAGO: "Pendiente de pago",
  PAGO_APROBADO: "Pago aprobado",
  PAGO_RECHAZADO: "Pago rechazado",
  EN_PREPARACION: "En preparación",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export const ORDER_STATUS_TONE: Record<string, Tone> = {
  PENDIENTE_PAGO: "neutral",
  PAGO_APROBADO: "neutral",
  PAGO_RECHAZADO: "danger",
  EN_PREPARACION: "warning",
  EN_CAMINO: "warning",
  ENTREGADO: "success",
  CANCELADO: "danger",
};

// El campo `estado` de Pedido mezcla dos fases del ciclo de vida de una
// orden (pago y cumplimiento/envío) — ver PAYMENT_STATUSES /
// (styles/theme.ts) para no duplicar hex ni desviarse de la paleta de marca.

// Cada uno de los 7 estados tiene un color único, sin repetir entre
// Fulfillment y Payment, para evitar que dos estados de gráficos distintos
// se confundan si algún día se muestran lado a lado o combinados.
export const ORDER_STATUS_CHART_COLOR: Record<string, string> = {
  // Fulfillment
  EN_PREPARACION: chartCategoryColors.amber,
  EN_CAMINO: chartCategoryColors.violet,
  ENTREGADO: chartCategoryColors.cyan,
  CANCELADO: chartCategoryColors.orange,
  // Payment
  PENDIENTE_PAGO: chartCategoryColors.zinc,
  PAGO_APROBADO: chartCategoryColors.emerald,
  PAGO_RECHAZADO: chartCategoryColors.rose,
};

export const PAYMENT_STATUSES = [
  "PENDIENTE_PAGO",
  "PAGO_APROBADO",
  "PAGO_RECHAZADO",
] as const;

export const FULFILLMENT_STATUSES = [
  "EN_PREPARACION",
  "EN_CAMINO",
  "ENTREGADO",
  "CANCELADO",
] as const;

// Subconjunto de FULFILLMENT_STATUSES considerado "pendiente" para el KPI
// pendingShipments (excluye ENTREGADO y CANCELADO, que son estados finales).
export const PENDING_SHIPMENT_STATUSES = [
  "EN_PREPARACION",
  "EN_CAMINO",
] as const;

// Mismo orden de flujo de negocio que ESTADO_SORT_ORDER en Buyer
// (src/app/api/dashboard-analytics/orders/route.ts). Los repos están
// completamente separados sin imports compartidos, así que este array se
// duplica intencionalmente — si se cambia acá hay que replicarlo también
// del lado de Buyer. Se mantiene por documentación/consistencia de criterio,
// el ordenamiento real lo resuelve la query de Buyer, no este array.
export const ORDER_STATUS_SORT_ORDER: readonly string[] = [
  'PENDIENTE_PAGO',
  'PAGO_APROBADO',
  'EN_PREPARACION',
  'EN_CAMINO',
  'ENTREGADO',
  'PAGO_RECHAZADO',
  'CANCELADO',
];