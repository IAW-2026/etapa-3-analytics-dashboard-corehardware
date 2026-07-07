import { SignInButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-950 px-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
          CoreHardware
        </span>
        <h1 className="text-3xl font-light tracking-[0.05em] text-zinc-100">
          Analytics Dashboard
        </h1>
        <div className="mt-1 h-px w-12 bg-violet-500" />
      </div>

      <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
        Indicadores e inteligencia de negocio del ecosistema CoreHardware.
        Iniciá sesión para acceder.
      </p>

      <SignInButton mode="modal">
        <button className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500 active:scale-[0.98]">
          Iniciar sesión
        </button>
      </SignInButton>
    </main>
  );
}