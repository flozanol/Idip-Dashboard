import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { LeadForm } from "@/components/LeadForm";
import { getDashboardData } from "@/lib/actions";

export default async function PerformancePage() {
  const { sedes, categorias } = await getDashboardData();
  return (
    <div className="flex min-h-screen bg-black overflow-hidden text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <FilterBar />
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Análisis de Rendimiento</h2>
            <div className="premium-card h-[400px] flex items-center justify-center text-zinc-600 italic">
              Sección de analítica avanzada próximamente.
            </div>
          </div>
        </div>
        <LeadForm sedes={sedes} categorias={categorias} />
      </main>
    </div>
  );
}
