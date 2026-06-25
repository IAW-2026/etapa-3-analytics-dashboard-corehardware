import FinancesView from "@/components/finances/finances-view";
import type { Payment, Dispute } from "@/types/types";


async function fetchPayments(): Promise<Payment[] | null> {
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


async function fetchDisputes(): Promise<Dispute[] | null> {
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
    const [payments, disputes] = await Promise.all([fetchPayments(), fetchDisputes()]);

    return <FinancesView payments={payments} disputes={disputes} />;
}