'use client';

import { FULFILLMENT_STATUSES, ORDER_STATUS_CHART_COLOR, ORDER_STATUS_LABEL, PAYMENT_STATUSES } from '@/lib/dashboard/constants';
import type { PedidosFilters } from '@/lib/dashboard/pedidos-types';

function toggleEstado(estados: string[], key: string): string[] {
  return estados.includes(key) ? estados.filter((e) => e !== key) : [...estados, key];
}

function EstadoChipGroup({
  title,
  statusKeys,
  selected,
  onToggle,
}: {
  title: string;
  statusKeys: readonly string[];
  selected: string[];
  onToggle: (key: string) => void;
}) {
  return (
    <div className="flex min-w-[240px] flex-1 flex-col justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <span className="font-mono text-xs uppercase tracking-wide text-zinc-500">{title}</span>
      <div className="flex flex-wrap gap-2">
        {statusKeys.map((key) => {
          const isSelected = selected.includes(key);
          const color = ORDER_STATUS_CHART_COLOR[key] ?? '#a1a1aa';
          return (
            <button
              key={key}
              onClick={() => onToggle(key)}
              style={isSelected ? { borderColor: color, backgroundColor: `${color}1a`, color } : undefined}
              className={[
                'rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors',
                isSelected ? '' : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300',
              ].join(' ')}
            >
              {ORDER_STATUS_LABEL[key] ?? key}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PedidosFiltersBar({
  filters,
  onChange,
  onReset,
}: {
  filters: PedidosFilters;
  onChange: (next: PedidosFilters) => void;
  onReset: () => void;
}) {
  const hasActiveFilters =
    filters.estados.length > 0 || filters.fechaDesde !== '' || filters.fechaHasta !== '';

  const handleToggle = (key: string) =>
    onChange({ ...filters, estados: toggleEstado(filters.estados, key), page: 1 });

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wide text-zinc-500">Filtros</span>
        {hasActiveFilters && (
          <button onClick={onReset} className="font-mono text-xs text-zinc-500 hover:text-zinc-300">
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <EstadoChipGroup
          title="Estado del pedido"
          statusKeys={FULFILLMENT_STATUSES}
          selected={filters.estados}
          onToggle={handleToggle}
        />
        <EstadoChipGroup
          title="Estado del pago"
          statusKeys={PAYMENT_STATUSES}
          selected={filters.estados}
          onToggle={handleToggle}
        />

        <div className="flex min-w-[240px] flex-col justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <span className="font-mono text-xs uppercase tracking-wide text-zinc-500">Rango de fechas</span>
          <div className="flex flex-wrap gap-3">
            <label className="flex flex-col gap-1">
              <span className="font-mono text-[11px] text-zinc-600">Desde</span>
              <input
                type="date"
                value={filters.fechaDesde}
                onChange={(e) => onChange({ ...filters, fechaDesde: e.target.value, page: 1 })}
                className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-sm text-zinc-200"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-mono text-[11px] text-zinc-600">Hasta</span>
              <input
                type="date"
                value={filters.fechaHasta}
                onChange={(e) => onChange({ ...filters, fechaHasta: e.target.value, page: 1 })}
                className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-sm text-zinc-200"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}