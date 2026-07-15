export type Dispute = {
    id: string;
    pedidoId: string;
    fechaDeInicio: string;
    fechaDeFinalizacion: string | null;
    estado: 'pendiente' | 'reembolsada' | 'repuesta' | 'rechazada';
    descripcion: string;
};

export type Payment = {
    id: string;
    fecha: string;
    buyerId: string;
    sellerId: string;
    formaDePago: string;
    monto: string;
    estado: 'pendiente' | 'acreditado' | 'rechazado' | 'en_proceso' | 'cancelado' | 'reembolsado' | 'contracargo';
    pedidoId: string;
};

export type Sale = {
    id: string;
    date: string;
    sellerName: string;
    totalPrice: number;
};

export type BestSellingProduct = {
    name: string;
    brand: string;
    model: string;
    price: string;
    sellerName: string;
    totalSold: number;
}

export type Shipment = {
    id: string;
    pedido_id: string;
    estado: "PENDIENTE" | "ASIGNADO" | "RETIRADO" | "EN_CAMINO" | "ENTREGADO";
    direccion: string;
    monto: number;
    fecha_estimada: string | null;
    fecha_de_entrega: string | null;
    operador: { id: string; nombre: string; mail: string } | null;
};

export type Buyer = {
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

export type Seller = {
    id: string;
    razon_social: string;
    cuit: string;
    mail: string;
    celular: string;
    condicion_iva: string;
};

export type Operator = {
    id: string;
    nombre: string;
    apellido: string;
    dni: string;
    mail: string;
    celular: string;
};

export type Order = {
    id: string;
    fecha: string;
    comprador_id: string;
    vendedor_id: string;
    monto: number;
    estado: string;
};

export type LogisticaKpis = {
    ventana_dias: number;
    total_envios: { actual: number; anterior: number };
    on_time: {
        porcentaje_actual: number | null;
        porcentaje_anterior: number | null;
        entregados_actual: number;
        entregados_anterior: number;
    };
    tiempo_transito_dias: { actual: number | null; anterior: number | null };
    en_curso: number;
    en_riesgo: number;
};