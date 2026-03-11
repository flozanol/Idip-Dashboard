'use client'

import React, { useState } from 'react';
import { Calendar, Filter, X, Check } from 'lucide-react';

export function FilterBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-zinc-950/50 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <select className="bg-zinc-900 border border-zinc-800 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#98C222]/50 transition-all text-white">
          <option>Todas las Sedes</option>
          <option>Polanco</option>
          <option>Querétaro</option>
          <option>Online</option>
          <option>On-Demand</option>
        </select>

        <div className="h-4 w-[1px] bg-zinc-800" />

        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm">
          <Calendar size={14} className="text-[#98C222]" />
          <span className="text-zinc-300">Marzo 2024</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Filter size={14} className="text-[#98C222]" />
          Filtros Avanzados
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h3 className="text-lg font-bold">Filtros Avanzados</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Fecha Inicio</label>
                  <input type="date" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:border-[#98C222]/50 outline-none [color-scheme:dark]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Fecha Fin</label>
                  <input type="date" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:border-[#98C222]/50 outline-none [color-scheme:dark]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Estados de Lead</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Nuevo', 'Contactado', 'Seguimiento', 'Venta', 'Perdido'].map((status) => (
                    <button key={status} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm group hover:border-[#98C222]/30 transition-all">
                      <span className="text-zinc-400 group-hover:text-white">{status}</span>
                      <div className="w-4 h-4 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-[#98C222]/50 transition-colors">
                        <Check size={10} className="text-[#98C222]" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Criterio de Orden</label>
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:border-[#98C222]/50 outline-none">
                  <option>Más recientes primero</option>
                  <option>Más antiguos primero</option>
                  <option>Mayor monto de cierre</option>
                  <option>Más intentos de contacto</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 flex items-center gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
              >
                Limpiar
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-[2] bg-[#98C222] hover:bg-[#a1c92d] text-black font-extrabold py-3 rounded-xl shadow-lg shadow-[#98C222]/20 transition-all active:scale-95"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
