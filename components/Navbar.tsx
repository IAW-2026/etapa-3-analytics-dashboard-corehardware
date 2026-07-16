import { UserButton } from "@clerk/nextjs";
import { navAccentClass } from "@/styles/theme";

export function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
        COREHARDWARE <span className={navAccentClass}>/ ANALYTICS</span>
      </span>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-8 w-8",
          },
        }}
      />
    </header>
  );
}