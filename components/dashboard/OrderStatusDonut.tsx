"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { OrderStatusDistribution } from "@/lib/dashboard/types";
import { ORDER_STATUS_CHART_COLOR } from "@/lib/dashboard/constants";
import { cardClass, cardLabelClass, chartColors } from "@/styles/theme";

type OrderStatusDonutProps = {
  data: OrderStatusDistribution;
  title?: string;
};

export function OrderStatusDonut({ data, title = "Distribución de pedidos" }: OrderStatusDonutProps) {
  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className={cardClass}>
      <h2 className={`mb-4 ${cardLabelClass}`}>{title}</h2>

      <span className="sr-only">
        {title}: {data.map((d) => `${d.status} ${d.value} de ${total}`).join(", ")}
      </span>

      <div role="img" aria-label={`Gráfico de ${title.toLowerCase()}`}>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="status"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.statusKey}
                  fill={ORDER_STATUS_CHART_COLOR[entry.statusKey] ?? "#a1a1aa"}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: chartColors.tooltipBg,
                border: `1px solid ${chartColors.tooltipBorder}`,
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value, name) => {
                const numericValue = typeof value === "number" ? value : Number(value ?? 0);
                const pct = total > 0 ? ((numericValue / total) * 100).toFixed(1) : "0.0";
                return [`${numericValue} (${pct}%)`, String(name)];
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => (
                <span className="font-mono text-xs uppercase tracking-wide text-zinc-400">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}