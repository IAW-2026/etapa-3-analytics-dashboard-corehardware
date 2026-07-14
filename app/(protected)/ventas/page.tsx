import SalesView from "@/components/sales/sales-view";
import type { Sale } from "@/types/types";

async function fetchSales(): Promise<Sale[] | null> {
    try {
        const res = await fetch(`${process.env.SELLER_APP_URL}/api/sales`, {
            headers: { "x-api-key": process.env.SELLER_API_KEY! },
            cache: "no-store",
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export default async function Page() {
    const sales = await fetchSales();
    return <SalesView sales={sales} />;
}