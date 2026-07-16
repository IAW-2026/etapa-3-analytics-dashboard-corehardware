import { prisma } from "@/lib/prisma";
import { toSafeNumber } from "@/lib/utils/numbers";
import { TOP_SELLERS_LIMIT, TOP_PRODUCTS_LIMIT } from "./constants";

// Busca el snapshot de una fecha puntual; si no existe, cae al más reciente
// disponible antes de esa fecha. `isFallback` le indica a la UI que el dato
// mostrado no es el del día pedido, para poder avisarlo.
async function findDailyRevenueWithFallback(date: Date) {
  const exact = await prisma.dailyRevenueSnapshot.findFirst({ where: { date } });
  if (exact) return { snapshot: exact, isFallback: false };

  const fallback = await prisma.dailyRevenueSnapshot.findFirst({
    where: { date: { lt: date } },
    orderBy: { date: "desc" },
  });
  return { snapshot: fallback, isFallback: fallback !== null };
}

async function findNewBuyersWithFallback(date: Date) {
  const exact = await prisma.newBuyersSnapshot.findFirst({ where: { date } });
  if (exact) return { snapshot: exact, isFallback: false };

  const fallback = await prisma.newBuyersSnapshot.findFirst({
    where: { date: { lt: date } },
    orderBy: { date: "desc" },
  });
  return { snapshot: fallback, isFallback: fallback !== null };
}

export async function getDailyRevenueForDate(date: Date) {
  return findDailyRevenueWithFallback(date);
}

export function getPreviousDailyRevenueSnapshot(latestDate: Date) {
  return prisma.dailyRevenueSnapshot.findFirst({
    where: { date: { lt: latestDate } },
    orderBy: { date: "desc" },
  });
}

export async function getTopSellerSnapshotsForDate(date: Date) {
  const { snapshot: revenueSnapshot } = await findDailyRevenueWithFallback(date);
  if (!revenueSnapshot) return [];

  return prisma.topSellerSnapshot.findMany({
    where: { date: revenueSnapshot.date },
    orderBy: { revenue: "desc" },
    take: TOP_SELLERS_LIMIT,
  });
}

export async function getTopProductSnapshotsForDate(date: Date) {
  const { snapshot: revenueSnapshot } = await findDailyRevenueWithFallback(date);
  if (!revenueSnapshot) return [];

  return prisma.topProductSnapshot.findMany({
    where: { date: revenueSnapshot.date },
    orderBy: { quantity: "desc" },
    take: TOP_PRODUCTS_LIMIT,
  });
}

export async function getNewBuyersForDate(date: Date) {
  return findNewBuyersWithFallback(date);
}

export function getPreviousNewBuyersSnapshot(latestDate: Date) {
  return prisma.newBuyersSnapshot.findFirst({
    where: { date: { lt: latestDate } },
    orderBy: { date: "desc" },
  });
}

// --- Funciones de rango (mes/año) ---
// A diferencia de las de día, acá no hay "fallback": si no hay pedidos en
// el rango, las sumas simplemente dan 0/vacío. El view-model decide cómo
// mostrar eso (sin pedir prestado datos de otro período).

export async function getDailyRevenueForRange(fechaDesde: Date, fechaHasta: Date) {
  const result = await prisma.dailyRevenueSnapshot.aggregate({
    where: { date: { gte: fechaDesde, lte: fechaHasta } },
    _sum: {
      revenueProductos: true,
      revenueEnvio: true,
      revenueTotal: true,
      ordersCount: true,
    },
  });

  const revenueProductos = toSafeNumber(result._sum.revenueProductos ?? 0);
  const revenueEnvio = toSafeNumber(result._sum.revenueEnvio ?? 0);
  const revenueTotal = toSafeNumber(result._sum.revenueTotal ?? 0);
  const ordersCount = result._sum.ordersCount ?? 0;
  // El ticket promedio del rango NO es el promedio de los tickets diarios
  // (eso pesaría igual un día con 1 pedido que uno con 50); se recalcula
  // sobre los totales sumados del rango completo, ya convertidos a número
  // plano (revenueTotal es Decimal en el schema; dividir un Decimal con "/"
  // directo depende de coerción implícita de JS, mejor evitarlo).
  const ticketPromedio = ordersCount > 0 ? revenueTotal / ordersCount : 0;

  return { revenueProductos, revenueEnvio, revenueTotal, ordersCount, ticketPromedio };
}

export async function getNewBuyersForRange(fechaDesde: Date, fechaHasta: Date) {
  const result = await prisma.newBuyersSnapshot.aggregate({
    where: { date: { gte: fechaDesde, lte: fechaHasta } },
    _sum: { count: true },
  });

  return { count: result._sum.count ?? 0 };
}

export async function getTopSellersForRange(fechaDesde: Date, fechaHasta: Date) {
  const grouped = await prisma.topSellerSnapshot.groupBy({
    by: ["sellerId"],
    where: { date: { gte: fechaDesde, lte: fechaHasta } },
    _sum: { revenue: true, orders: true },
    orderBy: { _sum: { revenue: "desc" } },
    take: TOP_SELLERS_LIMIT,
  });

  if (grouped.length === 0) return [];

  // groupBy no devuelve sellerName; se resuelve con el nombre más reciente
  // que haya quedado guardado para cada sellerId dentro del rango.
  const ids = grouped.map((g) => g.sellerId);
  const names = await prisma.topSellerSnapshot.findMany({
    where: { sellerId: { in: ids }, date: { gte: fechaDesde, lte: fechaHasta } },
    distinct: ["sellerId"],
    orderBy: { date: "desc" },
    select: { sellerId: true, sellerName: true },
  });
  const nombrePorId = new Map(names.map((n) => [n.sellerId, n.sellerName]));

  return grouped.map((g) => ({
    sellerId: g.sellerId,
    sellerName: nombrePorId.get(g.sellerId) ?? null,
    orders: g._sum.orders ?? 0,
    revenue: g._sum.revenue ?? 0,
  }));
}

export async function getTopProductsForRange(fechaDesde: Date, fechaHasta: Date) {
  const grouped = await prisma.topProductSnapshot.groupBy({
    by: ["productId"],
    where: { date: { gte: fechaDesde, lte: fechaHasta } },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: TOP_PRODUCTS_LIMIT,
  });

  if (grouped.length === 0) return [];

  const ids = grouped.map((g) => g.productId);
  const names = await prisma.topProductSnapshot.findMany({
    where: { productId: { in: ids }, date: { gte: fechaDesde, lte: fechaHasta } },
    distinct: ["productId"],
    orderBy: { date: "desc" },
    select: { productId: true, productName: true },
  });
  const nombrePorId = new Map(names.map((n) => [n.productId, n.productName]));

  return grouped.map((g) => ({
    productId: g.productId,
    productName: nombrePorId.get(g.productId) ?? null,
    quantity: g._sum.quantity ?? 0,
  }));
}