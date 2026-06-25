"use client";

import { useState } from "react";
import type { Pago, Disputa } from "@/types/types";


const TABS = ["Pagos", "Disputas"] as const;


const paymentStatusBadge = (status: Pago["estado"]) => {
    const map: Record<Pago["estado"], string> = {
        APROBADO: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        PENDIENTE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        RECHAZADO: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return map[status];
};


const disputeStatusBadge = (status: Disputa["estado"]) => {
    const map: Record<Disputa["estado"], string> = {
        ABIERTA: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        RESUELTA: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        EN_REVISION: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
    return map[status];
};


type Props = {
    pagos: Pago[] | null;
    disputas: Disputa[] | null;
};


export default function FinancesTable({ pagos, disputas }: Props) {
    const [tab, setTab] = useState<(typeof TABS)[number]>("Pagos");

    const disputasAbiertas = disputas?.filter((d) => d.estado === "ABIERTA") ?? [];
    const disputasOrdenadas = disputas
        ? [...disputas].sort((a, b) => (a.estado === "ABIERTA" ? -1 : b.estado === "ABIERTA" ? 1 : 0))
        : null;

    return (
        <main className="p-8 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <div className="mb-8">
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
                        className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${
                            tab === t
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
                                    <th key={h} className="text-left px-4 py-3 text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pagos === null ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-red-400 font-mono">
                                        Error al cargar los pagos
                                    </td>
                                </tr>
                            ) : pagos.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-600 font-mono">
                                        Sin datos
                                    </td>
                                </tr>
                            ) : (
                                pagos.map((p) => (
                                    <tr key={p.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs text-neutral-500">{p.id}</td>
                                        <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                                            {new Date(p.fecha).toLocaleDateString("es-AR")}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-neutral-500">{p.buyerId}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-neutral-500">{p.sellerId}</td>
                                        <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{p.formaDePago}</td>
                                        <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">${p.monto}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-mono ${paymentStatusBadge(p.estado)}`}>
                                                {p.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-200 dark:border-neutral-800">
                                {["ID", "Pedido", "Fecha inicio", "Fecha fin", "Estado", "Descripción"].map((h) => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {disputasOrdenadas === null ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-red-400 font-mono">
                                        Error al cargar las disputas
                                    </td>
                                </tr>
                            ) : disputasOrdenadas.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-600 font-mono">
                                        Sin datos
                                    </td>
                                </tr>
                            ) : (
                                disputasOrdenadas.map((d) => (
                                    <tr key={d.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs text-neutral-500">{d.id}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-neutral-500">{d.pedidoId}</td>
                                        <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                                            {new Date(d.fechaDeInicio).toLocaleDateString("es-AR")}
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                                            {d.fechaDeFinalizacion
                                                ? new Date(d.fechaDeFinalizacion).toLocaleDateString("es-AR")
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-mono ${disputeStatusBadge(d.estado)}`}>
                                                {d.estado}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 max-w-xs truncate">
                                            {d.descripcion}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </main>
    );
}