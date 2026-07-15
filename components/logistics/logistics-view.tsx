import LogisticsCharts from "@/components/logistics/logistics-charts";
import LogisticsTable from "@/components/logistics/logistics-table";
import LogisticsKpiStrip from "@/components/logistics/logistics-kpi-strip";
import LogisticsAtRiskAlert from "@/components/logistics/logistics-at-risk-alert";
import LogisticsDateRangeFilter from "@/components/logistics/logistics-date-range-filter";
import LogisticsMap from "@/components/logistics/logistics-map";
import LogisticsBuyerCTA from "@/components/logistics/logistics-buyer-cta";
import type { Shipment, LogisticaKpis } from "@/types/types";

type Props = {
    shipments: Shipment[] | null;
    kpis: LogisticaKpis | null;
    rango: string;
    buyerUrl?: string;
};

function SectionTitle({ title }: { title: string }) {
    return (
        <div className="mb-3">
            <h2 className="text-xs font-mono tracking-[0.15em] uppercase text-neutral-500 dark:text-neutral-400">
                {title}
            </h2>
        </div>
    );
}

export default function LogisticsView({ shipments, kpis, rango, buyerUrl }: Props) {
    return (
        <main className="p-8 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-light tracking-[0.05em] text-neutral-900 dark:text-neutral-100">
                        Logistica
                    </h1>
                    <div className="h-px w-8 bg-violet-500 mt-2" />
                </div>
                <LogisticsDateRangeFilter valor={rango} />
            </div>

            <SectionTitle title="Resumen" />
            <LogisticsKpiStrip kpis={kpis} />
            <LogisticsAtRiskAlert cantidad={kpis?.en_riesgo ?? null} />

            <SectionTitle title="Métricas" />
            <LogisticsCharts shipments={shipments} />

            <SectionTitle title="Distribución geográfica" />
            <LogisticsMap shipments={shipments} />

            <SectionTitle title="Envíos" />
            <LogisticsTable shipments={shipments} />

            <LogisticsBuyerCTA buyerUrl={buyerUrl} />
        </main>
    );
}
