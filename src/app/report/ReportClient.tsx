'use client'

import React, { useEffect, useMemo } from 'react';
import { getVerdict, generateStrategicInsights } from '@/lib/insights';
import { 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  BarChart3, 
  PieChart, 
  Clock, 
  CheckCircle2,
  Download,
  Printer,
  ChevronLeft
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';

export default function ReportClient({ data }: { data: any }) {
  const { leads, sedes, categorias, objetivos } = data;
  const now = new Date();
  const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(now);

  const verdict = getVerdict(data);
  const insights = generateStrategicInsights(data);

  // Planeado vs Real Data
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  const chartData = useMemo(() => {
    return sedes.map((sede: any) => {
      const obj = objetivos.find((o: any) => o.sede_id === sede.id && o.mes === currentMonth && o.anio === currentYear);
      const sedeLeads = leads.filter((l: any) => 
        l.sede_id === sede.id && 
        new Date(l.fecha_registro).getMonth() + 1 === currentMonth && 
        new Date(l.fecha_registro).getFullYear() === currentYear
      );
      const sedeSales = sedeLeads.filter((l: any) => l.status === 'Venta');
      const actualSales = sedeSales.reduce((acc: number, l: any) => acc + (l.monto_cierre || 0), 0);

      return {
        name: sede.nombre,
        Planeado: obj?.meta_ventas || 0,
        Real: actualSales
      };
    });
  }, [sedes, objetivos, leads, currentMonth, currentYear]);

  // Fugas de Dinero
  const staleLeads = leads.filter((l: any) => {
    if (l.status !== 'Nuevo') return false;
    const regDate = new Date(l.fecha_registro);
    const diffHours = (now.getTime() - regDate.getTime()) / (1000 * 60 * 60);
    return diffHours > 48;
  }).slice(0, 10);

  // Mix de Producto
  const productMix = useMemo(() => {
    return categorias.map((cat: any) => {
      const catSales = leads.filter((l: any) => l.categoria_id === cat.id && l.status === 'Venta');
      const totalMonto = catSales.reduce((acc: number, l: any) => acc + (l.monto_cierre || 0), 0);
      return {
        name: cat.nombre,
        value: totalMonto
      };
    }).filter((item: any) => item.value > 0);
  }, [categorias, leads]);

  const COLORS = ['#98C222', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans print:bg-white pb-20">
      {/* Navbar for screen only */}
      <nav className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between print:hidden">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors"
        >
          <ChevronLeft size={18} />
          <span className="font-bold">Volver al Dashboard</span>
        </button>
        <div className="flex gap-4">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#98C222] hover:bg-[#86ad1e] text-black px-6 py-2 rounded-xl font-bold transition-all shadow-lg"
          >
            <Printer size={18} />
            Imprimir / Exportar PDF
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-12 bg-white mt-8 shadow-2xl print:shadow-none print:mt-0 print:max-w-full">
        {/* Header / Branding */}
        <header className="flex justify-between items-start border-b-4 border-[#98C222] pb-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-[#98C222] font-black text-2xl">ID</div>
              <h1 className="text-4xl font-black tracking-tight uppercase italic">Radiografía IDIP</h1>
            </div>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Reporte Ejecutivo de Desempeño</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-[#98C222] capitalize">{monthName}</h2>
            <p className="text-zinc-500 text-sm font-medium mt-1">Generado el {new Date().toLocaleDateString('es-ES')}</p>
          </div>
        </header>

        {/* Sección 1: Veredicto Directivo */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-black text-white">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Sección 1: Veredicto Directivo</h3>
          </div>
          <div className="p-8 rounded-3xl bg-zinc-900 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#98C222]/10 blur-3xl -mr-32 -mt-32" />
            <p className="text-3xl font-black leading-tight relative z-10 italic">
              "{verdict}"
            </p>
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {insights.map((insight, idx) => (
                <div key={idx} className="flex gap-3 text-zinc-400">
                  <Target size={18} className="text-[#98C222] shrink-0" />
                  <p className="text-sm font-medium leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección 2: Planeado vs Real */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-black text-white">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Sección 2: Planeado vs Real ($)</h3>
          </div>
          <div className="h-[400px] w-full bg-zinc-50 rounded-3xl p-8 border border-zinc-200">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a' }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="Planeado" fill="#e4e4e7" radius={[5, 5, 0, 0]} barSize={40} />
                <Bar dataKey="Real" fill="#98C222" radius={[5, 5, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Sección 3: Fugas de Dinero */}
        <section className="mb-12 page-break-before">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-rose-500 text-white">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Sección 3: Fugas de Dinero (Atención Prioritaria)</h3>
          </div>
          <div className="rounded-3xl border-2 border-rose-500/20 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-rose-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-rose-900 border-b border-rose-200">Prospecto</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-rose-900 border-b border-rose-200">Antigüedad</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-rose-900 border-b border-rose-200">Teléfono</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-rose-900 border-b border-rose-200 text-right">Estatus</th>
                </tr>
              </thead>
              <tbody>
                {staleLeads.map((lead: any) => {
                  const hours = Math.floor((now.getTime() - new Date(lead.fecha_registro).getTime()) / (1000 * 60 * 60));
                  return (
                    <tr key={lead.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-sm">{lead.nombre_prospecto}</td>
                      <td className="px-6 py-4 text-sm font-medium text-rose-600 flex items-center gap-2">
                        <Clock size={14} />
                        {hours} horas
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500 font-medium">{lead.telefono || 'Sin datos'}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-3 py-1 bg-zinc-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Atención Pendiente</span>
                      </td>
                    </tr>
                  );
                })}
                {staleLeads.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 font-medium italic">No se detectaron fugas de dinero críticas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-zinc-400 italic font-medium">Muestra los primeros 10 leads en estatus 'Nuevo' con más de 48 horas sin actualización.</p>
        </section>

        {/* Sección 4: Mix de Producto */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-black text-white">
              <PieChart size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Sección 4: Mix de Producto (Ventas $)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-zinc-50 rounded-3xl p-8 border border-zinc-200">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={productMix}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {productMix.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {productMix.map((item: any, index: number) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm font-bold text-zinc-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-zinc-900">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-20 pt-8 border-t border-zinc-200 text-center">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Confidencial - Propiedad de IDIP Academy</p>
          <div className="mt-4 flex justify-center gap-8">
             <div className="w-32 h-1 bg-zinc-900" />
             <div className="w-32 h-1 bg-zinc-900" />
          </div>
          <div className="mt-2 flex justify-center gap-[104px] text-[8px] font-black uppercase text-zinc-400 tracking-tighter">
             <span>Director de Sede</span>
             <span>Finanzas Global</span>
          </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .page-break-before { page-break-before: always; }
          @page { margin: 2cm; }
        }
      `}} />
    </div>
  );
}
