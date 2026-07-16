"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { BestSellingProduct, SellerNameId } from "@/types/types";
import FilterBySellerInput from "@/components/best-selling-products/filter-by-seller-input";

type Props = {
    products: BestSellingProduct[] | null;
    maxProducts?: number;
    sellerId?: string;
    sellersNamesIds: SellerNameId[] | null;
};

export default function ProductsView({ products, maxProducts = 5, sellerId, sellersNamesIds }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateRoute = (params: URLSearchParams) => {
        const query = params.toString();
        router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    };

    const handleMaxProductsChange = (value: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("maxProducts", value.toString());
        updateRoute(params);
    };

    const handleSellerSelect = (selectedSellerId?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (selectedSellerId) {
            params.set("sellerId", selectedSellerId);
        } else {
            params.delete("sellerId");
        }

        updateRoute(params);
    };

    return (
        <main className="p-8 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-light tracking-[0.05em] text-neutral-900 dark:text-neutral-100">
                    Productos más vendidos
                </h1>
                <div className="h-px w-8 bg-violet-500 mt-2" />
            </div>

            <div className="mb-8 space-y-4 lg:flex lg:items-end lg:justify-between lg:space-y-0">
                <FilterBySellerInput
                    sellersNamesIds={sellersNamesIds}
                    selectedSellerId={sellerId}
                    onSelectSeller={handleSellerSelect}
                />

                <div className="flex flex-wrap items-center gap-3">
                    {[5, 10, 15].map((value) => (
                        <button
                            key={value}
                            type="button"
                            className="rounded-full border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                            disabled={maxProducts === value}
                            onClick={() => handleMaxProductsChange(value)}
                        >
                            {value}
                        </button>
                    ))}
                </div>
            </div>

            {(!products || products.length === 0) ? (
                <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                    No hay Datos
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <table className="min-w-full text-left text-sm text-neutral-700 dark:text-neutral-300">
                        <thead className="bg-neutral-50 text-xs uppercase tracking-[0.08em] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                            <tr>
                                <th className="px-4 py-3">Producto</th>
                                <th className="px-4 py-3">Marca</th>
                                <th className="px-4 py-3">Modelo</th>
                                <th className="px-4 py-3">Precio</th>
                                <th className="px-4 py-3">Vendedor</th>
                                <th className="px-4 py-3">Total vendido</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.slice(0, maxProducts).map((product) => (
                                <tr key={product.name} className="border-t border-neutral-200 dark:border-neutral-800">
                                    <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{product.name}</td>
                                    <td className="px-4 py-3">{product.brand}</td>
                                    <td className="px-4 py-3">{product.model}</td>
                                    <td className="px-4 py-3">{product.price}</td>
                                    <td className="px-4 py-3">{product.sellerName}</td>
                                    <td className="px-4 py-3">{product.totalSold}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
