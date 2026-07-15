"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

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

    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {OPCIONES.map((op) => (
                <button
                    key={op.value}
                    onClick={() => handleChange(op.value)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${valor === op.value
                            ? "bg-violet-600 border-violet-600 text-white dark:bg-violet-500 dark:border-violet-500"
                            : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-violet-400"
                        }`}
                >
                    {op.label}
                </button>
            ))}
        </div>
    );
}
