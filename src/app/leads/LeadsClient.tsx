'use client'

import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { LeadForm } from "@/components/LeadForm";
import { clearLeads } from "@/lib/actions";
import { Users, Edit2, X } from "lucide-react";
import { StatusSelector, AttemptCounter } from "@/components/LeadManagement";
import { MobileHeader } from "@/components/MobileHeader";
import { useState } from "react";

export default function LeadsPage({ 
  data 
}: { 
  data: { 
    leads: any[], 
    sedes: any[], 
    categorias: any[], 
    cursos: any[], 
    vendedores: any[] 
  } 
}) {
  const { leads, sedes, categorias, cursos, vendedores } = data;
  const [editingLead, setEditingLead] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  return (
    <div className="flex min-h-screen bg-black overflow-hidden text-white relative">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <MobileHeader onOpenMenu={() => setIsSidebarOpen(true)} />
        <FilterBar />
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Gestión de Leads</h2>
                <div className="text-zinc-500 text-sm">{leads.length} leads registrados</div>
              </div>
            </div>

            <div className="premium-card overflow-hidden !p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-medium uppercase text-[10px] tracking-wider sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4">Prospecto</th>
                      <th className="px-6 py-4">Sede / Curso</th>
                      <th className="px-6 py-4">Vendedor</th>
                      <th className="px-6 py-4">Canal</th>
                      <th className="px-6 py-4">Monto</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Intentos</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {leads.map((lead: any) => {
                      const sede = String(sedes.find(s => s.id === lead.sede_id)?.nombre || 'Sede ?');
                      const categoria = String(categorias.find(c => c.id === lead.categoria_id)?.nombre || '---');
                      const curso = String(cursos.find(c => c.id === lead.curso_id)?.nombre || 'General');
                      const vendedor = String(vendedores.find(v => v.id === lead.vendedor_id)?.nombre || 'Sin asignar');
                      
                      return (
                        <tr key={lead.id} className="hover:bg-zinc-900/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white">{String(lead.nombre_prospecto)}</div>
                            <div className="text-zinc-500 text-[10px] leading-tight mt-0.5">{String(lead.email || '')}</div>
                            <div className="text-zinc-500 text-[10px]">{String(lead.telefono || 'Sin teléfono')}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                               <div className="flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 rounded-full bg-[#98C222]" />
                                 <span className="text-zinc-300 font-medium">{sede}</span>
                               </div>
                               <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">{curso} ({categoria})</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-zinc-400 text-xs">{vendedor}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-300">{String(lead.canal_origen)}</span>
                              {lead.canal_origen === 'Recomendados' && (
                                <span className="text-[9px] font-bold text-[#98C222] bg-[#98C222]/10 px-1.5 py-0.5 rounded-full ring-1 ring-[#98C222]/30">VIP</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-[#98C222]">
                              {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(lead.monto_cierre || 0)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <StatusSelector leadId={lead.id} currentStatus={String(lead.status)} />
                          </td>
                          <td className="px-6 py-4">
                            <AttemptCounter leadId={lead.id} attempts={Number(lead.intentos_contacto || 0)} />
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-3 text-zinc-400">
                               <span className="font-medium text-[11px] font-mono">{new Date(lead.fecha_registro).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}</span>
                               <button 
                                 onClick={() => setEditingLead(lead)}
                                 className="p-1.5 hover:bg-zinc-800 rounded-lg hover:text-white transition-all transform active:scale-95"
                               >
                                 <Edit2 size={14} />
                               </button>
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
        <LeadForm 
          sedes={sedes} 
          categorias={categorias} 
          cursos={cursos} 
          vendedores={vendedores} 
          editData={editingLead}
          onClose={() => setEditingLead(null)}
        />
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
