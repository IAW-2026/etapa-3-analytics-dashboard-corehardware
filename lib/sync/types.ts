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
  subtotal_productos: number | null;
  costo_envio: number | null;
  estado: PedidoEstado;
  productos_id?: string[];
};

export type PedidosPageResponse = {
  items: Pedido[];
  total: number;
  limit: number;
  offset: number;
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
  fecha_alta: string;
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

export type Producto = {
  id: string;
  nombre: string;
  vendedor_id: string;
};

export type ProductosResponse = {
  total: number;
  items: Producto[];
};

export type Vendedor = {
  id: string;
  razon_social: string;
  cuit: string;
  mail: string;
  celular: string;
  condicion_iva: string;
  fecha_creacion: string; // ISO 8601
};

export type VendedoresResponse = {
  total: number;
  items: Vendedor[];
};