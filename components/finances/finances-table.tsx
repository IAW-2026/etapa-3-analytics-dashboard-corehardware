"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Payment, Dispute } from "@/types/types";
import { Pagination } from "@/components/shared/Pagination";
import { cardLabelClass } from "@/styles/theme";
import {
    PAYMENT_STATUS_LABEL,
    PAYMENT_STATUS_BADGE_CLASS,
    DISPUTE_STATUS_LABEL,
    DISPUTE_STATUS_BADGE_CLASS,
} from "@/lib/dashboard/constants";

const TABS = ["Pagos", "Disputas"] as const;
const PAGE_LIMIT = 15;

type Props = {
    payments: Payment[] | null;
    disputes: Dispute[] | null;
};

export default function FinancesTable({ payments, disputes }: Props) {
    const [tab, setTab] = useState<(typeof TABS)[number]>("Pagos");
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Cada tab pagina de forma independiente, vía query params en la URL
    // (en vez de estado local) para que la página quede bookmarkeable y
    // sobreviva a un refresh.
    const pagosPageParam = Math.max(parseInt(searchParams.get("pagosPage") ?? "1", 10) || 1, 1);
    const disputasPageParam = Math.max(parseInt(searchParams.get("disputasPage") ?? "1", 10) || 1, 1);

    const sortedDisputes = disputes
        ? [...disputes].sort((a, b) => (a.estado === "pendiente" ? -1 : b.estado === "pendiente" ? 1 : 0))
        : null;

    const totalPagosPages = payments ? Math.max(1, Math.ceil(payments.length / PAGE_LIMIT)) : 1;
    const totalDisputasPages = sortedDisputes ? Math.max(1, Math.ceil(sortedDisputes.length / PAGE_LIMIT)) : 1;

    // Si la URL apunta a una página que ya no existe (ej. quedó vieja tras
    // un refresh con menos datos), la clampeamos en vez de romper el slice.
    const pagosPage = Math.min(pagosPageParam, totalPagosPages);
    const disputasPage = Math.min(disputasPageParam, totalDisputasPages);

    const paginatedPayments = payments
        ? payments.slice((pagosPage - 1) * PAGE_LIMIT, pagosPage * PAGE_LIMIT)
        : null;
    const paginatedDisputes = sortedDisputes
        ? sortedDisputes.slice((disputasPage - 1) * PAGE_LIMIT, disputasPage * PAGE_LIMIT)
        : null;

    function updatePage(key: "pagosPage" | "disputasPage", newPage: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, String(newPage));
        router.push(`?${params.toString()}`, { scroll: false });
    }

    // Roving tabindex + navegación con flechas, patrón WAI-ARIA para tabs.
    function handleTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const nextIndex = e.key === "ArrowRight"
            ? (index + 1) % TABS.length
            : (index - 1 + TABS.length) % TABS.length;
        setTab(TABS[nextIndex]);
        tabRefs.current[nextIndex]?.focus();
    }

    const tabButtonBase =
        "px-3 py-1.5 text-xs font-mono rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

    return (
        <>
            <div role="tablist" aria-label="Secciones de finanzas" className="flex gap-2 mb-6">
                {TABS.map((t, i) => (
                    <button
                        key={t}
                        ref={(el) => { tabRefs.current[i] = el; }}
                        id={`finances-tab-${t}`}
                        role="tab"
                        type="button"
                        aria-selected={tab === t}
                        aria-controls={`finances-panel-${t}`}
                        tabIndex={tab === t ? 0 : -1}
                        onClick={() => setTab(t)}
                        onKeyDown={(e) => handleTabKeyDown(e, i)}
                        className={`${tabButtonBase} ${tab === t
                            ? "bg-violet-600 border-violet-600 text-white"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-violet-500 hover:text-zinc-200"
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div
                id="finances-panel-Pagos"
                role="tabpanel"
                aria-labelledby="finances-tab-Pagos"
                hidden={tab !== "Pagos"}
                className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-sm">
                        <caption className="sr-only">Listado de pagos</caption>
                        <thead>
                            <tr className="border-b border-zinc-800">
                                {["ID", "Fecha", "Comprador", "Vendedor", "Forma de pago", "Monto", "Estado"].map((h) => (
                                    <th key={h} scope="col" className={`text-left px-4 py-3 whitespace-nowrap ${cardLabelClass}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {payments === null ? (
                                <tr>
                                    <td colSpan={7} role="status" className="px-4 py-8 text-center text-sm text-rose-400 font-mono">
                                        Error al cargar los pagos
                                    </td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-zinc-400 font-mono">
                                        Sin datos
                                    </td>
                                </tr>
                            ) : (
                                paginatedPayments!.map((p) => (
                                    <tr key={p.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs text-zinc-400">{p.id}</td>
                                        <td className="px-4 py-3 text-zinc-300">
                                            {new Date(p.fecha).toLocaleDateString("es-AR")}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-zinc-400">{p.buyerId}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-zinc-400">{p.sellerId}</td>
                                        <td className="px-4 py-3 text-zinc-300">{p.formaDePago}</td>
                                        <td className="px-4 py-3 text-zinc-200">${p.monto}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-mono ${PAYMENT_STATUS_BADGE_CLASS[p.estado]}`}>
                                                {PAYMENT_STATUS_LABEL[p.estado]}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {payments && payments.length > 0 && (
                    <div className="px-4 pb-4">
                        <Pagination
                            page={pagosPage}
                            total={payments.length}
                            pageLimit={PAGE_LIMIT}
                            onPageChange={(p) => updatePage("pagosPage", p)}
                        />
                    </div>
                )}
            </div>

            <div
                id="finances-panel-Disputas"
                role="tabpanel"
                aria-labelledby="finances-tab-Disputas"
                hidden={tab !== "Disputas"}
                className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-sm">
                        <caption className="sr-only">Listado de disputas</caption>
                        <thead>
                            <tr className="border-b border-zinc-800">
                                {["ID", "Pedido", "Fecha inicio", "Fecha fin", "Estado", "Descripción"].map((h) => (
                                    <th key={h} scope="col" className={`text-left px-4 py-3 whitespace-nowrap ${cardLabelClass}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDisputes === null ? (
                                <tr>
                                    <td colSpan={6} role="status" className="px-4 py-8 text-center text-sm text-rose-400 font-mono">
                                        Error al cargar las disputas
                                    </td>
                                </tr>
                            ) : sortedDisputes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-400 font-mono">
                                        Sin datos
                                    </td>
                                </tr>
                            ) : (
                                paginatedDisputes!.map((d) => (
                                    <tr key={d.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs text-zinc-400">{d.id}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-zinc-400">{d.pedidoId}</td>
                                        <td className="px-4 py-3 text-zinc-300">
                                            {new Date(d.fechaDeInicio).toLocaleDateString("es-AR")}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-300">
                                            {d.fechaDeFinalizacion
                                                ? new Date(d.fechaDeFinalizacion).toLocaleDateString("es-AR")
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-mono ${DISPUTE_STATUS_BADGE_CLASS[d.estado]}`}>
                                                {DISPUTE_STATUS_LABEL[d.estado]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-300 max-w-xs truncate">
                                            {d.descripcion}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {sortedDisputes && sortedDisputes.length > 0 && (
                    <div className="px-4 pb-4">
                        <Pagination
                            page={disputasPage}
                            total={sortedDisputes.length}
                            pageLimit={PAGE_LIMIT}
                            onPageChange={(p) => updatePage("disputasPage", p)}
                        />
                    </div>
                )}
            </div>
        </>
    );
}