export type Pago = {
    id: string;
    fecha: string;
    buyerId: string;
    sellerId: string;
    formaDePago: string;
    monto: number;
    estado: "APROBADO" | "PENDIENTE" | "RECHAZADO";
    pedidoId: string;
};

export type Disputa = {
    id: string;
    pedidoId: string;
    fechaDeInicio: string;
    fechaDeFinalizacion: string | null;
    estado: "ABIERTA" | "RESUELTA" | "EN_REVISION";
    descripcion: string;
};