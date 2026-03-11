'use client'

import React, { useState } from 'react';
import { Plus, X, Send } from 'lucide-react';
import { createLead } from '@/lib/actions';

const CANALES = ['Google', 'TikTok', 'Instagram', 'Facebook', 'YouTube', 'Alumnos', 'Exalumnos', 'Recomendados', 'Teléfono', 'Piso', 'WhatsApp'];
const ESTADOS = ['Nuevo', 'Contactado', 'Seguimiento', 'Venta', 'Perdido'];

export function LeadForm({ sedes, categorias }: { sedes: any[], categorias: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await createLead(formData);
    if (result.success) {
      setIsOpen(false);
    }
    setIsSubmitting(false);
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-rose-600 hover:bg-rose-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-rose-900/40 hover:scale-110 active:scale-95 transition-all group"
      >
        <Plus size={28} className={isOpen ? "rotate-45" : "group-hover:rotate-90 transition-transform duration-300"} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h3 className="text-lg font-bold">Registro Rápido de Lead</h3>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Nombre del Prospecto</label>
                <input required name="nombre" type="text" placeholder="Ej. Ana García" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-rose-500/50 outline-none transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Sede</label>
                  <select name="sedeId" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none">
                    {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Categoría</label>
                  <select name="categoriaId" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none">
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Canal de Origen</label>
                  <select name="canal" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none">
                    {CANALES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Estado</label>
                  <select name="status" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none">
                    {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full mt-4 bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-rose-900/20"
              >
                {isSubmitting ? "Registrando..." : (
                  <>
                    <Send size={18} />
                    Guardar Lead
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
