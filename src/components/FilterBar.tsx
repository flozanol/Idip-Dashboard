import React from 'react';
import { Calendar, Filter } from 'lucide-react';

export function FilterBar() {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-zinc-950/50 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <select className="bg-zinc-900 border border-zinc-800 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all">
          <option>Todas las Sedes</option>
          <option>Polanco</option>
          <option>Querétaro</option>
          <option>Online</option>
          <option>On-Demand</option>
        </select>

        <div className="h-4 w-[1px] bg-zinc-800" />

        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm">
          <Calendar size={14} className="text-zinc-500" />
          <span className="text-zinc-300">Marzo 2024</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-rose-900/20">
          <Filter size={14} />
          Filtros Avanzados
        </button>
      </div>
    </div>
  );
}
