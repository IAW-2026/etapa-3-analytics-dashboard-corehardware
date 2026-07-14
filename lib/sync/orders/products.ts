import { ESTADOS_PEDIDO_EXCLUIDOS_DE_VENTAS } from "../constants";
import type { Pedido } from "../types";

export type ProductoAgrupado = {
  id: string;
  cantidad: number;
};

export function agruparProductosEnRango(pedidos: Pedido[]): ProductoAgrupado[] {
  const map = new Map<string, number>();

  for (const pedido of pedidos) {
    if (ESTADOS_PEDIDO_EXCLUIDOS_DE_VENTAS.includes(pedido.estado)) continue;
    for (const productoId of pedido.productos_id ?? []) {
      map.set(productoId, (map.get(productoId) ?? 0) + 1);
    }
  }

  return Array.from(map.entries()).map(([id, cantidad]) => ({ id, cantidad }));
}