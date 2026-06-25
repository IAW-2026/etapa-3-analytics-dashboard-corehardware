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