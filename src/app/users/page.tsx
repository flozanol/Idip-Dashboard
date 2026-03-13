'use client'

import React, { useState, useEffect } from 'react';
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { createUser, getAllUsers, updateUserRole, resetUserPasswordByAdmin, deleteUser } from '@/lib/actions';
import { UserPlus, Shield, Mail, Lock, MapPin, Loader2, Users, Edit2, Trash2, Key, X, Check } from 'lucide-react';

export default function UsersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [resettingPasswordUser, setResettingPasswordUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    async function fetchData() {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
        const session = await fetch('/api/auth/session').then(res => res.json()).catch(() => null);
        setCurrentUser(session?.user);
    }
    fetchData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createUser(formData);
    if (result.success) {
      e.currentTarget.reset();
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers);
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const handleUpdateRole = async (userId: number, rol: string, sedeId: any) => {
    setLoading(true);
    const result = await updateUserRole(userId, rol, sedeId ? parseInt(sedeId) : null);
    if (result.success) {
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers);
      setEditingUser(null);
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingPasswordUser || !newPassword) return;
    setLoading(true);
    const result = await resetUserPasswordByAdmin(resettingPasswordUser.id, newPassword);
    if (result.success) {
      alert(`Contraseña de ${resettingPasswordUser.nombre} actualizada correctamente.`);
      setResettingPasswordUser(null);
      setNewPassword('');
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
    setLoading(true);
    const result = await deleteUser(userId);
    if (result.success) {
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers);
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-black overflow-hidden relative">
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsSidebarOpen(false)} />
      )}
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentUser={currentUser} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden text-white">
        <MobileHeader onOpenMenu={() => setIsSidebarOpen(true)} currentUser={currentUser} />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <header>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#afca0b]/10 border border-[#afca0b]/20 text-[#afca0b] text-xs font-bold uppercase tracking-widest mb-4">
                <Shield size={14} />
                Administración
              </div>
              <h1 className="text-4xl font-black tracking-tight">Gestión de Usuarios</h1>
              <p className="text-zinc-500">Crea y administra los accesos para Directores, Gerentes y Vendedores.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulario */}
              <div className="lg:col-span-1">
                <div className="premium-card sticky top-6">
                  {editingUser ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                            <Edit2 size={20} />
                          </div>
                          <h3 className="text-xl font-bold">Editar Usuario</h3>
                        </div>
                        <button onClick={() => setEditingUser(null)} className="text-zinc-500 hover:text-white">
                          <X size={20} />
                        </button>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                        <p className="text-xs text-zinc-500 mb-1">Usuario</p>
                        <p className="font-bold">{editingUser.nombre}</p>
                        <p className="text-xs text-zinc-500">{editingUser.email}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Rol</label>
                          <select 
                            value={editingUser.rol}
                            onChange={(e) => setEditingUser({...editingUser, rol: e.target.value})}
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#afca0b]/50"
                          >
                            <option value="Vendedor">Vendedor</option>
                            <option value="Gerente">Gerente</option>
                            <option value="Director">Director</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Sede (Opcional)</label>
                          <select 
                            value={editingUser.sede_id || ''}
                            onChange={(e) => setEditingUser({...editingUser, sede_id: e.target.value})}
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#afca0b]/50"
                          >
                            <option value="">Ninguna / Global</option>
                            <option value="1">Polanco</option>
                            <option value="2">Querétaro</option>
                            <option value="3">Online</option>
                            <option value="4">On-Demand</option>
                          </select>
                        </div>
                        <button 
                          onClick={() => handleUpdateRole(editingUser.id, editingUser.rol, editingUser.sede_id)}
                          disabled={loading} 
                          className="w-full py-3 bg-[#afca0b] hover:bg-[#c5e112] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          {loading ? <Loader2 className="animate-spin" /> : <><Check size={18} /> Guardar Cambios</>}
                        </button>
                      </div>
                    </div>
                  ) : resettingPasswordUser ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                            <Key size={20} />
                          </div>
                          <h3 className="text-xl font-bold">Reset Password</h3>
                        </div>
                        <button onClick={() => setResettingPasswordUser(null)} className="text-zinc-500 hover:text-white">
                          <X size={20} />
                        </button>
                      </div>

                      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                        <p className="text-xs text-zinc-500 mb-1">Reseteando contraseña para</p>
                        <p className="font-bold">{resettingPasswordUser.nombre}</p>
                      </div>

                      <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                          <input 
                            type="password" 
                            required 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" 
                          />
                        </div>
                        <button 
                          disabled={loading || newPassword.length < 6} 
                          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? <Loader2 className="animate-spin" /> : "Actualizar Contraseña"}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-[#afca0b]/10 text-[#afca0b]">
                          <UserPlus size={20} />
                        </div>
                        <h3 className="text-xl font-bold">Nuevo Usuario</h3>
                      </div>

                      <form onSubmit={handleCreateUser} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Nombre</label>
                          <input name="nombre" required className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#afca0b]/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email</label>
                          <input name="email" type="email" required className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#afca0b]/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
                          <input name="password" type="password" required className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#afca0b]/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Rol</label>
                          <select name="rol" required className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#afca0b]/50">
                            <option value="Vendedor">Vendedor</option>
                            <option value="Gerente">Gerente</option>
                            <option value="Director">Director</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Sede (Opcional)</label>
                          <select name="sedeId" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#afca0b]/50">
                            <option value="">Ninguna / Global</option>
                            <option value="1">Polanco</option>
                            <option value="2">Querétaro</option>
                            <option value="3">Online</option>
                            <option value="4">On-Demand</option>
                          </select>
                        </div>
                        <button disabled={loading} className="w-full py-3 mt-4 bg-[#afca0b] hover:bg-[#c5e112] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                          {loading ? <Loader2 className="animate-spin" /> : "Crear Usuario"}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>

              {/* Lista */}
              <div className="lg:col-span-2">
                <div className="premium-card">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                      <Users size={20} />
                    </div>
                    <h3 className="text-xl font-bold">Usuarios Registrados</h3>
                  </div>

                  <div className="space-y-3">
                    {users.map((u) => (
                      <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center border border-zinc-700">
                             <span className="text-sm font-bold">{u.nombre.charAt(0)}</span>
                          </div>
                          <div>
                            <h5 className="font-bold text-sm tracking-tight">{u.nombre}</h5>
                            <p className="text-xs text-zinc-500">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-6 justify-between sm:justify-end">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${
                            u.rol === 'Director' ? 'bg-rose-500/10 text-rose-500' : 
                            u.rol === 'Gerente' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            {u.rol}
                          </span>
                          
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => { setEditingUser(u); setResettingPasswordUser(null); }}
                              className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                              title="Editar Rol"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => { setResettingPasswordUser(u); setEditingUser(null); }}
                              className="p-2 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"
                              title="Resetear Password"
                            >
                              <Key size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                              title="Eliminar Usuario"
                              disabled={currentUser?.id === u.id}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
      `}} />
    </div>
  );
}
