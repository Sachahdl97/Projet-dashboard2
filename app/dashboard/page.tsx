"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Alerte {
  id_alerte: number;
  site_installation: string;
  code_appareil: string;
  type_description: string;
  statut: string;
  created_at: string;
}

const STATUTS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  en_attente: { label: "EN ATTENTE", color: "#ff9800", bg: "rgba(255,152,0,0.12)",  border: "rgba(255,152,0,0.3)"  },
  en_cours:   { label: "EN COURS",   color: "#f44336", bg: "rgba(244,67,54,0.12)",  border: "rgba(244,67,54,0.3)"  },
  transmis:   { label: "TRANSMIS",   color: "#4caf50", bg: "rgba(76,175,80,0.12)",  border: "rgba(76,175,80,0.3)"  },
};

export default function Dashboard() {
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [chargement, setChargement] = useState(true);
  const router = useRouter();

  async function chargerAlertes() {
    try {
      const res = await fetch("/api/alertes");
      const data = await res.json();
      setAlertes(Array.isArray(data) ? data : []);
    } catch {
      setAlertes([]);
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    chargerAlertes();
    const interval = setInterval(chargerAlertes, 5000);
    return () => clearInterval(interval);
  }, []);

  async function handleDeconnexion() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  }

  const stats = [
    { label: "Total alertes", value: alertes.length,                                       color: "#2196f3", border: "rgba(33,150,243,0.3)"  },
    { label: "En attente",    value: alertes.filter(a => a.statut === "en_attente").length, color: "#ff9800", border: "rgba(255,152,0,0.3)"   },
    { label: "En cours",      value: alertes.filter(a => a.statut === "en_cours").length,   color: "#f44336", border: "rgba(244,67,54,0.3)"   },
    { label: "Transmis",      value: alertes.filter(a => a.statut === "transmis").length,   color: "#4caf50", border: "rgba(76,175,80,0.3)"   },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a1520", fontFamily: "'Inter','Segoe UI',sans-serif", display: "flex" }}>
      <aside style={{ width: "220px", minHeight: "100vh", background: "#0f1e2e", borderRight: "1px solid rgba(30,100,180,0.15)", padding: "24px 0", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(30,100,180,0.15)", marginBottom: "8px" }}>
          <div style={{ fontSize: "22px", marginBottom: "4px" }}>💧</div>
          <div style={{ color: "#fff", fontWeight: "800", fontSize: "13px", letterSpacing: "2px" }}>KOTEPISCINE</div>
          <div style={{ color: "#2a5a8a", fontSize: "10px", letterSpacing: "1px", marginTop: "2px" }}>SURVEILLANCE</div>
        </div>

        <nav style={{ padding: "8px 12px" }}>
          {[
            { icon: "📊", label: "Dashboard",  href: "/dashboard",       active: true  },
            { icon: "🔔", label: "Alertes",    href: "/dashboard",       active: false },
            { icon: "⚙️", label: "Appareils",  href: "/dashboard",       active: false },
            { icon: "👤", label: "Clients",    href: "/clients/nouveau", active: false },
          ].map((item) => (
            <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                padding: "10px 14px", borderRadius: "10px", marginBottom: "4px",
                background: item.active ? "rgba(21,101,192,0.25)" : "transparent",
                color: item.active ? "#64b5f6" : "#3a6a9a",
                fontSize: "13px", fontWeight: item.active ? "600" : "400",
                cursor: "pointer", display: "flex", gap: "10px", alignItems: "center",
                border: item.active ? "1px solid rgba(21,101,192,0.3)" : "1px solid transparent"
              }}>
                <span>{item.icon}</span>{item.label}
              </div>
            </a>
          ))}

          <div style={{ marginTop: "16px", borderTop: "1px solid rgba(30,100,180,0.15)", paddingTop: "16px" }}>
            <button onClick={handleDeconnexion} style={{
              width: "100%", padding: "10px 14px", borderRadius: "10px",
              background: "rgba(244,67,54,0.08)", border: "1px solid rgba(244,67,54,0.2)",
              color: "#ef5350", fontSize: "13px", cursor: "pointer",
              display: "flex", gap: "10px", alignItems: "center"
            }}>
              <span>🚪</span>Déconnexion
            </button>
          </div>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "32px 36px", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", margin: "0 0 4px" }}>Monitoring Alertes</h1>
            <p style={{ color: "#3a6a9a", fontSize: "12px", margin: 0 }}>Tableau de bord en temps réel</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(76,175,80,0.1)", border: "1px solid rgba(76,175,80,0.25)", borderRadius: "20px", padding: "8px 16px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4caf50", boxShadow: "0 0 8px #4caf50", display: "inline-block" }}/>
            <span style={{ color: "#4caf50", fontSize: "12px", fontWeight: "600" }}>BASE 12 : CONNECTÉE</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ background: "#0f1e2e", borderRadius: "14px", padding: "22px 20px", border: `1px solid ${stat.border}`, borderLeft: `3px solid ${stat.color}` }}>
              <div style={{ color: stat.color, fontSize: "32px", fontWeight: "800", lineHeight: "1" }}>{stat.value}</div>
              <div style={{ color: "#3a6a9a", fontSize: "12px", marginTop: "6px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#0f1e2e", borderRadius: "14px", border: "1px solid rgba(30,100,180,0.15)", overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(30,100,180,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ color: "#fff", fontWeight: "600", fontSize: "15px" }}>Dernières alertes</span>
              {chargement && <span style={{ color: "#3a6a9a", fontSize: "12px", marginLeft: "10px" }}>Chargement...</span>}
            </div>
            <a href="/clients/nouveau" style={{ textDecoration: "none", background: "linear-gradient(135deg, #1565c0, #1e88e5)", color: "#fff", fontSize: "12px", fontWeight: "600", padding: "8px 18px", borderRadius: "8px", letterSpacing: "1px" }}>
              + NOUVEAU CLIENT
            </a>
          </div>
          {alertes.length === 0 && !chargement ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#3a6a9a" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>📭</div>
              <p style={{ margin: 0 }}>Aucune alerte pour le moment</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.2)" }}>
                  {["ID ALERTE", "SITE", "APPAREIL", "TYPE", "STATUT", "DATE"].map(h => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "#3a6a9a", fontSize: "11px", fontWeight: "600", letterSpacing: "1px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alertes.map((a, i) => {
                  const s = STATUTS[a.statut] || STATUTS.en_attente;
                  return (
                    <tr key={a.id_alerte} style={{ borderTop: "1px solid rgba(30,100,180,0.1)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.1)" }}>
                      <td style={{ padding: "14px 20px", color: "#4a8ab8", fontSize: "13px", fontWeight: "600" }}>#{a.id_alerte}</td>
                      <td style={{ padding: "14px 20px", color: "#d0e8f8", fontSize: "13px" }}>{a.site_installation}</td>
                      <td style={{ padding: "14px 20px", color: "#d0e8f8", fontSize: "13px" }}>{a.code_appareil}</td>
                      <td style={{ padding: "14px 20px", color: "#8ab8d8", fontSize: "13px" }}>{a.type_description}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "600", background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", color: "#3a6a9a", fontSize: "12px" }}>
                        {new Date(a.created_at).toLocaleString("fr-FR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}