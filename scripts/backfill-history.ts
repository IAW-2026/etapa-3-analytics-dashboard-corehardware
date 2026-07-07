import { prisma } from "../lib/prisma";
import { fetchAllSources } from "../lib/sync/fetchers";
import {
  calculateDashboardMetrics,
  calculateOrderStatusCounts,
  calculateAppSummaryMetrics,
} from "../lib/sync/metrics";
import type { Comprador, Pedido, ForeignSale, Envio, Pago } from "../lib/sync/types";
import type { Prisma } from "@prisma/client";

const BACKFILL_DAYS = 120;

function getUTCDateDaysAgo(daysAgo: number): Date {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date;
}

function filterByDateHasta<T>(
  records: T[],
  cutoff: Date,
  getDate: (record: T) => string,
): T[] {
  return records.filter((record) => new Date(getDate(record)) <= cutoff);
}

function unwrap<T>(result: PromiseSettledResult<T>, sourceName: string): T {
  if (result.status === "rejected") {
    throw new Error(`Fuente ${sourceName} falló durante backfill: ${result.reason}`);
  }
  return result.value;
}

async function clearExistingHistory(): Promise<void> {
  await prisma.$transaction([
    prisma.dashboardSnapshot.deleteMany(),
    prisma.orderStatusSnapshot.deleteMany(),
    prisma.appSummarySnapshot.deleteMany(),
  ]);
}

async function run(): Promise<void> {
  console.log("Borrando historial existente...");
  await clearExistingHistory();

  console.log("Trayendo estado completo actual de las 4 APIs...");
  const results = await fetchAllSources();

  const compradores: Comprador[] = unwrap(results.compradores, "compradores");
  const pedidos: Pedido[] = unwrap(results.pedidos, "pedidos");
  const ventas: ForeignSale[] = unwrap(results.ventas, "ventas");
  const envios: Envio[] = unwrap(results.envios, "envios").items;
  const pagos: Pago[] = unwrap(results.pagos, "pagos");

  const dashboardRows: Prisma.DashboardSnapshotCreateManyInput[] = [];
  const orderStatusRows: Prisma.OrderStatusSnapshotCreateManyInput[] = [];
  const appSummaryRows: Prisma.AppSummarySnapshotCreateManyInput[] = [];

  for (let daysAgo = BACKFILL_DAYS; daysAgo >= 0; daysAgo--) {
    const cutoff = getUTCDateDaysAgo(daysAgo);

    const pedidosHasta = filterByDateHasta(pedidos, cutoff, (pedido) => pedido.fecha);
    const ventasHasta = filterByDateHasta(ventas, cutoff, (venta) => venta.date);
    const pagosHasta = filterByDateHasta(pagos, cutoff, (pago) => pago.fecha);

    // compradores y envios NO se filtran por cutoff: las APIs de origen no
    // exponen historial de cambios de estado, así que activeUsers y
    // pendingShipping son el estado ACTUAL proyectado hacia atrás. Limitación
    // honesta acordada — en días viejos puede haber 0 pedidos pero
    // activeUsers/envios mostrando el número de hoy.
    const dashboardMetrics = calculateDashboardMetrics(pedidosHasta, compradores, envios, pagosHasta);

    const orderStatusCounts = calculateOrderStatusCounts(pedidosHasta);

    const appSummaryMetrics = calculateAppSummaryMetrics(
      compradores,
      pedidosHasta,
      ventasHasta,
      envios,
      pagosHasta,
      dashboardMetrics,
    );

    dashboardRows.push({
      date: cutoff,
      gmv: dashboardMetrics.gmv,
      orders: dashboardMetrics.totalOrders,
      pendingShipping: dashboardMetrics.pendingShipping,
      settled: dashboardMetrics.settled,
      activeUsers: dashboardMetrics.activeUsers,
    });

    orderStatusCounts.forEach((row) => {
      orderStatusRows.push({ date: cutoff, status: row.status, count: row.count });
    });

    appSummaryMetrics.forEach((row) => {
      appSummaryRows.push({ date: cutoff, app: row.app, metric: row.metric, value: row.value });
    });
  }

  console.log(`Guardando ${dashboardRows.length} filas de DashboardSnapshot...`);
  await prisma.dashboardSnapshot.createMany({ data: dashboardRows });

  console.log(`Guardando ${orderStatusRows.length} filas de OrderStatusSnapshot...`);
  await prisma.orderStatusSnapshot.createMany({ data: orderStatusRows });

  console.log(`Guardando ${appSummaryRows.length} filas de AppSummarySnapshot...`);
  await prisma.appSummarySnapshot.createMany({ data: appSummaryRows });

  console.log("Backfill completo.");
}

run()
  .catch((error) => {
    console.error("Backfill falló:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });