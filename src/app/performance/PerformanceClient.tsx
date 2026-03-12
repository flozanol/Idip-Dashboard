'use client'

import React, { useState } from 'react';
import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { LeadForm } from "@/components/LeadForm";
import { MobileHeader } from "@/components/MobileHeader";

export default function PerformanceClient({ 
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
            <h2 className="text-2xl font-bold tracking-tight">Análisis de Rendimiento</h2>
            <div className="premium-card h-[400px] flex items-center justify-center text-zinc-600 italic">
              Sección de analítica avanzada próximamente.
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
