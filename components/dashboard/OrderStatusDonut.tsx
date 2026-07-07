"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { OrderStatusDistribution } from "@/lib/dashboard/types";;
import { cardClass, cardLabelClass, toneHexColors, chartColors } from "@/styles/theme";

export function OrderStatusDonut({ data }: { data: OrderStatusDistribution }) {
  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className={cardClass}>
      <h2 className={`mb-4 ${cardLabelClass}`}>Distribución de pedidos</h2>

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
              <Cell key={entry.status} fill={toneHexColors[entry.tone]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: chartColors.tooltipBg, border: `1px solid ${chartColors.tooltipBorder}`, borderRadius: 8, fontSize: 12 }}
            formatter={(value, name) => {
              const numericValue = typeof value === "number" ? value : Number(value ?? 0);
              const pct = total > 0 ? ((numericValue / total) * 100).toFixed(1) : "0.0";
              return [`${numericValue} (${pct}%)`, String(name)];
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => <span className="font-mono text-xs uppercase tracking-wide text-zinc-400">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}