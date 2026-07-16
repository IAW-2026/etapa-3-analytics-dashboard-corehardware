"use client";

import { useState } from "react";
import { KpiStrip } from "./KpiStrip";
import { OrderStatusDonut } from "./OrderStatusDonut";
import { OrderDrillDownModal } from "./OrderDrillDownModal";
import type {
  DashboardKpis,
  FulfillmentStatusDistribution,
  PaymentStatusDistribution,
  DrillDownFilter,
} from "@/lib/dashboard/types";

export function OrdersDrillDownController({
  kpis,
  fulfillmentDistribution,
  paymentDistribution,
}: {
  kpis: DashboardKpis;
  fulfillmentDistribution: FulfillmentStatusDistribution;
  paymentDistribution: PaymentStatusDistribution;
}) {
  const [filter, setFilter] = useState<DrillDownFilter | null>(null);

  const openDrillDown = (estados: string[], label: string) => setFilter({ estados, label });

  return (
    <>
      <KpiStrip kpis={kpis} onOrdersDrillDown={openDrillDown} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OrderStatusDonut
          title="Estado del pedido"
          data={fulfillmentDistribution}
          onSelect={openDrillDown}
        />
        <OrderStatusDonut
          title="Estado del pago"
          data={paymentDistribution}
          onSelect={openDrillDown}
        />
      </div>

      <OrderDrillDownModal filter={filter} onClose={() => setFilter(null)} />
    </>
  );
}