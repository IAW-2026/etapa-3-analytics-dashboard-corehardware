import type { PedidoEstado, EnvioEstado } from "./types";

export const ESTADOS_PEDIDO: PedidoEstado[] = [
  "PENDIENTE_PAGO",
  "PAGO_APROBADO",
  "PAGO_RECHAZADO",
  "EN_PREPARACION",
  "EN_CAMINO",
  "ENTREGADO",
  "CANCELADO",
];

export const ESTADOS_ENVIO_PENDIENTES: EnvioEstado[] = [
  "PENDIENTE",
  "ASIGNADO",
  "RETIRADO",
  "EN_CAMINO",
];

export const ESTADOS_PEDIDO_EXCLUIDOS_DE_GMV: PedidoEstado[] = ["CANCELADO", "PAGO_RECHAZADO"];

export const ESTADO_PAGO_ACREDITADO = "acreditado";