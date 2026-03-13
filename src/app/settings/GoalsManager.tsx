'use client'

import React, { useState } from 'react';
import { updateObjetivoMensual } from '@/lib/actions';
import { Target, TrendingUp, Wallet, CheckCircle2, Loader2, Calendar } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function GoalsManager({ 
  sedes = [], 
  objetivos = [] 
}: { 
  sedes: any[], 
  objetivos: any[] 
}) {
  const now = new Date();
  const [selectedMes, setSelectedMes] = useState(now.getMonth() + 1);
  const [selectedAnio, setSelectedAnio] = useState(now.getFullYear());
  const [loading, setLoading] = useState<number | null>(null);
  const [success, setSuccess] = useState<number | null>(null);

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const handleSave = async (sedeId: number, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(sedeId);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const metaLeads = parseInt(formData.get('meta_leads') as string) || 0;
    const metaVentas = parseFloat(formData.get('meta_ventas') as string) || 0;
    const presupuesto = parseFloat(formData.get('presupuesto') as string) || 0;

    const result = await updateObjetivoMensual(sedeId, selectedMes, selectedAnio, metaLeads, metaVentas, presupuesto);
    
    if (result.success) {
      setSuccess(sedeId);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      alert("Error al guardar objetivos");
    }
    setLoading(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-end bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
        <div className="space-y-2 flex-1 w-full text-white">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Mes</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <select 
              value={selectedMes}
              onChange={(e) => setSelectedMes(parseInt(e.target.value))}
              className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#98C222]/50 appearance-none"
            >
              {meses.map((mes, idx) => (
                <option key={idx} value={idx + 1}>{mes}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2 flex-1 w-full text-white">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Año</label>
          <input 
            type="number" 
            value={selectedAnio}
            onChange={(e) => setSelectedAnio(parseInt(e.target.value))}
            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#98C222]/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sedes.map((sede) => {
          const objetivo = objetivos.find(o => o.sede_id === sede.id && o.mes === selectedMes && o.anio === selectedAnio);
          
          return (
            <div key={sede.id} className="premium-card space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#98C222]/10 text-[#98C222]">
                    <Target size={20} />
                  </div>
                  <h3 className="text-xl font-bold">{sede.nombre}</h3>
                </div>
              </div>

              <form onSubmit={(e) => handleSave(sede.id, e)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Meta de Leads</label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                      <input 
                        name="meta_leads" 
                        type="number" 
                        defaultValue={objetivo?.meta_leads || 0}
                        className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#98C222]/50" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Meta de Ventas ($)</label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                      <input 
                        name="meta_ventas" 
                        type="number" 
                        step="0.01"
                        defaultValue={objetivo?.meta_ventas || 0}
                        className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#98C222]/50" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Presupuesto Marketing</label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                      <input 
                        name="presupuesto" 
                        type="number" 
                        step="0.01"
                        defaultValue={objetivo?.presupuesto || 0}
                        className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#98C222]/50" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    disabled={loading === sede.id}
                    className={cn(
                      "px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 text-sm",
                      success === sede.id ? "bg-green-500 text-white" : "bg-white text-black hover:bg-zinc-200"
                    )}
                  >
                    {loading === sede.id ? <Loader2 className="animate-spin" size={18} /> : success === sede.id ? <><CheckCircle2 size={18} /> Guardado</> : "Guardar Objetivos"}
                  </button>
                </div>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
