'use client'

import React, { useState, useEffect } from 'react';
import { Plus, X, Send, Edit2 } from 'lucide-react';
import { createLead, updateLead } from '@/lib/actions';

const CANALES = ['Google', 'TikTok', 'Instagram', 'Facebook', 'YouTube', 'Alumnos', 'Exalumnos', 'Recomendados', 'Teléfono', 'Piso', 'WhatsApp'];
const ESTADOS = ['Nuevo', 'Contactado', 'Seguimiento', 'Venta', 'Perdido'];

export function LeadForm({ 
  sedes, 
  categorias, 
  cursos, 
  vendedores,
  editData = null,
  onClose = () => {}
}: { 
  sedes: any[], 
  categorias: any[], 
  cursos: any[], 
  vendedores: any[],
  editData?: any,
  onClose?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setIsOpen(true);
    }
  }, [editData]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const result = editData 
      ? await updateLead(editData.id, formData)
      : await createLead(formData);

    if (result.success) {
      handleClose();
    }
    setIsSubmitting(false);
  }

  return (
    <>
      {!editData && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 bg-rose-600 hover:bg-rose-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-rose-900/40 hover:scale-110 active:scale-95 transition-all group"
        >
          <Plus size={28} className={isOpen ? "rotate-45" : "group-hover:rotate-90 transition-transform duration-300"} />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h3 className="text-lg font-bold">{editData ? 'Editar Lead' : 'Registro Rápido de Lead'}</h3>
              <button onClick={handleClose} className="text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Nombre del Prospecto</label>
                  <input required name="nombre" type="text" defaultValue={editData?.nombre_prospecto} placeholder="Ej. Ana García" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-[#98C222]/50 outline-none transition-colors" />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Teléfono</label>
                  <input name="telefono" type="tel" defaultValue={editData?.telefono} placeholder="Ej. 5512345678" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-[#98C222]/50 outline-none transition-colors" />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Email</label>
                  <input name="email" type="email" defaultValue={editData?.email} placeholder="Ej. ana@ejemplo.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-[#98C222]/50 outline-none transition-colors" />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Fecha de Registro</label>
                  <input required name="fecha" type="date" defaultValue={editData?.fecha_registro ? new Date(editData.fecha_registro).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-[#98C222]/50 outline-none transition-colors [color-scheme:dark]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Sede</label>
                  <select name="sedeId" defaultValue={editData?.sede_id} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none">
                    {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Categoría</label>
                  <select name="categoriaId" defaultValue={editData?.categoria_id} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none">
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Curso Específico</label>
                  <select name="cursoId" defaultValue={editData?.curso_id || ""} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none">
                    <option value="">Seleccionar curso...</option>
                    {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Vendedor</label>
                  <select name="vendedorId" defaultValue={editData?.vendedor_id || ""} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none">
                    <option value="">Seleccionar vendedor...</option>
                    {vendedores.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Canal de Origen</label>
                  <select name="canal" defaultValue={editData?.canal_origen} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none">
                    {CANALES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Estado</label>
                  <select name="status" defaultValue={editData?.status} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none">
                    {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Monto de Venta (si aplica)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                  <input name="montoCierre" type="number" step="0.01" defaultValue={editData?.monto_cierre} placeholder="0.00" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-7 pr-3 py-2 text-sm focus:border-[#98C222]/50 outline-none transition-colors" />
                </div>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full mt-4 bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-rose-900/20"
              >
                {isSubmitting ? (editData ? "Actualizando..." : "Registrando...") : (
                  <>
                    {editData ? <Edit2 size={18} /> : <Send size={18} />}
                    {editData ? "Actualizar Lead" : "Guardar Lead"}
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
