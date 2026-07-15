"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Shipment } from "@/types/types";

const STATES = ["Todos", "PENDIENTE", "ASIGNADO", "RETIRADO", "EN_CAMINO", "ENTREGADO"];
const PAGE_SIZE = 10;

const stateBadge = (state: string) => {
    const map: Record<string, string> = {
        PENDIENTE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        ASIGNADO: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
        RETIRADO: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        EN_CAMINO: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        ENTREGADO: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
    return map[state] ?? "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400";
};

type Props = {
    shipments: Shipment[] | null;
};

export default function LogisticsTable({ shipments }: Props) {
    const [filter, setFilter] = useState("Todos");
    const [page, setPage] = useState(1);

    const filtered =
        shipments === null
            ? []
            : filter === "Todos"
                ? shipments
                : shipments.filter((s) => s.estado === filter);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    // Reset a la pagina 1 cuando cambia el filtro o el dataset.
    useEffect(() => {
        setPage(1);
    }, [filter, shipments]);

    // Si por alguna razon la pagina actual quedo fuera de rango, corregir.
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const pageStart = (page - 1) * PAGE_SIZE;
    const pageEnd = pageStart + PAGE_SIZE;
    const pageItems = filtered.slice(pageStart, pageEnd);

    return (
        <>
            <div className="flex gap-2 mb-6 flex-wrap">
                {STATES.map((e) => {
                    const count = e === "Todos"
                        ? shipments?.length ?? 0
                        : shipments?.filter((s) => s.estado === e).length ?? 0;
                    return (
                        <button
                            key={e}
                            onClick={() => setFilter(e)}
                            className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${filter === e
                                    ? "bg-violet-600 border-violet-600 text-white dark:bg-violet-500 dark:border-violet-500"
                                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-violet-400"
                                }`}
                        >
                            {e}
                            <span className="ml-1.5 opacity-60">({count})</span>
                        </button>
                    );
                })}
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-800">
                            {["ID", "Pedido", "Dirección", "Estado", "Operador", "Entrega", "Monto"].map((h) => (
                                <th key={h} className="text-left px-4 py-3 text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {shipments === null ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-sm text-red-400 font-mono">
                                    Error al cargar los envíos
                                </td>
                            </tr>
                        ) : pageItems.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-600 font-mono">
                                    Sin datos
                                </td>
                            </tr>
                        ) : (
                            pageItems.map((s) => (
                                <tr key={s.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">{s.id.slice(-8)}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">{s.pedido_id.slice(-8)}</td>
                                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{s.direccion}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-mono ${stateBadge(s.estado)}`}>{s.estado}</span>
                                    </td>
                                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                                        {s.operador ? s.operador.nombre : "Sin asignar"}
                                    </td>
                                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                                        {s.estado === "ENTREGADO" && s.fecha_de_entrega
                                            ? new Date(s.fecha_de_entrega).toLocaleDateString("es-AR")
                                            : s.fecha_estimada
                                                ? new Date(s.fecha_estimada).toLocaleDateString("es-AR")
                                                : "-"}
                                    </td>
                                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">${s.monto}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {filtered.length > PAGE_SIZE && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                        <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                            {pageStart + 1}–{Math.min(pageEnd, filtered.length)} de {filtered.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-1.5 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-violet-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                aria-label="Página anterior"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-xs font-mono px-3 text-neutral-500 dark:text-neutral-400">
                                {page} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-1.5 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-violet-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                aria-label="Página siguiente"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
