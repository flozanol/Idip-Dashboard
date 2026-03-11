'use client'

import React from 'react';
import { updateLeadStatus, updateLeadAttempts } from '@/lib/actions';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function StatusSelector({ leadId, currentStatus }: { leadId: number, currentStatus: string }) {
  const statuses = ['Nuevo', 'Contactado', 'Seguimiento', 'Venta', 'Perdido'];
  
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await updateLeadStatus(leadId, e.target.value);
  };

  return (
    <select 
      value={currentStatus}
      onChange={handleChange}
      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border outline-none transition-all cursor-pointer ${
        currentStatus === 'Venta' ? 'bg-[#98C222]/10 text-[#98C222] border-[#98C222]/20' :
        currentStatus === 'Perdido' ? 'bg-zinc-800 text-zinc-500 border-zinc-700' :
        'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500'
      }`}
    >
      {statuses.map(s => <option key={s} value={s} className="bg-zinc-900 text-white">{s}</option>)}
    </select>
  );
}

export function AttemptCounter({ leadId, attempts }: { leadId: number, attempts: number }) {
  const handleUpdate = async (delta: number) => {
    const newAttempts = Math.max(0, attempts + delta);
    if (newAttempts !== attempts) {
      await updateLeadAttempts(leadId, newAttempts);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-lg px-2 py-1 group/attempts hover:border-zinc-700 transition-colors">
      <span className="text-[10px] font-mono font-medium text-zinc-500 min-w-[1ch]">{attempts}</span>
      <div className="flex flex-col border-l border-zinc-800 pl-1.5 ml-0.5">
        <button 
          onClick={() => handleUpdate(1)} 
          className="text-zinc-600 hover:text-[#98C222] transition-colors"
          title="Incrementar intentos"
        >
          <ChevronUp size={12} />
        </button>
        <button 
          onClick={() => handleUpdate(-1)} 
          className="text-zinc-600 hover:text-rose-500 transition-colors"
          title="Decrementar intentos"
        >
          <ChevronDown size={12} />
        </button>
      </div>
    </div>
  );
}
