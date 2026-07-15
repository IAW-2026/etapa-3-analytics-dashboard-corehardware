import type { BestSellingProduct } from "@/types/types";
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

type searchParams = Promise<{ maxProducts?: number }>

export default async function BestSellingProductsPage({ searchParams }: { searchParams: searchParams }) {
    const { maxProducts } = await searchParams;
    const seller = undefined; 
    const products = await fetchBestSellingProducts(seller, maxProducts);
    return <ProductsView products={products} maxProducts={maxProducts} />;
}

