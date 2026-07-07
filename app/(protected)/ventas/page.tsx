import SalesView from "@/components/sales/sales-view";
import type { Sale, Order } from "@/types/types";

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

async function fetchOrders(): Promise<Order[] | null> {
    try {
        const res = await fetch(`${process.env.BUYER_APP_URL}/api/orders/all`, {
            headers: { "x-api-key": process.env.BUYER_API_KEY! },
            cache: "no-store",
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export default async function Page() {
    const [sales, orders] = await Promise.all([fetchSales(), fetchOrders()]);
    return <SalesView sales={sales} orders={orders} />;
}