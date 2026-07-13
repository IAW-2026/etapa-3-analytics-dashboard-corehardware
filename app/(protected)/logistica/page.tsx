import LogisticsView from "@/components/logistics/logistics-view";
import type { Shipment, LogisticaKpis } from "@/types/types";

const RANGOS_VALIDOS = new Set(["7", "30", "90", "0"]);
const RANGO_DEFAULT = "30";

async function fetchShipments(): Promise<Shipment[] | null> {
    try {
        const res = await fetch(`${process.env.SHIPPING_APP_URL}/api/analytics/envios`, {
            headers: { "X-API-Key": process.env.SHIPPING_API_KEY! },
            cache: "no-store",
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.items;
    } catch {
        return null;
    }
}

async function fetchLogisticaKpis(days: string): Promise<LogisticaKpis | null> {
    try {
        const res = await fetch(
            `${process.env.SHIPPING_APP_URL}/api/analytics/stats/logistica-kpis?days=${days}`,
            {
                headers: { "X-API-Key": process.env.SHIPPING_API_KEY! },
                cache: "no-store",
            }
        );
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

type PageProps = {
    searchParams: Promise<{ days?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams;
    const rango = params.days && RANGOS_VALIDOS.has(params.days) ? params.days : RANGO_DEFAULT;

    const [shipments, kpis] = await Promise.all([
        fetchShipments(),
        fetchLogisticaKpis(rango),
    ]);

    return <LogisticsView shipments={shipments} kpis={kpis} rango={rango} />;
}
