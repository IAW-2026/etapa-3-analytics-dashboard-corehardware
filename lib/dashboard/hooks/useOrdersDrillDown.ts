import { useEffect, useState } from "react";
import type { Order } from "@/types/types";
import type { DrillDownFilter } from "@/lib/dashboard/types";

export type OrdersQueryResponse = {
  items: Order[];
  total: number;
  limit: number;
  offset: number;
};

export type DrillDownStatus = "idle" | "loading" | "error";

const PREVIEW_LIMIT = 10;

function buildOrdersQueryParams(filter: DrillDownFilter): URLSearchParams {
  const params = new URLSearchParams({ limit: String(PREVIEW_LIMIT) });
  if (filter.estados.length > 0) {
    params.set("estado", filter.estados.join(","));
  }
  return params;
}

/**
 * Encapsulates fetching preview orders for a given drill-down filter.
 * Keeping this out of the component makes the fetch logic independently
 * testable and keeps OrderDrillDownModal focused purely on rendering.
 */
export function useOrdersDrillDown(filter: DrillDownFilter | null) {
  const [data, setData] = useState<OrdersQueryResponse | null>(null);
  const [status, setStatus] = useState<DrillDownStatus>("idle");

  useEffect(() => {
    if (!filter) {
      setData(null);
      setStatus("idle");
      return;
    }

    let isCancelled = false;
    setStatus("loading");

    const params = buildOrdersQueryParams(filter);

    fetch(`/api/buyer/orders?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json() as Promise<OrdersQueryResponse>;
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
  }, [filter]);

  return { data, status };
}