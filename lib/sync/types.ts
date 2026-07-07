export type PedidoEstado =
  | "PENDIENTE_PAGO"
  | "PAGO_APROBADO"
  | "PAGO_RECHAZADO"
  | "EN_PREPARACION"
  | "EN_CAMINO"
  | "ENTREGADO"
  | "CANCELADO";

export type Pedido = {
  id: string;
  fecha: string;
  comprador_id: string;
  vendedor_id: string;
  monto: number;
  estado: PedidoEstado;
};

export type Comprador = {
  id: string;
  dni: string;
  cuil_cuit: string;
  apellido: string;
  nombre: string;
  direccion: string;
  mail: string;
  celular: string;
  condicion_iva: string;
};

export type ForeignSale = {
  id: string;
  date: string;
  sellerId: string;
  totalPrice: string;
};

export type EnvioEstado = "PENDIENTE" | "ASIGNADO" | "RETIRADO" | "EN_CAMINO" | "ENTREGADO";

export type Envio = {
  id: string;
  pedido_id: string;
  estado: EnvioEstado;
  direccion: string;
  monto: number;
  fecha_estimada: string;
  fecha_de_entrega: string | null;
  operador: { id: string; nombre: string; mail: string } | null;
};

export type EnviosResponse = {
  total: number;
  items: Envio[];
};

export type PagoEstado =
  | "acreditado"
  | "pendiente"
  | "rechazado"
  | "en_proceso"
  | "cancelado"
  | "reembolsado"
  | "contracargo";

export type Pago = {
  id: string;
  fecha: string;
  buyerId: string;
  sellerId: string;
  formaDePago: string;
  monto: number;
  estado: PagoEstado;
  pedidoId: string;
};

export type Disputa = {
  id: string;
  pedidoId: string;
  fechaDeInicio: string;
  fechaDeFinalizacion: string | null;
  estado: string;
  descripcion: string;
};