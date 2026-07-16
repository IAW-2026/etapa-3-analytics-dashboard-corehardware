"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cardClass, cardLabelClass, chartCategoryColors, chartColors } from "@/styles/theme";
import type { UserGrowthPoint } from "@/lib/users/types";

type Granularity = "day" | "month" | "year";

interface UsersGrowthChartProps {
  points: UserGrowthPoint[];
  operadoresDisponible: boolean;
  granularity: Granularity;
}

type SeriesKey = "compradores" | "vendedores" | "operadores";

// Operadores pasó de cyan a orange: el cyan quedaba casi blanco sobre el
// fondo oscuro y se confundía con texto normal. Orange se distingue mucho
// más claramente de violeta (compradores) y emerald (vendedores).
const SERIES_CONFIG: { key: SeriesKey; label: string; color: string }[] = [
  { key: "compradores", label: "Compradores", color: chartCategoryColors.violet },
  { key: "vendedores", label: "Vendedores", color: chartCategoryColors.emerald },
  { key: "operadores", label: "Operadores", color: chartCategoryColors.orange },
];

const MONTH_LABELS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

export function UsersGrowthChart({ points, operadoresDisponible, granularity }: UsersGrowthChartProps) {
  // Antes arrancaba con new Set(["operadores"]) -> esa serie nacía oculta.
  // El requisito es que las 3 series aparezcan "en on" en day/month/year,
  // y que el usuario decida qué apagar. Por eso ahora arranca vacío.
  const [hidden, setHidden] = useState<Set<SeriesKey>>(new Set());

  function toggleSeries(key: SeriesKey) {
    if (key === "operadores" && !operadoresDisponible) return;
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  // Totales del período mostrado en el cuadro superpuesto. Para "day" el
  // período es un único día, así que el total coincide con el valor de
  // ese día -- el mismo cuadro sirve para las 3 granularidades sin
  // lógica especial por caso.
  const totals = points.reduce(
    (acc, p) => {
      acc.compradores += p.compradores;
      acc.vendedores += p.vendedores;
      if (p.operadores !== null) acc.operadores += p.operadores;
      return acc;
    },
    { compradores: 0, vendedores: 0, operadores: 0 }
  );

  const xAxisProps =
    granularity === "year"
      ? {
          // ~365 puntos: mostrar fecha completa en cada uno es ilegible.
          // Se reduce a ~12 ticks (uno por mes), solo el nombre del mes.
          interval: Math.max(Math.ceil(points.length / 12) - 1, 0),
          tickFormatter: (value: string) => {
            const monthIndex = Number(value.slice(5, 7)) - 1;
            return MONTH_LABELS[monthIndex] ?? value;
          },
        }
      : granularity === "month"
      ? {
          // ~28-31 puntos: el mes/año ya está en el selector de arriba,
          // repetirlo en cada tick es ruido -- solo el día (DD).
          interval: Math.max(Math.ceil(points.length / 10) - 1, 0),
          tickFormatter: (value: string) => value.slice(8, 10),
        }
      : { interval: 0, tickFormatter: (value: string) => value };

  return (
    <div className={cardClass}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className={cardLabelClass}>Crecimiento de usuarios</p>
        <TotalsPanel totals={totals} operadoresDisponible={operadoresDisponible} />
      </div>

      <div className="mt-3 h-64 w-full sm:h-80">
        <ResponsiveContainer>
          <LineChart data={points} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis
              dataKey="fecha"
              stroke={chartColors.axis}
              tick={{ fontSize: 11, fontFamily: "monospace" }}
              {...xAxisProps}
            />
            <YAxis
              allowDecimals={false}
              stroke={chartColors.axis}
              tick={{ fontSize: 11, fontFamily: "monospace" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartColors.tooltipBg,
                border: `1px solid ${chartColors.tooltipBorder}`,
                borderRadius: 6,
                fontSize: 12,
                fontFamily: "monospace",
              }}
              labelStyle={{ color: "#e4e4e7" }}
              itemStyle={{ fontFamily: "monospace" }}
            />
            {SERIES_CONFIG.map(({ key, label, color }) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={label}
                stroke={color}
                strokeWidth={2}
                // Con un único punto (granularity="day") no hay línea que
                // dibujar -- sin un dot visible por defecto el punto
                // desaparecía. Con más de un punto, se deja solo el
                // activeDot de hover para no saturar la línea de puntos.
                dot={points.length <= 1 ? { r: 5, fill: color, stroke: "#09090b", strokeWidth: 2 } : false}
                hide={hidden.has(key)}
                connectNulls={false}
                activeDot={{ r: 5, fill: color, stroke: "#09090b", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda como botones HTML reales en vez de la <Legend> nativa de
          Recharts: la de Recharts se dibuja en SVG y no es operable por
          teclado ni tiene semántica de botón -- falla accesibilidad.
          Se agrega un texto guía + ícono para dejar explícito que son
          clickeables (antes solo se comunicaba vía aria-label, invisible
          para un usuario vidente que no usa lector de pantalla). */}
      <div className="mt-3">
        <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-zinc-500">
          <span aria-hidden="true">☰</span>
          Tocá una serie para mostrarla u ocultarla
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Mostrar u ocultar series del gráfico">
          {SERIES_CONFIG.map(({ key, label, color }) => {
            const isHidden = hidden.has(key);
            const isDisabled = key === "operadores" && !operadoresDisponible;
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleSeries(key)}
                disabled={isDisabled}
                aria-pressed={!isHidden}
                aria-label={`${isHidden ? "Mostrar" : "Ocultar"} serie ${label}`}
                className={[
                  "inline-flex items-center gap-2 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                  isDisabled
                    ? "cursor-not-allowed border-zinc-800 text-zinc-600"
                    : isHidden
                    ? "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                    : "border-zinc-700 text-zinc-100",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: isDisabled ? "#52525b" : color, opacity: isHidden ? 0.4 : 1 }}
                />
                {label}
                {isDisabled ? " (sin datos)" : ""}
              </button>
            );
          })}
        </div>
      </div>

      {!operadoresDisponible && (
        <p className="mt-2 font-mono text-xs text-zinc-400">
          No se pudo obtener la serie de Operadores (Shipping no respondió).
        </p>
      )}
    </div>
  );
}

function TotalsPanel({
  totals,
  operadoresDisponible,
}: {
  totals: { compradores: number; vendedores: number; operadores: number };
  operadoresDisponible: boolean;
}) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/60 px-4 py-3">
      <StatRow label="Compradores" value={totals.compradores} color={chartCategoryColors.violet} />
      <StatRow label="Vendedores" value={totals.vendedores} color={chartCategoryColors.emerald} />
      <StatRow
        label="Operadores"
        value={operadoresDisponible ? totals.operadores : null}
        color={chartCategoryColors.orange}
      />
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: number | null; color: string }) {
  return (
    <div className="flex items-center justify-between gap-6 py-0.5 font-mono text-xs">
      <span className="flex items-center gap-2 text-zinc-300">
        <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </span>
      <span className="text-zinc-100">{value === null ? "sin datos" : value}</span>
    </div>
  );
}