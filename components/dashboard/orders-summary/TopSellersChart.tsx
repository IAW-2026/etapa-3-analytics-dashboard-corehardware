"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cardClass, cardLabelClass, chartColors } from "@/styles/theme";
import type { TopSellerRow } from "@/lib/dashboard/orders-summary/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function TopSellersChart({ data }: { data: TopSellerRow[] }) {
  const chartData = [...data].reverse(); // Recharts dibuja de abajo hacia arriba; invertimos para que el #1 quede arriba

  return (
    <div className={cardClass}>
      <h2 className={`mb-4 ${cardLabelClass}`}>Top vendedores</h2>
      {chartData.length === 0 ? (
        <p className="py-8 text-center font-mono text-sm text-zinc-500">Sin datos para este día</p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 40)}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24, bottom: 4 }}>
            <CartesianGrid stroke={chartColors.grid} horizontal={false} />
            <XAxis
              type="number"
              stroke={chartColors.axis}
              tick={{ fontSize: 10, fontFamily: "monospace" }}
              tickFormatter={formatCurrency}
              tickMargin={6}
            />
            <YAxis
              type="category"
              dataKey="sellerName"
              stroke={chartColors.axis}
              tick={{ fontSize: 11, fontFamily: "monospace" }}
              width={90}
              tickFormatter={(value: string) => (value.length > 12 ? `${value.slice(0, 11)}…` : value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartColors.tooltipBg,
                border: `1px solid ${chartColors.tooltipBorder}`,
                borderRadius: 6,
                fontFamily: "monospace",
                fontSize: 12,
              }}
              formatter={(value) => [formatCurrency(Number(value)), "Ingresos"]}
            />
            <Bar
              dataKey="revenue"
              fill={chartColors.primary}
              radius={[0, 4, 4, 0]}
              barSize={28}
              maxBarSize={28}
              activeBar={{ fill: chartColors.primary, fillOpacity: 0.85 }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}