import type { Metadata } from "next";
import FinancesView from "@/components/finances/finances-view";
import type { Payment, Dispute } from "@/types/types";

export const metadata: Metadata = {
    title: "Finanzas | CoreHardware Analytics",
    description: "Pagos y disputas del sistema de pagos de CoreHardware.",
};

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
        // El endpoint de disputas está paginado (default limit=10).
        // Pedimos un límite alto para traer el listado completo en una sola
        // llamada, ya que hoy no necesitamos paginación server-side.
        const res = await fetch(`${process.env.PAYMENTS_APP_URL}/api/disputes?limit=1000`, {
            headers: { "x-api-key": process.env.PAYMENTS_API_KEY! },
            cache: "no-store",
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.disputes;
    } catch {
        return null;
    }
}

export default async function FinancesPage() {
    const [payments, disputes] = await Promise.all([fetchPayments(), fetchDisputes()]);

    return <FinancesView payments={payments} disputes={disputes} />;
}