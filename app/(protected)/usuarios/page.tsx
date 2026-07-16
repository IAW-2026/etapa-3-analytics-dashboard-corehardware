import UsersView from "@/components/users/users-view";
import { fetchVendedores, fetchOperadores, fetchCompradores } from "@/lib/sync/fetchers";
import { getUsersGrowthForRange } from "@/lib/users/growth";
import type { Buyer, Seller, Operator } from "@/types/types";
import type { DateFallbackInfo } from "@/lib/dashboard/orders-summary/types";
import type { RangeInfo } from "@/lib/dashboard/orders-summary/view-model";

export const dynamic = "force-dynamic";

type Granularity = "day" | "month" | "year";

// ─────────────────────────────────────────────────────────────────────────
// Cómputo de rangos día/mes/año. Calca la lógica de
// app/(protected)/pedidos/resumen/page.tsx (parseGranularity,
// parseRequestedDate, parseMonthRange, parseYearRange) — duplicado acá
// porque esas funciones viven inline en ese archivo, no exportadas como
// utilidad compartida. Si se quiere evitar la duplicación más adelante,
// se puede extraer a algo como lib/dashboard/date-ranges.ts.
//
// A diferencia de Pedidos-Resumen, acá NO hace falta calcular período
// anterior (previousMonthRange/previousYearRange): el gráfico de Usuarios
// es una serie temporal, no un KPI comparativo contra el período anterior.
// ─────────────────────────────────────────────────────────────────────────

function parseGranularity(value: string | undefined): Granularity {
  if (value === "month" || value === "year") return value;
  return "day";
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseRequestedDate(dateParam: string | undefined): string {
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    const parsed = new Date(`${dateParam}T00:00:00.000Z`);
    if (!Number.isNaN(parsed.getTime())) return dateParam;
  }
  return todayUTC();
}

function parseMonthRange(monthParam: string | undefined): [string, string] {
  const now = new Date();
  let year = now.getUTCFullYear();
  let monthIndex = now.getUTCMonth(); // 0-indexado

  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [y, m] = monthParam.split("-").map(Number);
    if (m >= 1 && m <= 12) {
      year = y;
      monthIndex = m - 1;
    }
  }

  const fechaDesde = new Date(Date.UTC(year, monthIndex, 1)).toISOString().slice(0, 10);
  // Date.UTC(year, monthIndex + 1, 0) da el último día del mes -- mismo
  // truco que en pedidos/resumen/page.tsx.
  const fechaHasta = new Date(Date.UTC(year, monthIndex + 1, 0)).toISOString().slice(0, 10);

  return [fechaDesde, fechaHasta];
}

function parseYearRange(yearParam: string | undefined): [string, string] {
  const now = new Date();
  let year = now.getUTCFullYear();

  if (yearParam && /^\d{4}$/.test(yearParam)) {
    year = Number(yearParam);
  }

  const fechaDesde = new Date(Date.UTC(year, 0, 1)).toISOString().slice(0, 10);
  const fechaHasta = new Date(Date.UTC(year, 11, 31)).toISOString().slice(0, 10);

  return [fechaDesde, fechaHasta];
}

// ─────────────────────────────────────────────────────────────────────────
// Fetchers para las tablas — sin cambios respecto al page.tsx original.
// ─────────────────────────────────────────────────────────────────────────

async function fetchBuyers(): Promise<Buyer[] | null> {
  try {
    return await fetchCompradores();
  } catch {
    return null;
  }
}

async function fetchSellers(): Promise<Seller[] | null> {
  try {
    return await fetchVendedores();
  } catch {
    return null;
  }
}

// /api/analytics/operadores (listado) ya está integrado en
// lib/sync/fetchers.ts -- distinto del endpoint de growth usado en
// getUsersGrowthForRange, que alimenta el gráfico, no esta tabla.
async function fetchOperators(): Promise<Operator[] | null> {
  try {
    return await fetchOperadores();
  } catch {
    return null;
  }
}

interface UsersPageProps {
  searchParams: Promise<{
    granularity?: string;
    date?: string;
    month?: string;
    year?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const granularity = parseGranularity(params.granularity);

  let dateInfo: DateFallbackInfo | undefined;
  let rangeInfo: RangeInfo | undefined;
  let from: string;
  let to: string;

  if (granularity === "day") {
    const requestedDate = parseRequestedDate(params.date);
    from = requestedDate;
    to = requestedDate;
  } else if (granularity === "month") {
    [from, to] = parseMonthRange(params.month);
  } else {
    [from, to] = parseYearRange(params.year);
  }

  const [buyers, sellers, operators, growthData] = await Promise.all([
    fetchBuyers(),
    fetchSellers(),
    fetchOperators(),
    getUsersGrowthForRange(from, to),
  ]);

  if (granularity === "day") {
    // A diferencia de Pedidos-Resumen, acá "day" nunca cae en fallback:
    // las queries de growth siempre devuelven una fila para el día pedido
    // (real o en cero), no dependen de que exista un snapshot puntual.
    dateInfo = { requestedDate: from, actualDate: from, isFallback: false };
  } else {
    const hasData = growthData.points.some(
      (p) => p.compradores > 0 || p.vendedores > 0 || (p.operadores ?? 0) > 0
    );
    rangeInfo = { fechaDesde: from, fechaHasta: to, hasData };
  }

  return (
    <UsersView
      buyers={buyers}
      sellers={sellers}
      operators={operators}
      growthData={growthData}
      granularity={granularity}
      dateInfo={dateInfo}
      rangeInfo={rangeInfo}
    />
  );
}