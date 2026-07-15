"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Shipment } from "@/types/types";

const STATES = ["Todos", "PENDIENTE", "ASIGNADO", "RETIRADO", "EN_CAMINO", "ENTREGADO"];
const PAGE_SIZE = 10;

// Alineado con la paleta del theme (emerald/amber/rose/violet/cyan/orange).
const stateBadge = (state: string) => {
    const map: Record<string, string> = {
        PENDIENTE: "bg-amber-400/10 text-amber-400",
        ASIGNADO: "bg-cyan-400/10 text-cyan-400",
        RETIRADO: "bg-orange-400/10 text-orange-400",
        EN_CAMINO: "bg-violet-400/10 text-violet-400",
        ENTREGADO: "bg-emerald-400/10 text-emerald-400",
    };
    return map[state] ?? "bg-zinc-400/10 text-zinc-400";
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

    useEffect(() => { setPage(1); }, [filter, shipments]);
    useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

    const pageStart = (page - 1) * PAGE_SIZE;
    const pageEnd = pageStart + PAGE_SIZE;
    const pageItems = filtered.slice(pageStart, pageEnd);

    return (
        <>
            <div className="flex gap-2 mb-4 flex-wrap">
                {STATES.map((e) => {
                    const count = e === "Todos"
                        ? shipments?.length ?? 0
                        : shipments?.filter((s) => s.estado === e).length ?? 0;
                    return (
                        <button
                            key={e}
                            onClick={() => setFilter(e)}
                            className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${filter === e
                                    ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-violet-500/40 hover:text-zinc-200"
                                }`}
                        >
                            {e}
                            <span className="ml-1.5 opacity-60">({count})</span>
                        </button>
                    );
                })}
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-800">
                            {["ID", "Pedido", "Dirección", "Estado", "Operador", "Entrega", "Monto"].map((h) => (
                                <th key={h} className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-zinc-400">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {shipments === null ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-sm text-rose-400 font-mono">
                                    Error al cargar los envíos
                                </td>
                            </tr>
                        ) : pageItems.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-sm text-zinc-500 font-mono">
                                    Sin datos
                                </td>
                            </tr>
                        ) : (
                            pageItems.map((s) => (
                                <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">{s.id.slice(-8)}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">{s.pedido_id.slice(-8)}</td>
                                    <td className="px-4 py-3 text-zinc-300">{s.direccion}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-mono ${stateBadge(s.estado)}`}>{s.estado}</span>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-400">
                                        {s.operador ? s.operador.nombre : "Sin asignar"}
                                    </td>
                                    <td className="px-4 py-3 text-zinc-400 font-mono">
                                        {s.estado === "ENTREGADO" && s.fecha_de_entrega
                                            ? new Date(s.fecha_de_entrega).toLocaleDateString("es-AR")
                                            : s.fecha_estimada
                                                ? new Date(s.fecha_estimada).toLocaleDateString("es-AR")
                                                : "-"}
                                    </td>
                                    <td className="px-4 py-3 text-zinc-300 font-mono">${s.monto.toLocaleString("es-AR")}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {filtered.length > PAGE_SIZE && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800 bg-zinc-900/50">
                        <span className="text-xs font-mono text-zinc-500">
                            {pageStart + 1}–{Math.min(pageEnd, filtered.length)} de {filtered.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-1.5 rounded border border-zinc-800 text-zinc-400 hover:border-violet-500/40 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                aria-label="Página anterior"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-xs font-mono px-3 text-zinc-400">
                                {page} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-1.5 rounded border border-zinc-800 text-zinc-400 hover:border-violet-500/40 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
