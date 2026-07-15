import { Suspense } from "react";
import FinancesCharts from "@/components/finances/finances-charts";
import FinancesTable from "@/components/finances/finances-table";
import type { Payment, Dispute } from "@/types/types";

type Props = {
    payments: Payment[] | null;
    disputes: Dispute[] | null;
};

export default function FinancesView({ payments, disputes }: Props) {
    // Mismo patrón que PedidosPageClient: sin <main> ni fondo propios, porque
    // el layout de (protected) ya los provee. Antes Finanzas duplicaba ambos,
    // lo que desalineaba el punto de inicio del contenido contra el resto de
    // las páginas del dashboard.
    return (
        <div className="flex flex-col gap-6 p-6">
            <h1 className="font-mono text-lg uppercase tracking-wide text-zinc-200">Finanzas</h1>

            <FinancesCharts payments={payments} disputes={disputes} />

            {/*
                FinancesTable usa useSearchParams (paginación vía URL), lo que
                requiere un Suspense boundary en Next.js App Router.
            */}
            <Suspense fallback={null}>
                <FinancesTable payments={payments} disputes={disputes} />
            </Suspense>
        </div>
    );
}