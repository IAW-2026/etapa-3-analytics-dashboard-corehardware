"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Truck,
  ShoppingCart,
  Users,
  ShoppingBag,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/finanzas", label: "Finanzas", icon: Wallet },
  { href: "/logistica", label: "Logística", icon: Truck },
  { href: "/ventas", label: "Ventas", icon: ShoppingCart },
  { href: "/usuarios", label: "Usuarios", icon: Users },
  { href: "/productos", label: "Productos", icon: ShoppingBag },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-1 border-r border-zinc-800 bg-zinc-950 p-3">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 rounded-md px-3 py-2 font-mono text-sm transition-colors ${
              isActive
                ? "bg-violet-600/10 text-violet-400"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}