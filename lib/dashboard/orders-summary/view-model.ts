import { toSafeNumber } from "@/lib/utils/numbers";
import type {
  DailyRevenueSnapshot,
  NewBuyersSnapshot,
  Prisma,
  TopProductSnapshot,
} from "@prisma/client";
import type {
  ComparableKpiValue,
  DateFallbackInfo,
  NewBuyersKpi,
  RevenueKpis,
  TopProductRow,
  TopSellerRow,
} from "./types";

const UNKNOWN_SELLER_NAME = "Vendedor desconocido";
const UNKNOWN_PRODUCT_NAME = "Producto desconocido";

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function calculateChangePct(current: number, previous: number): number | undefined {
  if (previous === 0) return undefined;
  return ((current - previous) / previous) * 100;
}

// hasPreviousData es una señal aparte de changePct: puede haber período
// anterior real pero con valor 0 (changePct queda undefined igual, por el
// guard de división por cero), o puede no haber existido período anterior
// en absoluto. El caller decide cuál es cuál; acá solo se arma el objeto.
function buildKpiValue(
  current: number,
  previous: number | undefined,
  hasPreviousData: boolean,
): ComparableKpiValue {
  return {
    value: current,
    changePct: hasPreviousData && previous !== undefined ? calculateChangePct(current, previous) : undefined,
    hasPreviousData,
  };
}

export function buildDateFallbackInfo(
  requestedDate: Date,
  actualDate: Date | null,
): DateFallbackInfo {
  const requested = toDateString(requestedDate);
  return {
    requestedDate: requested,
    actualDate: actualDate ? toDateString(actualDate) : null,
    isFallback: actualDate !== null && toDateString(actualDate) !== requested,
  };
}

// Info equivalente a DateFallbackInfo pero para mes/año: acá no existe el
// concepto de "pedir prestado" otro período, así que solo indicamos si el
// rango pedido tiene datos o no (hasData), sin isFallback/actualDate.
export type RangeInfo = {
  fechaDesde: string;
  fechaHasta: string;
  hasData: boolean;
};

export function buildRangeInfo(fechaDesde: Date, fechaHasta: Date, ordersCount: number): RangeInfo {
  return {
    fechaDesde: toDateString(fechaDesde),
    fechaHasta: toDateString(fechaHasta),
    hasData: ordersCount > 0,
  };
}

export function buildRevenueKpis(
  current: DailyRevenueSnapshot | null,
  previous: DailyRevenueSnapshot | null,
): RevenueKpis {
  const empty: ComparableKpiValue = { value: 0, hasPreviousData: false };

  if (!current) {
    return {
      revenueProductos: empty,
      revenueEnvio: empty,
      revenueTotal: empty,
      ordersCount: empty,
      ticketPromedio: empty,
    };
  }

  // Para día, "hay período anterior" = existe un snapshot del día anterior
  // (fallback ya resuelto en getPreviousDailyRevenueSnapshot). Simple: previous !== null.
  const hasPreviousData = previous !== null;

  return {
    revenueProductos: buildKpiValue(
      toSafeNumber(current.revenueProductos),
      previous ? toSafeNumber(previous.revenueProductos) : undefined,
      hasPreviousData,
    ),
    revenueEnvio: buildKpiValue(
      toSafeNumber(current.revenueEnvio),
      previous ? toSafeNumber(previous.revenueEnvio) : undefined,
      hasPreviousData,
    ),
    revenueTotal: buildKpiValue(
      toSafeNumber(current.revenueTotal),
      previous ? toSafeNumber(previous.revenueTotal) : undefined,
      hasPreviousData,
    ),
    ordersCount: buildKpiValue(current.ordersCount, previous?.ordersCount, hasPreviousData),
    ticketPromedio: buildKpiValue(
      toSafeNumber(current.ticketPromedio),
      previous ? toSafeNumber(previous.ticketPromedio) : undefined,
      hasPreviousData,
    ),
  };
}

// Totales de un rango (mes/año) ya sumados y convertidos a número plano por
// getDailyRevenueForRange/getNewBuyersForRange en queries.ts — a diferencia
// de DailyRevenueSnapshot, acá los campos de revenue ya NO son Decimal.
export type RangeRevenueTotals = {
  revenueProductos: number;
  revenueEnvio: number;
  revenueTotal: number;
  ordersCount: number;
  ticketPromedio: number;
};

export function buildRevenueKpisForRange(
  current: RangeRevenueTotals,
  previous: RangeRevenueTotals | null,
): RevenueKpis {
  // getDailyRevenueForRange nunca devuelve null (agrega sobre 0 filas y
  // rellena con `?? 0`), así que un previous "vacío" no se distingue por
  // ser null sino porque ordersCount da 0 — si no hubo ni una orden en todo
  // el período anterior, no hay dato real con qué comparar.
  const hasPreviousData = (previous?.ordersCount ?? 0) > 0;

  return {
    revenueProductos: buildKpiValue(current.revenueProductos, previous?.revenueProductos, hasPreviousData),
    revenueEnvio: buildKpiValue(current.revenueEnvio, previous?.revenueEnvio, hasPreviousData),
    revenueTotal: buildKpiValue(current.revenueTotal, previous?.revenueTotal, hasPreviousData),
    ordersCount: buildKpiValue(current.ordersCount, previous?.ordersCount, hasPreviousData),
    ticketPromedio: buildKpiValue(current.ticketPromedio, previous?.ticketPromedio, hasPreviousData),
  };
}

// Tipos angostados a solo los campos que estos builders realmente leen.
// Un Pick es estructuralmente compatible tanto con las filas completas que
// devuelve getTopSellerSnapshotsForDate/getTopProductSnapshotsForDate (que
// traen el modelo entero de Prisma, con date/id incluidos) como con las
// filas ya agregadas que devuelve getTopSellersForRange/getTopProductsForRange
// (que no tienen date/id) — mismo builder sirve para día y para rango.
// TopSellerRowInput NO se deriva con Pick<TopSellerSnapshot,...> porque ahí
// `revenue` queda tipado estrictamente como Decimal (el tipo real de la
// columna). Pero getTopSellersForRange devuelve `_sum.revenue ?? 0`, que
// TypeScript tipa como `Decimal | number` por el fallback en 0. Definimos
// el tipo a mano para aceptar ambos casos; toSafeNumber ya sabe convertir
// cualquiera de los dos a número plano.
type TopSellerRowInput = {
  sellerId: string;
  sellerName: string | null;
  orders: number;
  revenue: Prisma.Decimal | number;
};
type TopProductRowInput = Pick<TopProductSnapshot, "productId" | "productName" | "quantity">;
type NewBuyersRowInput = Pick<NewBuyersSnapshot, "count">;

export function buildTopSellers(rows: TopSellerRowInput[]): TopSellerRow[] {
  return rows.map((row) => ({
    sellerId: row.sellerId,
    sellerName: row.sellerName ?? UNKNOWN_SELLER_NAME,
    orders: row.orders,
    revenue: toSafeNumber(row.revenue),
  }));
}

export function buildTopProducts(rows: TopProductRowInput[]): TopProductRow[] {
  return rows.map((row) => ({
    productId: row.productId,
    productName: row.productName ?? UNKNOWN_PRODUCT_NAME,
    quantity: row.quantity,
  }));
}

// hasPreviousData es opcional con default `previous !== null` para no romper
// el llamado existente de "día" (donde null SÍ es la señal correcta). Para
// "mes"/"año", page.tsx pasa el tercer argumento explícito basado en
// previousRevenue.ordersCount, porque ahí previous nunca es null.
export function buildNewBuyersKpi(
  current: NewBuyersRowInput | null,
  previous: NewBuyersRowInput | null,
  hasPreviousData: boolean = previous !== null,
): NewBuyersKpi {
  return buildKpiValue(current?.count ?? 0, previous?.count, hasPreviousData);
}