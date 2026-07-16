import { AlertTriangle, CheckCircle2 } from "lucide-react";

type Props = {
    cantidad: number | null;
};

export default function LogisticsAtRiskAlert({ cantidad }: Props) {
    if (cantidad === null) return null;

    if (cantidad === 0) {
        return (
            <div className="flex items-center gap-3 rounded-lg border border-emerald-900/40 bg-emerald-400/5 p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" strokeWidth={1.75} />
                <div>
                    <p className="text-sm font-medium text-emerald-300">
                        Sin envíos en riesgo
                    </p>
                    <p className="text-xs text-emerald-400/70 font-mono">
                        Todos los envíos en curso están dentro de su fecha estimada de entrega.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 rounded-lg border border-rose-900/40 bg-rose-400/5 p-4">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" strokeWidth={1.75} />
            <div className="flex-1">
                <p className="text-sm font-medium text-rose-300">
                    {cantidad === 1
                        ? "1 envío en riesgo"
                        : `${cantidad} envíos en riesgo`}
                </p>
                <p className="text-xs text-rose-400/70 font-mono">
                    {cantidad === 1
                        ? "Ya pasó su fecha estimada de entrega y todavía no fue entregado."
                        : "Ya pasaron su fecha estimada de entrega y todavía no fueron entregados."}
                </p>
            </div>
        </div>
    );
}
