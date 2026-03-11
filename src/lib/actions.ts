'use server'

import { db } from './db';
import { revalidatePath } from 'next/cache';

export async function createLead(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const email = formData.get('email') as string;
  const telefono = formData.get('telefono') as string;
  const sedeId = parseInt(formData.get('sedeId') as string);
  const categoriaId = parseInt(formData.get('categoriaId') as string);
  const cursoId = formData.get('cursoId') ? parseInt(formData.get('cursoId') as string) : null;
  const vendedorId = formData.get('vendedorId') ? parseInt(formData.get('vendedorId') as string) : null;
  const canal = formData.get('canal') as string;
  const status = formData.get('status') as string;
  const montoCierre = parseFloat(formData.get('montoCierre') as string) || 0;
  const fecha = formData.get('fecha') as string;

  try {
    await db.execute({
      sql: "INSERT INTO leads (nombre_prospecto, email, telefono, sede_id, categoria_id, curso_id, vendedor_id, canal_origen, status, monto_cierre, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [nombre, email, telefono, sedeId, categoriaId, cursoId, vendedorId, canal, status, montoCierre, fecha]
    });
    revalidatePath('/');
    revalidatePath('/leads');
    return { success: true };
  } catch (error) {
    console.error("Error creating lead:", error);
    return { success: false, error: "Failed to create lead" };
  }
}

export async function updateLead(leadId: number, formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const email = formData.get('email') as string;
  const telefono = formData.get('telefono') as string;
  const sedeId = parseInt(formData.get('sedeId') as string);
  const categoriaId = parseInt(formData.get('categoriaId') as string);
  const cursoId = formData.get('cursoId') ? parseInt(formData.get('cursoId') as string) : null;
  const vendedorId = formData.get('vendedorId') ? parseInt(formData.get('vendedorId') as string) : null;
  const canal = formData.get('canal') as string;
  const status = formData.get('status') as string;
  const montoCierre = parseFloat(formData.get('montoCierre') as string) || 0;
  const fecha = formData.get('fecha') as string;

  try {
    await db.execute({
      sql: `UPDATE leads SET 
            nombre_prospecto = ?, 
            email = ?, 
            telefono = ?, 
            sede_id = ?, 
            categoria_id = ?, 
            curso_id = ?, 
            vendedor_id = ?, 
            canal_origen = ?, 
            status = ?, 
            monto_cierre = ?, 
            fecha_registro = ? 
            WHERE id = ?`,
      args: [nombre, email, telefono, sedeId, categoriaId, cursoId, vendedorId, canal, status, montoCierre, fecha, leadId]
    });
    revalidatePath('/');
    revalidatePath('/leads');
    return { success: true };
  } catch (error) {
    console.error("Error updating lead:", error);
    return { success: false, error: "Failed to update lead" };
  }
}

export async function getDashboardData() {
  try {
    const leads = await db.execute("SELECT * FROM leads ORDER BY fecha_registro DESC");
    const sedes = await db.execute("SELECT * FROM sedes");
    const categorias = await db.execute("SELECT * FROM categorias");
    const cursos = await db.execute("SELECT * FROM cursos");
    const vendedores = await db.execute("SELECT * FROM vendedores");
    const inversiones = await db.execute("SELECT * FROM inversiones");
    
    return {
      leads: leads.rows,
      sedes: sedes.rows,
      categorias: categorias.rows,
      cursos: cursos.rows,
      vendedores: vendedores.rows,
      inversiones: inversiones.rows,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { leads: [], sedes: [], categorias: [], cursos: [], vendedores: [], inversiones: [] };
  }
}

// Courses Management
export async function addCourse(nombre: string) {
  try {
    await db.execute({
      sql: "INSERT INTO cursos (nombre) VALUES (?)",
      args: [nombre]
    });
    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteCourse(id: number) {
  try {
    await db.execute({
      sql: "DELETE FROM cursos WHERE id = ?",
      args: [id]
    });
    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// Vendors Management
export async function addVendor(nombre: string) {
  try {
    await db.execute({
      sql: "INSERT INTO vendedores (nombre) VALUES (?)",
      args: [nombre]
    });
    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteVendor(id: number) {
  try {
    await db.execute({
      sql: "DELETE FROM vendedores WHERE id = ?",
      args: [id]
    });
    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// Investments Tracking
export async function updateInvestment(canal: string, mes: number, anio: number, monto: number) {
  try {
    await db.execute({
      sql: "INSERT INTO inversiones (canal, mes, anio, monto) VALUES (?, ?, ?, ?) ON CONFLICT(canal, mes, anio) DO UPDATE SET monto = excluded.monto",
      args: [canal, mes, anio, monto]
    });
    revalidatePath('/investments');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error updating investment:", error);
    return { success: false };
  }
}

export async function clearLeads() {
  try {
    await db.execute("DELETE FROM leads");
    revalidatePath('/');
    revalidatePath('/leads');
    return { success: true };
  } catch (error) {
    console.error("Error clearing leads:", error);
    return { success: false };
  }
}

export async function updateLeadStatus(id: number, status: string) {
  try {
    await db.execute({
      sql: "UPDATE leads SET status = ? WHERE id = ?",
      args: [status, id]
    });
    revalidatePath('/');
    revalidatePath('/leads');
    return { success: true };
  } catch (error) {
    console.error("Error updating lead status:", error);
    return { success: false };
  }
}

export async function updateLeadAttempts(id: number, attempts: number) {
  try {
    await db.execute({
      sql: "UPDATE leads SET intentos_contacto = ? WHERE id = ?",
      args: [attempts, id]
    });
    revalidatePath('/');
    revalidatePath('/leads');
    return { success: true };
  } catch (error) {
    console.error("Error updating lead attempts:", error);
    return { success: false };
  }
}
