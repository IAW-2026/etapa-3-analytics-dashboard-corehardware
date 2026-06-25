import FinancesCharts from "@/components/finances/finances-charts";
import FinancesTable from "@/components/finances/finances-table";
import type { Payment, Dispute } from "@/types/types";

type Props = {
    payments: Payment[] | null;
    disputes: Dispute[] | null;
};

export default function FinancesView({ payments, disputes }: Props) {
    return (
        <main className="p-8 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-light tracking-[0.05em] text-neutral-900 dark:text-neutral-100">
                    Finanzas
                </h1>
                <div className="h-px w-8 bg-violet-500 mt-2" />
            </div>

            <FinancesCharts payments={payments} disputes={disputes} />
            <FinancesTable payments={payments} disputes={disputes} />
        </main>
    );
}