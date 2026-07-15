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
        <h2 className="font-mono text-xs uppercase tracking-wider text-zinc-400 mb-3">
            {title}
        </h2>
    );
}

export default function LogisticsView({ shipments, kpis, rango, buyerUrl }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
                        Logística
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Envíos, operadores y cumplimiento de entregas.
                    </p>
                </div>
                <LogisticsDateRangeFilter valor={rango} />
            </div>

            <section>
                <SectionTitle title="Resumen" />
                <LogisticsKpiStrip kpis={kpis} />
                <LogisticsAtRiskAlert cantidad={kpis?.en_riesgo ?? null} />
            </section>

            <section>
                <SectionTitle title="Métricas" />
                <LogisticsCharts shipments={shipments} />
            </section>

            <section>
                <SectionTitle title="Distribución geográfica" />
                <LogisticsMap shipments={shipments} />
            </section>

            <section>
                <SectionTitle title="Envíos" />
                <LogisticsTable shipments={shipments} />
            </section>

            <LogisticsBuyerCTA buyerUrl={buyerUrl} />
        </div>
    );
}
