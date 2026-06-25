"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn } from "@clerk/nextjs";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/logistica", label: "Logística" },
    { href: "/ventas", label: "Ventas" },
    { href: "/finanzas", label: "Finanzas" },
    { href: "/usuarios", label: "Usuarios" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-900 px-8">
            <div className="h-16 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <Link href="/" className="flex flex-col gap-0">
                        <span className="text-xs font-mono tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
                            CoreHardware
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-light tracking-[0.1em] text-neutral-900 dark:text-neutral-100">
                                Analytics
                            </span>
                            <div className="h-px w-6 bg-violet-500" />
                        </div>
                    </Link>
                    <div className="hidden md:flex gap-6">
                        {LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm transition-colors ${pathname === link.href
                                        ? "text-violet-500 font-medium"
                                        : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <UserButton />
                    <button
                        className="md:hidden text-neutral-500 dark:text-neutral-400"
                        onClick={() => setOpen(!open)}
                        aria-label="Menú"
                    >
                        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="md:hidden flex flex-col pb-4 gap-1">
                    {LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={`px-2 py-2 text-sm rounded-md transition-colors ${pathname === link.href
                                    ? "text-violet-500 font-medium"
                                    : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}