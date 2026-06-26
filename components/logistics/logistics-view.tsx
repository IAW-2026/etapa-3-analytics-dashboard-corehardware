"use client";

import { useState } from "react";
import type { Shipment } from "@/types/types";

const STATES = ["Todos", "PENDIENTE", "ASIGNADO", "RETIRADO", "EN_CAMINO", "ENTREGADO"];

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

export default function LogisticsView({ shipments }: Props) {
    const [filter, setFilter] = useState("Todos");

    const filtered =
        shipments === null
            ? []
            : filter === "Todos"
                ? shipments
                : shipments.filter((s) => s.estado === filter);

    return (
        <main className="p-8 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-light tracking-[0.05em] text-neutral-900 dark:text-neutral-100">
                    Logistica
                </h1>
                <div className="h-px w-8 bg-violet-500 mt-2" />
            </div>

            <div className="flex gap-2 mb-6">
                {STATES.map((e) => (
                    <button
                        key={e}
                        onClick={() => setFilter(e)}
                        className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${filter === e
                                ? "bg-violet-600 border-violet-600 text-white dark:bg-violet-500 dark:border-violet-500"
                                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-violet-400"
                            }`}
                    >
                        {e}
                    </button>
                ))}
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
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-600 font-mono">
                                    Sin datos
                                </td>
                            </tr>
                        ) : (
                            filtered.map((s) => (
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
            </div>
        </main>
    );
}
