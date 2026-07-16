import SalesView from "@/components/sales/sales-view";
import type { Sale } from "@/types/types";

const SALES_PAGE_LIMIT = 10;

async function fetchSales(limit: number, offset: number): Promise<{ sales: Sale[]; total: number } | null> {
    try {
        const res = await fetch(
            `${process.env.SELLER_APP_URL}/api/sales?limit=${limit}&offset=${offset}`,
            {
                headers: { "x-api-key": process.env.SELLER_API_KEY! },
                cache: "no-store",
            },
        );
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
    const offset = (page - 1) * SALES_PAGE_LIMIT;

    const data = await fetchSales(SALES_PAGE_LIMIT, offset);

    return (
        <SalesView
            sales={data?.sales ?? null}
            total={data?.total ?? 0}
            page={page}
            pageLimit={SALES_PAGE_LIMIT}
        />
    );
}