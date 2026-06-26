import { TrendingUp, ShoppingCart, Truck, AlertTriangle } from "lucide-react";
import type { Dispute } from "@/types/types";

const KPI_CARDS = [
    { label: "Pedidos totales", key: "orders", icon: ShoppingCart },
    { label: "Monto procesado", key: "amount", icon: TrendingUp },
    { label: "Envíos pendientes", key: "shippings", icon: Truck },
    { label: "Disputas abiertas", key: "disputes", icon: AlertTriangle },
];

async function fetchDisputasAbiertas(): Promise<number | null> {
    try {
        const res = await fetch(`${process.env.PAYMENTS_APP_URL}/api/disputes?status=open`, {
            headers: { "x-api-key": process.env.PAYMENTS_API_KEY! },
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const data: Dispute[] = await res.json();
        return data.length;
    } catch {
        return null;
    }
}

async function fetchEnviosPendientes(): Promise<number | null> {
    try {
        const res = await fetch(`${process.env.SHIPPING_APP_URL}/api/analytics/stats/resumen`, {
            headers: { "X-API-Key": process.env.SHIPPING_API_KEY! },
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        // No entregados aún (pendientes de asignar + en curso de reparto).
        return data.envios.pendientes + data.envios.en_curso;
    } catch {
        return null;
    }
}

export default async function DashboardPage() {
    const [disputasAbiertas, enviosPendientes] = await Promise.all([
        fetchDisputasAbiertas(),
        fetchEnviosPendientes(),
    ]);

    const kpis = {
        orders: "—",
        amount: "—",
        shippings: enviosPendientes === null ? "Error" : String(enviosPendientes),
        disputes: disputasAbiertas === null ? "Error" : String(disputasAbiertas),
    };

    return (
        <main className="p-8 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-light tracking-[0.05em] text-neutral-900 dark:text-neutral-100">
                    Dashboard
                </h1>
                <div className="h-px w-8 bg-violet-500 mt-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {KPI_CARDS.map(({ label, key, icon: Icon }) => (
                    <div
                        key={key}
                        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 flex flex-col gap-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500">
                                {label}
                            </span>
                            <Icon className="w-4 h-4 text-neutral-300 dark:text-neutral-600" />
                        </div>
                        <span className={`text-3xl font-light tracking-tight ${
                            (key === "disputes" && disputasAbiertas === null) ||
                            (key === "shippings" && enviosPendientes === null)
                                ? "text-red-400"
                                : "text-neutral-900 dark:text-neutral-100"
                        }`}>
                            {kpis[key as keyof typeof kpis]}
                        </span>
                    </div>
                ))}
            </div>
        </main>
    );
}