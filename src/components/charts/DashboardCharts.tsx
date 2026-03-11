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

const funnelData = [
  { name: 'Nuevo', value: 400, fill: '#3b82f6' },
  { name: 'Contactado', value: 300, fill: '#6366f1' },
  { name: 'Seguimiento', value: 200, fill: '#8b5cf6' },
  { name: 'Venta', value: 100, fill: '#10b981' },
];

const channelData = [
  { name: 'Google', value: 40 },
  { name: 'TikTok', value: 30 },
  { name: 'Instagram', value: 20 },
  { name: 'Facebook', value: 10 },
];

const COLORS = ['#e11d48', '#f43f5e', '#fb7185', '#fda4af'];

export function FunnelChart() {
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

export function ChannelMixChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={channelData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {channelData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
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
