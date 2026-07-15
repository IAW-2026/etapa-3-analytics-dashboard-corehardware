import UsersView from "@/components/users/users-view";
import { fetchVendedores } from "@/lib/sync/fetchers";
import type { Buyer, Seller, Operator } from "@/types/types";

async function fetchBuyers(): Promise<Buyer[] | null> {
    try {
        const res = await fetch(`${process.env.BUYER_APP_URL}/api/buyers`, {
            headers: { "x-api-key": process.env.BUYER_API_KEY! },
            cache: "no-store",
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

async function fetchSellers(): Promise<Seller[] | null> {
    try {
        return await fetchVendedores();
    } catch {
        return null;
    }
}
// TODO: reemplazar cuando el Shipping App exponga GET /api/operators
async function fetchOperators(): Promise<Operator[] | null> {
    return null;
}

export default async function UsersPage() {
    const [buyers, sellers, operators] = await Promise.all([
        fetchBuyers(),
        fetchSellers(),
        fetchOperators(),
    ]);

    return <UsersView buyers={buyers} sellers={sellers} operators={operators} />;
}