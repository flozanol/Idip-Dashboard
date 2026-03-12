import React from 'react';
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { MarketingMetricsForm } from "@/components/MarketingMetricsForm";
import { Globe } from 'lucide-react';

export default function MarketingMetricsPage() {
  return (
    <div className="flex min-h-screen bg-black overflow-hidden relative">
      <Sidebar isOpen={false} onClose={() => {}} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <MobileHeader onOpenMenu={() => {}} />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-4xl mx-auto">
            <div className="premium-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#afca0b]/5 blur-3xl -mr-32 -mt-32" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-[#afca0b]/10 text-[#afca0b]">
                  <Globe size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Métricas de Marketing</h1>
                  <p className="text-zinc-500 text-sm">Ingresa los datos de redes sociales y comunidad para el reporte ejecutivo.</p>
                </div>
              </div>

              <MarketingMetricsForm />
            </div>
          </div>
        </div>
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
