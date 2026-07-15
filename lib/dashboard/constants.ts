import type { SourceApp, SyncStatus } from "@prisma/client";
import type { Tone } from "@/styles/theme";
import type { ApiHealthStatus } from "./types";
import { chartCategoryColors } from "@/styles/theme";
import type { Payment, Dispute } from "@/types/types";

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

// ---- Finanzas: Payment ----
// Cada estado tiene un color de badge y de gráfico ÚNICO (no se reutilizan
// los 4 Tone semánticos, que generaban colisiones entre dominios distintos,
// p.ej. "acreditado" y "repuesta" pintando igual por compartir tone=success).
export const PAYMENT_STATUS_LABEL: Record<Payment["estado"], string> = {
  acreditado: "Acreditado",
  pendiente: "Pendiente",
  rechazado: "Rechazado",
  en_proceso: "En proceso",
  cancelado: "Cancelado",
  reembolsado: "Reembolsado",
  contracargo: "Contracargo",
};

export const PAYMENT_STATUS_BADGE_CLASS: Record<Payment["estado"], string> = {
  acreditado: "bg-emerald-400/10 text-emerald-400",
  pendiente: "bg-violet-400/10 text-violet-400",
  en_proceso: "bg-cyan-400/10 text-cyan-400",
  rechazado: "bg-rose-400/10 text-rose-400",
  cancelado: "bg-zinc-400/10 text-zinc-400",
  reembolsado: "bg-amber-400/10 text-amber-400",
  contracargo: "bg-orange-400/10 text-orange-400",
};

export const PAYMENT_STATUS_CHART_COLOR: Record<Payment["estado"], string> = {
  acreditado: chartCategoryColors.emerald,
  pendiente: chartCategoryColors.violet,
  en_proceso: chartCategoryColors.cyan,
  rechazado: chartCategoryColors.rose,
  cancelado: chartCategoryColors.zinc,
  reembolsado: chartCategoryColors.amber,
  contracargo: chartCategoryColors.orange,
};

// ---- Finanzas: Dispute ----
// Hues disjuntos de los de Payment (sky/fuchsia/lime/indigo vs.
// emerald/violet/cyan/rose/zinc/amber/orange) para que ningún estado de
// disputa comparta color con ningún estado de pago.
export const DISPUTE_STATUS_LABEL: Record<Dispute["estado"], string> = {
  pendiente: "Pendiente",
  reembolsada: "Reembolsada",
  repuesta: "Repuesta",
  rechazada: "Rechazada",
};

export const DISPUTE_STATUS_BADGE_CLASS: Record<Dispute["estado"], string> = {
  pendiente: "bg-sky-400/10 text-sky-400",
  reembolsada: "bg-fuchsia-400/10 text-fuchsia-400",
  repuesta: "bg-lime-400/10 text-lime-400",
  rechazada: "bg-indigo-400/10 text-indigo-400",
};

// Colores para el pie de antigüedad de disputas pendientes (finances-charts).
export const DISPUTE_AGE_BUCKET_COLOR: Record<string, string> = {
  "0-7 días": chartCategoryColors.violet,
  "8-15 días": chartCategoryColors.cyan,
  "16-30 días": chartCategoryColors.amber,
  "30+ días": chartCategoryColors.rose,
};