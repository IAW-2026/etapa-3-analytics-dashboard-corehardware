"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Sector,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import type { Payment, Dispute } from "@/types/types";

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

const PAYMENT_STATUS_COLORS: Record<Payment["estado"], string> = {
    acreditado: "#34d399",
    pendiente: "#a78bfa",
    rechazado: "#f87171",
    en_proceso: "#818cf8",
    cancelado: "#52525b",
    reembolsado: "#e879f9",
    contracargo: "#fb923c",
};

const PAYMENT_STATUS_LABELS: Record<Payment["estado"], string> = {
    acreditado: "Acreditado",
    pendiente: "Pendiente",
    rechazado: "Rechazado",
    en_proceso: "En proceso",
    cancelado: "Cancelado",
    reembolsado: "Reembolsado",
    contracargo: "Contracargo",
};

const AGE_BUCKET_LABELS = ["0-7 días", "8-15 días", "16-30 días", "30+ días"] as const;

const AGE_BUCKET_COLOR_BY_LABEL: Record<string, string> = {
    "0-7 días": "#a78bfa",
    "8-15 días": "#818cf8",
    "16-30 días": "#fb923c",
    "30+ días": "#f87171",
};

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
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs shadow-sm">
            <p className="font-mono text-neutral-500 dark:text-neutral-400 mb-1">{label}</p>
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
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs shadow-sm">
            <p style={{ color: entry.color }} className="font-mono">
                {entry.name}: {entry.value}
            </p>
        </div>
    );
}

function getActiveStates(data: MonthlyBucket[]): Payment["estado"][] {
    const all = Object.keys(PAYMENT_STATUS_COLORS) as Payment["estado"][];
    return all.filter((state) => data.some((bucket) => bucket[state] > 0));
}

const PAYMENT_STATE_LIST = Object.keys(PAYMENT_STATUS_COLORS) as Payment["estado"][];

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
                <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
                    <h2 className="text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500 mb-4">
                        Monto mensual por estado
                    </h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
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
                            <Tooltip content={<MonthlyAmountTooltip />} cursor={{ fill: "currentColor", opacity: 0.04 }} />
                            <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }} />
                            {getActiveStates(monthlyData).map((state, i, arr) => (
                                <Bar
                                    key={state}
                                    dataKey={state}
                                    stackId="state"
                                    fill={PAYMENT_STATUS_COLORS[state]}
                                    name={PAYMENT_STATUS_LABELS[state]}
                                    maxBarSize={40}
                                    radius={i === arr.length - 1 ? [4, 4, 0, 0] : undefined}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {hasOpenDisputeData && (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
                    <h2 className="text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500 mb-4">
                        Antigüedad de disputas pendientes
                    </h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={openDisputeAgeBuckets}
                                dataKey="count"
                                nameKey="label"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={2}
                                shape={(props: PieSectorDataItem) => (
                                    <Sector
                                        {...props}
                                        fill={AGE_BUCKET_COLOR_BY_LABEL[props.payload?.label as string]}
                                    />
                                )}
                            />
                            <Tooltip content={<DisputeAgeTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}