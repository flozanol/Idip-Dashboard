'use client'

import React, { useState } from 'react';
import { updateMarketingMetrics } from '@/lib/actions';
import { Save, Facebook, Instagram, Star, Youtube, Music2, Calendar, MapPin } from 'lucide-react';

export function MarketingMetricsForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateMarketingMetrics(formData);

    if (result.success) {
      setMessage({ type: 'success', text: 'Métricas actualizadas correctamente' });
    } else {
      setMessage({ type: 'error', text: 'Error al actualizar las métricas' });
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
            <Calendar size={14} /> Mes
          </label>
          <select 
            name="mes" 
            defaultValue={currentMonth}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#afca0b]/50 transition-all font-medium"
          >
            {months.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
            <Calendar size={14} /> Año
          </label>
          <input 
            type="number" 
            name="anio" 
            defaultValue={currentYear}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#afca0b]/50 transition-all font-medium"
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Polanco Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#afca0b] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-zinc-800">
            <MapPin size={16} /> Ciudad de México (Polanco)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                <Facebook size={12} className="text-blue-500" /> FB Fans
              </label>
              <input type="number" name="fb_fans_polanco" placeholder="0" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#afca0b]/50 transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                <Instagram size={12} className="text-pink-500" /> IG Followers
              </label>
              <input type="number" name="ig_followers_polanco" placeholder="0" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#afca0b]/50 transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                <Star size={12} className="text-yellow-500" /> Google Rating
              </label>
              <input type="number" step="0.1" name="google_rating_polanco" placeholder="0.0" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#afca0b]/50 transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                <Star size={12} className="text-yellow-500" /> Google Reseñas
              </label>
              <input type="number" name="google_reviews_polanco" placeholder="0" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#afca0b]/50 transition-all font-medium" />
            </div>
          </div>
        </div>

        {/* Querétaro Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#afca0b] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-zinc-800">
            <MapPin size={16} /> Querétaro
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                <Facebook size={12} className="text-blue-500" /> FB Fans
              </label>
              <input type="number" name="fb_fans_qro" placeholder="0" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#afca0b]/50 transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                <Instagram size={12} className="text-pink-500" /> IG Followers
              </label>
              <input type="number" name="ig_followers_qro" placeholder="0" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#afca0b]/50 transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                <Star size={12} className="text-yellow-500" /> Google Rating
              </label>
              <input type="number" step="0.1" name="google_rating_qro" placeholder="0.0" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#afca0b]/50 transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                <Star size={12} className="text-yellow-500" /> Google Reseñas
              </label>
              <input type="number" name="google_reviews_qro" placeholder="0" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#afca0b]/50 transition-all font-medium" />
            </div>
          </div>
        </div>

        {/* Global Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Music2 size={16} /> Global / TikTok & YouTube
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                <Youtube size={12} className="text-red-500" /> Youtube Suscritos
              </label>
              <input type="number" name="yt_subscribers" placeholder="0" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#afca0b]/50 transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                <Music2 size={12} /> Tiktok Followers
              </label>
              <input type="number" name="tt_followers" placeholder="0" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#afca0b]/50 transition-all font-medium" />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#afca0b] hover:bg-[#afca0b]/80 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 shadow-lg shadow-[#afca0b]/20"
      >
        <Save size={20} />
        {loading ? 'Guardando...' : 'Guardar Métricas'}
      </button>

      {message && (
        <div className={`p-4 rounded-xl text-center text-sm font-bold ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {message.text}
        </div>
      )}
    </form>
  );
}
