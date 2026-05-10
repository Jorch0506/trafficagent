// components/SitesManager.jsx
// Gestión de sitios registrados por usuario
// Límite según plan: free/starter=1, growth=3, agency=10

import { useState, useEffect } from "react";
import { supabase } from "../hooks/useAuth";

const PLAN_SITE_LIMITS = {
  free:    1,
  starter: 1,
  growth:  3,
  agency:  10,
};

const PLAN_COLORS = {
  free:    "#4ade80",
  starter: "#38bdf8",
  growth:  "#f59e0b",
  agency:  "#e879f9",
};

function getFavicon(url) {
  try {
    const domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
}

function isValidUrl(str) {
  try {
    const url = str.startsWith("http") ? str : `https://${str}`;
    new URL(url);
    return url.includes(".");
  } catch {
    return false;
  }
}

export function SitesManager({ user, userPlan, onAnalyzeSite }) {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newName, setNewName] = useState("");
  const [urlError, setUrlError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const plan = userPlan || "free";
  const planColor = PLAN_COLORS[plan] || "#38bdf8";
  const siteLimit = PLAN_SITE_LIMITS[plan] || 1;
  const canAddMore = sites.length < siteLimit;

  useEffect(() => {
    if (!user?.id) return;
    fetchSites();
  }, [user?.id]);

  const fetchSites = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("sites")
      .select("id, url, name, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setSites(data || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newUrl) { setUrlError("Ingresa la URL del sitio."); return; }
    if (!isValidUrl(newUrl)) { setUrlError("URL no válida. Formato: misitioweb.com"); return; }

    setSaving(true);
    const cleanUrl = newUrl.startsWith("http") ? newUrl : `https://${newUrl}`;

    const { error } = await supabase.from("sites").insert({
      user_id: user.id,
      url: cleanUrl,
      name: newName || cleanUrl,
    });

    if (error) {
      setUrlError("Error al guardar el sitio. Intenta de nuevo.");
    } else {
      setNewUrl("");
      setNewName("");
      setUrlError("");
      setShowForm(false);
      fetchSites();
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    await supabase.from("sites").delete().eq("id", id);
    setSites(prev => prev.filter(s => s.id !== id));
    setDeletingId(null);
  };

  const inp = {
    width: "100%",
    background: "var(--bg-elevated)",
    border: "1px solid var(--bg-border)",
    borderRadius: "var(--radius-md)",
    color: "var(--text-primary)",
    fontSize: "var(--text-sm)",
    padding: "10px 14px",
    fontFamily: "var(--font-sans)",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ marginTop: "var(--space-8)" }}>

      {/* Header de la sección */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-lg)", marginBottom: 2 }}>
            Mis sitios
          </h3>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
            {sites.length} / {siteLimit} sitios registrados
          </div>
        </div>
        {canAddMore ? (
          <button
            onClick={() => setShowForm(v => !v)}
            style={{ padding: "8px 16px", background: showForm ? "var(--bg-border)" : "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-sm)", color: showForm ? "var(--text-secondary)" : "#fff", fontWeight: 700, fontSize: "var(--text-sm)", cursor: "pointer", fontFamily: "var(--font-sans)" }}
          >
            {showForm ? "Cancelar" : "+ Agregar sitio"}
          </button>
        ) : (
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", padding: "6px 12px", background: "var(--bg-elevated)", borderRadius: "var(--radius-full)", border: "1px solid var(--bg-border)" }}>
            Límite del plan alcanzado
          </span>
        )}
      </div>

      {/* Formulario para agregar sitio */}
      {showForm && (
        <div style={{ background: "var(--bg-surface)", border: `1px solid ${planColor}33`, borderRadius: "var(--radius-lg)", padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-muted)", marginBottom: "var(--space-1)", textTransform: "uppercase", letterSpacing: 1 }}>
                URL del sitio *
              </label>
              <input
                value={newUrl}
                onChange={e => { setNewUrl(e.target.value); setUrlError(""); }}
                placeholder="https://misitioweb.com"
                style={{ ...inp, borderColor: urlError ? "var(--brand-danger)" : "var(--bg-border)" }}
                onFocus={e => e.target.style.borderColor = urlError ? "var(--brand-danger)" : "var(--brand-primary)"}
                onBlur={e => e.target.style.borderColor = urlError ? "var(--brand-danger)" : "var(--bg-border)"}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
              />
              {urlError && (
                <div style={{ fontSize: "var(--text-xs)", color: "var(--brand-danger)", marginTop: 4 }}>⚠ {urlError}</div>
              )}
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-muted)", marginBottom: "var(--space-1)", textTransform: "uppercase", letterSpacing: 1 }}>
                Nombre (opcional)
              </label>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Mi tienda online"
                style={inp}
                onFocus={e => e.target.style.borderColor = "var(--brand-primary)"}
                onBlur={e => e.target.style.borderColor = "var(--bg-border)"}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={saving}
            style={{ padding: "10px 24px", background: saving ? "var(--bg-border)" : "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-sm)", color: saving ? "var(--text-disabled)" : "#fff", fontWeight: 700, fontSize: "var(--text-sm)", cursor: saving ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)" }}
          >
            {saving ? "Guardando..." : "Guardar sitio"}
          </button>
        </div>
      )}

      {/* Lista de sitios */}
      {loading ? (
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", textAlign: "center", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
          Cargando sitios...
        </div>
      ) : sites.length === 0 ? (
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-8)", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: "var(--space-3)" }}>🌐</div>
          <div style={{ fontSize: "var(--text-base)", fontWeight: 500, marginBottom: "var(--space-2)" }}>Sin sitios registrados</div>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
            Agrega tu sitio para acceder rápidamente al generador
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "var(--space-2)" }}>
          {sites.map(site => {
            const favicon = getFavicon(site.url);
            return (
              <div key={site.id} style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-4) var(--space-5)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flex: 1, minWidth: 0 }}>
                  {favicon && (
                    <img src={favicon} alt="" width={20} height={20} style={{ borderRadius: 4, flexShrink: 0 }} onError={e => e.target.style.display = "none"} />
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {site.name || site.url}
                    </div>
                    {site.name && (
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {site.url}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "var(--space-2)", flexShrink: 0 }}>
                  <button
                    onClick={() => onAnalyzeSite(site.url)}
                    style={{ padding: "7px 14px", background: "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-sm)", color: "#fff", fontSize: "var(--text-xs)", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-sans)" }}
                  >
                    Analizar →
                  </button>
                  <button
                    onClick={() => handleDelete(site.id)}
                    disabled={deletingId === site.id}
                    style={{ padding: "7px 10px", background: "transparent", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", fontSize: "var(--text-xs)", cursor: "pointer", fontFamily: "var(--font-sans)", opacity: deletingId === site.id ? 0.5 : 1 }}
                  >
                    {deletingId === site.id ? "..." : "✕"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upgrade CTA si llegó al límite */}
      {!canAddMore && sites.length > 0 && plan !== "agency" && (
        <div style={{ marginTop: "var(--space-4)", padding: "var(--space-4)", background: `${planColor}10`, border: `1px solid ${planColor}30`, borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap" }}>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
            Has alcanzado el límite de <strong style={{ color: planColor }}>{siteLimit} sitio{siteLimit > 1 ? "s" : ""}</strong> en tu plan {plan}.
          </div>
          <button
            onClick={async () => {
              const nextPlan = plan === "free" || plan === "starter" ? "growth" : "agency";
              const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: nextPlan }) });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
            }}
            style={{ padding: "8px 16px", background: "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-sm)", color: "#fff", fontWeight: 700, fontSize: "var(--text-xs)", cursor: "pointer", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}
          >
            {plan === "free" || plan === "starter" ? "Activar Growth — 3 sitios →" : "Activar Agency — 10 sitios →"}
          </button>
        </div>
      )}

    </div>
  );
}
