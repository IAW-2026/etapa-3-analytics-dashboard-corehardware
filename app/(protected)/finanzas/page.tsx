import FinancesTable from "@/components/finances-table";
import type { Pago, Disputa } from "@/types/types";


async function fetchPagos(): Promise<Pago[] | null> {
    try {
        const res = await fetch(`${process.env.PAYMENTS_APP_URL}/api/payments`, {
            headers: { "x-api-key": process.env.PAYMENTS_API_KEY! },
            cache: "no-store",
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}


async function fetchDisputas(): Promise<Disputa[] | null> {
    try {
        const res = await fetch(`${process.env.PAYMENTS_APP_URL}/api/disputes`, {
            headers: { "x-api-key": process.env.PAYMENTS_API_KEY! },
            cache: "no-store",
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}


export default async function FinancesPage() {
    const [pagos, disputas] = await Promise.all([fetchPagos(), fetchDisputas()]);

    return <FinancesTable pagos={pagos} disputas={disputas} />;
}