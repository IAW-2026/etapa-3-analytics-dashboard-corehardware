"use client";

import CountUp from "react-countup";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cardClass, cardLabelClass } from "@/styles/theme";

type KpiCardProps = {
  label: string;
  value: number;
  changePct?: number;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export function KpiCard({
  label,
  value,
  changePct,
  icon: Icon,
  prefix = "",
  suffix = "",
  decimals = 0,
}: KpiCardProps) {
  const isPositive = (changePct ?? 0) >= 0;

  return (
    <div className={`flex flex-col gap-3 ${cardClass}`}>
      <div className="flex items-center justify-between">
        <span className={cardLabelClass}>{label}</span>
        <Icon className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
      </div>

      <div className="font-mono text-2xl font-semibold text-zinc-50">
        <CountUp
          end={value}
          duration={1.2}
          separator="."
          decimal=","
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
        />
      </div>

      {changePct !== undefined && (
        <div
          className={`flex items-center gap-1 text-xs font-mono ${
            isPositive ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          <span>{Math.abs(changePct).toFixed(1)}% vs período anterior</span>
        </div>
      )}
    </div>
  );
}