"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NouveauClient() {
  const [form, setForm] = useState({ nom: "", prenom: "", telephone: "", email1: "", email2: "", email3: "" });
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);
  const [chargement, setChargement] = useState(false);
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setErreur("");
    if (!form.nom || !form.telephone) {
      setErreur("Le nom et le téléphone sont obligatoires");
      return;
    }
    setChargement(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSucces(true);
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setErreur(data.erreur || "Erreur lors de la création");
      }
    } catch {
      setErreur("Erreur réseau, réessayez");
    } finally {
      setChargement(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px",
    background: "rgba(10,20,32,0.8)",
    border: "1px solid rgba(30,100,180,0.2)",
    borderRadius: "10px", color: "#d0e8f8",
    fontSize: "14px", outline: "none", boxSizing: "border-box"
  };

  const labelStyle: React.CSSProperties = {
    color: "#6a9ab8", fontSize: "11px", fontWeight: "700",
    letterSpacing: "1.5px", display: "block", marginBottom: "8px"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a1520", fontFamily: "'Inter','Segoe UI',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ background: "#0f1e2e", borderRadius: "20px", padding: "48px 44px", width: "100%", maxWidth: "580px", border: "1px solid rgba(30,100,180,0.15)", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
        <div style={{ marginBottom: "36px" }}>
          <a href="/dashboard" style={{ color: "#3a6a9a", fontSize: "12px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>← Retour au dashboard</a>
          <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", margin: "0 0 6px" }}>Ajouter un nouveau client</h1>
          <p style={{ color: "#3a6a9a", fontSize: "13px", margin: 0 }}>Remplissez les informations du client</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>NOM DU CLIENT *</label>
              <input name="nom" type="text" placeholder="Ex: Dupont" value={form.nom} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>PRÉNOM</label>
              <input name="prenom" type="text" placeholder="Ex: Jean" value={form.prenom} onChange={handleChange} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>TÉLÉPHONE *</label>
            <input name="telephone" type="tel" placeholder="Ex: 0690 00 00 00" value={form.telephone} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>EMAIL PRINCIPAL</label>
            <input name="email1" type="email" placeholder="Ex: contact@exemple.com" value={form.email1} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>EMAIL 2</label>
              <input name="email2" type="email" placeholder="Optionnel" value={form.email2} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>EMAIL 3</label>
              <input name="email3" type="email" placeholder="Optionnel" value={form.email3} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(30,100,180,0.15)", margin: "8px 0" }} />

          {erreur && (
            <div style={{ background: "rgba(183,28,28,0.15)", border: "1px solid rgba(244,67,54,0.3)", borderRadius: "10px", padding: "12px 16px" }}>
              <p style={{ color: "#ef5350", fontSize: "13px", margin: 0 }}>⚠ {erreur}</p>
            </div>
          )}
          {succes && (
            <div style={{ background: "rgba(76,175,80,0.15)", border: "1px solid rgba(76,175,80,0.3)", borderRadius: "10px", padding: "12px 16px" }}>
              <p style={{ color: "#4caf50", fontSize: "13px", margin: 0 }}>✅ Client créé ! Redirection...</p>
            </div>
          )}

          <button onClick={handleSubmit} disabled={chargement || succes} style={{
            width: "100%", padding: "14px",
            background: chargement ? "rgba(21,101,192,0.5)" : "linear-gradient(135deg, #1565c0, #1e88e5)",
            border: "none", borderRadius: "10px", color: "#fff",
            fontSize: "13px", fontWeight: "700", letterSpacing: "2px",
            cursor: chargement ? "not-allowed" : "pointer"
          }}>
            {chargement ? "Création en cours..." : "CRÉER LE CLIENT"}
          </button>
        </div>
      </div>
    </div>
  );
}
