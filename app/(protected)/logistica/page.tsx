import LogisticsView from "@/components/logistics/logistics-view";
import type { Shipment } from "@/types/types";

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

export default async function Page() {
    const shipments = await fetchShipments();
    return <LogisticsView shipments={shipments} />;
}
