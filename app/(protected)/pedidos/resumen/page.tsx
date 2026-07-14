import { getTodayUTC } from "@/lib/utils/date";
import {
    getDailyRevenueForDate,
    getDailyRevenueForRange,
    getNewBuyersForDate,
    getNewBuyersForRange,
    getPreviousDailyRevenueSnapshot,
    getPreviousNewBuyersSnapshot,
    getTopProductSnapshotsForDate,
    getTopProductsForRange,
    getTopSellerSnapshotsForDate,
    getTopSellersForRange,
} from "@/lib/dashboard/orders-summary/queries";
import {
    buildDateFallbackInfo,
    buildNewBuyersKpi,
    buildRangeInfo,
    buildRevenueKpis,
    buildRevenueKpisForRange,
    buildTopProducts,
    buildTopSellers,
} from "@/lib/dashboard/orders-summary/view-model";
import { OrdersSummaryKpiStrip } from "@/components/dashboard/orders-summary/OrdersSummaryKpiStrip";
import { OrdersSummaryDateControls } from "@/components/dashboard/orders-summary/OrdersSummaryDateControls";
import { TopSellersChart } from "@/components/dashboard/orders-summary/TopSellersChart";
import { TopProductsChart } from "@/components/dashboard/orders-summary/TopProductsChart";

export const dynamic = "force-dynamic";

type Granularity = "day" | "month" | "year";

function parseGranularity(value: string | undefined): Granularity {
    if (value === "month" || value === "year") return value;
    return "day";
}

function parseRequestedDate(dateParam: string | undefined): Date {
    if (!dateParam) return getTodayUTC();

    const parsed = new Date(`${dateParam}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime())) return getTodayUTC();

    return parsed;
}

// "YYYY-MM" -> [primer día del mes, último día del mes], ambos UTC medianoche.
// El truco del día 0 del mes siguiente = último día del mes actual es el
// mismo patrón que ya usa el resto del proyecto para fechas UTC.
function parseMonthRange(monthParam: string | undefined): [Date, Date] {
    if (!monthParam) return parseMonthRange(toMonthParam(getTodayUTC()));

    const [yearStr, monthStr] = monthParam.split("-");
    const year = Number(yearStr);
    const monthIndex = Number(monthStr) - 1;
    if (Number.isNaN(year) || Number.isNaN(monthIndex)) {
        return parseMonthRange(toMonthParam(getTodayUTC()));
    }

    return [
        new Date(Date.UTC(year, monthIndex, 1)),
        new Date(Date.UTC(year, monthIndex + 1, 0)),
    ];
}

function toMonthParam(date: Date): string {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

// Período anterior = mes calendario inmediatamente anterior (mismo criterio
// que día vs. día anterior). Si se prefiere comparar contra el mismo mes del
// año pasado, este es el único lugar que habría que cambiar.
function previousMonthRange(fechaDesde: Date): [Date, Date] {
    const prevMonthLastDay = new Date(Date.UTC(fechaDesde.getUTCFullYear(), fechaDesde.getUTCMonth(), 0));
    const prevMonthFirstDay = new Date(
        Date.UTC(prevMonthLastDay.getUTCFullYear(), prevMonthLastDay.getUTCMonth(), 1),
    );
    return [prevMonthFirstDay, prevMonthLastDay];
}

// "YYYY" -> [1/enero, 31/diciembre], ambos UTC medianoche.
function parseYearRange(yearParam: string | undefined): [Date, Date] {
    const year = yearParam ? Number(yearParam) : getTodayUTC().getUTCFullYear();
    if (Number.isNaN(year)) return parseYearRange(undefined);

    return [new Date(Date.UTC(year, 0, 1)), new Date(Date.UTC(year, 11, 31))];
}

// Período anterior = año calendario anterior.
function previousYearRange(fechaDesde: Date): [Date, Date] {
    const prevYear = fechaDesde.getUTCFullYear() - 1;
    return [new Date(Date.UTC(prevYear, 0, 1)), new Date(Date.UTC(prevYear, 11, 31))];
}

export default async function OrdersSummaryPage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string; month?: string; year?: string; granularity?: string }>;
}) {
    const { date: dateParam, month: monthParam, year: yearParam, granularity: granularityParam } =
        await searchParams;
    const granularity = parseGranularity(granularityParam);

    if (granularity === "day") {
        const requestedDate = parseRequestedDate(dateParam);

        const { snapshot: revenueSnapshot, isFallback: revenueIsFallback } =
            await getDailyRevenueForDate(requestedDate);
        const { snapshot: newBuyersSnapshot } = await getNewBuyersForDate(requestedDate);

        const [previousRevenue, previousNewBuyers, topSellers, topProducts] = await Promise.all([
            revenueSnapshot ? getPreviousDailyRevenueSnapshot(revenueSnapshot.date) : Promise.resolve(null),
            newBuyersSnapshot ? getPreviousNewBuyersSnapshot(newBuyersSnapshot.date) : Promise.resolve(null),
            getTopSellerSnapshotsForDate(requestedDate),
            getTopProductSnapshotsForDate(requestedDate),
        ]);

        const dateInfo = buildDateFallbackInfo(requestedDate, revenueSnapshot?.date ?? null);
        const revenueKpis = buildRevenueKpis(revenueSnapshot, previousRevenue);
        const newBuyersKpi = buildNewBuyersKpi(newBuyersSnapshot, previousNewBuyers);
        const topSellerRows = buildTopSellers(topSellers);
        const topProductRows = buildTopProducts(topProducts);

        return (
            <div className="flex flex-col gap-6 p-6">
                <OrdersSummaryDateControls granularity="day" dateInfo={dateInfo} />
                <OrdersSummaryKpiStrip revenue={revenueKpis} newBuyers={newBuyersKpi} />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <TopSellersChart data={topSellerRows} />
                    <TopProductsChart data={topProductRows} />
                </div>
            </div>
        );
    }

    // granularity === "month" | "year"
    const [fechaDesde, fechaHasta] =
        granularity === "month" ? parseMonthRange(monthParam) : parseYearRange(yearParam);
    const [prevFechaDesde, prevFechaHasta] =
        granularity === "month" ? previousMonthRange(fechaDesde) : previousYearRange(fechaDesde);

    const [currentRevenue, previousRevenue, currentNewBuyers, previousNewBuyers, topSellers, topProducts] =
        await Promise.all([
            getDailyRevenueForRange(fechaDesde, fechaHasta),
            getDailyRevenueForRange(prevFechaDesde, prevFechaHasta),
            getNewBuyersForRange(fechaDesde, fechaHasta),
            getNewBuyersForRange(prevFechaDesde, prevFechaHasta),
            getTopSellersForRange(fechaDesde, fechaHasta),
            getTopProductsForRange(fechaDesde, fechaHasta),
        ]);

    const rangeInfo = buildRangeInfo(fechaDesde, fechaHasta, currentRevenue.ordersCount);
    const revenueKpis = buildRevenueKpisForRange(currentRevenue, previousRevenue);
    // previousRevenue.ordersCount > 0 es la señal de "hubo actividad real en
    // el período anterior" — más confiable que fijarse en el propio conteo
    // de compradores nuevos, que puede dar 0 legítimamente aunque sí hubo
    // pedidos ese período (0 compradores nuevos, pero el período existió).
    const newBuyersKpi = buildNewBuyersKpi(currentNewBuyers, previousNewBuyers, previousRevenue.ordersCount > 0);
    const topSellerRows = buildTopSellers(topSellers);
    const topProductRows = buildTopProducts(topProducts);

    return (
        <div className="flex flex-col gap-6 p-6">
            <OrdersSummaryDateControls granularity={granularity} rangeInfo={rangeInfo} />
            <OrdersSummaryKpiStrip revenue={revenueKpis} newBuyers={newBuyersKpi} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <TopSellersChart data={topSellerRows} />
                <TopProductsChart data={topProductRows} />
            </div>
        </div>
    );
}