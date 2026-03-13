'use client'

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { FilterBar } from '@/components/FilterBar';
import { addCourse, deleteCourse, addVendor, deleteVendor, changeUserPassword } from '@/lib/actions';
import { MobileHeader } from '@/components/MobileHeader';
import GoalsManager from './GoalsManager';
import { 
  Plus, 
  Trash2, 
  GraduationCap, 
  UserCheck, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Lock, 
  Loader2, 
  CheckCircle2,
  Target
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SettingsPage({ 
  cursos = [], 
  vendedores = [],
  sedes = [],
  objetivos = [],
  currentUser
}: { 
  cursos: any[], 
  vendedores: any[],
  sedes?: any[],
  objetivos?: any[],
  currentUser?: any
}) {
  const [activeTab, setActiveTab] = useState<'general' | 'metas'>('general');
  const [newCourse, setNewCourse] = useState('');
  const [newVendor, setNewVendor] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const isDirector = currentUser?.rol === 'Director';

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

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordSuccess(false);
    
    const formData = new FormData(e.currentTarget);
    const newPass = formData.get('newPassword') as string;
    const confirmPass = formData.get('confirmPassword') as string;

    if (newPass !== confirmPass) {
      alert("Las contraseñas no coinciden");
      setLoadingPassword(false);
      return;
    }

    if (newPass.length < 6) {
      alert("La nueva contraseña debe tener al menos 6 caracteres");
      setLoadingPassword(false);
      return;
    }

    const result = await changeUserPassword(formData);
    if (result.success) {
      setPasswordSuccess(true);
      e.currentTarget.reset();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } else {
      alert(result.error);
    }
    setLoadingPassword(false);
  };

  return (
    <div className="flex min-h-screen bg-black overflow-hidden text-white relative">
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
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#98C222]/10 border border-[#98C222]/20 text-[#98C222] text-xs font-bold uppercase tracking-widest">
                <SettingsIcon size={14} />
                Gestión
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">Configuración</h1>
              <p className="text-zinc-500 text-lg">Administra los catálogos del sistema y tu seguridad personal.</p>
            </header>

            {isDirector && (
              <div className="flex gap-4 p-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl w-fit">
                <button 
                  onClick={() => setActiveTab('general')}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                    activeTab === 'general' ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"
                  )}
                >
                  <SettingsIcon size={16} /> General
                </button>
                <button 
                  onClick={() => setActiveTab('metas')}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                    activeTab === 'metas' ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"
                  )}
                >
                  <Target size={16} /> Metas Históricas
                </button>
              </div>
            )}

            {activeTab === 'general' ? (
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

                {/* Seguridad - Cambio de Contraseña */}
                <div className="premium-card space-y-6 md:col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
                      <ShieldCheck size={20} />
                    </div>
                    <h3 className="text-xl font-bold">Seguridad</h3>
                  </div>

                  <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Contraseña Actual</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                        <input name="currentPassword" type="password" required className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                        <input name="newPassword" type="password" required className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Confirmar Nueva Contraseña</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                        <input name="confirmPassword" type="password" required className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500/50" />
                      </div>
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                      <button 
                        disabled={loadingPassword}
                        className={cn(
                          "px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2",
                          passwordSuccess ? "bg-green-500 text-white" : "bg-white text-black hover:bg-zinc-200"
                        )}
                      >
                        {loadingPassword ? <Loader2 className="animate-spin" /> : passwordSuccess ? <><CheckCircle2 size={18} /> Actualizada</> : "Actualizar Contraseña"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <GoalsManager sedes={sedes} objetivos={objetivos} />
            )}
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
