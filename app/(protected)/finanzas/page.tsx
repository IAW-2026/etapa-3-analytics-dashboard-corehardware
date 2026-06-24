"use client";

import { useState } from "react";


const TABS = ["Pagos", "Disputas"];


const paymentStatusBadge = (status: string) => {
    const map: Record<string, string> = {
        APROBADO: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        PENDIENTE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        RECHAZADO: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return map[status] ?? "bg-neutral-100 text-neutral-500";
};


const disputeStatusBadge = (status: string) => {
    const map: Record<string, string> = {
        ABIERTA: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        RESUELTA: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        EN_REVISION: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
    return map[status] ?? "bg-neutral-100 text-neutral-500";
};


export default function FinancesPage() {
    const [tab, setTab] = useState("Pagos");
    // TODO: fetch from GET api/payments and GET api/disputes
    const pagos: any[] = [];
    const disputas: any[] = [];

    const disputasAbiertas = disputas.filter((d) => d.estado === "ABIERTA");
    const disputasResto = disputas.filter((d) => d.estado !== "ABIERTA");

    return (
        <main className="p-8 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <div className="mb-8">
                <p className="text-xs font-mono tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
                    CoreHardware
                </p>
                <h1 className="text-2xl font-light tracking-[0.05em] text-neutral-900 dark:text-neutral-100">
                    Finanzas
                </h1>
                <div className="h-px w-8 bg-violet-500 mt-2" />
            </div>

            <div className="flex gap-2 mb-6">
                {TABS.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${tab === t
                                ? "bg-violet-600 border-violet-600 text-white dark:bg-violet-500 dark:border-violet-500"
                                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-violet-400"
                            }`}
                    >
                        {t}
                        {t === "Disputas" && disputasAbiertas.length > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                {disputasAbiertas.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                {tab === "Pagos" ? (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-200 dark:border-neutral-800">
                                {["ID", "Fecha", "Comprador", "Vendedor", "Forma de pago", "Monto", "Estado"].map((h) => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pagos.length === 0 ? (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-600 font-mono">Sin datos</td></tr>
                            ) : pagos.map((p) => (
                                <tr key={p.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">{p.id}</td>
                                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{p.fecha}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">{p.comprador_id}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">{p.vendedor_id}</td>
                                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{p.forma_de_pago}</td>
                                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">${p.monto}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-mono ${paymentStatusBadge(p.estado)}`}>{p.estado}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-200 dark:border-neutral-800">
                                {["ID", "Pedido", "Fecha inicio", "Fecha fin", "Estado", "Descripción"].map((h) => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {disputas.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-600 font-mono">Sin datos</td></tr>
                            ) : [...disputasAbiertas, ...disputasResto].map((d) => (
                                <tr key={d.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">{d.id}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">{d.pedido_id}</td>
                                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{d.fecha_de_inicio}</td>
                                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{d.fecha_de_finalizacion ?? "—"}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-mono ${disputeStatusBadge(d.estado)}`}>{d.estado}</span>
                                    </td>
                                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 max-w-xs truncate">{d.descripcion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </main>
    );
}