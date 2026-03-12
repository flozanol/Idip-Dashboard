'use client'

import React, { useState } from 'react';
import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { LeadForm } from "@/components/LeadForm";
import { MobileHeader } from "@/components/MobileHeader";

export default function SedesClient({ 
  data 
}: { 
  data: { 
    sedes: any[], 
    categorias: any[], 
    cursos: any[], 
    vendedores: any[] 
  } 
}) {
  const { sedes, categorias, cursos, vendedores } = data;
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
