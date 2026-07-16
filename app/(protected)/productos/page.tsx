import type { BestSellingProduct, SellerNameId } from "@/types/types";
import ProductsView from "@/components/best-selling-products/products-view";

async function fetchBestSellingProducts(sellerId?: string, limit?: number): Promise<BestSellingProduct[] | null> {
    try {
    const url = new URL(`${process.env.SELLER_APP_URL}/api/products/best-selling`);
    if (sellerId) {
        url.searchParams.append("sellerId", sellerId);
    }
    if (limit) {
        url.searchParams.append("limit", limit.toString());
    }
    const res = await fetch(url, {
            headers: { "x-api-key": process.env.SELLER_API_KEY! },
            cache: "no-store",
        });
    if (!res.ok) return null;
    const data = await res.json();
    return data.items;
    } catch {
    return null;
    }
}

async function fetchSellersNamesIds(): Promise<SellerNameId[] | null> {
    try {
        const res = await fetch(`${process.env.SELLER_APP_URL}/api/sellers/names-ids`, {
            headers: { "x-api-key": process.env.SELLER_API_KEY! },
            cache: "no-store",
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data;
    } catch {
        return null;
    }
}

type searchParams = Promise<{ maxProducts?: number, sellerId?: string }>

export default async function BestSellingProductsPage({ searchParams }: { searchParams: searchParams }) {
    const { maxProducts, sellerId } = await searchParams;
    const products = await fetchBestSellingProducts(sellerId, maxProducts);
    const sellers = await fetchSellersNamesIds();
    return <ProductsView products={products} maxProducts={maxProducts} sellersNamesIds={sellers} sellerId={sellerId} />;
}

