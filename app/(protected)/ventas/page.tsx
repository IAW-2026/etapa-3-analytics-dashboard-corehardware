"use client";

import { useState } from "react";


const TABS = ["Pedidos", "Ventas"];


const stateBadge = (state: string) => {
  const map: Record<string, string> = {
    PENDIENTE_PAGO: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    PAGO_APROBADO: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    PAGO_RECHAZADO: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    EN_PREPARACION: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    EN_CAMINO: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    ENTREGADO: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    CANCELADO: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
  };
  return map[state] ?? "bg-neutral-100 text-neutral-500";
};


export default function SalesPage() {
  const [tab, setTab] = useState("Pedidos");
  // TODO: fetch from GET api/orders and GET api/sales
  const pedidos: any[] = [];
  const ventas: any[] = [];

  return (
    <main className="p-8 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <div className="mb-8">
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
          CoreHardware
        </p>
        <h1 className="text-2xl font-light tracking-[0.05em] text-neutral-900 dark:text-neutral-100">
          Ventas
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
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        {tab === "Pedidos" ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                {["ID", "Fecha", "Comprador", "Vendedor", "Monto", "Estado"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-600 font-mono">Sin datos</td></tr>
              ) : pedidos.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">{p.id}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{p.fecha}</td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">{p.comprador_id}</td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">{p.vendedor_id}</td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">${p.monto}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono ${stateBadge(p.estado)}`}>{p.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                {["ID", "Fecha", "Vendedor", "Monto"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ventas.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-600 font-mono">Sin datos</td></tr>
              ) : ventas.map((v) => (
                <tr key={v.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">{v.id}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{v.fecha}</td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">{v.vendedor_id}</td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">${v.monto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}