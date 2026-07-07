"use client";

import { useMemo, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { TrendPoint } from "@/lib/dashboard/types";
import { cardClass, cardLabelClass, chartColors } from "@/styles/theme";

const periods = [
  { key: "14d", label: "14D", days: 14 },
  { key: "30d", label: "30D", days: 30 },
] as const;

type PeriodKey = (typeof periods)[number]["key"];

export function TrendChart({ data }: { data: TrendPoint[] }) {
  const [period, setPeriod] = useState<PeriodKey>("30d");

  const chartData = useMemo(() => {
    const config = periods.find((p) => p.key === period)!;
    return data.slice(-config.days);
  }, [period, data]);

  return (
    <div className={cardClass}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className={cardLabelClass}>GMV</h2>
        <div className="flex gap-1 rounded-md border border-zinc-800 p-0.5">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`rounded px-2.5 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
                period === p.key ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="gmvFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.35} />
              <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartColors.grid} vertical={false} />
          <XAxis dataKey="date" stroke={chartColors.axis} fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke={chartColors.axis} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: chartColors.tooltipBg, border: `1px solid ${chartColors.tooltipBorder}`, borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#a1a1aa" }}
          />
          <Area type="monotone" dataKey="gmv" stroke={chartColors.primary} strokeWidth={2} fill="url(#gmvFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}