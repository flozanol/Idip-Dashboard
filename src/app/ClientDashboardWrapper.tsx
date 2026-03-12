'use client'

import React, { useState } from 'react';
import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { StatsCards } from "@/components/StatsCards";
import { LeadForm } from "@/components/LeadForm";
import { FunnelChart, ChannelMixChart } from "@/components/charts/DashboardCharts";
import { MobileHeader } from "@/components/MobileHeader";
import { Facebook, Instagram, Youtube, Music2, Star, Pin, ExternalLink } from 'lucide-react';

export default function ClientDashboardWrapper({ data }: { data: any }) {
  const { leads, sedes, categorias, cursos, vendedores, inversiones, marketingMetrics, currentUser } = data;
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
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentUser={currentUser} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <MobileHeader onOpenMenu={() => setIsSidebarOpen(true)} currentUser={currentUser} />
        <FilterBar />
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6 pb-12 text-white">
            <div className="px-6 pt-6">
              <a 
                href="https://direccion-idip.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="premium-card group bg-gradient-to-r from-zinc-900 to-zinc-950 border-[#afca0b]/20 hover:border-[#afca0b]/50 transition-all flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-[#afca0b]/10 text-[#afca0b] group-hover:scale-110 transition-transform">
                    <ExternalLink size={20} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold tracking-tight">Acceso a Dirección Estratégica</h5>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-0.5">Reportes y KPIs Avanzados</p>
                  </div>
                </div>
                <div className="px-4">
                   <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center group-hover:bg-[#afca0b] group-hover:text-black transition-all">
                      <ExternalLink size={14} />
                   </div>
                </div>
              </a>
            </div>
            <StatsCards leads={leads} inversiones={inversiones} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
              <div className="lg:col-span-2 premium-card">
                <h4 className="text-sm font-semibold text-zinc-400 mb-6 uppercase tracking-wider">Embudo de Conversión</h4>
                <div className="h-[320px] w-full">
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
              {/* Desempeño por Sede */}
              <div className="premium-card min-h-[300px]">
                <h4 className="text-sm font-semibold text-zinc-400 mb-6 uppercase tracking-wider">Desempeño por Sede</h4>
                <div className="grid grid-cols-1 gap-4">
                  {sedes.map((sede: any) => {
                    const sedeLeads = leads.filter((l: any) => l.sede_id === sede.id);
                    const sedeVentas = sedeLeads.filter((l: any) => l.status === 'Venta').length;
                    const conversion = sedeLeads.length > 0 ? ((sedeVentas / sedeLeads.length) * 100).toFixed(1) : '0.0';
                    return (
                      <div key={sede.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <span className="font-medium text-sm">{String(sede.nombre)}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] text-zinc-500 uppercase">Leads: <span className="text-white">{sedeLeads.length}</span></span>
                          <span className="text-[10px] text-zinc-500 uppercase">Conv: <span className="text-[#afca0b] font-bold">{conversion}%</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social Media Stats */}
              <div className="premium-card lg:col-span-2">
                <h4 className="text-sm font-semibold text-zinc-400 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Presencia en Redes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Polanco */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-l-2 border-[#afca0b] pl-2">CDMX (Polanco)</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 group hover:border-blue-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Facebook size={12} className="text-[#1877F2]" />
                          <span className="text-[9px] text-zinc-500 uppercase font-bold block">FB Fans</span>
                        </div>
                        <span className="text-sm font-bold text-blue-500">{marketingMetrics?.fb_fans_polanco?.toLocaleString() || 0}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 group hover:border-pink-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Instagram size={12} className="text-[#E4405F]" />
                          <span className="text-[9px] text-zinc-500 uppercase font-bold block">IG Followers</span>
                        </div>
                        <span className="text-sm font-bold text-pink-500">{marketingMetrics?.ig_followers_polanco?.toLocaleString() || 0}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 group hover:border-yellow-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Star size={12} className="text-[#F4B400]" />
                          <span className="text-[9px] text-zinc-500 uppercase font-bold block">G-Rating</span>
                        </div>
                        <span className="text-sm font-bold text-yellow-500">{marketingMetrics?.google_rating_polanco || 0}★</span>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 group hover:border-yellow-600/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Star size={12} className="text-[#F4B400]" />
                          <span className="text-[9px] text-zinc-500 uppercase font-bold block">G-Reviews</span>
                        </div>
                        <span className="text-sm font-bold text-yellow-600">{marketingMetrics?.google_reviews_polanco?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Querétaro */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-l-2 border-[#afca0b] pl-2">Querétaro</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 group hover:border-blue-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Facebook size={12} className="text-[#1877F2]" />
                          <span className="text-[9px] text-zinc-500 uppercase font-bold block">FB Fans</span>
                        </div>
                        <span className="text-sm font-bold text-blue-500">{marketingMetrics?.fb_fans_qro?.toLocaleString() || 0}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 group hover:border-pink-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Instagram size={12} className="text-[#E4405F]" />
                          <span className="text-[9px] text-zinc-500 uppercase font-bold block">IG Followers</span>
                        </div>
                        <span className="text-sm font-bold text-pink-500">{marketingMetrics?.ig_followers_qro?.toLocaleString() || 0}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 group hover:border-yellow-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Star size={12} className="text-[#F4B400]" />
                          <span className="text-[9px] text-zinc-500 uppercase font-bold block">G-Rating</span>
                        </div>
                        <span className="text-sm font-bold text-yellow-500">{marketingMetrics?.google_rating_qro || 0}★</span>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 group hover:border-yellow-600/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Star size={12} className="text-[#F4B400]" />
                          <span className="text-[9px] text-zinc-500 uppercase font-bold block">G-Reviews</span>
                        </div>
                        <span className="text-sm font-bold text-yellow-600">{marketingMetrics?.google_reviews_qro?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Otros Canales */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-l-2 border-zinc-700 pl-2">Global</h5>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between group hover:border-zinc-500/30 transition-colors">
                        <div className="flex items-center gap-2">
                          <Music2 size={12} className="text-white" />
                          <span className="text-[9px] text-zinc-500 uppercase font-bold">TikTok Followers</span>
                        </div>
                        <span className="text-sm font-bold text-white">{marketingMetrics?.tt_followers?.toLocaleString() || 0}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between group hover:border-red-500/30 transition-colors">
                        <div className="flex items-center gap-2">
                          <Youtube size={12} className="text-[#FF0000]" />
                          <span className="text-[9px] text-zinc-500 uppercase font-bold">Youtube Suscritos</span>
                        </div>
                        <span className="text-sm font-bold text-red-500">{marketingMetrics?.yt_subscribers?.toLocaleString() || 0}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between group hover:border-red-600/30 transition-colors">
                        <div className="flex items-center gap-2">
                          <Pin size={12} className="text-[#E60023]" />
                          <span className="text-[9px] text-zinc-500 uppercase font-bold">Pinterest Followers</span>
                        </div>
                        <span className="text-sm font-bold text-[#E60023]">{marketingMetrics?.pin_followers?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6">
              <div className="premium-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#afca0b]/5 blur-3xl -mr-16 -mt-16" />
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
        <LeadForm sedes={sedes} categorias={categorias} cursos={cursos} vendedores={vendedores} currentUser={currentUser} />
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
