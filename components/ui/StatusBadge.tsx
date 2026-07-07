import { toneBadgeClasses, type Tone } from "@/styles/theme";

export function StatusBadge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wide ${toneBadgeClasses[tone]}`}
    >
      {label}
    </span>
  );
}