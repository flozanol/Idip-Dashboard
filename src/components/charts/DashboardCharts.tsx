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
  const funnelData = [
    { name: 'Nuevo', value: leads.filter(l => l.status === 'Nuevo').length, fill: '#3b82f6' },
    { name: 'Contactado', value: leads.filter(l => l.status === 'Contactado').length, fill: '#6366f1' },
    { name: 'Seguimiento', value: leads.filter(l => l.status === 'Seguimiento').length, fill: '#8b5cf6' },
    { name: 'Venta', value: leads.filter(l => l.status === 'Venta').length, fill: '#10b981' },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        layout="vertical"
        data={funnelData}
        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#a1a1aa', fontSize: 12 }}
        />
        <Tooltip 
          cursor={{ fill: '#27272a' }}
          contentStyle={{ 
            backgroundColor: '#18181b', 
            border: '1px solid #3f3f46', 
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'
          }}
          labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '4px' }}
          itemStyle={{ color: '#98C222', fontWeight: '800' }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
          {funnelData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ChannelMixChart({ leads }: { leads: any[] }) {
  const channels = ['Google', 'TikTok', 'Instagram', 'Facebook', 'YouTube', 'Alumnos', 'Exalumnos', 'Recomendados', 'Teléfono', 'Piso', 'WhatsApp'];
  
  const channelData = channels.map(channel => ({
    name: channel,
    value: leads.filter(l => l.canal_origen === channel).length
  })).filter(d => d.value > 0);

  const COLORS = ['#98C222', '#e11d48', '#3b82f6', '#6366f1', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#06b6d4', '#84cc16'];

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
          itemStyle={{ color: '#98C222', fontWeight: '800' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
