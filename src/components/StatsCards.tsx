import React from 'react';
import { Users, TrendingUp, DollarSign, Zap } from 'lucide-react';

export function StatsCards({ leads, inversiones = [] }: { leads: any[], inversiones?: any[] }) {
  const totalLeads = leads.length;
  const ventasLeads = leads.filter(l => l.status === 'Venta');
  const ventasCount = ventasLeads.length;
  const conversionRate = totalLeads > 0 ? ((ventasCount / totalLeads) * 100).toFixed(1) : '0.0';
  
  const totalVentasMonto = ventasLeads.reduce((acc, l) => acc + (l.monto_cierre || 0), 0);
  const avgTicket = ventasCount > 0 ? (totalVentasMonto / ventasCount).toFixed(0) : '0';

  // ROI/Rendimiento
  const totalInversion = inversiones.reduce((acc, inv) => acc + (inv.monto || 0), 0);
  const roi = totalInversion > 0 ? (totalVentasMonto / totalInversion).toFixed(1) : '--';

  const stats = [
    { label: 'Total Leads', value: totalLeads.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Inversión Total', value: `$${totalInversion.toLocaleString()}`, icon: DollarSign, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Costo por Lead', value: totalLeads > 0 ? `$${(totalInversion / totalLeads).toFixed(0)}` : '$0', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Conversión', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-[#afca0b]', bg: 'bg-[#afca0b]/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 pt-6">
      {stats.map((stat) => (
        <div key={stat.label} className="premium-card group hover:border-zinc-700 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
            </div>
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className={`text-xs font-medium text-[#afca0b]`}>
              Tiempo real
            </span>
            <span className="text-zinc-600 text-xs">actualizado hoy</span>
          </div>
        </div>
      ))}
    </div>
  );
}
