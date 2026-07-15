"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Truck,
  ShoppingCart,
  Users,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  children?: { href: string; label: string }[];
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  {
    href: "/pedidos",
    label: "Pedidos",
    icon: ClipboardList,
    children: [{ href: "/pedidos/resumen", label: "Resumen" }],
  },
  { href: "/finanzas", label: "Finanzas", icon: Wallet },
  { href: "/logistica", label: "Logística", icon: Truck },
  { href: "/ventas", label: "Ventas", icon: ShoppingCart },
  { href: "/usuarios", label: "Usuarios", icon: Users },
  { href: "/productos", label: "Productos", icon: ShoppingBag },
];

export function Sidebar() {
  const pathname = usePathname();
  // Arranca colapsado=false por default; se sincroniza con localStorage
  // recién en el useEffect (evita mismatch de hidratación SSR/cliente,
  // ya que localStorage no existe en el server).
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored === "true") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  }

  return (
    <aside
      className={`flex shrink-0 flex-col gap-1 border-r border-zinc-800 bg-zinc-950 p-3 transition-[width] duration-200 ${collapsed ? "w-16" : "w-56"
        }`}
    >
      <div className={`mb-2 flex w-full ${collapsed ? "justify-center" : "justify-end"}`}>
        <button
          onClick={toggleCollapsed}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200"
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          ) : (
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;

        const hasActiveChild = item.children?.some((child) => pathname === child.href) ?? false;

          return (
          <div key={item.href} className="flex flex-col gap-1">
            <Link
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-2 rounded-md px-3 py-2 font-mono text-sm transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                hasActiveChild
                  ? "text-violet-400"
                  : isActive
                    ? "bg-violet-600/10 text-violet-400"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {!collapsed && item.label}
            </Link>
            {!collapsed && item.children && isActive && (
              <div className="ml-9 mt-1 flex flex-col gap-1">
                {item.children.map((child) => {
                  const isChildActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${isChildActive
                          ? "bg-violet-600/10 text-violet-400"
                          : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                        }`}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}