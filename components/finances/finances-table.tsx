"use client";

import { useState } from "react";
import type { Payment, Dispute } from "@/types/types";

const TABS = ["Pagos", "Disputas"] as const;

const PAYMENT_STATUS_BADGE: Record<Payment["estado"], string> = {
    acreditado:  "bg-emerald-950/60 text-emerald-400",
    pendiente:   "bg-violet-950/60 text-violet-400",
    rechazado:   "bg-red-950/60 text-red-400",
    en_proceso:  "bg-indigo-950/60 text-indigo-400",
    cancelado:   "bg-zinc-800 text-zinc-400",
    reembolsado: "bg-fuchsia-950/60 text-fuchsia-400",
    contracargo: "bg-orange-950/60 text-orange-400",
};

const DISPUTE_STATUS_BADGE: Record<Dispute["estado"], string> = {
    pendiente:   "bg-violet-950/60 text-violet-400",
    reembolsada: "bg-fuchsia-950/60 text-fuchsia-400",
    repuesta:    "bg-emerald-950/60 text-emerald-400",
    rechazada:   "bg-red-950/60 text-red-400",
};

type Props = {
    payments: Payment[] | null;
    disputes: Dispute[] | null;
};

export default function FinancesTable({ payments, disputes }: Props) {
    const [tab, setTab] = useState<(typeof TABS)[number]>("Pagos");

    const openDisputes = disputes?.filter((d) => d.estado === "pendiente") ?? [];
    const sortedDisputes = disputes
        ? [...disputes].sort((a, b) => (a.estado === "pendiente" ? -1 : b.estado === "pendiente" ? 1 : 0))
        : null;

    return (
        <>
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
                            {payments === null ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-red-400 font-mono">
                                        Error al cargar los pagos
                                    </td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-600 font-mono">
                                        Sin datos
                                    </td>
                                </tr>
                            ) : (
                                payments.map((p) => (
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
                                            <span className={`px-2 py-0.5 rounded text-xs font-mono ${PAYMENT_STATUS_BADGE[p.estado]}`}>
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
                            {sortedDisputes === null ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-red-400 font-mono">
                                        Error al cargar las disputas
                                    </td>
                                </tr>
                            ) : sortedDisputes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-600 font-mono">
                                        Sin datos
                                    </td>
                                </tr>
                            ) : (
                                sortedDisputes.map((d) => (
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
                                            <span className={`px-2 py-0.5 rounded text-xs font-mono ${DISPUTE_STATUS_BADGE[d.estado]}`}>
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
        </>
    );
}