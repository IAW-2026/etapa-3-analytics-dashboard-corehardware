import Link from 'next/link'
import { ArrowRight } from 'lucide-react'


export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-6">
            <div className="flex flex-col items-center gap-8 text-center">

                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-mono tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
                        CoreHardware
                    </span>
                    <h1 className="text-6xl font-light tracking-[0.1em] text-neutral-900 dark:text-neutral-100">
                        Analytics
                    </h1>
                    <div className="h-px w-12 bg-violet-500 mt-1" />
                </div>

                <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed">
                    Panel centralizado de operación para el ecosistema CoreHardware.
                </p>

                <Link
                    href="/sign-in"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400 text-white font-medium text-sm rounded-lg transition-colors active:scale-[0.98]"
                >
                    Iniciar sesión
                    <ArrowRight className="w-4 h-4" />
                </Link>

            </div>
        </div>
    )
}