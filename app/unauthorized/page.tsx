import Link from "next/link";

export const dynamic = "force-dynamic";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-gray-900 border border-red-900 rounded-xl p-8 max-w-md text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-2">Acceso denegado</h1>
        <p className="text-gray-400 mb-6">
          El Analytics Dashboard es exclusivo para usuarios con rol <b className="text-cyan-400">admin</b>.
        </p>
        <Link
          href="/sign-in"
          className="inline-block bg-cyan-500 hover:bg-cyan-400 text-gray-950 px-6 py-2 rounded-lg font-semibold transition"
        >
          Volver al login
        </Link>
      </div>
    </main>
  );
}
