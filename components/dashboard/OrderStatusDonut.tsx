"use client";

import { PieChart, Pie, Sector, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { OrderStatusDistribution } from "@/lib/dashboard/types";
import { ORDER_STATUS_CHART_COLOR, ORDER_STATUS_LABEL } from "@/lib/dashboard/constants";
import { cardClass, cardLabelClass, chartColors } from "@/styles/theme";

type OrderStatusDonutProps = {
  data: OrderStatusDistribution;
  title?: string;
  onSelect: (estados: string[], label: string) => void;
};

export function OrderStatusDonut({
  data,
  title = "Distribución de pedidos",
  onSelect,
}: OrderStatusDonutProps) {
  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className={cardClass}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className={cardLabelClass}>{title}</h2>
        <button
          onClick={() => onSelect(data.map((d) => d.statusKey), title)}
          className="font-mono text-xs text-violet-400 hover:text-violet-300"
        >
          Ver pedidos →
        </button>
      </div>

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
              className="cursor-pointer"
              shape={(props: any) => (
                <Sector
                  {...props}
                  fill={ORDER_STATUS_CHART_COLOR[data[props.index]?.statusKey] ?? "#a1a1aa"}
                />
              )}
              onClick={(_, index) => {
                const entry = data[index];
                onSelect([entry.statusKey], ORDER_STATUS_LABEL[entry.statusKey] ?? entry.status);
              }}
            />
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
              content={({ payload }) => (
                <ul
                  style={{
                    marginTop: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "4px 16px",
                    listStyle: "none",
                    padding: 0,
                  }}
                >
                  {payload?.map((entry: any) => {
                    const statusKey = entry.payload?.statusKey;
                    const color = ORDER_STATUS_CHART_COLOR[statusKey] ?? "#a1a1aa";
                    return (
                      <li
                        key={statusKey}
                        style={{ display: "flex", alignItems: "center", gap: 6 }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: "9999px",
                            backgroundColor: color,
                            flexShrink: 0,
                          }}
                        />
                        <span className="font-mono text-xs uppercase tracking-wide text-zinc-400">
                          {entry.value}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}