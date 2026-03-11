'use client'

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { FilterBar } from '@/components/FilterBar';
import { DollarSign, Save, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { updateInvestment } from '@/lib/actions';

const CANALES = ['Google', 'TikTok', 'Instagram', 'Facebook', 'YouTube', 'Alumnos', 'Exalumnos', 'Recomendados', 'Teléfono', 'Piso', 'WhatsApp'];
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function InvestmentsPage({ 
  inversiones = [] 
}: { 
  inversiones: any[] 
}) {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [saving, setSaving] = useState<string | null>(null);

  // Local state for edits
  const [localInversiones, setLocalInversiones] = useState<Record<string, number>>(
    CANALES.reduce((acc, canal) => {
      const inv = inversiones.find(i => i.canal === canal && i.mes === selectedMonth && i.anio === selectedYear);
      acc[canal] = inv ? inv.monto : 0;
      return acc;
    }, {} as Record<string, number>)
  );

  // Re-sync local state when filters change
  React.useEffect(() => {
    setLocalInversiones(
      CANALES.reduce((acc, canal) => {
        const inv = inversiones.find(i => i.canal === canal && i.mes === selectedMonth && i.anio === selectedYear);
        acc[canal] = inv ? inv.monto : 0;
        return acc;
      }, {} as Record<string, number>)
    );
  }, [selectedMonth, selectedYear, inversiones]);

  const handleSave = async (canal: string) => {
    setSaving(canal);
    const monto = localInversiones[canal] || 0;
    await updateInvestment(canal, selectedMonth, selectedYear, monto);
    setSaving(null);
  };

  return (
    <div className="flex min-h-screen bg-black overflow-hidden text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <FilterBar />
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest">
                <TrendingUp size={14} />
                ROI Tracking
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">Inversión Mensual</h1>
              <p className="text-zinc-500 text-lg">Registra cuánto inviertes en cada canal para calcular el rendimiento real.</p>
            </header>

            <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-2 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg">
                <CalendarIcon size={16} className="text-zinc-500" />
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="bg-transparent outline-none text-sm font-medium"
                >
                  {MESES.map((mes, i) => (
                    <option key={mes} value={i + 1}>{mes}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg">
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="bg-transparent outline-none text-sm font-medium"
                >
                  {[2024, 2025, 2026].map(anio => (
                    <option key={anio} value={anio}>{anio}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CANALES.map((canal) => (
                <div key={canal} className="premium-card flex items-center justify-between group">
                  <div className="space-y-1">
                    <h4 className="font-bold text-zinc-300">{canal}</h4>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Gasto en Publicidad</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative w-32">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                      <input 
                        type="number"
                        value={localInversiones[canal] === 0 ? '' : localInversiones[canal]}
                        onChange={(e) => setLocalInversiones({...localInversiones, [canal]: parseFloat(e.target.value) || 0})}
                        placeholder="0.00"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-6 pr-3 py-2 text-sm focus:border-blue-500/50 outline-none transition-colors"
                      />
                    </div>
                    <button 
                      onClick={() => handleSave(canal)}
                      disabled={saving === canal}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-blue-600 text-zinc-400 hover:text-white transition-all disabled:opacity-50"
                    >
                      {saving === canal ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save size={20} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
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
