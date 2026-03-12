'use client'

import React, { useState } from 'react';
import { setupAdmin } from '@/lib/actions';
import { ShieldAlert, User, Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react';

export default function SetupAdminPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await setupAdmin(formData);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Error creating admin');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="premium-card max-w-md w-full p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-500/10 text-green-500">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-2xl font-bold">Administrador Creado</h1>
          <p className="text-zinc-500 text-sm">El primer usuario Director ha sido creado exitosamente. Ya puedes iniciar sesión.</p>
          <a href="/login" className="block w-full py-3 bg-[#afca0b] text-black font-bold rounded-xl hover:bg-[#c5e112] transition-colors">
            Ir al Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-rose-500/10 text-rose-500 mb-6">
            <ShieldAlert size={48} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Setup Inicial Admin</h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">Ruta Confidencial IDIP</p>
        </div>

        <div className="premium-card p-8 bg-zinc-900/40 backdrop-blur-md border-rose-500/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Nombre Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-rose-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="nombre"
                  required
                  className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                  placeholder="Nombre del Director"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Email Principal</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-rose-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                  placeholder="admin@idip.com.mx"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Contraseña de Acceso</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-rose-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs py-3 px-4 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Inicializar Sistema"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
