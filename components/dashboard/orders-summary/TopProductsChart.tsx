"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cardClass, cardLabelClass, chartColors } from "@/styles/theme";
import type { TopProductRow } from "@/lib/dashboard/orders-summary/types";

export function TopProductsChart({ data }: { data: TopProductRow[] }) {
  const chartData = [...data].reverse();

  return (
    <div className={cardClass}>
      <h2 className={`mb-4 ${cardLabelClass}`}>Top productos</h2>
      {chartData.length === 0 ? (
        <p className="py-8 text-center font-mono text-sm text-zinc-500">Sin datos para este día</p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 40)}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid stroke={chartColors.grid} horizontal={false} />
            <XAxis
              type="number"
              stroke={chartColors.axis}
              tick={{ fontSize: 11, fontFamily: "monospace" }}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="productName"
              stroke={chartColors.axis}
              tick={{ fontSize: 11, fontFamily: "monospace" }}
              width={90}
              tickFormatter={(value: string) => (value.length > 12 ? `${value.slice(0, 11)}…` : value)}
            />
            <Tooltip
              formatter={(value) => [value, "Cantidad"]}
              contentStyle={{
                backgroundColor: chartColors.tooltipBg,
                border: `1px solid ${chartColors.tooltipBorder}`,
                borderRadius: 6,
                fontFamily: "monospace",
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="quantity"
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