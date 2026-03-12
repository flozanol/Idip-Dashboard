'use client'

import React, { useState } from 'react';
import { loginAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result.success) {
      router.push('/');
      router.refresh();
    } else {
      setError(result.error || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-[#afca0b]/10 text-[#afca0b] mb-6">
            <ShieldCheck size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">IDIP Dashboard</h1>
          <p className="text-zinc-500 uppercase text-[10px] font-bold tracking-[0.2em]">Acceso Restringido • v2.0</p>
        </div>

        <div className="premium-card bg-zinc-900/50 backdrop-blur-xl border-zinc-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Corporativo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-[#afca0b] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-black border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#afca0b]/50 focus:border-[#afca0b]/50 transition-all font-medium"
                  placeholder="ejemplo@idip.com.mx"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-[#afca0b] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full bg-black border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#afca0b]/50 focus:border-[#afca0b]/50 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs py-3 px-4 rounded-xl font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#afca0b] hover:bg-[#c5e112] disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group shadow-lg shadow-[#afca0b]/10"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Iniciar Sesión
                  <ShieldCheck size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-10 text-center text-zinc-600 text-xs">
          &copy; {new Date().getFullYear()} IDIP Dashboard Evolution. <br/> 
          Todos los accesos son monitoreados.
        </p>
      </div>
    </div>
  );
}
