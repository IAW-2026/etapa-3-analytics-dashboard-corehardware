import { ESTADOS_PEDIDO_EXCLUIDOS_DE_VENTAS } from "../constants";
import type { Pedido } from "../types";

const UMBRAL_ENVIO_GRATIS = 500000;
const COSTO_ENVIO_ESTANDAR = 8500;

export type DesgloseEnvio = {
  subtotalProductos: number;
  costoEnvio: number;
};

// Resuelve subtotal/envío para un pedido, en orden de confiabilidad:
// 1. Ambos valores ya guardados (pedidos post-migración) → se usan tal cual.
// 2. Solo uno guardado → el otro se deriva por resta exacta contra `monto`
//    (subtotal + envío = monto por construcción, no es una suposición).
// 3. Ambos null (pedidos históricos pre-migración) → aproximación: se
//    asume envío estándar ($8.500) si el monto total es <= $500.000, o
//    envío gratis si lo supera. Zona de ambigüedad real solo entre
//    $500.000 y $508.500 para estos pedidos viejos.
export function resolverDesgloseEnvio(pedido: Pedido): DesgloseEnvio {
  const { monto, subtotal_productos, costo_envio } = pedido;

  if (subtotal_productos !== null && costo_envio !== null) {
    return { subtotalProductos: subtotal_productos, costoEnvio: costo_envio };
  }

  if (subtotal_productos !== null) {
    return { subtotalProductos: subtotal_productos, costoEnvio: monto - subtotal_productos };
  }

  if (costo_envio !== null) {
    return { subtotalProductos: monto - costo_envio, costoEnvio: costo_envio };
  }

  if (monto <= UMBRAL_ENVIO_GRATIS) {
    return { subtotalProductos: monto - COSTO_ENVIO_ESTANDAR, costoEnvio: COSTO_ENVIO_ESTANDAR };
  }
  return { subtotalProductos: monto, costoEnvio: 0 };
}

export type DailyRevenue = {
  revenueProductos: number;
  revenueEnvio: number;
  revenueTotal: number;
  ordersCount: number;
  ticketPromedio: number;
};

export function calcularRevenueDelDia(pedidos: Pedido[]): DailyRevenue {
  const pedidosValidos = pedidos.filter(
    (pedido) => !ESTADOS_PEDIDO_EXCLUIDOS_DE_VENTAS.includes(pedido.estado)
  );

  let revenueProductos = 0;
  let revenueEnvio = 0;

  for (const pedido of pedidosValidos) {
    const desglose = resolverDesgloseEnvio(pedido);
    revenueProductos += desglose.subtotalProductos;
    revenueEnvio += desglose.costoEnvio;
  }

  const revenueTotal = revenueProductos + revenueEnvio;
  const ordersCount = pedidosValidos.length;
  const ticketPromedio = ordersCount > 0 ? revenueTotal / ordersCount : 0;

  return { revenueProductos, revenueEnvio, revenueTotal, ordersCount, ticketPromedio };
}