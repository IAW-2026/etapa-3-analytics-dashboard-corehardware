"use client";

import { memo, useState } from "react";
import type { Buyer, Seller, Operator } from "@/types/types";
import type { UsersGrowthData } from "@/lib/users/types";
import type { DateFallbackInfo } from "@/lib/dashboard/orders-summary/types";
import type { RangeInfo } from "@/lib/dashboard/orders-summary/view-model";
import { cardClass } from "@/styles/theme";
import { UsersGrowthChart } from "./UsersGrowthChart";
import { UsersDateControls } from "./UsersDateControls";

const TABS = ["Compradores", "Vendedores", "Operadores"] as const;
type Tab = (typeof TABS)[number];
type Granularity = "day" | "month" | "year";

interface UsersViewProps {
  buyers: Buyer[] | null;
  sellers: Seller[] | null;
  operators: Operator[] | null;
  growthData: UsersGrowthData;
  granularity: Granularity;
  dateInfo?: DateFallbackInfo;
  rangeInfo?: RangeInfo;
}

export default function UsersView({
  buyers,
  sellers,
  operators,
  growthData,
  granularity,
  dateInfo,
  rangeInfo,
}: UsersViewProps) {
  const [tab, setTab] = useState<Tab>("Compradores");

  return (
    <main className="p-4 sm:p-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-[0.05em] text-zinc-100">Usuarios</h1>
        <div className="h-px w-8 bg-violet-500 mt-2" />
      </div>

      <div className="mb-6">
        {granularity === "day" && dateInfo ? (
          <UsersDateControls granularity="day" dateInfo={dateInfo} />
        ) : rangeInfo ? (
          <UsersDateControls granularity={granularity as "month" | "year"} rangeInfo={rangeInfo} />
        ) : null}
      </div>

      <div className="mb-8">
        <UsersGrowthChart
          points={growthData.points}
          operadoresDisponible={growthData.operadoresDisponible}
          granularity={granularity}
        />
      </div>

      <div className="flex gap-2 mb-6" role="tablist" aria-label="Tipo de usuario">
        {TABS.map((t) => (
          <TabButton key={t} label={t} active={tab === t} onClick={() => setTab(t)} />
        ))}
      </div>

      <div className={cardClass}>
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
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
        active
          ? "bg-violet-600 border-violet-600 text-white"
          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-violet-400"
      }`}
    >
      {label}
    </button>
  );
});

const TableHead = memo(function TableHead({
  headers,
}: {
  headers: { label: string; hideBelowLg?: boolean }[];
}) {
  return (
    <thead>
      <tr className="border-b border-zinc-800">
        {headers.map((h) => (
          <th
            key={h.label}
            className={`text-left px-4 py-3 text-xs font-mono tracking-[0.1em] uppercase text-zinc-500 ${
              h.hideBelowLg ? "hidden lg:table-cell" : ""
            }`}
          >
            {h.label}
          </th>
        ))}
      </tr>
    </thead>
  );
});

function EmptyState({ message, isError = false }: { message: string; isError?: boolean }) {
  return (
    <p className={`py-8 text-center font-mono text-xs ${isError ? "text-rose-400" : "text-zinc-500"}`}>
      {message}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Tarjeta mobile genérica (< sm, ej. Chrome mobile) -- mismo espíritu que
// OrderMobileCard en components/dashboard/OrderRow.tsx.
// ─────────────────────────────────────────────────────────────────────────

function MobileFieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">{label}</span>
      <span className="text-right text-sm text-zinc-300">{value}</span>
    </div>
  );
}

function EntityMobileCard({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
      <p className="text-sm font-medium text-zinc-100">{title}</p>
      <div className="mt-2 divide-y divide-zinc-800/60">
        {rows.map((r) => (
          <MobileFieldRow key={r.label} label={r.label} value={r.value} />
        ))}
      </div>
    </div>
  );
}

// Columnas "hideBelowLg" solo aparecen en pantallas grandes (monitor
// completo). En sm-lg (ej. media pantalla de un monitor de 22") se ven
// las columnas esenciales; el overflow-x-auto es red de seguridad si
// igual no entran.

const BUYERS_HEADERS: { label: string; hideBelowLg?: boolean }[] = [
  { label: "Nombre" },
  { label: "DNI" },
  { label: "Mail" },
  { label: "Celular" },
  { label: "CUIL/CUIT", hideBelowLg: true },
  { label: "Dirección", hideBelowLg: true },
  { label: "Condición IVA", hideBelowLg: true },
];

const BuyersTable = memo(function BuyersTable({ buyers }: { buyers: Buyer[] | null }) {
  if (buyers === null) return <EmptyState message="Error al cargar compradores" isError />;
  if (buyers.length === 0) return <EmptyState message="Sin datos" />;

  return (
    <>
      <div className="flex flex-col gap-2 p-4 sm:hidden">
        {buyers.map((b) => (
          <EntityMobileCard
            key={b.id}
            title={`${b.apellido}, ${b.nombre}`}
            rows={[
              { label: "DNI", value: b.dni },
              { label: "CUIL/CUIT", value: b.cuil_cuit },
              { label: "Mail", value: b.mail },
              { label: "Celular", value: b.celular },
              { label: "Dirección", value: b.direccion },
              { label: "Condición IVA", value: b.condicion_iva },
            ]}
          />
        ))}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <TableHead headers={BUYERS_HEADERS} />
          <tbody>
            {buyers.map((b) => (
              <tr key={b.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">
                  {b.apellido}, {b.nombre}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500 whitespace-nowrap">{b.dni}</td>
                <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{b.mail}</td>
                <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{b.celular}</td>
                <td className="hidden px-4 py-3 font-mono text-xs text-zinc-500 whitespace-nowrap lg:table-cell">
                  {b.cuil_cuit}
                </td>
                <td className="hidden px-4 py-3 text-zinc-400 lg:table-cell">{b.direccion}</td>
                <td className="hidden px-4 py-3 text-zinc-400 whitespace-nowrap lg:table-cell">
                  {b.condicion_iva}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

const SELLERS_HEADERS: { label: string; hideBelowLg?: boolean }[] = [
  { label: "Razón social" },
  { label: "CUIT" },
  { label: "Mail" },
  { label: "Celular" },
  { label: "Condición IVA", hideBelowLg: true },
];

const SellersTable = memo(function SellersTable({ sellers }: { sellers: Seller[] | null }) {
  if (sellers === null) return <EmptyState message="Error al cargar vendedores" isError />;
  if (sellers.length === 0) return <EmptyState message="Sin datos" />;

  return (
    <>
      <div className="flex flex-col gap-2 p-4 sm:hidden">
        {sellers.map((s) => (
          <EntityMobileCard
            key={s.id}
            title={s.razon_social}
            rows={[
              { label: "CUIT", value: s.cuit },
              { label: "Mail", value: s.mail },
              { label: "Celular", value: s.celular },
              { label: "Condición IVA", value: s.condicion_iva },
            ]}
          />
        ))}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <TableHead headers={SELLERS_HEADERS} />
          <tbody>
            {sellers.map((s) => (
              <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">{s.razon_social}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500 whitespace-nowrap">{s.cuit}</td>
                <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{s.mail}</td>
                <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{s.celular}</td>
                <td className="hidden px-4 py-3 text-zinc-400 whitespace-nowrap lg:table-cell">
                  {s.condicion_iva}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

const OPERATORS_HEADERS: { label: string; hideBelowLg?: boolean }[] = [
  { label: "Nombre" },
  { label: "DNI" },
  { label: "Mail" },
  { label: "Celular" },
];

const OperatorsTable = memo(function OperatorsTable({ operators }: { operators: Operator[] | null }) {
  if (operators === null) return <EmptyState message="Error al cargar operadores" isError />;
  if (operators.length === 0) return <EmptyState message="Sin datos" />;

  return (
    <>
      <div className="flex flex-col gap-2 p-4 sm:hidden">
        {operators.map((o) => (
          <EntityMobileCard
            key={o.id}
            title={`${o.apellido}, ${o.nombre}`}
            rows={[
              { label: "DNI", value: o.dni },
              { label: "Mail", value: o.mail },
              { label: "Celular", value: o.celular },
            ]}
          />
        ))}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <TableHead headers={OPERATORS_HEADERS} />
          <tbody>
            {operators.map((o) => (
              <tr key={o.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">
                  {o.apellido}, {o.nombre}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500 whitespace-nowrap">{o.dni}</td>
                <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{o.mail}</td>
                <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{o.celular}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});