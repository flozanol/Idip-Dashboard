export interface DashboardData {
  leads: any[];
  sedes: any[];
  categorias: any[];
  cursos: any[];
  vendedores: any[];
  inversiones: any[];
  marketingMetrics: any;
  objetivos: any[];
}

export function generateStrategicInsights(data: DashboardData) {
  const insights: string[] = [];
  const { leads, inversiones, objetivos } = data;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // 1. Conversion Rate Analysis
  const totalLeads = leads.length;
  const salesCount = leads.filter(l => l.status === 'Venta').length;
  const convRate = totalLeads > 0 ? (salesCount / totalLeads) * 100 : 0;

  if (convRate < 8) {
    insights.push("La tasa de conversión general está por debajo del benchmark del 10%. Se sugiere revisar el pitch de ventas o la calidad de los leads entrantes.");
  } else if (convRate > 15) {
    insights.push("Excelente tasa de conversión. El equipo de ventas está cerrando con alta eficiencia; considera aumentar el volumen de leads.");
  }

  // 2. Channel Performance (ROI)
  const channelSales = leads.filter(l => l.status === 'Venta').reduce((acc, l) => {
    acc[l.canal_origen] = (acc[l.canal_origen] || 0) + (l.monto_cierre || 0);
    return acc;
  }, {} as Record<string, number>);

  const channelLeads = leads.reduce((acc, l) => {
    acc[l.canal_origen] = (acc[l.canal_origen] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Find lowest performing channel (highest cost per lead / lowest conversion)
  // Since we don't have per-channel investment breakdown in the current schema (just total investments),
  // we can look at conversion per channel.
  let worstChannel = "";
  let lowestConv = 100;

  Object.keys(channelLeads).forEach(channel => {
    const channelSalesCount = leads.filter(l => l.canal_origen === channel && l.status === 'Venta').length;
    const channelConv = (channelSalesCount / channelLeads[channel]) * 100;
    if (channelConv < lowestConv && channelLeads[channel] > 10) { // Only consider channels with enough data
      lowestConv = channelConv;
      worstChannel = channel;
    }
  });

  if (worstChannel) {
    insights.push(`El canal ${worstChannel} presenta una conversión del ${lowestConv.toFixed(1)}%, la más baja del mix. Se sugiere auditar la segmentación de campaña en este canal.`);
  }

  // 3. Stale Leads (Fugas de dinero)
  const staleLeads = leads.filter(l => {
    if (l.status !== 'Nuevo') return false;
    const regDate = new Date(l.fecha_registro);
    const diffHours = (now.getTime() - regDate.getTime()) / (1000 * 60 * 60);
    return diffHours > 48;
  });

  if (staleLeads.length > 0) {
    insights.push(`Existen ${staleLeads.length} leads en status 'Nuevo' con más de 48 horas sin atención. Esto representa una fuga potencial de ingresos.`);
  }

  // 4. Goals Progress
  const monthGoals = objetivos.filter(o => o.mes === currentMonth && o.anio === currentYear);
  const totalGoalVentas = monthGoals.reduce((acc, o) => acc + (o.meta_ventas || 0), 0);
  const actualSales = leads.filter(l => {
    const d = new Date(l.fecha_registro);
    return (d.getMonth() + 1) === currentMonth && d.getFullYear() === currentYear && l.status === 'Venta';
  }).reduce((acc, l) => acc + (l.monto_cierre || 0), 0);

  if (totalGoalVentas > 0) {
    const progress = (actualSales / totalGoalVentas) * 100;
    if (progress < 50 && now.getDate() > 15) {
      insights.push(`Alerta de cumplimiento: Llevamos el ${progress.toFixed(1)}% de la meta de ventas a mitad de mes. Se requiere una acción comercial agresiva.`);
    }
  }

  return insights.length > 0 ? insights : ["Los indicadores están estables. Continúa con la estrategia actual y monitorea los picos de tráfico."];
}

export function getVerdict(data: DashboardData) {
  const { leads, objetivos } = data;
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const monthGoals = objetivos.filter(o => o.mes === currentMonth && o.anio === currentYear);
  const totalGoalVentas = monthGoals.reduce((acc, o) => acc + (o.meta_ventas || 0), 0);
  const actualSales = leads.filter(l => {
    const d = new Date(l.fecha_registro);
    return (d.getMonth() + 1) === currentMonth && d.getFullYear() === currentYear && l.status === 'Venta';
  }).reduce((acc, l) => acc + (l.monto_cierre || 0), 0);

  if (totalGoalVentas === 0) return "Pendiente definir objetivos para emitir veredicto.";

  const progress = (actualSales / totalGoalVentas) * 100;

  if (progress >= 90) return "Vamos por excelente camino. IDIP está proyectando un cierre récord este mes.";
  if (progress >= 70) return "Rendimiento estable. Se sugiere optimizar el cierre de leads calificados para asegurar la meta.";
  return "Alerta Directiva: El volumen de ventas está por debajo de lo proyectado. Se requiere revisión inmediata por sede.";
}
