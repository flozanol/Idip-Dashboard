import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { LeadForm } from "@/components/LeadForm";
import { getDashboardData, clearLeads } from "@/lib/actions";

export default async function LeadsPage() {
  const { leads, sedes, categorias } = await getDashboardData();

  async function handleClear() {
    'use server'
    await clearLeads();
  }

  return (
    <div className="flex min-h-screen bg-black overflow-hidden text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <FilterBar />
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Gestión de Leads</h2>
                <div className="text-zinc-500 text-sm">{leads.length} leads registrados</div>
              </div>
              <form action={handleClear}>
                <button className="text-xs text-rose-500/50 hover:text-rose-500 transition-colors border border-rose-500/20 hover:border-rose-500/50 px-3 py-1.5 rounded-lg">
                  Borrar datos de prueba
                </button>
              </form>
            </div>

            <div className="premium-card overflow-hidden !p-0">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-medium uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Prospecto</th>
                    <th className="px-6 py-4">Sede / Categoría</th>
                    <th className="px-6 py-4">Canal</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {leads.map((lead: any) => (
                    <tr key={lead.id} className="hover:bg-zinc-900/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{lead.nombre_prospecto}</div>
                        <div className="text-zinc-500 text-xs">{lead.telefono || 'Sin teléfono'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">Sede {lead.sede_id}</span>
                           <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">Cat {lead.categoria_id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-300">{lead.canal_origen}</span>
                        {lead.canal_origen === 'Recomendados' && (
                          <span className="ml-2 text-[10px] font-bold text-[#98C222] bg-[#98C222]/10 px-1.5 py-0.5 rounded animate-pulse">ALTA PRIORIDAD</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                        {new Date(lead.fecha_registro).toLocaleDateString('es-MX')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {leads.length === 0 && (
                <div className="p-12 text-center text-zinc-500 italic">No hay leads registrados aún.</div>
              )}
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
