import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { LeadForm } from "@/components/LeadForm";
import { getDashboardData } from "@/lib/actions";

export default async function SedesPage() {
  const { sedes, categorias } = await getDashboardData();
  return (
    <div className="flex min-h-screen bg-black overflow-hidden text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <FilterBar />
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Análisis por Sede</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sedes.map((sede: any) => (
                <div key={sede.id} className="premium-card">
                  <h3 className="text-lg font-bold mb-2">{sede.nombre}</h3>
                  <div className="h-[200px] flex items-center justify-center text-zinc-600 italic text-sm">
                    Métricas de sede próximamente.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <LeadForm sedes={sedes} categorias={categorias} />
      </main>
    </div>
  );
}
