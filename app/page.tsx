"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const [voirMdp, setVoirMdp] = useState(false);
  const router = useRouter();

  async function handleConnexion() {
    setErreur("");
    if (!identifiant || !motDePasse) {
      setErreur("Veuillez remplir tous les champs");
      return;
    }
    setChargement(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifiant, motDePasse }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard");
      } else {
        setErreur(data.erreur || "Erreur de connexion");
      }
    } catch {
      setErreur("Erreur réseau, réessayez");
    } finally {
      setChargement(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleConnexion();
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f1923 0%, #1a2332 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>
      <div style={{
        background: "#1e2a3a", borderRadius: "16px",
        padding: "48px 40px", width: "100%", maxWidth: "400px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        border: "1px solid rgba(30,100,180,0.15)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            width: "56px", height: "56px",
            background: "linear-gradient(135deg, #1d6fa4, #2196f3)",
            borderRadius: "14px", margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px"
          }}>💧</div>
          <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: "800", letterSpacing: "3px", margin: 0 }}>KOTEPISCINE</h1>
          <p style={{ color: "#5a7a9a", fontSize: "13px", marginTop: "6px" }}>Système de surveillance</p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: "#8aa4be", fontSize: "12px", fontWeight: "600", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>IDENTIFIANT</label>
          <input type="text" placeholder="Votre identifiant" value={identifiant}
            onChange={(e) => setIdentifiant(e.target.value)} onKeyDown={handleKeyDown}
            style={{ width: "100%", padding: "12px 16px", background: "#0f1923", border: "1px solid #2a3f55", borderRadius: "8px", color: "#c8d8e8", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ color: "#8aa4be", fontSize: "12px", fontWeight: "600", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>MOT DE PASSE</label>
          <div style={{ position: "relative" }}>
            <input
              type={voirMdp ? "text" : "password"}
              placeholder="Votre mot de passe" value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)} onKeyDown={handleKeyDown}
              style={{ width: "100%", padding: "12px 44px 12px 16px", background: "#0f1923", border: "1px solid #2a3f55", borderRadius: "8px", color: "#c8d8e8", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            />
            <button type="button" onClick={() => setVoirMdp(!voirMdp)}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#5a7a9a", fontSize: "16px", padding: "0" }}>
              {voirMdp ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {erreur && (
          <div style={{ background: "rgba(183,28,28,0.15)", border: "1px solid rgba(244,67,54,0.3)", borderRadius: "8px", padding: "10px 16px", marginBottom: "20px" }}>
            <p style={{ color: "#ef5350", fontSize: "13px", margin: 0 }}>⚠ {erreur}</p>
          </div>
        )}

        <button onClick={handleConnexion} disabled={chargement} style={{
          width: "100%", padding: "14px",
          background: chargement ? "rgba(21,101,192,0.5)" : "linear-gradient(135deg, #1565c0, #1e88e5)",
          border: "none", borderRadius: "8px", color: "#fff",
          fontSize: "14px", fontWeight: "700", letterSpacing: "2px",
          cursor: chargement ? "not-allowed" : "pointer"
        }}>
          {chargement ? "Connexion..." : "SE CONNECTER"}
        </button>
      </div>
    </main>
  );
}