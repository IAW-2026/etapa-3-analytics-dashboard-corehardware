import { fetchPedidosEnRango, fetchProductos, fetchVendedores, fetchCompradores } from "./fetchers";
import { agruparProductosEnRango } from "./orders/products";
import { agruparVendedoresEnRango } from "./orders/sellers";
import { calcularRevenueDelDia } from "./orders/revenue";
import { contarCompradoresNuevos } from "./new-buyers";
import type { Pedido, Producto, Vendedor, Comprador } from "./types";

export type DailyRevenueSnapshotData = {
  date: Date;
  revenueProductos: number;
  revenueEnvio: number;
  revenueTotal: number;
  ordersCount: number;
  ticketPromedio: number;
};

export type TopSellerSnapshotData = {
  date: Date;
  sellerId: string;
  sellerName: string | null;
  orders: number;
  revenue: number;
};

export type TopProductSnapshotData = {
  date: Date;
  productId: string;
  productName: string | null;
  quantity: number;
};

export type NewBuyersSnapshotData = {
  date: Date;
  count: number;
};

export type DailySnapshots = {
  dailyRevenue: DailyRevenueSnapshotData;
  topSellers: TopSellerSnapshotData[];
  topProducts: TopProductSnapshotData[];
  newBuyers: NewBuyersSnapshotData;
};

// Datos crudos de las 4 fuentes, ya traídos, listos para calcular snapshots
// de uno o más días sin volver a pegarle a las APIs externas.
export type SourceData = {
  pedidos: Pedido[];
  productos: Producto[];
  vendedores: Vendedor[];
  compradores: Comprador[];
};

function toFechaISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Trae pedidos del rango [fechaDesde, fechaHasta] + el catálogo actual
// completo de productos/vendedores/compradores. Pensada para pedirse UNA
// SOLA VEZ y reutilizarse en múltiples llamadas a buildSnapshotsForDate
// (ej. un backfill de 120 días no debería hacer 120 fetches de productos).
export async function fetchSourceData(fechaDesde: Date, fechaHasta: Date): Promise<SourceData> {
  const [pedidos, productos, vendedores, compradores] = await Promise.all([
    fetchPedidosEnRango(toFechaISO(fechaDesde), toFechaISO(fechaHasta)),
    fetchProductos(),
    fetchVendedores(),
    fetchCompradores(),
  ]);

  return { pedidos, productos, vendedores, compradores };
}

// Calcula los 4 snapshots de un día puntual a partir de SourceData ya
// traído. Filtra pedidos/compradores a esa fecha exacta en memoria — no
// hace ningún fetch. No persiste nada; eso lo hacen las funciones de
// persistence.ts.
export function buildSnapshotsForDate(date: Date, source: SourceData): DailySnapshots {
  const fecha = toFechaISO(date);

  const pedidosDelDia = source.pedidos.filter((p) => toFechaISO(new Date(p.fecha)) === fecha);

  const revenue = calcularRevenueDelDia(pedidosDelDia);

  const productosAgrupados = agruparProductosEnRango(pedidosDelDia);
  const nombreProducto = new Map(source.productos.map((p) => [p.id, p.nombre]));
  const topProducts: TopProductSnapshotData[] = productosAgrupados.map((p) => ({
    date,
    productId: p.id,
    productName: nombreProducto.get(p.id) ?? null,
    quantity: p.cantidad,
  }));

  const vendedoresAgrupados = agruparVendedoresEnRango(pedidosDelDia);
  const nombreVendedor = new Map(source.vendedores.map((v) => [v.id, v.razon_social]));
  const topSellers: TopSellerSnapshotData[] = vendedoresAgrupados.map((v) => ({
    date,
    sellerId: v.id,
    sellerName: nombreVendedor.get(v.id) ?? null,
    orders: v.orders,
    revenue: v.revenue,
  }));

  const newBuyers: NewBuyersSnapshotData = {
    date,
    count: contarCompradoresNuevos(source.compradores, fecha),
  };

  return {
    dailyRevenue: {
      date,
      revenueProductos: revenue.revenueProductos,
      revenueEnvio: revenue.revenueEnvio,
      revenueTotal: revenue.revenueTotal,
      ordersCount: revenue.ordersCount,
      ticketPromedio: revenue.ticketPromedio,
    },
    topSellers,
    topProducts,
    newBuyers,
  };
}

// Punto de entrada del cron: arma los 4 snapshots nuevos para un único día.
// Sigue funcionando igual que antes (fetch + build en un solo paso) —
// el cron no necesita saber que por dentro ahora se apoya en fetchSourceData
// + buildSnapshotsForDate.
export async function construirSnapshotsDelDia(date: Date): Promise<DailySnapshots> {
  const source = await fetchSourceData(date, date);
  return buildSnapshotsForDate(date, source);
}