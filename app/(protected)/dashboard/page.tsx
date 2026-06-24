import { TrendingUp, ShoppingCart, Truck, AlertTriangle } from "lucide-react";

const KPI_CARDS = [
    { label: "Pedidos totales", key: "orders", icon: ShoppingCart },
    { label: "Monto procesado", key: "amount", icon: TrendingUp },
    { label: "Envíos pendientes", key: "shippings", icon: Truck },
    { label: "Disputas abiertas", key: "disputes", icon: AlertTriangle },
];

export default function DashboardPage() {
    // TODO: fetch data from APIs
    const kpis = {
        orders: "—",
        amount: "—",
        shippings: "—",
        disputes: "—",
    };

    return (
        <main className="p-8 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <div className="mb-8">
                <p className="text-xs font-mono tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
                    CoreHardware
                </p>
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
                        <span className="text-3xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
                            {kpis[key as keyof typeof kpis]}
                        </span>
                    </div>
                ))}
            </div>
        </main>
    );
}