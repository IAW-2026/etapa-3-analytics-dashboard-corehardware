"use client";

import { useState } from "react";


const TABS = ["Compradores", "Vendedores", "Operadores"];


export default function UsersPage() {
    const [tab, setTab] = useState("Compradores");
    // TODO: fetch from GET api/buyers, GET api/sellers, GET api/operators
    const buyers: any[] = [];
    const sellers: any[] = [];
    const operators: any[] = [];

    return (
        <main className="p-8 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-light tracking-[0.05em] text-neutral-900 dark:text-neutral-100">
                    Usuarios
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
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                {tab === "Compradores" && (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-200 dark:border-neutral-800">
                                {["Nombre", "DNI", "Mail", "Celular", "Condición IVA"].map((h) => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {buyers.length === 0 ? (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-600 font-mono">Sin datos</td></tr>
                            ) : buyers.map((b) => (
                                <tr key={b.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{b.apellido}, {b.nombre}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">{b.dni}</td>
                                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{b.mail}</td>
                                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{b.celular}</td>
                                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{b.condicion_iva}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {tab === "Vendedores" && (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-200 dark:border-neutral-800">
                                {["Razón social", "CUIT", "Mail", "Celular", "Condición IVA"].map((h) => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sellers.length === 0 ? (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-600 font-mono">Sin datos</td></tr>
                            ) : sellers.map((s) => (
                                <tr key={s.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{s.razon_social}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">{s.cuit}</td>
                                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{s.mail}</td>
                                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{s.celular}</td>
                                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{s.condicion_iva}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {tab === "Operadores" && (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-200 dark:border-neutral-800">
                                {["Nombre", "DNI", "Mail", "Celular"].map((h) => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {operators.length === 0 ? (
                                <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-600 font-mono">Sin datos</td></tr>
                            ) : operators.map((o) => (
                                <tr key={o.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{o.apellido}, {o.nombre}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">{o.dni}</td>
                                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{o.mail}</td>
                                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{o.celular}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </main>
    );
}