"use client";

import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderMobileCard, OrderTableRow } from "@/components/dashboard/OrderRow";
import { PedidosFiltersBar } from "./PedidosFiltersBar";
import { PedidosPagination } from "./PedidosPagination";
import { usePedidosQuery } from "@/lib/dashboard/hooks/usePedidosQuery";
import {
  DEFAULT_PEDIDOS_FILTERS,
  type PedidosFilters,
  type SortableField,
  type SortDirection,
} from "@/lib/dashboard/pedidos-types";

const SORTABLE_FIELDS: readonly SortableField[] = ["fecha", "monto", "estado"];

function parseSortBy(value: string | null): SortableField {
  return SORTABLE_FIELDS.includes(value as SortableField)
    ? (value as SortableField)
    : DEFAULT_PEDIDOS_FILTERS.sortBy;
}

function parseSortDir(value: string | null): SortDirection {
  return value === "asc" || value === "desc" ? value : DEFAULT_PEDIDOS_FILTERS.sortDir;
}

function parseFiltersFromSearchParams(searchParams: URLSearchParams): PedidosFilters {
  const estadoParam = searchParams.get("estado");
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  return {
    estados: estadoParam ? estadoParam.split(",").filter(Boolean) : [],
    fechaDesde: searchParams.get("fechaDesde") ?? "",
    fechaHasta: searchParams.get("fechaHasta") ?? "",
    page: Number.isNaN(page) || page < 1 ? 1 : page,
    sortBy: parseSortBy(searchParams.get("sortBy")),
    sortDir: parseSortDir(searchParams.get("sortDir")),
  };
}

function buildSearchParamsFromFilters(filters: PedidosFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.estados.length > 0) params.set("estado", filters.estados.join(","));
  if (filters.fechaDesde) params.set("fechaDesde", filters.fechaDesde);
  if (filters.fechaHasta) params.set("fechaHasta", filters.fechaHasta);
  if (filters.page > 1) params.set("page", String(filters.page));
  if (filters.sortBy !== DEFAULT_PEDIDOS_FILTERS.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDir !== DEFAULT_PEDIDOS_FILTERS.sortDir) params.set("sortDir", filters.sortDir);
  return params;
}

function SortableColumnHeader({
  field,
  label,
  align,
  filters,
  onSortChange,
}: {
  field: SortableField;
  label: string;
  align?: "right";
  filters: PedidosFilters;
  onSortChange: (field: SortableField) => void;
}) {
  const isActive = filters.sortBy === field;
  const ActiveIcon = filters.sortDir === "asc" ? ChevronUp : ChevronDown;

  return (
    <th className={`py-2 ${align === "right" ? "text-right" : ""}`}>
      <button
        onClick={() => onSortChange(field)}
        className={[
          "inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide transition-colors",
          isActive ? "text-zinc-200" : "text-zinc-500 hover:text-zinc-300",
        ].join(" ")}
      >
        {label}
        {isActive ? (
          <ActiveIcon className="h-3 w-3" />
        ) : (
          <ChevronsUpDown className="h-3 w-3 text-zinc-600" />
        )}
      </button>
    </th>
  );
}

export function PedidosPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseFiltersFromSearchParams(searchParams);

  const { data, status } = usePedidosQuery(filters);

  const updateFilters = (next: PedidosFilters) => {
    const params = buildSearchParamsFromFilters(next);
    const query = params.toString();
    router.push(`/pedidos${query ? `?${query}` : ""}`, { scroll: false });
  };

  const handleSortChange = (field: SortableField) => {
    const isSameField = filters.sortBy === field;

    if (!isSameField) {
      updateFilters({ ...filters, sortBy: field, sortDir: "desc", page: 1 });
      return;
    }

    if (filters.sortDir === "desc") {
      updateFilters({ ...filters, sortDir: "asc", page: 1 });
      return;
    }

    // Tercer click sobre la misma columna: se suelta el orden explícito y
    // vuelve al default (fecha desc), en vez de quedar ciclando asc/desc
    // indefinidamente en esa columna.
    updateFilters({
      ...filters,
      sortBy: DEFAULT_PEDIDOS_FILTERS.sortBy,
      sortDir: DEFAULT_PEDIDOS_FILTERS.sortDir,
      page: 1,
    });
  };

  const hasItems = Boolean(data && data.items.length > 0);

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="font-mono text-lg uppercase tracking-wide text-zinc-200">Pedidos</h1>

      <PedidosFiltersBar
        filters={filters}
        onChange={updateFilters}
        onReset={() => updateFilters(DEFAULT_PEDIDOS_FILTERS)}
      />

      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        {status === "loading" && (
          <p className="py-8 text-center font-mono text-xs text-zinc-500">Cargando pedidos…</p>
        )}

        {status === "error" && (
          <p className="py-8 text-center font-mono text-xs text-rose-400">
            No se pudieron cargar los pedidos.
          </p>
        )}

        {status === "idle" && !hasItems && (
          <p className="py-8 text-center font-mono text-xs text-zinc-500">
            No hay pedidos que coincidan con estos filtros.
          </p>
        )}

        {status === "idle" && hasItems && data && (
          <>
            <div className="flex flex-col gap-2 sm:hidden">
              {data.items.map((order) => (
                <OrderMobileCard key={order.id} order={order} />
              ))}
            </div>

            <table className="hidden w-full sm:table">
              <thead>
                <tr className="border-b border-zinc-800 text-left font-mono text-xs uppercase tracking-wide text-zinc-500">
                  <th className="py-2">Pedido</th>
                  <SortableColumnHeader field="fecha" label="Fecha" filters={filters} onSortChange={handleSortChange} />
                  <SortableColumnHeader field="estado" label="Estado" filters={filters} onSortChange={handleSortChange} />
                  <SortableColumnHeader
                    field="monto"
                    label="Monto"
                    align="right"
                    filters={filters}
                    onSortChange={handleSortChange}
                  />
                </tr>
              </thead>
              <tbody>
                {data.items.map((order) => (
                  <OrderTableRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>

            <PedidosPagination
              page={filters.page}
              total={data.total}
              onPageChange={(page) => updateFilters({ ...filters, page })}
            />
          </>
        )}
      </div>
    </div>
  );
}