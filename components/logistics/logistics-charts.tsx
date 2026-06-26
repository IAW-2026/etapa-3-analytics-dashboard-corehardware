"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { Shipment } from "@/types/types";

type Props = {
    shipments: Shipment[] | null;
};

const ESTADOS = ["PENDIENTE", "ASIGNADO", "RETIRADO", "EN_CAMINO", "ENTREGADO"] as const;

const ESTADO_COLORS: Record<string, string> = {
    PENDIENTE: "#eab308",
    ASIGNADO: "#22d3ee",
    RETIRADO: "#fb923c",
    EN_CAMINO: "#60a5fa",
    ENTREGADO: "#34d399",
};

const ESTADO_LABELS: Record<string, string> = {
    PENDIENTE: "Pendiente",
    ASIGNADO: "Asignado",
    RETIRADO: "Retirado",
    EN_CAMINO: "En camino",
    ENTREGADO: "Entregado",
};

const SLA_COLORS = { "A tiempo": "#34d399", "Tarde": "#f87171" };

function formatCurrency(value: number): string {
    return `$${value.toLocaleString("es-AR")}`;
}

function buildEstadoDistribucion(shipments: Shipment[]) {
    const counts: Record<string, number> = {};
    for (const s of shipments) counts[s.estado] = (counts[s.estado] ?? 0) + 1;
    return ESTADOS
        .map((estado) => ({ estado, label: ESTADO_LABELS[estado], count: counts[estado] ?? 0 }))
        .filter((b) => b.count > 0);
}

function buildCargaPorOperador(shipments: Shipment[]) {
    const counts = new Map<string, number>();
    for (const s of shipments) {
        const nombre = s.operador ? s.operador.nombre : "Sin asignar";
        counts.set(nombre, (counts.get(nombre) ?? 0) + 1);
    }
    return Array.from(counts.entries())
        .map(([nombre, count]) => ({ nombre, count }))
        .sort((a, b) => b.count - a.count);
}

function buildSlaCumplimiento(shipments: Shipment[]) {
    const entregados = shipments.filter((s) => s.estado === "ENTREGADO" && s.fecha_de_entrega && s.fecha_estimada);
    let aTiempo = 0;
    let tarde = 0;
    for (const s of entregados) {
        if (new Date(s.fecha_de_entrega!).getTime() <= new Date(s.fecha_estimada!).getTime()) aTiempo++;
        else tarde++;
    }
    return [
        { label: "A tiempo", count: aTiempo },
        { label: "Tarde", count: tarde },
    ].filter((b) => b.count > 0);
}

function buildMontoPorEstado(shipments: Shipment[]) {
    const totals: Record<string, number> = {};
    for (const s of shipments) totals[s.estado] = (totals[s.estado] ?? 0) + s.monto;
    return ESTADOS
        .map((estado) => ({ estado, label: ESTADO_LABELS[estado], monto: totals[estado] ?? 0 }))
        .filter((b) => b.monto > 0);
}

function CountTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; color: string }[] }) {
    if (!active || !payload?.length) return null;
    const entry = payload[0];
    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs shadow-sm">
            <p style={{ color: entry.color }} className="font-mono">{entry.name}: {entry.value}</p>
        </div>
    );
}

function MontoTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; color: string }[]; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs shadow-sm">
            <p className="font-mono" style={{ color: payload[0].color }}>{label}: {formatCurrency(payload[0].value)}</p>
        </div>
    );
}

export default function LogisticsCharts({ shipments }: Props) {
    if (!shipments || shipments.length === 0) return null;

    const estadoDistribucion = buildEstadoDistribucion(shipments);
    const cargaPorOperador = buildCargaPorOperador(shipments);
    const slaCumplimiento = buildSlaCumplimiento(shipments);
    const montoPorEstado = buildMontoPorEstado(shipments);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
                <h2 className="text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500 mb-4">
                    Distribución por estado
                </h2>
                <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                        <Pie data={estadoDistribucion} dataKey="count" nameKey="label" innerRadius={55} outerRadius={85} paddingAngle={2}>
                            {estadoDistribucion.map((entry) => (
                                <Cell key={entry.estado} fill={ESTADO_COLORS[entry.estado]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CountTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
                <h2 className="text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500 mb-4">
                    Carga por operador
                </h2>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={cargaPorOperador} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke="currentColor" strokeOpacity={0.06} vertical={false} />
                        <XAxis
                            dataKey="nombre"
                            tick={{ fontSize: 11, fontFamily: "monospace", fill: "currentColor", opacity: 0.4 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fontFamily: "monospace", fill: "currentColor", opacity: 0.4 }}
                            axisLine={false}
                            tickLine={false}
                            width={30}
                            allowDecimals={false}
                        />
                        <Tooltip content={<CountTooltip />} cursor={{ fill: "currentColor", opacity: 0.04 }} />
                        <Bar dataKey="count" name="Envíos" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {slaCumplimiento.length > 0 && (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
                    <h2 className="text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500 mb-4">
                        Cumplimiento de SLA (entregados)
                    </h2>
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie data={slaCumplimiento} dataKey="count" nameKey="label" innerRadius={55} outerRadius={85} paddingAngle={2}>
                                {slaCumplimiento.map((entry) => (
                                    <Cell key={entry.label} fill={SLA_COLORS[entry.label as keyof typeof SLA_COLORS]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CountTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
                <h2 className="text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500 mb-4">
                    Monto por estado
                </h2>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={montoPorEstado} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke="currentColor" strokeOpacity={0.06} vertical={false} />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 11, fontFamily: "monospace", fill: "currentColor", opacity: 0.4 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fontFamily: "monospace", fill: "currentColor", opacity: 0.4 }}
                            axisLine={false}
                            tickLine={false}
                            width={70}
                            tickFormatter={formatCurrency}
                        />
                        <Tooltip content={<MontoTooltip />} cursor={{ fill: "currentColor", opacity: 0.04 }} />
                        <Bar dataKey="monto" name="Monto" radius={[4, 4, 0, 0]} maxBarSize={40}>
                            {montoPorEstado.map((entry) => (
                                <Cell key={entry.estado} fill={ESTADO_COLORS[entry.estado]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
