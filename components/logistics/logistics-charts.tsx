"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { Shipment } from "@/types/types";
import { cardClass, cardLabelClass } from "@/styles/theme";

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

function buildCargaConOnTimePorOperador(shipments: Shipment[]) {
    const map = new Map<string, { total: number; aTiempo: number; tarde: number; enCurso: number }>();
    for (const s of shipments) {
        const nombre = s.operador ? s.operador.nombre : "Sin asignar";
        if (!map.has(nombre)) map.set(nombre, { total: 0, aTiempo: 0, tarde: 0, enCurso: 0 });
        const row = map.get(nombre)!;
        row.total++;
        if (s.estado === "ENTREGADO" && s.fecha_de_entrega && s.fecha_estimada) {
            const onTime =
                new Date(s.fecha_de_entrega).getTime() <=
                new Date(s.fecha_estimada).getTime();
            if (onTime) row.aTiempo++;
            else row.tarde++;
        } else {
            row.enCurso++;
        }
    }
    return Array.from(map.entries())
        .map(([nombre, r]) => ({ nombre, ...r }))
        .sort((a, b) => b.total - a.total);
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

// Extrae la ciudad como la parte 2 de "Calle X, Ciudad, Provincia".
// Si la direccion no tiene coma, usa la direccion completa.
function extraerCiudad(direccion: string): string {
    const partes = direccion.split(",").map((p) => p.trim()).filter(Boolean);
    if (partes.length >= 2) return partes[1];
    return partes[0] ?? "Sin ciudad";
}

function buildTopDestinos(shipments: Shipment[], top = 5) {
    const counts = new Map<string, number>();
    for (const s of shipments) {
        const ciudad = extraerCiudad(s.direccion);
        counts.set(ciudad, (counts.get(ciudad) ?? 0) + 1);
    }
    return Array.from(counts.entries())
        .map(([ciudad, count]) => ({ ciudad, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, top);
}

function buildEntregasPorSemana(shipments: Shipment[]) {
    const entregados = shipments.filter(
        (s) => s.estado === "ENTREGADO" && s.fecha_de_entrega
    );
    if (entregados.length === 0) return [];

    const buckets = new Map<string, { semana: string; count: number; ts: number }>();
    for (const s of entregados) {
        const d = new Date(s.fecha_de_entrega!);
        const inicio = new Date(d);
        inicio.setDate(d.getDate() - d.getDay());
        inicio.setHours(0, 0, 0, 0);
        const key = inicio.toISOString().slice(0, 10);
        if (!buckets.has(key)) {
            const label = inicio.toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
            });
            buckets.set(key, { semana: label, count: 0, ts: inicio.getTime() });
        }
        buckets.get(key)!.count++;
    }

    return Array.from(buckets.values()).sort((a, b) => a.ts - b.ts);
}

function CountTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; color: string }[] }) {
    if (!active || !payload?.length) return null;
    const entry = payload[0];
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs shadow-sm">
            <p style={{ color: entry.color }} className="font-mono">{entry.name}: {entry.value}</p>
        </div>
    );
}

function MontoTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; color: string }[]; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs shadow-sm">
            <p className="font-mono" style={{ color: payload[0].color }}>{label}: {formatCurrency(payload[0].value)}</p>
        </div>
    );
}

function OperadorTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: { name: string; value: number; color: string; dataKey: string }[];
    label?: string;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs shadow-sm">
            <p className="font-mono text-zinc-500 mb-1">{label}</p>
            {payload.map((entry) => (
                <p key={entry.dataKey} style={{ color: entry.color }} className="font-mono">
                    {entry.name}: {entry.value}
                </p>
            ))}
        </div>
    );
}

export default function LogisticsCharts({ shipments }: Props) {
    if (!shipments || shipments.length === 0) return null;

    const estadoDistribucion = buildEstadoDistribucion(shipments);
    const cargaPorOperador = buildCargaConOnTimePorOperador(shipments);
    const slaCumplimiento = buildSlaCumplimiento(shipments);
    const montoPorEstado = buildMontoPorEstado(shipments);
    const topDestinos = buildTopDestinos(shipments, 5);
    const entregasPorSemana = buildEntregasPorSemana(shipments);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className={cardClass}>
                <h2 className={`${cardLabelClass} mb-4`}>Distribución por estado</h2>
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

            <div className={cardClass}>
                <h2 className={`${cardLabelClass} mb-4`}>Carga y cumplimiento por operador</h2>
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
                        <Tooltip content={<OperadorTooltip />} cursor={{ fill: "currentColor", opacity: 0.04 }} />
                        <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }} />
                        <Bar dataKey="aTiempo" name="Entregados a tiempo" stackId="op" fill="#34d399" maxBarSize={40} />
                        <Bar dataKey="tarde" name="Entregados tarde" stackId="op" fill="#f87171" maxBarSize={40} />
                        <Bar dataKey="enCurso" name="En curso" stackId="op" fill="#a1a1aa" maxBarSize={40} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {slaCumplimiento.length > 0 && (
                <div className={cardClass}>
                    <h2 className={`${cardLabelClass} mb-4`}>Cumplimiento de SLA (entregados)</h2>
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

            <div className={cardClass}>
                <h2 className={`${cardLabelClass} mb-4`}>Monto por estado</h2>
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

            {topDestinos.length > 0 && (
                <div className={cardClass}>
                    <h2 className={`${cardLabelClass} mb-4`}>Top {topDestinos.length} destinos</h2>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart
                            data={topDestinos}
                            layout="vertical"
                            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid stroke="currentColor" strokeOpacity={0.06} horizontal={false} />
                            <XAxis
                                type="number"
                                tick={{ fontSize: 11, fontFamily: "monospace", fill: "currentColor", opacity: 0.4 }}
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                            />
                            <YAxis
                                dataKey="ciudad"
                                type="category"
                                tick={{ fontSize: 11, fontFamily: "monospace", fill: "currentColor", opacity: 0.4 }}
                                axisLine={false}
                                tickLine={false}
                                width={120}
                            />
                            <Tooltip content={<CountTooltip />} cursor={{ fill: "currentColor", opacity: 0.04 }} />
                            <Bar dataKey="count" name="Envíos" fill="#a78bfa" radius={[0, 4, 4, 0]} maxBarSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {entregasPorSemana.length > 0 && (
                <div className={`${cardClass} lg:col-span-2`}>
                    <h2 className={`${cardLabelClass} mb-4`}>Entregas por semana</h2>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={entregasPorSemana} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="currentColor" strokeOpacity={0.06} vertical={false} />
                            <XAxis
                                dataKey="semana"
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
                            <Tooltip content={<CountTooltip />} cursor={{ stroke: "currentColor", strokeOpacity: 0.1 }} />
                            <Line
                                type="monotone"
                                dataKey="count"
                                name="Entregados"
                                stroke="#34d399"
                                strokeWidth={2}
                                dot={{ r: 3, fill: "#34d399" }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}