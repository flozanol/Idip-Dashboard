'use server'

import { db } from './db';
import { revalidatePath } from 'next/cache';

export async function createLead(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const telefono = formData.get('telefono') as string;
  const sedeId = parseInt(formData.get('sedeId') as string);
  const categoriaId = parseInt(formData.get('categoriaId') as string);
  const canal = formData.get('canal') as string;
  const status = formData.get('status') as string;

  try {
    await db.execute({
      sql: "INSERT INTO leads (nombre_prospecto, telefono, sede_id, categoria_id, canal_origen, status) VALUES (?, ?, ?, ?, ?, ?)",
      args: [nombre, telefono, sedeId, categoriaId, canal, status]
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error creating lead:", error);
    return { success: false, error: "Failed to create lead" };
  }
}

export async function getDashboardData() {
  try {
    const leads = await db.execute("SELECT * FROM leads ORDER BY fecha_registro DESC");
    const sedes = await db.execute("SELECT * FROM sedes");
    const categorias = await db.execute("SELECT * FROM categorias");
    
    return {
      leads: leads.rows,
      sedes: sedes.rows,
      categorias: categorias.rows,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { leads: [], sedes: [], categorias: [] };
  }
}
