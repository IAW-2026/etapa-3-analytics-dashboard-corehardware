"use client";

import { DollarSign, ShoppingCart, Truck, Wallet, Users } from "lucide-react";
import { KpiCard } from "./KpiCard";
import type { DashboardKpis } from "@/lib/dashboard/types";
import { PENDING_SHIPMENT_STATUSES } from "@/lib/dashboard/constants";

export function KpiStrip({
  kpis,
  onOrdersDrillDown,
}: {
  kpis: DashboardKpis;
  onOrdersDrillDown: (estados: string[], label: string) => void;
}) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <KpiCard
                label="GMV del período"
                value={kpis.gmv.value}
                changePct={kpis.gmv.changePct}
                icon={DollarSign}
                prefix="$" />
            <KpiCard
                label="Órdenes totales"
                value={kpis.totalOrders.value}
                changePct={kpis.totalOrders.changePct}
                icon={ShoppingCart}
                actionLabel="Ver pedidos"
                onAction={() => onOrdersDrillDown([], "Órdenes totales")} />
            <KpiCard
                label="Pendientes de envío"
                value={kpis.pendingShipments.value}
                changePct={kpis.pendingShipments.changePct}
                icon={Truck}
                actionLabel="Ver pedidos"
                onAction={() => onOrdersDrillDown([...PENDING_SHIPMENT_STATUSES], "Pendientes de envío")} />
            <KpiCard
                label="Acreditado"
                value={kpis.accreditedAmount.value}
                icon={Wallet}
                prefix="$" />
            <KpiCard
                label="Usuarios activos"
                value={kpis.activeUsers.value}
                changePct={kpis.activeUsers.changePct}
                icon={Users} />
        </div>
    );
}