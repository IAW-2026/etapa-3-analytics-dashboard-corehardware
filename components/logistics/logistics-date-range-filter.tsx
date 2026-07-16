"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { chartCategoryColors } from "@/styles/theme";

const OPCIONES = [
    { label: "Últimos 7 días", value: "7" },
    { label: "Últimos 30 días", value: "30" },
    { label: "Últimos 90 días", value: "90" },
    { label: "Todo", value: "0" },
] as const;

type Props = {
    valor: string;
};

export default function LogisticsDateRangeFilter({ valor }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function handleChange(nuevo: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("days", nuevo);
        router.push(`${pathname}?${params.toString()}`);
    }

    const color = chartCategoryColors.violet;

    return (
        <div className="flex flex-wrap gap-2">
            {OPCIONES.map((op) => {
                const isSelected = valor === op.value;
                return (
                    <button
                        key={op.value}
                        onClick={() => handleChange(op.value)}
                        style={isSelected ? { borderColor: color, backgroundColor: `${color}1a`, color } : undefined}
                        className={[
                            "rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors",
                            isSelected ? "" : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300",
                        ].join(" ")}
                    >
                        {op.label}
                    </button>
                );
            })}
        </div>
    );
}
