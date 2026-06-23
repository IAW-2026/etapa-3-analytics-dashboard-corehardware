import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await requireAdminPage();

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-gray-400 mt-1">Inteligencia de negocio del ecosistema CoreHardware</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
        <p className="text-gray-400">
          Próximamente: KPIs globales y resumen ejecutivo de las 4 apps.
        </p>
      </div>
    </main>
  );
}
