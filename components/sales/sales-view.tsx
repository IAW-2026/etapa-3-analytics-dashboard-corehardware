"use client";

import type { Sale } from "@/types/types";

type Props = {
    sales: Sale[] | null;
};

export default function SalesView({ sales }: Props) {
    return (
        <main className="p-8 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-light tracking-[0.05em] text-neutral-900 dark:text-neutral-100">
                    Ventas
                </h1>
                <div className="h-px w-8 bg-violet-500 mt-2" />
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-800">
                            {["ID", "Fecha", "Vendedor", "Monto"].map((h) => (
                                <th key={h} className="text-left px-4 py-3 text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sales === null ? (
                            <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-red-400 font-mono">Error al cargar las ventas</td></tr>
                        ) : sales.length === 0 ? (
                            <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-600 font-mono">Sin datos</td></tr>
                        ) : sales.map((v) => (
                            <tr key={v.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                                <td className="px-4 py-3 font-mono text-xs text-neutral-500">{v.id}</td>
                                <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{new Date(v.date).toLocaleDateString("es-AR")}</td>
                                <td className="px-4 py-3 font-mono text-xs text-neutral-500">{v.sellerId}</td>
                                <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">${v.totalPrice}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}