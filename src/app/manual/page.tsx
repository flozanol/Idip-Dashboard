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
  Settings,
  PieChart
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { FilterBar } from '@/components/FilterBar';
import { MobileHeader } from '@/components/MobileHeader';
import { useState } from 'react';

export default function ManualPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sections = [
    {
      title: "1. Roles y Seguridad (RBAC)",
      icon: Settings,
      color: "text-[#98C222]",
      bg: "bg-[#98C222]/10",
      content: "IDIP Dashboard utiliza Control de Acceso Basado en Roles. Los Directores gestionan usuarios, los Gerentes supervisan su sede y los Vendedores administran sus propios leads.",
      tips: [
        "El Director puede crear usuarios y resetear contraseñas.",
        "Cambia tu contraseña periódicamente desde Configuración.",
        "Los Gerentes solo ven datos de su sede asignada."
      ]
    },
    {
      title: "2. Gestión de Leads y Embudo",
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      content: "El corazón del sistema. Registra prospectos, edita su estatus ('Nuevo', 'Contactado', 'Cierre', 'Venta') y monitorea los intentos de contacto.",
      tips: [
        "Leads con +4 intentos sin venta aparecen como Alertas de Pérdida.",
        "Ingresa el 'Monto de Cierre' solo cuando el estatus sea 'Venta'.",
        "Usa el botón de edición para actualizar información del prospecto."
      ]
    },
    {
      title: "3. Metas Históricas y Planeación",
      icon: TrendingUp,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      content: "Solo Directores: Define metas mensuales de leads, ventas y presupuesto por sede para habilitar indicadores de rendimiento.",
      tips: [
        "Configura las metas al inicio de cada mes.",
        "Si falta una meta, verás un banner preventivo en el Dashboard.",
        "El sistema guarda el histórico para comparativas anuales."
      ]
    },
    {
      title: "4. Dashboards Senior BI",
      icon: Zap,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      content: "Indicadores tipo 'semáforo' con efecto glow: Velocidad de Venta (Ventas vs Meta), Salud del Embudo (% Conversión) y Eficiencia de Gasto (ROI).",
      tips: [
        "Verde (>90%): Operación saludable.",
        "Amarillo (70-89%): Atención requerida.",
        "Rojo (<70%): Acción correctiva inmediata."
      ]
    },
    {
      title: "5. Radiografía IDIP (Reportes)",
      icon: BookOpen,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      content: "Genera reportes ejecutivos en PDF ('Radiografía IDIP') con veredicto directivo, gráficas de Planeado vs Real y detección de fugas de dinero.",
      tips: [
        "Usa el botón 'Reporte Mensual' en el Dashboard.",
        "Detecta leads 'stale' (>48h sin atención) automáticamente.",
        "Visualiza el 'Mix de Producto' por monto de venta."
      ]
    },
    {
      title: "6. Métricas de Marketing",
      icon: PieChart,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      content: "Monitorea el crecimiento de redes sociales (FB, IG, YT, TT, Pinterest) y ratings de Google por sede y mes.",
      tips: [
        "Actualiza métricas mensualmente para ver la tendencia de crecimiento.",
        "Compara el G-Rating entre Polanco y Querétaro.",
        "Cruza el crecimiento de fans con el volumen de leads por canal."
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-black overflow-hidden text-white relative">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <MobileHeader onOpenMenu={() => setIsSidebarOpen(true)} />
        <FilterBar />
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#98C222]/10 border border-[#98C222]/20 text-[#98C222] text-xs font-bold uppercase tracking-widest">
                <BookOpen size={14} />
                Manual Senior BI
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">Ecosistema IDIP Marketing Pulse</h1>
              <p className="text-zinc-500 text-lg">Guía técnica y operativa para la toma de decisiones basada en datos.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section) => (
                <div key={section.title} className="premium-card space-y-4 flex flex-col">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${section.bg} ${section.color}`}>
                      <section.icon size={20} />
                    </div>
                    <h3 className="text-sm font-bold">{section.title}</h3>
                  </div>
                  <p className="text-zinc-500 leading-relaxed text-[11px] flex-1">
                    {section.content}
                  </p>
                  <div className="space-y-2 pt-2 border-t border-zinc-800/50">
                    {section.tips.slice(0, 3).map((tip, i) => (
                      <div key={i} className="flex gap-2">
                        <CheckCircle2 size={12} className="text-[#98C222] shrink-0 mt-0.5" />
                        <span className="text-[10px] text-zinc-400 italic leading-tight">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="premium-card bg-zinc-900 border-zinc-800 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#98C222]/5 blur-3xl -mr-16 -mt-16" />
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2 text-[#98C222]">
                    <Lightbulb size={24} />
                    <h3 className="text-xl font-bold">Lógica de Insights (IA)</h3>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    El sistema no solo muestra datos, los interpreta. Si un canal tiene un <strong>ROI</strong> bajo o hay <strong>fugas de dinero</strong> (leads ignorados), el reporte lo señalará automáticamente en la sección de veredicto. Usa esta información para reasignar presupuesto de campañas ineficientes hacia las de mayor conversión.
                  </p>
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
