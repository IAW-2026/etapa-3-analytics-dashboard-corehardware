import { ESTADOS_PEDIDO_EXCLUIDOS_DE_VENTAS } from "../constants";
import { resolverDesgloseEnvio } from "./revenue";
import type { Pedido } from "../types";

export type VendedorAgrupado = {
  id: string;
  orders: number;
  revenue: number;
};

// Un pedido pertenece a un único vendedor (Pedido.vendedor_id), así que
// no hace falta desglosar por producto: se agrupa directo por vendedor_id.
// revenue = solo subtotal de productos (el envío no es ingreso del vendedor).
export function agruparVendedoresEnRango(pedidos: Pedido[]): VendedorAgrupado[] {
  const map = new Map<string, VendedorAgrupado>();

  for (const pedido of pedidos) {
    if (ESTADOS_PEDIDO_EXCLUIDOS_DE_VENTAS.includes(pedido.estado)) continue;

    const { subtotalProductos } = resolverDesgloseEnvio(pedido);
    const actual = map.get(pedido.vendedor_id) ?? { id: pedido.vendedor_id, orders: 0, revenue: 0 };

    actual.orders += 1;
    actual.revenue += subtotalProductos;
    map.set(pedido.vendedor_id, actual);
  }

  return Array.from(map.values());
}