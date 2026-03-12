'use client'

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { FilterBar } from '@/components/FilterBar';
import { Plus, Trash2, GraduationCap, UserCheck, Settings as SettingsIcon } from 'lucide-react';
import { addCourse, deleteCourse, addVendor, deleteVendor } from '@/lib/actions';
import { MobileHeader } from '@/components/MobileHeader';

export default function SettingsPage({ 
  cursos = [], 
  vendedores = [],
  currentUser
}: { 
  cursos: any[], 
  vendedores: any[],
  currentUser?: any
}) {
  const [newCourse, setNewCourse] = useState('');
  const [newVendor, setNewVendor] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.trim()) return;
    await addCourse(newCourse);
    setNewCourse('');
  };

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.trim()) return;
    await addVendor(newVendor);
    setNewVendor('');
  };

  return (
    <div className="flex min-h-screen bg-black overflow-hidden text-white relative">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentUser={currentUser} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <MobileHeader onOpenMenu={() => setIsSidebarOpen(true)} currentUser={currentUser} />
        <FilterBar />
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#98C222]/10 border border-[#98C222]/20 text-[#98C222] text-xs font-bold uppercase tracking-widest">
                <SettingsIcon size={14} />
                Gestión
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">Configuración del Sistema</h1>
              <p className="text-zinc-500 text-lg">Administra los catálogos de cursos y vendedores para la captura de leads.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cursos Management */}
              <div className="premium-card space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#98C222]/10 text-[#98C222]">
                    <GraduationCap size={20} />
                  </div>
                  <h3 className="text-xl font-bold">Cursos</h3>
                </div>

                <form onSubmit={handleAddCourse} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    placeholder="Nombre del curso..." 
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-[#98C222]/50 outline-none transition-colors"
                  />
                  <button type="submit" className="bg-[#98C222] hover:bg-[#86ad1e] text-black p-2 rounded-lg transition-colors">
                    <Plus size={20} />
                  </button>
                </form>

                <div className="space-y-2">
                  {cursos.map((curso) => (
                    <div key={curso.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 group transition-colors hover:border-zinc-700">
                      <span className="text-zinc-300 text-sm font-medium">{curso.nombre}</span>
                      <button 
                        onClick={() => deleteCourse(curso.id)}
                        className="text-zinc-600 hover:text-rose-500 p-1 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {cursos.length === 0 && (
                    <p className="text-center py-4 text-zinc-600 text-xs italic">No hay cursos registrados</p>
                  )}
                </div>
              </div>

              {/* Vendedores Management */}
              <div className="premium-card space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                    <UserCheck size={20} />
                  </div>
                  <h3 className="text-xl font-bold">Vendedores</h3>
                </div>

                <form onSubmit={handleAddVendor} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    placeholder="Nombre del vendedor..." 
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500/50 outline-none transition-colors"
                  />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors">
                    <Plus size={20} />
                  </button>
                </form>

                <div className="space-y-2">
                  {vendedores.map((vendedor) => (
                    <div key={vendedor.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 group transition-colors hover:border-zinc-700">
                      <span className="text-zinc-300 text-sm font-medium">{vendedor.nombre}</span>
                      <button 
                        onClick={() => deleteVendor(vendedor.id)}
                        className="text-zinc-600 hover:text-rose-500 p-1 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {vendedores.length === 0 && (
                    <p className="text-center py-4 text-zinc-600 text-xs italic">No hay vendedores registrados</p>
                  )}
                </div>
              </div>
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
