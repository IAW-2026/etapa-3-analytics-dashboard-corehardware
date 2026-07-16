"use client";

import { useEffect, useRef } from "react";
import type { DrillDownFilter } from "@/lib/dashboard/types";
import { useOrdersDrillDown } from "@/lib/dashboard/hooks/useOrdersDrillDown";
import { OrderMobileCard, OrderTableRow } from "./OrderRow";

function buildDrillDownHref(filter: DrillDownFilter): string {
  const query = filter.estados.length > 0 ? `?estado=${filter.estados.join(",")}` : "";
  return `/pedidos${query}`;
}

function DrillDownFeedback({ status, isEmpty }: { status: "idle" | "loading" | "error"; isEmpty: boolean }) {
  if (status === "loading") {
    return <p className="py-8 text-center font-mono text-xs text-zinc-500">Cargando pedidos…</p>;
  }

  if (status === "error") {
    return (
      <p className="py-8 text-center font-mono text-xs text-rose-400">
        No se pudieron cargar los pedidos.
      </p>
    );
  }

  if (isEmpty) {
    return (
      <p className="py-8 text-center font-mono text-xs text-zinc-500">
        No hay pedidos en este estado.
      </p>
    );
  }

  return null;
}

export function OrderDrillDownModal({
  filter,
  onClose,
}: {
  filter: DrillDownFilter | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { data, status } = useOrdersDrillDown(filter);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (filter) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [filter]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  const hasItems = Boolean(data && data.items.length > 0);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className={[
        "m-0 w-full max-w-none bg-zinc-900 p-0 text-zinc-50",
        "fixed inset-x-0 bottom-0 max-h-[85vh] rounded-t-lg border-t border-zinc-800",
        "sm:inset-0 sm:m-auto sm:max-h-[80vh] sm:w-full sm:max-w-lg sm:rounded-lg sm:border",
        "backdrop:bg-black/60",
      ].join(" ")}
    >
      {filter && (
        <div className="flex max-h-[85vh] flex-col sm:max-h-[80vh]">
          <div className="flex items-center justify-between border-b border-zinc-800 p-4">
            <h2 className="font-mono text-sm uppercase tracking-wide text-zinc-300">
              {filter.label}
            </h2>
            <button
              onClick={onClose}
              className="rounded p-1 text-zinc-500 hover:text-zinc-300"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <DrillDownFeedback status={status} isEmpty={status === "idle" && !hasItems} />

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
                      <th className="py-2">Fecha</th>
                      <th className="py-2">Estado</th>
                      <th className="py-2 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((order) => (
                      <OrderTableRow key={order.id} order={order} />
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          <div className="border-t border-zinc-800 p-4">
            <a
              href={buildDrillDownHref(filter)}
              className="block text-center font-mono text-xs text-violet-400 hover:text-violet-300"
            >
              Ver todos →
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}