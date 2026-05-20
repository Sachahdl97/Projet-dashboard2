import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { nom, prenom, telephone, email1, email2, email3 } = await request.json();

    if (!nom || !telephone) {
      return NextResponse.json({ erreur: "Nom et téléphone obligatoires" }, { status: 400 });
    }

    const dbPath = path.resolve(process.env.DB_PATH || "./MaBase12.db");
    const db = new Database(dbPath);
    db.prepare(`
      INSERT INTO clients (nom, prenom, telephone, email1, email2, email3)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(nom, prenom || null, telephone, email1 || null, email2 || null, email3 || null);
    db.close();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur clients:", error);
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
