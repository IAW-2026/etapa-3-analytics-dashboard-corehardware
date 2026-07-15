import { Package, Clock, Truck, Timer, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { LogisticaKpis } from "@/types/types";

type Props = {
    kpis: LogisticaKpis | null;
};

function calcularDelta(actual: number | null, anterior: number | null): number | null {
    if (actual === null || anterior === null) return null;
    if (anterior === 0) return actual === 0 ? 0 : null;
    return ((actual - anterior) / anterior) * 100;
}

function KpiTile({
    label,
    value,
    delta,
    icon: Icon,
    suffix = "",
    formatter,
    // Para envios en riesgo: mas es peor.
    invertidoParaBueno = false,
}: {
    label: string;
    value: number | null;
    delta: number | null;
    icon: React.ComponentType<{ className?: string }>;
    suffix?: string;
    formatter?: (n: number) => string;
    invertidoParaBueno?: boolean;
}) {
    const mostrarDelta = delta !== null && Number.isFinite(delta);
    const isPositivo = (delta ?? 0) >= 0;
    const esBueno = invertidoParaBueno ? !isPositivo : isPositivo;
    const displayValue =
        value === null
            ? "—"
            : formatter
                ? formatter(value)
                : `${value.toLocaleString("es-AR")}${suffix}`;

    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500">
                    {label}
                </span>
                <Icon className="w-4 h-4 text-neutral-300 dark:text-neutral-600" />
            </div>
            <span className="text-3xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 font-mono">
                {displayValue}
            </span>
            {mostrarDelta ? (
                <div
                    className={`flex items-center gap-1 text-xs font-mono ${esBueno ? "text-emerald-500" : "text-rose-500"
                        }`}
                >
                    {isPositivo ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    <span>{Math.abs(delta).toFixed(1)}% vs período anterior</span>
                </div>
            ) : (
                <div className="h-4" />
            )}
        </div>
    );
}

export default function LogisticsKpiStrip({ kpis }: Props) {
    if (!kpis) {
        return (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 mb-6">
                <p className="text-sm text-rose-400 font-mono">
                    Error al cargar las métricas de logística
                </p>
            </div>
        );
    }

    const deltaTotal = calcularDelta(kpis.total_envios.actual, kpis.total_envios.anterior);
    const deltaOnTime = calcularDelta(kpis.on_time.porcentaje_actual, kpis.on_time.porcentaje_anterior);
    const deltaTransito = calcularDelta(
        kpis.tiempo_transito_dias.actual,
        kpis.tiempo_transito_dias.anterior
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiTile
                label="Total de envíos"
                value={kpis.total_envios.actual}
                delta={deltaTotal}
                icon={Package}
            />
            <KpiTile
                label="On-time (SLA)"
                value={kpis.on_time.porcentaje_actual}
                delta={deltaOnTime}
                icon={Clock}
                formatter={(n) => `${n.toFixed(1)}%`}
            />
            <KpiTile
                label="Tiempo tránsito"
                value={kpis.tiempo_transito_dias.actual}
                delta={deltaTransito}
                icon={Timer}
                formatter={(n) => `${n.toFixed(1)} días`}
                invertidoParaBueno
            />
            <KpiTile
                label="Envíos en curso"
                value={kpis.en_curso}
                delta={null}
                icon={Truck}
            />
        </div>
    );
}
