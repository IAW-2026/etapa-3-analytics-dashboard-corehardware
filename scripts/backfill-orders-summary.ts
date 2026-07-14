// Las variables de entorno (.env y .env.local) se cargan a nivel de proceso
// con el flag --env-file de Node, ANTES de que arranque este script — ver el
// comando de ejecución al final del archivo. No cargarlas acá con dotenv:
// los `import` de ESM se hoistean por encima de cualquier código normal, así
// que un `config()` escrito antes del `import { prisma }` de todos modos se
// ejecuta DESPUÉS de que lib/prisma.ts ya leyó (y cacheó, vacío) DATABASE_URL.
// Esto fue justo lo que causó el error "SASL: client password must be a
// string" en los intentos anteriores.
import { prisma } from "../lib/prisma";
import { fetchSourceData, buildSnapshotsForDate } from "../lib/sync/aggregate";
import {
  persistDailyRevenueSnapshot,
  persistTopSellerSnapshots,
  persistTopProductSnapshots,
  persistNewBuyersSnapshot,
} from "../lib/sync/persistence";

const BACKFILL_DAYS = 120;

function getUTCDateDaysAgo(daysAgo: number): Date {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date;
}

// Borra el historial existente de los 4 modelos nuevos antes de recrearlo
// desde cero, igual que hace el backfill viejo con los 3 modelos originales.
// Si esto tira error de "model does not exist", confirmar el nombre exacto
// de cada modelo en schema.prisma (puede que no coincida 1:1 con el nombre
// del tipo *SnapshotData en aggregate.ts).
async function clearExistingHistory(): Promise<void> {
  await prisma.$transaction([
    prisma.dailyRevenueSnapshot.deleteMany(),
    prisma.topSellerSnapshot.deleteMany(),
    prisma.topProductSnapshot.deleteMany(),
    prisma.newBuyersSnapshot.deleteMany(),
  ]);
}

async function run(): Promise<void> {
  console.log("Borrando historial existente (4 tablas nuevas)...");
  await clearExistingHistory();

  const fechaHasta = getUTCDateDaysAgo(0);
  const fechaDesde = getUTCDateDaysAgo(BACKFILL_DAYS);

  console.log(
    `Trayendo pedidos + catálogo actual una sola vez (rango ${fechaDesde.toISOString().slice(0, 10)} a ${fechaHasta
      .toISOString()
      .slice(0, 10)})...`,
  );
  const source = await fetchSourceData(fechaDesde, fechaHasta);

  let dailyRevenueCount = 0;
  let topSellersCount = 0;
  let topProductsCount = 0;
  let newBuyersCount = 0;

  for (let daysAgo = BACKFILL_DAYS; daysAgo >= 0; daysAgo--) {
    const date = getUTCDateDaysAgo(daysAgo);
    const snapshots = buildSnapshotsForDate(date, source);

    await persistDailyRevenueSnapshot(snapshots.dailyRevenue);
    dailyRevenueCount += 1;

    if (snapshots.topSellers.length > 0) {
      await persistTopSellerSnapshots(snapshots.topSellers);
      topSellersCount += snapshots.topSellers.length;
    }

    if (snapshots.topProducts.length > 0) {
      await persistTopProductSnapshots(snapshots.topProducts);
      topProductsCount += snapshots.topProducts.length;
    }

    await persistNewBuyersSnapshot(snapshots.newBuyers);
    newBuyersCount += 1;

    if (daysAgo % 10 === 0) {
      console.log(`  ...procesado día ${date.toISOString().slice(0, 10)} (faltan ${daysAgo} días)`);
    }
  }

  console.log("Backfill completo.");
  console.log(`  DailyRevenueSnapshot: ${dailyRevenueCount} filas`);
  console.log(`  TopSellerSnapshot: ${topSellersCount} filas`);
  console.log(`  TopProductSnapshot: ${topProductsCount} filas`);
  console.log(`  NewBuyersSnapshot: ${newBuyersCount} filas`);
}

run()
  .catch((error) => {
    console.error("Backfill falló:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Correr así (PowerShell), cargando ambos .env a nivel de proceso:
//   npx tsx --env-file=.env --env-file=.env.local scripts/backfill-orders-summary.ts