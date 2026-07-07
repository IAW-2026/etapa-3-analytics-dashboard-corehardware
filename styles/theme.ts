
export type Tone = "success" | "warning" | "danger" | "neutral";

export const toneBadgeClasses: Record<Tone, string> = {
  success: "bg-emerald-400/10 text-emerald-400",
  warning: "bg-amber-400/10 text-amber-400",
  danger: "bg-rose-400/10 text-rose-400",
  neutral: "bg-zinc-400/10 text-zinc-400",
};

// Mismos tonos pero como color hex plano, para usar en SVG/Recharts
// (fill de gráficos no acepta clases de Tailwind directamente).
export const toneHexColors: Record<Tone, string> = {
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#fb7185",
  neutral: "#a1a1aa",
};

export type ApiHealthStatus = "online" | "degraded" | "offline";

export const statusToTone: Record<ApiHealthStatus, Tone> = {
  online: "success",
  degraded: "warning",
  offline: "danger",
};

export const statusToLabel: Record<ApiHealthStatus, string> = {
  online: "Online",
  degraded: "Degradado",
  offline: "Offline",
};

// Colores fijos para gráficos Recharts (no son clases de Tailwind)
export const chartColors = {
  primary: "#8b5cf6",
  grid: "#27272a",
  axis: "#71717a",
  tooltipBg: "#18181b",
  tooltipBorder: "#27272a",
};

// Clases repetidas en las tarjetas del dashboard
export const cardClass = "rounded-lg border border-zinc-800 bg-zinc-900 p-4";
export const cardLabelClass =
  "font-mono text-xs uppercase tracking-wider text-zinc-400";

// Paleta para gráficos con múltiples categorías en un mismo chart (ej. donut
// de distribución), donde cada slice necesita un color propio y distinguible
// entre sí — a diferencia de toneHexColors, que asigna un color por
// significado semántico (puede repetirse entre estados sin relación visual).
// Reutiliza los mismos hex ya aprobados como "Deep Terminal": nada nuevo,
// solo se exponen con nombres pensados para uso categórico.
export const chartCategoryColors = {
  emerald: toneHexColors.success,
  rose: toneHexColors.danger,
  amber: toneHexColors.warning,
  violet: chartColors.primary,
  zinc: toneHexColors.neutral,
} as const;