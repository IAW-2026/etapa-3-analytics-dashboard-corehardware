import { ShoppingBag, ExternalLink } from "lucide-react";

type Props = {
    buyerUrl?: string;
};

// Banner sutil al final de /logistica que conecta con la app de compra (Buyer),
// dando cierre visual al ecosistema: el operativo de logistica arranca en
// una venta.
export default function LogisticsBuyerCTA({ buyerUrl }: Props) {
    if (!buyerUrl) return null;

    return (
        <div className="mt-6 mb-2 rounded-lg border border-violet-200 dark:border-violet-900/50 bg-gradient-to-r from-violet-50 to-transparent dark:from-violet-950/30 dark:to-transparent p-4 flex items-center gap-4">
            <div className="shrink-0 h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Todo envío arranca en una venta
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Explorá la tienda del ecosistema CoreHardware.
                </p>
            </div>
            <a
                href={buyerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-violet-600 hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400 text-white text-xs font-mono px-3 py-1.5 transition-colors"
            >
                Ir a la tienda
                <ExternalLink className="h-3 w-3" />
            </a>
        </div>
    );
}
