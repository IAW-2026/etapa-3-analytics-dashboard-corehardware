import { toSafeNumber } from "@/lib/utils/numbers";
import {
  ESTADOS_PEDIDO,
  ESTADOS_ENVIO_PENDIENTES,
  ESTADOS_PEDIDO_EXCLUIDOS_DE_GMV,
  ESTADO_PAGO_ACREDITADO,
} from "./constants";
import type { Comprador, Pedido, ForeignSale, Envio, Pago } from "./types";
import type { SourceApp } from "@prisma/client";

export type DashboardMetrics = {
  gmv: number;
  totalOrders: number;
  pendingShipping: number;
  settled: number;
  activeUsers: number;
};

export function calculateDashboardMetrics(
  pedidos: Pedido[],
  compradores: Comprador[],
  envios: Envio[],
  pagos: Pago[]
): DashboardMetrics {
  const gmv = pedidos
    .filter((pedido) => !ESTADOS_PEDIDO_EXCLUIDOS_DE_GMV.includes(pedido.estado))
    .reduce((acc, pedido) => acc + toSafeNumber(pedido.monto), 0);

  const pendingShipping = envios.filter((envio) => ESTADOS_ENVIO_PENDIENTES.includes(envio.estado)).length;

  const settled = pagos
    .filter((pago) => pago.estado === ESTADO_PAGO_ACREDITADO)
    .reduce((acc, pago) => acc + toSafeNumber(pago.monto), 0);

  return {
    gmv,
    totalOrders: pedidos.length,
    pendingShipping,
    settled,
    activeUsers: compradores.length,
  };
}

export type OrderStatusCount = {
  status: Pedido["estado"];
  count: number;
};

export function calculateOrderStatusCounts(pedidos: Pedido[]): OrderStatusCount[] {
  return ESTADOS_PEDIDO.map((estado) => ({
    status: estado,
    count: pedidos.filter((pedido) => pedido.estado === estado).length,
  }));
}

export type AppMetric = {
  app: SourceApp;
  metric: string;
  value: number;
};

export function calculateAppSummaryMetrics(
  compradores: Comprador[],
  pedidos: Pedido[],
  ventas: ForeignSale[],
  envios: Envio[],
  pagos: Pago[],
  dashboardMetrics: DashboardMetrics
): AppMetric[] {
  const ventasTotal = ventas.reduce((acc, venta) => acc + toSafeNumber(venta.totalPrice), 0);

  return [
    { app: "BUYER", metric: "totalCompradores", value: compradores.length },
    { app: "BUYER", metric: "totalPedidos", value: pedidos.length },
    { app: "BUYER", metric: "gmv", value: dashboardMetrics.gmv },
    { app: "SELLER", metric: "cantidadVentas", value: ventas.length },
    { app: "SELLER", metric: "montoVentas", value: ventasTotal },
    { app: "SHIPPING", metric: "totalEnvios", value: envios.length },
    { app: "SHIPPING", metric: "pendientes", value: dashboardMetrics.pendingShipping },
    { app: "PAYMENTS", metric: "totalPagos", value: pagos.length },
    { app: "PAYMENTS", metric: "montoAcreditado", value: dashboardMetrics.settled },
  ];
}