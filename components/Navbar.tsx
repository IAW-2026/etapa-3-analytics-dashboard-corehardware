"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn } from "@clerk/nextjs";
import { BarChart3 } from "lucide-react";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/logistica", label: "Logística" },
  { href: "/ventas", label: "Ventas" },
  { href: "/finanzas", label: "Finanzas" },
  { href: "/usuarios", label: "Usuarios" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <SignedIn>
      <nav className="bg-gray-900 border-b border-cyan-900 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <span className="font-bold text-lg tracking-tight">
              <span className="text-white">ANALYTICS</span>
              <span className="text-cyan-400">·CH</span>
            </span>
          </Link>
          <div className="flex gap-5">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition ${
                  pathname === link.href
                    ? "text-cyan-400 font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <UserButton />
      </nav>
    </SignedIn>
  );
}
