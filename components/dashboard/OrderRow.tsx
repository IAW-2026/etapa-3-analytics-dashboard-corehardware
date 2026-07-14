import { StatusBadge } from '@/components/ui/StatusBadge';
import { ORDER_STATUS_CHART_COLOR, ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from '@/lib/dashboard/constants';
import type { Order } from '@/types/types';

function formatOrderDate(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-AR');
}

function formatOrderAmount(monto: number): string {
  return `$${monto.toLocaleString('es-AR')}`;
}

function OrderStatusBadge({ estado }: { estado: Order['estado'] }) {
  return (
    <StatusBadge
      label={ORDER_STATUS_LABEL[estado] ?? estado}
      tone={ORDER_STATUS_TONE[estado] ?? 'neutral'}
      color={ORDER_STATUS_CHART_COLOR[estado]}
    />
  );
}

export function OrderMobileCard({ order }: { order: Order }) {
  return (
    <div className="rounded-lg border border-zinc-800 p-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-zinc-500">{formatOrderDate(order.fecha)}</span>
        <OrderStatusBadge estado={order.estado} />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-mono text-xs text-zinc-400">#{order.id.slice(0, 8)}</span>
        <span className="font-mono text-sm font-semibold">{formatOrderAmount(order.monto)}</span>
      </div>
    </div>
  );
}

export function OrderTableRow({ order }: { order: Order }) {
  return (
    <tr className="border-b border-zinc-800/60 font-mono text-sm">
      <td className="py-2 text-zinc-400">#{order.id.slice(0, 8)}</td>
      <td className="py-2 text-zinc-400">{formatOrderDate(order.fecha)}</td>
      <td className="py-2">
        <OrderStatusBadge estado={order.estado} />
      </td>
      <td className="py-2 text-right">{formatOrderAmount(order.monto)}</td>
    </tr>
  );
}