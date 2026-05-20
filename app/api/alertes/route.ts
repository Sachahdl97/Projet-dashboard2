import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

export async function GET() {
  try {
    const dbPath = path.resolve(process.env.DB_PATH || "./MaBase12.db");
    const db = new Database(dbPath);
    const alertes = db.prepare(`
      SELECT
        a.id_alerte,
        ap.site_installation,
        ap.code_appareil,
        t.description AS type_description,
        a.statut,
        a.created_at
      FROM alertes a
      JOIN appareils ap ON a.id_appareil = ap.id_appareil
      JOIN types_alerte t ON a.id_type = t.id_type
      ORDER BY a.created_at DESC
      LIMIT 50
    `).all();
    db.close();
    return NextResponse.json(alertes);
  } catch (error) {
    console.error("Erreur alertes:", error);
    return NextResponse.json([], { status: 500 });
  }
}
