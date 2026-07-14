"use client";

import { DollarSign, Package, Truck, ShoppingCart, Receipt, UserPlus } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import type { RevenueKpis, NewBuyersKpi } from "@/lib/dashboard/orders-summary/types";

export function OrdersSummaryKpiStrip({
  revenue,
  newBuyers,
}: {
  revenue: RevenueKpis;
  newBuyers: NewBuyersKpi;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <KpiCard
        label="Ingresos totales"
        value={revenue.revenueTotal.value}
        changePct={revenue.revenueTotal.changePct}
        hasPreviousData={revenue.revenueTotal.hasPreviousData}
        icon={DollarSign}
        prefix="$"
      />
      <KpiCard
        label="Ingresos por productos"
        value={revenue.revenueProductos.value}
        changePct={revenue.revenueProductos.changePct}
        hasPreviousData={revenue.revenueProductos.hasPreviousData}
        icon={Package}
        prefix="$"
      />
      <KpiCard
        label="Ingresos por envío"
        value={revenue.revenueEnvio.value}
        changePct={revenue.revenueEnvio.changePct}
        hasPreviousData={revenue.revenueEnvio.hasPreviousData}
        icon={Truck}
        prefix="$"
      />
      <KpiCard
        label="Órdenes"
        value={revenue.ordersCount.value}
        changePct={revenue.ordersCount.changePct}
        hasPreviousData={revenue.ordersCount.hasPreviousData}
        icon={ShoppingCart}
      />
      <KpiCard
        label="Ticket promedio"
        value={revenue.ticketPromedio.value}
        changePct={revenue.ticketPromedio.changePct}
        hasPreviousData={revenue.ticketPromedio.hasPreviousData}
        icon={Receipt}
        prefix="$"
      />
      <KpiCard
        label="Compradores nuevos"
        value={newBuyers.value}
        changePct={newBuyers.changePct}
        hasPreviousData={newBuyers.hasPreviousData}
        icon={UserPlus}
      />
    </div>
  );
}