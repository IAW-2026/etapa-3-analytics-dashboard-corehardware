import { SignOutButton } from "@clerk/nextjs";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
            <div className="flex flex-col items-center gap-8 text-center max-w-sm">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500">
                        CoreHardware
                    </span>
                    <h1 className="text-3xl font-light tracking-[0.05em] text-zinc-100">
                        Acceso denegado
                    </h1>
                    <div className="h-px w-12 bg-violet-500 mt-1" />
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 flex flex-col items-center gap-4 w-full">
                    <ShieldAlert className="w-8 h-8 text-violet-500" />
                    <p className="text-sm text-zinc-400 leading-relaxed">
                        El Analytics Dashboard es exclusivo para usuarios con rol{" "}
                        <span className="font-mono text-xs uppercase tracking-[0.1em] text-violet-500">
                            admin
                        </span>
                        .
                    </p>
                </div>

                <SignOutButton redirectUrl="/">
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm rounded-lg transition-colors active:scale-[0.98]">
                        Cerrar sesión
                    </button>
                </SignOutButton>
            </div>
        </main>
    );
}