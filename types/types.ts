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
    sellerId: string;
    totalPrice: number;
};

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