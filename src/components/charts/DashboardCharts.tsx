'use client'

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export function FunnelChart({ leads }: { leads: any[] }) {
  const stages = [
    { name: 'Nuevo', value: leads.filter(l => l.status === 'Nuevo').length, color: '#afca0b', icon: '🎯' },
    { name: 'Contactado', value: leads.filter(l => l.status === 'Contactado').length, color: '#00adbb', icon: '📞' },
    { name: 'Seguimiento', value: leads.filter(l => l.status === 'Seguimiento').length, color: '#e91e63', icon: '📝' },
    { name: 'Venta', value: leads.filter(l => l.status === 'Venta').length, color: '#ff5722', icon: '💰' },
  ];

  const total = stages[0].value || 1;

  return (
    <div className="relative w-full h-[320px] flex flex-col justify-center py-4">
      <div className="flex-1 flex flex-col gap-2">
        {stages.map((stage, index) => {
          // Calculate width based on a funnel shape (tapering down)
          const baseWidth = 100 - (index * 15);
          const percentage = ((stage.value / total) * 100).toFixed(0);
          
          return (
            <div key={stage.name} className="relative group">
              <div className="flex items-center justify-between mb-1 px-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                  <span>{stage.icon}</span> {stage.name}
                </span>
                <span className="text-[10px] font-bold text-white bg-zinc-800 px-2 py-0.5 rounded-full">
                  {stage.value} leads ({percentage}%)
                </span>
              </div>
              
              <div 
                className="h-12 relative transition-all duration-500 ease-out flex items-center"
                style={{ 
                  width: `${baseWidth}%`,
                  margin: '0 auto',
                }}
              >
                {/* The Funnel Segment */}
                <div 
                  className="absolute inset-0 rounded-lg shadow-lg overflow-hidden group-hover:brightness-110 transition-all border border-white/5"
                  style={{ 
                    backgroundColor: stage.color,
                    clipPath: `polygon(${index * 5}% 0%, ${100 - (index * 5)}% 0%, ${100 - ((index + 1) * 5)}% 100%, ${(index + 1) * 5}% 100%)`,
                    opacity: 0.9,
                    boxShadow: `0 4px 20px -5px ${stage.color}40`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/10" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChannelMixChart({ leads }: { leads: any[] }) {
  const channels = ['Google', 'TikTok', 'Instagram', 'Facebook', 'YouTube', 'Alumnos', 'Exalumnos', 'Recomendados', 'Teléfono', 'Piso', 'WhatsApp'];
  
  const channelData = channels.map(channel => ({
    name: channel,
    value: leads.filter(l => l.canal_origen === channel).length
  })).filter(d => d.value > 0);

  const COLORS = ['#afca0b', '#00adbb', '#e91e63', '#ff5722', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#06b6d4', '#84cc16'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={channelData.length > 0 ? channelData : [{ name: 'Sin datos', value: 1 }]}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {channelData.length > 0 ? channelData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          )) : <Cell key="empty" fill="#27272a" />}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#18181b', 
            border: '1px solid #3f3f46', 
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'
          }}
          labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '4px' }}
          itemStyle={{ color: '#afca0b', fontWeight: '800' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
