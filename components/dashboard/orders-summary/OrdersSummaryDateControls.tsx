"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import type { DateFallbackInfo } from "@/lib/dashboard/orders-summary/types";
import type { RangeInfo } from "@/lib/dashboard/orders-summary/view-model";

type Granularity = "day" | "month" | "year";

const PERIOD_TABS: { key: Granularity; label: string }[] = [
  { key: "day", label: "Día" },
  { key: "month", label: "Mes" },
  { key: "year", label: "Año" },
];

// Discriminated union: TypeScript obliga a pasar dateInfo solo con "day"
// y rangeInfo solo con "month"/"year" — no se pueden mezclar por error.
type OrdersSummaryDateControlsProps =
  | { granularity: "day"; dateInfo: DateFallbackInfo }
  | { granularity: "month" | "year"; rangeInfo: RangeInfo };

export function OrdersSummaryDateControls(props: OrdersSummaryDateControlsProps) {
  const { granularity } = props;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado local para el input de año: mientras el usuario tipea, el valor
  // "confirmado" (props.rangeInfo.fechaDesde, atado a la URL) todavía no
  // cambió, así que sin este estado el input quedaba controlado por un
  // value que no se movía tecla a tecla y parecía bloqueado.
  const [yearInput, setYearInput] = useState(
    granularity === "year" ? props.rangeInfo.fechaDesde.slice(0, 4) : "",
  );

  useEffect(() => {
    if (granularity === "year") {
      setYearInput(props.rangeInfo.fechaDesde.slice(0, 4));
    }
  }, [granularity, granularity === "year" ? props.rangeInfo.fechaDesde : null]);

  function navigate(params: URLSearchParams) {
    router.push(`/pedidos/resumen?${params.toString()}`);
  }

  function handleTabClick(key: Granularity) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("granularity", key);
    // Al cambiar de pestaña no arrastramos date/month/year viejos: si no
    // vienen, page.tsx ya cae al día/mes/año actual por default.
    params.delete("date");
    params.delete("month");
    params.delete("year");
    navigate(params);
  }

  function handleDateChange(newDate: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("granularity", "day");
    params.set("date", newDate);
    navigate(params);
  }

  function handleMonthChange(newMonth: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("granularity", "month");
    params.set("month", newMonth);
    navigate(params);
  }

  function handleYearChange(newYear: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("granularity", "year");
    params.set("year", newYear);
    navigate(params);
  }

  function handleYearInputChange(rawValue: string) {
    const digits = rawValue.replace(/\D/g, "").slice(0, 4);
    setYearInput(digits);
    if (digits.length === 4) handleYearChange(digits);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-md border border-zinc-800 p-1">
          {PERIOD_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`rounded px-3 py-1.5 font-mono text-xs transition-colors ${
                tab.key === granularity
                  ? "bg-violet-600/10 text-violet-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {granularity === "day" && (
          <input
            type="date"
            value={props.dateInfo.requestedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-sm text-zinc-200 [color-scheme:dark]"
          />
        )}

        {granularity === "month" && (
          <input
            type="month"
            value={props.rangeInfo.fechaDesde.slice(0, 7)}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-sm text-zinc-200 [color-scheme:dark]"
          />
        )}

        {granularity === "year" && (
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            placeholder="AAAA"
            value={yearInput}
            onChange={(e) => handleYearInputChange(e.target.value)}
            className="w-24 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-sm text-zinc-200 [color-scheme:dark]"
          />
        )}
      </div>

      {granularity === "day" && props.dateInfo.isFallback && props.dateInfo.actualDate && (
        <div className="flex items-center gap-2 rounded-md border border-amber-400/20 bg-amber-400/10 px-3 py-2 font-mono text-xs text-amber-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            No hay datos para el {props.dateInfo.requestedDate} — mostrando el último día disponible (
            {props.dateInfo.actualDate}).
          </span>
        </div>
      )}

      {granularity === "day" && props.dateInfo.isFallback && !props.dateInfo.actualDate && (
        <div className="flex items-center gap-2 rounded-md border border-rose-400/20 bg-rose-400/10 px-3 py-2 font-mono text-xs text-rose-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>No hay datos disponibles para ningún día.</span>
        </div>
      )}

      {/* Mes/año sin datos: no es un fallback raro, es simplemente un
          período vacío — mismo tono discreto que "Sin datos para este día"
          en los gráficos, sin caja de warning amarilla/roja. */}
      {(granularity === "month" || granularity === "year") && !props.rangeInfo.hasData && (
        <p className="font-mono text-xs text-zinc-500">Sin datos para este período.</p>
      )}
    </div>
  );
}