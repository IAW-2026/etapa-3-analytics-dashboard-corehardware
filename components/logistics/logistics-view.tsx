import LogisticsCharts from "@/components/logistics/logistics-charts";
import LogisticsTable from "@/components/logistics/logistics-table";
import type { Shipment } from "@/types/types";

type Props = {
    shipments: Shipment[] | null;
};

export default function LogisticsView({ shipments }: Props) {
    return (
        <main className="p-8 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-light tracking-[0.05em] text-neutral-900 dark:text-neutral-100">
                    Logistica
                </h1>
                <div className="h-px w-8 bg-violet-500 mt-2" />
            </div>

            <LogisticsCharts shipments={shipments} />
            <LogisticsTable shipments={shipments} />
        </main>
    );
}
