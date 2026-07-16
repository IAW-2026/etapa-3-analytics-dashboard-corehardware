import type { Comprador } from "./types";

function esMismoDia(fechaAlta: string, fecha: string): boolean {
  return fechaAlta.slice(0, 10) === fecha;
}

// Cuenta compradores cuyo fecha_alta cae en el día `fecha` (formato YYYY-MM-DD).
// Comparación en UTC (fecha_alta llega como ISO string desde Buyer), mismo
// criterio que ya usa dashboard-analytics/orders para sus límites de fecha.
export function contarCompradoresNuevos(compradores: Comprador[], fecha: string): number {
  return compradores.filter((comprador) => esMismoDia(comprador.fecha_alta, fecha)).length;
}