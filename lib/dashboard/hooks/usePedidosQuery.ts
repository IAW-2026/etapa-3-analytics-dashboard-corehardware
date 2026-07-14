import { useEffect, useState } from "react";
import type { Order } from "@/types/types";
import { PEDIDOS_PAGE_LIMIT, type PedidosFilters } from "@/lib/dashboard/pedidos-types";

export type PedidosQueryResponse = {
  items: Order[];
  total: number;
  limit: number;
  offset: number;
};

export type PedidosQueryStatus = "idle" | "loading" | "error";

function buildPedidosQueryParams(filters: PedidosFilters): URLSearchParams {
  const params = new URLSearchParams({
    limit: String(PEDIDOS_PAGE_LIMIT),
    offset: String((filters.page - 1) * PEDIDOS_PAGE_LIMIT),
    sortBy: filters.sortBy,
    sortDir: filters.sortDir,
  });

  if (filters.estados.length > 0) params.set("estado", filters.estados.join(","));
  if (filters.fechaDesde) params.set("fechaDesde", filters.fechaDesde);
  if (filters.fechaHasta) params.set("fechaHasta", filters.fechaHasta);

  return params;
}

export function usePedidosQuery(filters: PedidosFilters) {
  const [data, setData] = useState<PedidosQueryResponse | null>(null);
  const [status, setStatus] = useState<PedidosQueryStatus>("idle");

  useEffect(() => {
    let isCancelled = false;
    setStatus("loading");

    const params = buildPedidosQueryParams(filters);

    fetch(`/api/buyer/orders?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json() as Promise<PedidosQueryResponse>;
      })
      .then((json) => {
        if (isCancelled) return;
        setData(json);
        setStatus("idle");
      })
      .catch(() => {
        if (isCancelled) return;
        setStatus("error");
      });

    return () => {
      isCancelled = true;
    };
    // Se usa el join de estados como dependencia (en vez del array) para evitar
    // que una nueva referencia del array en cada render dispare un fetch de más.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.estados.join(","), filters.fechaDesde, filters.fechaHasta, filters.page, filters.sortBy, filters.sortDir]);

  return { data, status };
}