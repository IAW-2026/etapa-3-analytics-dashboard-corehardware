import { UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
        CoreHardware <span className="text-zinc-600">/ Analytics</span>
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