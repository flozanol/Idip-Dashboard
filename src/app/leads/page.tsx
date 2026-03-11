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
              {leads.length > 0 && (
                <form action={handleClear}>
                  <button className="text-xs text-rose-500/50 hover:text-rose-500 transition-colors border border-rose-500/20 hover:border-rose-500/50 px-3 py-1.5 rounded-lg font-medium">
                    Borrar datos de prueba
                  </button>
                </form>
              )}
            </div>

            <div className="premium-card overflow-hidden !p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-medium uppercase text-[10px] tracking-wider sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4">Prospecto</th>
                      <th className="px-6 py-4">Sede / Escuela</th>
                      <th className="px-6 py-4">Canal</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4 text-right">Registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {leads.map((lead: any) => {
                      const sede = sedes.find(s => s.id === lead.sede_id)?.nombre || 'Sede ?';
                      const categoria = categorias.find(c => c.id === lead.categoria_id)?.nombre || '---';
                      
                      return (
                        <tr key={lead.id} className="hover:bg-zinc-900/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white">{lead.nombre_prospecto}</div>
                            <div className="text-zinc-500 text-xs">{lead.telefono || 'Sin teléfono'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                               <div className="flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 rounded-full bg-[#98C222]" />
                                 <span className="text-zinc-300 font-medium">{sede}</span>
                               </div>
                               <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">{categoria}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-300">{lead.canal_origen}</span>
                              {lead.canal_origen === 'Recomendados' && (
                                <span className="text-[9px] font-bold text-[#98C222] bg-[#98C222]/10 px-1.5 py-0.5 rounded-full ring-1 ring-[#98C222]/30">VIP</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              lead.status === 'Venta' ? 'bg-[#98C222]/10 text-[#98C222] border-[#98C222]/20' :
                              lead.status === 'Perdido' ? 'bg-zinc-800 text-zinc-500 border-zinc-700' :
                              'bg-zinc-800 text-zinc-300 border-zinc-700'
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="text-zinc-400 font-medium">{new Date(lead.fecha_registro).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}</div>
                             <div className="text-[10px] text-zinc-600 font-mono italic">
                               {lead.intentos_contacto > 0 ? `${lead.intentos_contacto} intentos` : 'Nuevo'}
                             </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {leads.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center">
                     <Users size={24} className="text-zinc-700" />
                  </div>
                  <div>
                    <h3 className="text-zinc-400 font-medium">Bandeja de entrada vacía</h3>
                    <p className="text-zinc-600 text-xs mt-1">Usa el botón + para registrar el primer lead.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <LeadForm sedes={sedes} categorias={categorias} />
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: \`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      \`}} />
    </div>
  );
}
