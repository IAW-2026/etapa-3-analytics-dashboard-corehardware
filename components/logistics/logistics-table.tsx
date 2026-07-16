"use client";

import { useEffect, useState } from "react";
import { Pagination } from "@/components/shared/Pagination";
import { chartCategoryColors } from "@/styles/theme";
import type { Shipment } from "@/types/types";

const STATES = ["Todos", "PENDIENTE", "ASIGNADO", "RETIRADO", "EN_CAMINO", "ENTREGADO"] as const;
const PAGE_SIZE = 10;

// Mismos colores que los gráficos y el mapa (chartCategoryColors del theme),
// para que un envío ENTREGADO sea del mismo verde en el chip, en el badge
// de la tabla, en el donut y en el marcador del mapa.
const ESTADO_COLOR: Record<string, string> = {
    Todos: chartCategoryColors.violet,
    PENDIENTE: chartCategoryColors.amber,
    ASIGNADO: chartCategoryColors.cyan,
    RETIRADO: chartCategoryColors.orange,
    EN_CAMINO: chartCategoryColors.violet,
    ENTREGADO: chartCategoryColors.emerald,
};

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
    const [filter, setFilter] = useState<(typeof STATES)[number]>("Todos");
    const [page, setPage] = useState(1);

    const filtered =
        shipments === null
            ? []
            : filter === "Todos"
                ? shipments
                : shipments.filter((s) => s.estado === filter);

    useEffect(() => { setPage(1); }, [filter, shipments]);

    const pageStart = (page - 1) * PAGE_SIZE;
    const pageEnd = pageStart + PAGE_SIZE;
    const pageItems = filtered.slice(pageStart, pageEnd);

    return (
        <>
            <div className="flex flex-wrap gap-2 mb-4">
                {STATES.map((estado) => {
                    const count = estado === "Todos"
                        ? shipments?.length ?? 0
                        : shipments?.filter((s) => s.estado === estado).length ?? 0;
                    const isSelected = filter === estado;
                    const color = ESTADO_COLOR[estado] ?? "#a1a1aa";
                    return (
                        <button
                            key={estado}
                            onClick={() => setFilter(estado)}
                            style={isSelected ? { borderColor: color, backgroundColor: `${color}1a`, color } : undefined}
                            className={[
                                "rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors",
                                isSelected ? "" : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300",
                            ].join(" ")}
                        >
                            {estado}
                            <span className="ml-1.5 opacity-70">({count})</span>
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

                <div className="px-4 pb-3">
                    <Pagination
                        page={page}
                        total={filtered.length}
                        pageLimit={PAGE_SIZE}
                        onPageChange={setPage}
                    />
                </div>
            </div>
        </>
    );
}
