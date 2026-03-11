import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { StatsCards } from "@/components/StatsCards";
import { LeadForm } from "@/components/LeadForm";
import { FunnelChart, ChannelMixChart } from "@/components/charts/DashboardCharts";
import { getDashboardData } from "@/lib/actions";
import { initDb } from "@/lib/db";

export default async function Dashboard() {
  await initDb();
  const { leads, sedes, categorias } = await getDashboardData();

  return (
    <div className="flex min-h-screen bg-black overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <FilterBar />
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6 pb-12">
            <StatsCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
              <div className="lg:col-span-2 premium-card">
                <h4 className="text-sm font-semibold text-zinc-400 mb-6 uppercase tracking-wider">Embudo de Conversión</h4>
                <FunnelChart />
              </div>
              <div className="premium-card">
                <h4 className="text-sm font-semibold text-zinc-400 mb-6 uppercase tracking-wider">Mix de Canales</h4>
                <ChannelMixChart />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6">
              <div className="premium-card min-h-[300px]">
                <h4 className="text-sm font-semibold text-zinc-400 mb-6 uppercase tracking-wider">Desempeño por Sede</h4>
                <div className="space-y-4">
                  {sedes.map((sede: any) => (
                    <div key={sede.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                      <span className="font-medium">{sede.nombre}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-zinc-500">Leads: <span className="text-white">--</span></span>
                        <span className="text-xs text-zinc-500">Conversión: <span className="text-emerald-500">--%</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="premium-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl -mr-16 -mt-16" />
                <h4 className="text-sm font-semibold text-zinc-400 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  Alertas de Pérdida
                </h4>
                <div className="flex flex-col items-center justify-center h-48 text-zinc-600 text-center px-8">
                  <p className="text-sm">No hay leads críticos en este momento.</p>
                  <p className="text-xs mt-2 italic opacity-50">Los leads con más de 4 intentos fallidos aparecerán aquí.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LeadForm sedes={sedes} categorias={categorias} />
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}} />
    </div>
  );
}
