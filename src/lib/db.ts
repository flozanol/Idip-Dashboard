import { createClient } from '@libsql/client';

const url = "libsql://idip-dashboard-flozanol.aws-us-east-2.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzMyNTU3MzcsImlkIjoiMDE5Y2RlMzMtZWMwMS03YjcwLTgxMWItMDY3OGJlMGNiYTM3IiwicmlkIjoiZGVlNWVkNTgtMWViZS00ODk0LWJiZjktNzE2N2MxNTg3YjI1In0.aV1mLUeIG6ylYNe6EG5OT_qWD7lOHMaGd3-R5b4aTgW8xKDUq-TbxkjGxfbCPuNncXyo2TKJE4PsVdK00WUlCg";

export const db = createClient({
  url: url,
  authToken: authToken,
});

export async function initDb() {
  try {
    // Create tables
    await db.execute(`
      CREATE TABLE IF NOT EXISTS sedes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS cursos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS vendedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS inversiones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        canal TEXT NOT NULL,
        mes INTEGER NOT NULL,
        anio INTEGER NOT NULL,
        monto REAL DEFAULT 0,
        UNIQUE(canal, mes, anio)
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_prospecto TEXT NOT NULL,
        email TEXT,
        telefono TEXT,
        sede_id INTEGER REFERENCES sedes(id),
        categoria_id INTEGER REFERENCES categorias(id),
        curso_id INTEGER REFERENCES cursos(id),
        vendedor_id INTEGER REFERENCES vendedores(id),
        canal_origen TEXT NOT NULL,
        status TEXT NOT NULL,
        monto_cierre REAL DEFAULT 0,
        intentos_contacto INTEGER DEFAULT 0,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add columns if they don't exist (Migration)
    try {
      await db.execute("ALTER TABLE leads ADD COLUMN email TEXT");
    } catch (e) {}
    try {
      await db.execute("ALTER TABLE leads ADD COLUMN curso_id INTEGER REFERENCES cursos(id)");
    } catch (e) {}
    try {
      await db.execute("ALTER TABLE leads ADD COLUMN vendedor_id INTEGER REFERENCES vendedores(id)");
    } catch (e) {}

    // Seed Sedes
    const sedes = ['Polanco', 'Querétaro', 'Online', 'On-Demand'];
    for (const sede of sedes) {
      await db.execute({
        sql: "INSERT OR IGNORE INTO sedes (nombre) VALUES (?)",
        args: [sede]
      });
    }

    // Seed Categorias
    const categorias = ['Inscripción', 'Maquillaje', 'Imagen', 'Peinado', 'Certificaciones', 'Productos'];
    for (const cat of categorias) {
      await db.execute({
        sql: "INSERT OR IGNORE INTO categorias (nombre) VALUES (?)",
        args: [cat]
      });
    }

    console.log("Database initialized and seeded successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}
