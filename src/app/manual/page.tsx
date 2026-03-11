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
  CheckCircle2
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
      content: "La captura es la base de todo. Usa el botón '+' flotante en la esquina inferior derecha para abrir el formulario rápido.",
      tips: [
        "Selecciona la fecha correcta si estás subiendo información de días anteriores.",
        "Elige el canal adecuado para que el 'Mix de Canales' sea preciso.",
        "Los 'Recomendados' se marcan automáticamente como VIP."
      ]
    },
    {
      title: "2. Gestión de Fases",
      icon: MousePointerClick,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      content: "Ahora puedes cambiar el estado de un lead directamente desde la tabla de Leads sin recargar la página.",
      tips: [
        "Nuevo: Prospecto recién ingresado.",
        "Contactado: Ya hubo una primera interacción.",
        "Seguimiento: Interés activo, proceso de venta.",
        "Venta/Perdido: Cierre del ciclo."
      ]
    },
    {
      title: "3. Interpretación del Dashboard",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      content: "El dashboard te da la temperatura del negocio en tiempo real. Fíjate en el Embudo de Conversión.",
      tips: [
        "Un embudo muy 'ancho' arriba y muy 'estrecho' abajo indica problemas en el seguimiento.",
        "El Ticket Promedio te ayuda a ver si estás vendiendo certificaciones de alto valor."
      ]
    },
    {
      title: "4. Alertas de Pérdida",
      icon: AlertTriangle,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      content: "El sistema detecta automáticamente leads en riesgo. Si un lead tiene más de 4 intentos aparecerá aquí.",
      tips: [
        "No dejes que el widget de alertas se llene: contacta a esos leads o cámbialos a 'Perdido'.",
        "Atención inmediata a prospectos de alta prioridad."
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
      
      <style dangerouslySetInnerHTML={{ __html: \`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      \`}} />
    </div>
  );
}
