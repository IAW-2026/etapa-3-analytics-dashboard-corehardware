"use client";

import CountUp from "react-countup";
import { Package, Clock, Truck, Timer, ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cardClass, cardLabelClass } from "@/styles/theme";
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
    decimals = 0,
    // Para envios en riesgo o tiempos: mas es peor.
    invertidoParaBueno = false,
}: {
    label: string;
    value: number | null;
    delta: number | null;
    icon: LucideIcon;
    suffix?: string;
    decimals?: number;
    invertidoParaBueno?: boolean;
}) {
    const mostrarDelta = delta !== null && Number.isFinite(delta);
    const isPositivo = (delta ?? 0) >= 0;
    const esBueno = invertidoParaBueno ? !isPositivo : isPositivo;

    return (
        <div className={`flex flex-col gap-3 ${cardClass}`}>
            <div className="flex items-center justify-between">
                <span className={cardLabelClass}>{label}</span>
                <Icon className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
            </div>

            <div className="font-mono text-2xl font-semibold text-zinc-50">
                {value === null ? (
                    "—"
                ) : (
                    <CountUp
                        end={value}
                        duration={1.2}
                        separator="."
                        decimal=","
                        decimals={decimals}
                        suffix={suffix}
                    />
                )}
            </div>

            {mostrarDelta ? (
                <div
                    className={`flex items-center gap-1 text-xs font-mono ${esBueno ? "text-emerald-400" : "text-rose-400"
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
            <div className={`${cardClass} mb-4`}>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
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
                suffix="%"
                decimals={1}
            />
            <KpiTile
                label="Tiempo tránsito"
                value={kpis.tiempo_transito_dias.actual}
                delta={deltaTransito}
                icon={Timer}
                suffix=" días"
                decimals={1}
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
