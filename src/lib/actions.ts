'use server'

import { db, initDb } from './db';
import { revalidatePath } from 'next/cache';
import { getSession, hashPassword, verifyPassword, encrypt } from './auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };
  const usuarioId = session.user.id;

  try {
    await db.execute({
      sql: "INSERT INTO leads (nombre_prospecto, email, telefono, sede_id, categoria_id, curso_id, vendedor_id, usuario_id, canal_origen, status, monto_cierre, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [nombre, email, telefono, sedeId, categoriaId, cursoId, vendedorId, usuarioId, canal, status, montoCierre, fecha]
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

  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };
  const { rol, id: usuarioId, sede_id: userSedeId } = session.user;

  try {
    // Permission check
    if (rol === 'Vendedor') {
      const currentLead = await db.execute({
        sql: "SELECT usuario_id FROM leads WHERE id = ?",
        args: [leadId]
      });
      if (currentLead.rows.length === 0 || (currentLead.rows[0] as any).usuario_id !== usuarioId) {
        return { success: false, error: "No tienes permiso para editar este lead" };
      }
    } else if (rol === 'Gerente') {
      const currentLead = await db.execute({
        sql: "SELECT sede_id FROM leads WHERE id = ?",
        args: [leadId]
      });
      if (currentLead.rows.length === 0 || (currentLead.rows[0] as any).sede_id !== userSedeId) {
        return { success: false, error: "No tienes permiso para editar leads de otras sedes" };
      }
    }

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
  const session = await getSession();
  if (!session) return { leads: [], sedes: [], categorias: [], cursos: [], vendedores: [], inversiones: [], marketingMetrics: null };

  const { rol, id: usuarioId, sede_id: userSedeId } = session.user;

  try {
    let leadsQuery = `
      SELECT l.*, u.nombre as owner_nombre 
      FROM leads l
      LEFT JOIN usuarios u ON l.usuario_id = u.id
    `;
    let leadsArgs: any[] = [];

    if (rol === 'Gerente') {
      leadsQuery += " WHERE l.sede_id = ?";
      leadsArgs.push(userSedeId);
    } else if (rol === 'Vendedor') {
      leadsQuery += " WHERE l.usuario_id = ?";
      leadsArgs.push(usuarioId);
    }
    leadsQuery += " ORDER BY l.fecha_registro DESC";

    const leads = await db.execute({ sql: leadsQuery, args: leadsArgs });
    const sedes = await db.execute("SELECT * FROM sedes");
    const categorias = await db.execute("SELECT * FROM categorias");
    const cursos = await db.execute("SELECT * FROM cursos");
    const vendedores = await db.execute("SELECT * FROM vendedores");
    const inversiones = await db.execute("SELECT * FROM inversiones");
    const marketingMetrics = await db.execute("SELECT * FROM marketing_metrics ORDER BY anio DESC, mes DESC LIMIT 1");
    
    // Fetch goals for the current month/year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const objetivos = await db.execute({
      sql: "SELECT * FROM objetivos_mensuales WHERE mes = ? AND anio = ?",
      args: [currentMonth, currentYear]
    });
    
    return {
      leads: leads.rows,
      sedes: sedes.rows,
      categorias: categorias.rows,
      cursos: cursos.rows,
      vendedores: vendedores.rows,
      inversiones: inversiones.rows,
      marketingMetrics: marketingMetrics.rows[0] || null,
      objetivos: objetivos.rows,
      currentUser: session.user
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { leads: [], sedes: [], categorias: [], cursos: [], vendedores: [], inversiones: [], marketingMetrics: null, objetivos: [], currentUser: null };
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
  const pin_followers = parseInt(formData.get('pin_followers') as string) || 0;

  try {
    await db.execute({
      sql: `INSERT INTO marketing_metrics (
              mes, anio, 
              fb_fans_polanco, fb_fans_qro, 
              ig_followers_polanco, ig_followers_qro, 
              google_rating_polanco, google_rating_qro, 
              google_reviews_polanco, google_reviews_qro, 
              yt_subscribers, tt_followers, pin_followers
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
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
            tt_followers = excluded.tt_followers,
            pin_followers = excluded.pin_followers`,
      args: [
        mes, anio, 
        fb_fans_polanco, fb_fans_qro, 
        ig_followers_polanco, ig_followers_qro, 
        google_rating_polanco, google_rating_qro, 
        google_reviews_polanco, google_reviews_qro, 
        yt_subscribers, tt_followers, pin_followers
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

// Goals Management
export async function updateObjetivoMensual(sedeId: number, mes: number, anio: number, metaLeads: number, metaVentas: number, presupuesto: number) {
  const session = await getSession();
  if (!session || session.user.rol !== 'Director') return { success: false, error: "Unauthorized" };

  try {
    await db.execute({
      sql: `INSERT INTO objetivos_mensuales (sede_id, mes, anio, meta_leads, meta_ventas, presupuesto) 
            VALUES (?, ?, ?, ?, ?, ?) 
            ON CONFLICT(mes, anio, sede_id) DO UPDATE SET 
            meta_leads = excluded.meta_leads,
            meta_ventas = excluded.meta_ventas,
            presupuesto = excluded.presupuesto`,
      args: [sedeId, mes, anio, metaLeads, metaVentas, presupuesto]
    });
    revalidatePath('/');
    revalidatePath('/settings');
    return { success: true };
  } catch (error: any) {
    console.error("Error updating goal detail:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

export async function getObjetivosByMonth(mes: number, anio: number) {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM objetivos_mensuales WHERE mes = ? AND anio = ?",
      args: [mes, anio]
    });
    return result.rows;
  } catch (error) {
    console.error("Error fetching goals:", error);
    return [];
  }
}

export async function clearLeads() {
  const session = await getSession();
  if (!session || session.user.rol !== 'Director') return { success: false, error: "Unauthorized" };

  try {
    await db.execute("DELETE FROM leads");
    revalidatePath('/');
    revalidatePath('/leads');
    revalidatePath('/sedes');
    revalidatePath('/performance');
    revalidatePath('/investments');
    return { success: true };
  } catch (error) {
    console.error("Error clearing leads:", error);
    return { success: false };
  }
}

export async function updateLeadStatus(id: number, status: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };
  const { rol, id: usuarioId, sede_id: userSedeId } = session.user;

  try {
    // Permission check
    if (rol === 'Vendedor') {
      const currentLead = await db.execute({
        sql: "SELECT usuario_id FROM leads WHERE id = ?",
        args: [id]
      });
      if (currentLead.rows.length === 0 || (currentLead.rows[0] as any).usuario_id !== usuarioId) {
        return { success: false, error: "No tienes permiso" };
      }
    } else if (rol === 'Gerente') {
      const currentLead = await db.execute({
        sql: "SELECT sede_id FROM leads WHERE id = ?",
        args: [id]
      });
      if (currentLead.rows.length === 0 || (currentLead.rows[0] as any).sede_id !== userSedeId) {
        return { success: false, error: "No tienes permiso" };
      }
    }

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
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };
  const { rol, id: usuarioId, sede_id: userSedeId } = session.user;

  try {
    // Permission check
    if (rol === 'Vendedor') {
      const currentLead = await db.execute({
        sql: "SELECT usuario_id FROM leads WHERE id = ?",
        args: [id]
      });
      if (currentLead.rows.length === 0 || (currentLead.rows[0] as any).usuario_id !== usuarioId) {
        return { success: false, error: "No tienes permiso" };
      }
    } else if (rol === 'Gerente') {
      const currentLead = await db.execute({
        sql: "SELECT sede_id FROM leads WHERE id = ?",
        args: [id]
      });
      if (currentLead.rows.length === 0 || (currentLead.rows[0] as any).sede_id !== userSedeId) {
        return { success: false, error: "No tienes permiso" };
      }
    }

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

// Auth Actions
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await initDb();
    const result = await db.execute({
      sql: "SELECT * FROM usuarios WHERE email = ?",
      args: [email]
    });

    if (result.rows.length === 0) {
      return { success: false, error: "Credenciales inválidas" };
    }

    const user = result.rows[0] as any;
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return { success: false, error: "Credenciales inválidas" };
    }

    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    const session = await encrypt({ 
      user: { 
        id: user.id, 
        nombre: user.nombre, 
        email: user.email, 
        rol: user.rol, 
        sede_id: user.sede_id 
      }, 
      expires 
    });

    (await cookies()).set('session', session, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Error en el servidor" };
  }
}

export async function logoutAction() {
  (await cookies()).set('session', '', { expires: new Date(0) });
  redirect('/login');
}

export async function setupAdmin(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await initDb();
    const hashedPassword = await hashPassword(password);
    await db.execute({
      sql: "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, 'Director')",
      args: [nombre, email, hashedPassword]
    });
    return { success: true };
  } catch (error: any) {
    console.error("Setup error:", error);
    return { success: false, error: "Error creating admin: " + (error.message || "Unknown error") };
  }
}

export async function createUser(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.rol !== 'Director') return { success: false, error: "Unauthorized" };

  const nombre = formData.get('nombre') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const rol = formData.get('rol') as string;
  const sedeId = parseInt(formData.get('sedeId') as string) || null;

  try {
    const hashedPassword = await hashPassword(password);
    await db.execute({
      sql: "INSERT INTO usuarios (nombre, email, password, rol, sede_id) VALUES (?, ?, ?, ?, ?)",
      args: [nombre, email, hashedPassword, rol, sedeId]
    });
    revalidatePath('/users');
    return { success: true };
  } catch (error) {
    console.error("Create user error:", error);
    return { success: false, error: "Error creating user" };
  }
}

export async function getAllUsers() {
  const session = await getSession();
  if (!session || session.user.rol !== 'Director') return [];

  try {
    const result = await db.execute("SELECT id, nombre, email, rol, sede_id FROM usuarios");
    return result.rows;
  } catch (error) {
    return [];
  }
}

export async function updateUserRole(userId: number, rol: string, sedeId: number | null) {
  const session = await getSession();
  if (!session || session.user.rol !== 'Director') return { success: false, error: "Unauthorized" };

  try {
    await db.execute({
      sql: "UPDATE usuarios SET rol = ?, sede_id = ? WHERE id = ?",
      args: [rol, sedeId, userId]
    });
    revalidatePath('/users');
    return { success: true };
  } catch (error) {
    console.error("Update user role error:", error);
    return { success: false, error: "Error updating user role" };
  }
}

export async function changeUserPassword(formData: FormData) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const userId = session.user.id;

  try {
    const result = await db.execute({
      sql: "SELECT password FROM usuarios WHERE id = ?",
      args: [userId]
    });

    if (result.rows.length === 0) return { success: false, error: "User not found" };

    const user = result.rows[0] as any;
    const isValid = await verifyPassword(currentPassword, user.password);

    if (!isValid) {
      return { success: false, error: "Contraseña actual incorrecta" };
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await db.execute({
      sql: "UPDATE usuarios SET password = ? WHERE id = ?",
      args: [hashedNewPassword, userId]
    });

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, error: "Error changing password" };
  }
}

export async function resetUserPasswordByAdmin(userId: number, newPassword: string) {
  const session = await getSession();
  if (!session || session.user.rol !== 'Director') return { success: false, error: "Unauthorized" };

  try {
    const hashedNewPassword = await hashPassword(newPassword);
    await db.execute({
      sql: "UPDATE usuarios SET password = ? WHERE id = ?",
      args: [hashedNewPassword, userId]
    });
    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, error: "Error resetting password" };
  }
}

export async function deleteUser(userId: number) {
  const session = await getSession();
  if (!session || session.user.rol !== 'Director') return { success: false, error: "Unauthorized" };

  try {
    // Prevent deleting itself
    if (session.user.id === userId) {
      return { success: false, error: "No puedes eliminarte a ti mismo" };
    }

    await db.execute({
      sql: "DELETE FROM usuarios WHERE id = ?",
      args: [userId]
    });
    revalidatePath('/users');
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: "Error deleting user" };
  }
}
