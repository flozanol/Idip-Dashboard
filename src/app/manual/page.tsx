'use client'

import React from 'react';
import { 
  BookOpen, 
  Target, 
  MousePointerClick, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  Zap,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { FilterBar } from '@/components/FilterBar';

export default function ManualPage() {
  const sections = [
    {
      title: "1. Captura de Leads",
      icon: Target,
      color: "text-[#98C222]",
      bg: "bg-[#98C222]/10",
      content: "La captura es la base de todo. Usa el botón '+' flotante para registrar prospectos, especificando el curso, vendedor y monto de venta.",
      tips: [
        "Ingresa el monto de la venta para que el Ticket Promedio sea real.",
        "Asigna un vendedor para llevar el control de comisiones o desempeño.",
        "Selecciona el curso específico para el que aplica el lead."
      ]
    },
    {
      title: "2. Rendimiento (ROI)",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      content: "Conoce el retorno de inversión real. El sistema cruza tus ventas logradas con lo que invertiste en publicidad.",
      tips: [
        "Actualiza tus inversiones mensuales en la sección correspondiente.",
        "Un ROI mayor a 1 indica que estás recuperando lo invertido.",
        "Compara el rendimiento entre canales para optimizar tu gasto."
      ]
    },
    {
      title: "3. Inversiones por Canal",
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      content: "Registra cuánto inviertes al mes en Google, Facebook, etc. para obtener métricas de rentabilidad precisas.",
      tips: [
        "Hazlo una vez al mes o actualiza si aumentó el presupuesto.",
        "Elige el mes y año correctamente antes de guardar.",
        "Usa el botón de guardado individual por canal."
      ]
    },
    {
      title: "4. Catálogos y Filtros",
      icon: Settings,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      content: "Mantén tus catálogos de Cursos y Vendedores actualizados desde la sección de Configuración.",
      tips: [
        "Da de alta cursos nuevos antes de empezar su campaña.",
        "Borra vendedores que ya no estén activos para limpiar el formulario.",
        "Usa los filtros del Dashboard para segmentar por periodos."
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-black overflow-hidden text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <FilterBar />
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#98C222]/10 border border-[#98C222]/20 text-[#98C222] text-xs font-bold uppercase tracking-widest">
                <BookOpen size={14} />
                Guía de Usuario
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">Cómo explotar IDIP Marketing Pulse al máximo</h1>
              <p className="text-zinc-500 text-lg">Esta guía te ayudará a convertir datos en decisiones estratégicas para la escuela.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((section) => (
                <div key={section.title} className="premium-card space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${section.bg} ${section.color}`}>
                      <section.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold">{section.title}</h3>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-sm">
                    {section.content}
                  </p>
                  <div className="space-y-3">
                    {section.tips.map((tip, i) => (
                      <div key={i} className="flex gap-3 bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50">
                        <CheckCircle2 size={16} className="text-[#98C222] shrink-0 mt-0.5" />
                        <span className="text-xs text-zinc-500 italic">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="premium-card bg-gradient-to-br from-[#98C222]/20 to-transparent border-[#98C222]/20">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2 text-[#98C222]">
                    <Lightbulb size={24} />
                    <h3 className="text-xl font-bold">Pro Tip: Los Canales</h3>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    Si notas que el canal <strong>'TikTok'</strong> tiene muchos leads pero 0 ventas, podrías estar atrayendo a la audiencia equivocada. Compara esto con <strong>'Recomendados'</strong>, que suele tener una conversión mucho más alta. Ajusta tu presupuesto basándote en el <strong>Mix de Canales</strong>.
                  </p>
                </div>
                <div className="w-full md:w-64 h-40 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
                   <Zap size={48} className="text-[#98C222] animate-pulse" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Enfoque Estratégico</span>
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}} />
    </div>
  );
}
