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
    const marketingMetrics = await db.execute("SELECT * FROM marketing_metrics ORDER BY anio DESC, mes DESC LIMIT 1");
    
    return {
      leads: leads.rows,
      sedes: sedes.rows,
      categorias: categorias.rows,
      cursos: cursos.rows,
      vendedores: vendedores.rows,
      inversiones: inversiones.rows,
      marketingMetrics: marketingMetrics.rows[0] || null,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { leads: [], sedes: [], categorias: [], cursos: [], vendedores: [], inversiones: [], marketingMetrics: null };
  }
}

export async function updateMarketingMetrics(formData: FormData) {
  const mes = parseInt(formData.get('mes') as string);
  const anio = parseInt(formData.get('anio') as string);
  const fb_fans_polanco = parseInt(formData.get('fb_fans_polanco') as string) || 0;
  const fb_fans_qro = parseInt(formData.get('fb_fans_qro') as string) || 0;
  const ig_followers_polanco = parseInt(formData.get('ig_followers_polanco') as string) || 0;
  const ig_followers_qro = parseInt(formData.get('ig_followers_qro') as string) || 0;
  const google_rating_polanco = parseFloat(formData.get('google_rating_polanco') as string) || 0;
  const google_rating_qro = parseFloat(formData.get('google_rating_qro') as string) || 0;
  const google_reviews_polanco = parseInt(formData.get('google_reviews_polanco') as string) || 0;
  const google_reviews_qro = parseInt(formData.get('google_reviews_qro') as string) || 0;
  const yt_subscribers = parseInt(formData.get('yt_subscribers') as string) || 0;
  const tt_followers = parseInt(formData.get('tt_followers') as string) || 0;

  try {
    await db.execute({
      sql: `INSERT INTO marketing_metrics (
              mes, anio, 
              fb_fans_polanco, fb_fans_qro, 
              ig_followers_polanco, ig_followers_qro, 
              google_rating_polanco, google_rating_qro, 
              google_reviews_polanco, google_reviews_qro, 
              yt_subscribers, tt_followers
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
            ON CONFLICT(mes, anio) DO UPDATE SET 
            fb_fans_polanco = excluded.fb_fans_polanco,
            fb_fans_qro = excluded.fb_fans_qro,
            ig_followers_polanco = excluded.ig_followers_polanco,
            ig_followers_qro = excluded.ig_followers_qro,
            google_rating_polanco = excluded.google_rating_polanco,
            google_rating_qro = excluded.google_rating_qro,
            google_reviews_polanco = excluded.google_reviews_polanco,
            google_reviews_qro = excluded.google_reviews_qro,
            yt_subscribers = excluded.yt_subscribers,
            tt_followers = excluded.tt_followers`,
      args: [
        mes, anio, 
        fb_fans_polanco, fb_fans_qro, 
        ig_followers_polanco, ig_followers_qro, 
        google_rating_polanco, google_rating_qro, 
        google_reviews_polanco, google_reviews_qro, 
        yt_subscribers, tt_followers
      ]
    });
    revalidatePath('/');
    revalidatePath('/marketing-metrics');
    return { success: true };
  } catch (error) {
    console.error("Error updating marketing metrics:", error);
    return { success: false };
  }
}

// Courses Management
export async function addCourse(nombre: string) {
  try {
    await db.execute({
      sql: "INSERT INTO cursos (nombre) VALUES (?)",
      args: [nombre]
    });
    revalidatePath('/');
    revalidatePath('/leads');
    revalidatePath('/sedes');
    revalidatePath('/performance');
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
    revalidatePath('/');
    revalidatePath('/leads');
    revalidatePath('/sedes');
    revalidatePath('/performance');
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
    revalidatePath('/');
    revalidatePath('/leads');
    revalidatePath('/sedes');
    revalidatePath('/performance');
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
    revalidatePath('/');
    revalidatePath('/leads');
    revalidatePath('/sedes');
    revalidatePath('/performance');
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
