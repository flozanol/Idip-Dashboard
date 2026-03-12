'use client'

import React, { useState } from 'react';
import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { StatsCards } from "@/components/StatsCards";
import { LeadForm } from "@/components/LeadForm";
import { FunnelChart, ChannelMixChart } from "@/components/charts/DashboardCharts";
import { MobileHeader } from "@/components/MobileHeader";

export default function ClientDashboardWrapper({ data }: { data: any }) {
  const { leads, sedes, categorias, cursos, vendedores, inversiones } = data;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black overflow-hidden relative">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <MobileHeader onOpenMenu={() => setIsSidebarOpen(true)} />
        <FilterBar />
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6 pb-12">
            <StatsCards leads={leads} inversiones={inversiones} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
              <div className="lg:col-span-2 premium-card">
                <h4 className="text-sm font-semibold text-zinc-400 mb-6 uppercase tracking-wider">Embudo de Conversión</h4>
                <div className="h-[300px] w-full">
                  <FunnelChart leads={leads} />
                </div>
              </div>
              <div className="premium-card">
                <h4 className="text-sm font-semibold text-zinc-400 mb-6 uppercase tracking-wider">Mix de Canales</h4>
                <div className="h-[300px] w-full">
                  <ChannelMixChart leads={leads} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6">
              <div className="premium-card min-h-[300px]">
                <h4 className="text-sm font-semibold text-zinc-400 mb-6 uppercase tracking-wider">Desempeño por Sede</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {sedes.map((sede: any) => {
                    const sedeLeads = leads.filter((l: any) => l.sede_id === sede.id);
                    const sedeVentas = sedeLeads.filter((l: any) => l.status === 'Venta').length;
                    const conversion = sedeLeads.length > 0 ? ((sedeVentas / sedeLeads.length) * 100).toFixed(1) : '0.0';
                    return (
                      <div key={sede.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <span className="font-medium text-sm">{String(sede.nombre)}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] text-zinc-500 uppercase">Leads: <span className="text-white">{sedeLeads.length}</span></span>
                          <span className="text-[10px] text-zinc-500 uppercase">Conv: <span className="text-[#98C222] font-bold">{conversion}%</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="premium-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#98C222]/5 blur-3xl -mr-16 -mt-16" />
                <h4 className="text-sm font-semibold text-zinc-400 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  Alertas de Pérdida
                </h4>
                <div className="flex flex-col items-center justify-center min-h-[200px] text-zinc-600 text-center px-8">
                  {leads.filter((l: any) => Number(l.intentos_contacto || 0) >= 4 && String(l.status) !== 'Venta').length > 0 ? (
                    <div className="space-y-4 w-full">
                       {leads.filter((l: any) => Number(l.intentos_contacto || 0) >= 4 && String(l.status) !== 'Venta').slice(0, 3).map((l: any) => (
                         <div key={l.id} className="text-left p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 group hover:border-rose-500/40 transition-all">
                            <div className="text-xs text-rose-200 font-bold">{String(l.nombre_prospecto)}</div>
                            <div className="text-[10px] text-rose-500 mt-1 uppercase tracking-widest font-bold">{String(l.intentos_contacto)} intentos fallidos</div>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">No hay leads críticos en este momento.</p>
                      <p className="text-xs mt-2 italic opacity-50">Los leads con más de 4 intentos fallidos aparecerán aquí.</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <LeadForm sedes={sedes} categorias={categorias} cursos={cursos} vendedores={vendedores} />
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
