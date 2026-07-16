import { toneBadgeClasses, type Tone } from '@/styles/theme';

export function StatusBadge({
  label,
  tone,
  color,
}: {
  label: string;
  tone: Tone;
  color?: string;
}) {
  return (
    <span
      style={color ? { backgroundColor: `${color}1a`, color } : undefined}
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wide ${
        color ? '' : toneBadgeClasses[tone]
      }`}
    >
      {label}
    </span>
  );
}