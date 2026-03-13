'use client'

import React from 'react';
import { Activity, Droplet, Coins, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TrafficLightProps {
  label: string;
  value: string;
  percentage: number;
  icon: React.ElementType;
  description: string;
}

const Light = ({ label, value, percentage, icon: Icon, description }: TrafficLightProps) => {
  let colorClass = "";
  let glowClass = "";
  let statusLabel = "";

  if (percentage >= 90) {
    colorClass = "text-green-500 border-green-500/20 bg-green-500/5";
    glowClass = "shadow-[0_0_15px_rgba(34,197,94,0.3)]";
    statusLabel = "Excelente";
  } else if (percentage >= 70) {
    colorClass = "text-yellow-500 border-yellow-500/20 bg-yellow-500/5";
    glowClass = "shadow-[0_0_15px_rgba(234,179,8,0.2)]";
    statusLabel = "Estable";
  } else {
    colorClass = "text-red-500 border-red-500/20 bg-red-500/5";
    glowClass = "shadow-[0_0_15px_rgba(239,44,44,0.2)]";
    statusLabel = "Crítico";
  }

  return (
    <div className={cn("premium-card flex flex-col gap-4 border transition-all duration-500", colorClass, glowClass)}>
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-lg bg-current/10">
          <Icon size={18} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{statusLabel}</span>
      </div>
      <div>
        <h3 className="text-3xl font-black tracking-tight">{value}</h3>
        <p className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-60">{label}</p>
      </div>
      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
        <div 
          className="h-full bg-current transition-all duration-1000" 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-[11px] font-medium opacity-80 leading-relaxed">{description}</p>
    </div>
  );
};

export function TrafficLights({ 
  leads = [], 
  objetivos = [] 
}: { 
  leads: any[], 
  objetivos: any[] 
}) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Aggregate goals for current month
  const monthGoals = objetivos.reduce((acc, obj) => {
    acc.metaLeads += obj.meta_leads || 0;
    acc.metaVentas += obj.meta_ventas || 0;
    acc.presupuesto += obj.presupuesto || 0;
    return acc;
  }, { metaLeads: 0, metaVentas: 0, presupuesto: 0 });

  const hasGoals = monthGoals.metaLeads > 0 || monthGoals.metaVentas > 0;

  // Actuals
  const currentMonthLeads = leads.filter(l => {
    const d = new Date(l.fecha_registro);
    return (d.getMonth() + 1) === currentMonth && d.getFullYear() === currentYear;
  });
  
  const salesLeads = currentMonthLeads.filter(l => l.status === 'Venta');
  const actualSalesMonto = salesLeads.reduce((acc, l) => acc + (l.monto_cierre || 0), 0);
  const actualConvRate = currentMonthLeads.length > 0 ? (salesLeads.length / currentMonthLeads.length) * 100 : 0;

  // 1. Velocidad de Venta
  const salesVelocityPct = monthGoals.metaVentas > 0 ? (actualSalesMonto / monthGoals.metaVentas) * 100 : 0;

  // 2. Salud del Embudo (Target 10%)
  const funnelHealthPct = (actualConvRate / 10) * 100;

  // 3. Eficiencia de Gasto (ROI) - Target 5x
  const actualROI = monthGoals.presupuesto > 0 ? actualSalesMonto / monthGoals.presupuesto : 0;
  const roiEfficiencyPct = (actualROI / 5) * 100;

  const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(now);

  return (
    <div className="px-6 space-y-6">
      {!hasGoals && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-pulse">
          <AlertCircle size={18} />
          <p className="text-sm font-bold tracking-tight">
            Pendiente definir objetivos de {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Light 
          label="Velocidad de Venta"
          value={`$${(actualSalesMonto / 1000).toFixed(1)}k`}
          percentage={hasGoals ? salesVelocityPct : 0}
          icon={Activity}
          description={`${salesVelocityPct.toFixed(0)}% de la meta mensual (${(monthGoals.metaVentas / 1000).toFixed(1)}k)`}
        />
        <Light 
          label="Salud del Embudo"
          value={`${actualConvRate.toFixed(1)}%`}
          percentage={funnelHealthPct}
          icon={Droplet}
          description={`Conversión Lead-Venta. Meta recomendada: 10%`}
        />
        <Light 
          label="Eficiencia de Gasto"
          value={`x${actualROI.toFixed(1)}`}
          percentage={roiEfficiencyPct}
          icon={Coins}
          description={`Retorno de inversión (ROI). Target sugerido: x5.0`}
        />
      </div>
    </div>
  );
}
