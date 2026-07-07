import type { SourceApp, SyncStatus } from "@prisma/client";
import type { Tone } from "@/styles/theme";
import type { ApiHealthStatus } from "./types";

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