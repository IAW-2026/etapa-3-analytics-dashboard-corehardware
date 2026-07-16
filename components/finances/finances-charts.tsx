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
import type { Payment, Dispute } from "@/types/types";
import { cardLabelClass } from "@/styles/theme";
import {
    PAYMENT_STATUS_CHART_COLOR,
    PAYMENT_STATUS_LABEL,
    DISPUTE_AGE_BUCKET_COLOR,
} from "@/lib/dashboard/constants";

type Props = {
    payments: Payment[] | null;
    disputes: Dispute[] | null;
};

type MonthlyBucket = {
    monthKey: string;
    label: string;
    acreditado: number;
    pendiente: number;
    rechazado: number;
    en_proceso: number;
    cancelado: number;
    reembolsado: number;
    contracargo: number;
};

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat("es-AR", {
    month: "short",
    year: "2-digit",
});

const AGE_BUCKET_LABELS = ["0-7 días", "8-15 días", "16-30 días", "30+ días"] as const;

// Color fijo (no currentColor + opacity) para que el contraste de los ticks
// sea predecible y no dependa del tema del navegador.
const AXIS_TICK_COLOR = "#a1a1aa"; // zinc-400, ~7.5:1 sobre zinc-900

const EMPTY_BUCKET = (): Omit<MonthlyBucket, "monthKey" | "label"> => ({
    acreditado: 0, pendiente: 0, rechazado: 0,
    en_proceso: 0, cancelado: 0, reembolsado: 0, contracargo: 0,
});

function buildMonthlyAmountByStatus(payments: Payment[]): MonthlyBucket[] {
    const buckets = new Map<string, MonthlyBucket>();

    for (const payment of payments) {
        const date = new Date(payment.fecha);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        if (!buckets.has(monthKey)) {
            buckets.set(monthKey, {
                monthKey,
                label: MONTH_LABEL_FORMATTER.format(date),
                ...EMPTY_BUCKET(),
            });
        }

        buckets.get(monthKey)![payment.estado] += parseFloat(payment.monto);
    }

    return Array.from(buckets.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

function daysSince(dateString: string): number {
    return Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
}

function buildOpenDisputeAgeBuckets(disputes: Dispute[]) {
    const counts = [0, 0, 0, 0];

    for (const dispute of disputes) {
        if (dispute.estado !== "pendiente") continue;
        const age = daysSince(dispute.fechaDeInicio);
        if (age <= 7) counts[0]++;
        else if (age <= 15) counts[1]++;
        else if (age <= 30) counts[2]++;
        else counts[3]++;
    }

    return AGE_BUCKET_LABELS.map((label, i) => ({ label, count: counts[i] }))
        .filter((b) => b.count > 0);
}

type BarTooltipPayloadEntry = {
    dataKey: string;
    name: string;
    value: number;
    color: string;
};

type PieTooltipPayloadEntry = {
    name: string;
    value: number;
    color: string;
};

function formatCurrency(value: number): string {
    return `$${value.toLocaleString("es-AR")}`;
}

function MonthlyAmountTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: BarTooltipPayloadEntry[];
    label?: string;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs shadow-sm">
            <p className="font-mono text-zinc-400 mb-1">{label}</p>
            {payload.map((entry) => (
                <p key={entry.dataKey} style={{ color: entry.color }} className="font-mono">
                    {entry.name}: {formatCurrency(entry.value)}
                </p>
            ))}
        </div>
    );
}

function DisputeAgeTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: PieTooltipPayloadEntry[];
}) {
    if (!active || !payload?.length) return null;
    const entry = payload[0];
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs shadow-sm">
            <p style={{ color: entry.color }} className="font-mono">
                {entry.name}: {entry.value}
            </p>
        </div>
    );
}

function DisputeAgeLegend({ buckets }: { buckets: { label: string; count: number }[] }) {
    return (
        <ul className="flex flex-wrap gap-3 justify-center mt-2">
            {buckets.map((entry) => (
                <li key={entry.label} className="flex items-center gap-1.5 text-xs font-mono" style={{ color: AXIS_TICK_COLOR }}>
                    <span
                        className="inline-block w-2.5 h-2.5 rounded-sm"
                        style={{ backgroundColor: DISPUTE_AGE_BUCKET_COLOR[entry.label as keyof typeof DISPUTE_AGE_BUCKET_COLOR] }}
                    />
                    {entry.label}
                </li>
            ))}
        </ul>
    );
}

function getActiveStates(data: MonthlyBucket[]): Payment["estado"][] {
    const all = Object.keys(PAYMENT_STATUS_CHART_COLOR) as Payment["estado"][];
    return all.filter((state) => data.some((bucket) => bucket[state] > 0));
}

export default function FinancesCharts({ payments, disputes }: Props) {
    const monthlyData = payments && payments.length > 0 ? buildMonthlyAmountByStatus(payments) : null;
    const openDisputeAgeBuckets = disputes && disputes.length > 0
        ? buildOpenDisputeAgeBuckets(disputes)
        : null;
    const hasOpenDisputeData = openDisputeAgeBuckets && openDisputeAgeBuckets.length > 0;

    if (!monthlyData && !hasOpenDisputeData) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {monthlyData && (
                <div className="lg:col-span-2 rounded-lg border border-zinc-800 bg-zinc-900 p-5">
                    <h2 className={`${cardLabelClass} mb-4`}>Monto mensual por estado</h2>
                    <div
                        role="img"
                        aria-label={`Gráfico de barras apiladas: monto mensual de pagos por estado, ${monthlyData.length} meses.`}
                    >
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                                <CartesianGrid stroke="#27272a" vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 11, fontFamily: "monospace", fill: AXIS_TICK_COLOR }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fontFamily: "monospace", fill: AXIS_TICK_COLOR }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={70}
                                    tickFormatter={formatCurrency}
                                />
                                <Tooltip content={<MonthlyAmountTooltip />} cursor={{ fill: "#3f3f46", opacity: 0.3 }} />
                                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace", color: AXIS_TICK_COLOR }} />
                                {getActiveStates(monthlyData).map((state, i, arr) => (
                                    <Bar
                                        key={state}
                                        dataKey={state}
                                        stackId="state"
                                        fill={PAYMENT_STATUS_CHART_COLOR[state]}
                                        name={PAYMENT_STATUS_LABEL[state]}
                                        maxBarSize={40}
                                        radius={i === arr.length - 1 ? [4, 4, 0, 0] : undefined}
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {hasOpenDisputeData && (
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
                    <h2 className={`${cardLabelClass} mb-4`}>Antigüedad de disputas pendientes</h2>
                    <div
                        role="img"
                        aria-label={`Gráfico de torta: antigüedad de disputas pendientes agrupadas en ${openDisputeAgeBuckets.length} rangos.`}
                    >
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={openDisputeAgeBuckets}
                                    dataKey="count"
                                    nameKey="label"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={2}
                                >
                                    {openDisputeAgeBuckets.map((entry) => (
                                        <Cell key={entry.label} fill={DISPUTE_AGE_BUCKET_COLOR[entry.label]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<DisputeAgeTooltip />} />
                                {/*
                                    Recharts no arma la leyenda de un Pie a partir de los
                                    <Cell> automáticamente — hay que pasarle el payload
                                    (label + color) explícito, o los swatches salen vacíos.
                                */}
                               <Legend content={<DisputeAgeLegend buckets={openDisputeAgeBuckets} />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}