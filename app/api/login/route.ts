import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import Database from "better-sqlite3";
import path from "path";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "kotepiscine_secret_par_defaut"
);

interface Superviseur {
  id: number;
  identifiant: string;
  mot_de_passe: string;
}

export async function POST(request: NextRequest) {
  try {
    const { identifiant, motDePasse } = await request.json();

    if (!identifiant || !motDePasse) {
      return NextResponse.json({ erreur: "Identifiant et mot de passe requis" }, { status: 400 });
    }

    const dbPath = path.resolve(process.env.DB_PATH || "./MaBase12.db");
    const db = new Database(dbPath);
    const superviseur = db.prepare(
      "SELECT * FROM superviseurs WHERE identifiant = ?"
    ).get(identifiant) as Superviseur | undefined;
    db.close();

    if (!superviseur) {
      return NextResponse.json({ erreur: "Identifiant ou mot de passe incorrect" }, { status: 401 });
    }

    const ok = await bcrypt.compare(motDePasse, superviseur.mot_de_passe);
    if (!ok) {
      return NextResponse.json({ erreur: "Identifiant ou mot de passe incorrect" }, { status: 401 });
    }

    const token = await new SignJWT({ id: superviseur.id, identifiant: superviseur.identifiant })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("8h")
      .sign(SECRET);

    const response = NextResponse.json({ success: true });
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erreur login:", error);
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
