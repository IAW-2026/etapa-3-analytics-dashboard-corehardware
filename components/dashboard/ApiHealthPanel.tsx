import type { ApiHealthRow } from "@/lib/dashboard/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cardClass, cardLabelClass, statusToTone, statusToLabel } from "@/styles/theme";

export function ApiHealthPanel({ data }: { data: ApiHealthRow[] }) {
  return (
    <div className={cardClass}>
      <h2 className={`mb-4 ${cardLabelClass}`}>Salud de las APIs</h2>
      <div className="grid grid-cols-2 gap-3">
        {data.map((api) => (
          <div key={api.app} className="flex flex-col gap-2 rounded-md border border-zinc-800 bg-zinc-950 p-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-zinc-200">{api.app}</span>
              <StatusBadge label={statusToLabel[api.status]} tone={statusToTone[api.status]} />
            </div>
            <div className="flex items-center justify-between font-mono text-xs text-zinc-500">
              <span>{api.message ?? "—"}</span>
              <span>hace {api.lastSyncSecondsAgo}s</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}