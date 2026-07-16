import Link from "next/link";
import type { AppSummaryRow } from "@/lib/dashboard/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cardClass, cardLabelClass, statusToTone, statusToLabel } from "@/styles/theme";
import { formatRelativeTime } from "@/lib/utils/time";

export function AppSummaryTable({ data }: { data: AppSummaryRow[] }) {
  return (
    <div className={cardClass}>
      <h2 className={`mb-4 ${cardLabelClass}`}>Resumen por app</h2>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="pb-2 font-mono text-xs uppercase tracking-wide text-zinc-500">App</th>
            <th className="pb-2 font-mono text-xs uppercase tracking-wide text-zinc-500">Métrica clave</th>
            <th className="pb-2 font-mono text-xs uppercase tracking-wide text-zinc-500">Estado</th>
            <th className="pb-2 font-mono text-xs uppercase tracking-wide text-zinc-500">Última sync</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.app} className="border-b border-zinc-800/60 last:border-0">
              <td className="py-3">
                <Link href={row.href} className="font-mono text-sm text-zinc-200 transition-colors hover:text-violet-400">
                  {row.app}
                </Link>
              </td>
              <td className="py-3 font-mono text-sm text-zinc-400">
                {row.metricLabel}: <span className="text-zinc-200">{row.metricValue}</span>
              </td>
              <td className="py-3">
                <StatusBadge label={statusToLabel[row.status]} tone={statusToTone[row.status]} />
              </td>
              <td className="py-3 font-mono text-sm text-zinc-500">{formatRelativeTime(row.lastSyncSecondsAgo)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}