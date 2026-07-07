"use client";

import { memo, useState } from "react";
import type { Buyer, Seller, Operator } from "@/types/types";

const TABS = ["Compradores", "Vendedores", "Operadores"] as const;
type Tab = (typeof TABS)[number];

interface UsersViewProps {
    buyers: Buyer[] | null;
    sellers: Seller[] | null;
    operators: Operator[] | null;
}

export default function UsersView({ buyers, sellers, operators }: UsersViewProps) {
    const [tab, setTab] = useState<Tab>("Compradores");

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
                    <TabButton key={t} label={t} active={tab === t} onClick={() => setTab(t)} />
                ))}
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                {tab === "Compradores" && <BuyersTable buyers={buyers} />}
                {tab === "Vendedores" && <SellersTable sellers={sellers} />}
                {tab === "Operadores" && <OperatorsTable operators={operators} />}
            </div>
        </main>
    );
}

interface TabButtonProps {
    label: string;
    active: boolean;
    onClick: () => void;
}

const TabButton = memo(function TabButton({ label, active, onClick }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${
                active
                    ? "bg-violet-600 border-violet-600 text-white dark:bg-violet-500 dark:border-violet-500"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-violet-400"
            }`}
        >
            {label}
        </button>
    );
});

const TableHead = memo(function TableHead({ headers }: { headers: string[] }) {
    return (
        <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800">
                {headers.map((h) => (
                    <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-mono tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500"
                    >
                        {h}
                    </th>
                ))}
            </tr>
        </thead>
    );
});

function EmptyRow({ colSpan, message, isError = false }: { colSpan: number; message: string; isError?: boolean }) {
    return (
        <tr>
            <td
                colSpan={colSpan}
                className={`px-4 py-8 text-center text-sm font-mono ${
                    isError ? "text-red-400" : "text-neutral-400 dark:text-neutral-600"
                }`}
            >
                {message}
            </td>
        </tr>
    );
}

const BUYERS_HEADERS = ["Nombre", "DNI", "CUIL/CUIT", "Mail", "Celular", "Dirección", "Condición IVA"];

const BuyersTable = memo(function BuyersTable({ buyers }: { buyers: Buyer[] | null }) {
    return (
        <table className="w-full text-sm">
            <TableHead headers={BUYERS_HEADERS} />
            <tbody>
                {buyers === null ? (
                    <EmptyRow colSpan={BUYERS_HEADERS.length} message="Error al cargar compradores" isError />
                ) : buyers.length === 0 ? (
                    <EmptyRow colSpan={BUYERS_HEADERS.length} message="Sin datos" />
                ) : (
                    buyers.map((b) => (
                        <tr
                            key={b.id}
                            className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                        >
                            <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                                {b.apellido}, {b.nombre}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-neutral-500">{b.dni}</td>
                            <td className="px-4 py-3 font-mono text-xs text-neutral-500">{b.cuil_cuit}</td>
                            <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{b.mail}</td>
                            <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{b.celular}</td>
                            <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{b.direccion}</td>
                            <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{b.condicion_iva}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
});

const SELLERS_HEADERS = ["Razón social", "CUIT", "Mail", "Celular", "Condición IVA"];

const SellersTable = memo(function SellersTable({ sellers }: { sellers: Seller[] | null }) {
    return (
        <table className="w-full text-sm">
            <TableHead headers={SELLERS_HEADERS} />
            <tbody>
                {sellers === null ? (
                    <EmptyRow colSpan={SELLERS_HEADERS.length} message="Error al cargar vendedores" isError />
                ) : sellers.length === 0 ? (
                    <EmptyRow colSpan={SELLERS_HEADERS.length} message="Sin datos" />
                ) : (
                    sellers.map((s) => (
                        <tr
                            key={s.id}
                            className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                        >
                            <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{s.razon_social}</td>
                            <td className="px-4 py-3 font-mono text-xs text-neutral-500">{s.cuit}</td>
                            <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{s.mail}</td>
                            <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{s.celular}</td>
                            <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{s.condicion_iva}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
});

const OPERATORS_HEADERS = ["Nombre", "DNI", "Mail", "Celular"];

const OperatorsTable = memo(function OperatorsTable({ operators }: { operators: Operator[] | null }) {
    return (
        <table className="w-full text-sm">
            <TableHead headers={OPERATORS_HEADERS} />
            <tbody>
                {operators === null ? (
                    <EmptyRow colSpan={OPERATORS_HEADERS.length} message="Error al cargar operadores" isError />
                ) : operators.length === 0 ? (
                    <EmptyRow colSpan={OPERATORS_HEADERS.length} message="Sin datos" />
                ) : (
                    operators.map((o) => (
                        <tr
                            key={o.id}
                            className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                        >
                            <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                                {o.apellido}, {o.nombre}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-neutral-500">{o.dni}</td>
                            <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{o.mail}</td>
                            <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{o.celular}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
});