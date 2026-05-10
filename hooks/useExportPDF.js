// hooks/useExportPDF.js
// Hook que maneja exportación PDF premium (Playwright) y básica (jsPDF)
// Uso: const { exportPDF, exporting } = useExportPDF()

import { useState } from "react";
import { supabase } from "../hooks/useAuth";

export function useExportPDF() {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const exportPDF = async ({ planData, siteUrl, plan }) => {
    setExporting(true);
    setError(null);

    try {
      // Plan free → jsPDF básico (cliente, sin servidor)
      if (plan === "free") {
        await exportBasicPDF(planData, siteUrl);
        return { success: true, type: "basic" };
      }

      // Planes pagados → PDF premium via API (Playwright)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sesión expirada");

      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ planData, siteUrl }),
      });

      if (!response.ok) {
        const err = await response.json();
        // Si falla Playwright en producción, fallback a jsPDF
        if (response.status === 500) {
          console.warn("PDF premium falló, usando fallback básico:", err);
          await exportBasicPDF(planData, siteUrl);
          return { success: true, type: "fallback" };
        }
        throw new Error(err.error || "Error al generar el PDF");
      }

      // Descargar el blob
      const blob = await response.blob();
      const domain = siteUrl
        ? siteUrl.replace(/https?:\/\//, "").replace(/\//g, "")
        : "plan";
      const fecha = new Date().toISOString().split("T")[0];
      const filename = `CAEVIK-${domain}-${fecha}.pdf`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true, type: "premium" };
    } catch (err) {
      console.error("Error exportando PDF:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setExporting(false);
    }
  };

  return { exportPDF, exporting, error };
}

// ─── jsPDF básico (fallback / plan free) ─────────────────────────────────────
// Limpio, sin dependencias del servidor

async function exportBasicPDF(planData, siteUrl) {
  // Cargar jsPDF desde CDN si no está disponible
  if (!window.jspdf) {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Header
  doc.setFillColor(10, 10, 15);
  doc.rect(0, 0, pageW, 297, "F");

  doc.setTextColor(124, 58, 237);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("CAEVIK", margin, y + 8);

  doc.setTextColor(200, 200, 220);
  doc.setFontSize(12);
  doc.text("Plan de Tráfico Orgánico", margin, y + 18);

  if (siteUrl) {
    doc.setTextColor(160, 130, 250);
    doc.setFontSize(10);
    doc.text(siteUrl, margin, y + 26);
  }

  doc.setTextColor(100, 100, 120);
  doc.setFontSize(9);
  const fecha = new Date().toLocaleDateString("es-MX");
  doc.text(fecha, pageW - margin - doc.getTextWidth(fecha), y + 26);

  // Línea separadora
  y += 34;
  doc.setDrawColor(60, 60, 80);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 10;

  // Contenido
  const content = typeof planData === "string"
    ? planData
    : JSON.stringify(planData, null, 2);

  // Limpiar emojis y caracteres especiales
  const clean = content.replace(/[\u{1F300}-\u{1FFFF}]/gu, "").replace(/[^\x00-\x7F\u00C0-\u024F\u0400-\u04FF]/g, "");

  doc.setTextColor(180, 180, 200);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const lines = doc.splitTextToSize(clean, contentW);
  const lineH = 5;

  for (const line of lines) {
    if (y > 280) {
      doc.addPage();
      doc.setFillColor(10, 10, 15);
      doc.rect(0, 0, pageW, 297, "F");
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineH;
  }

  // Footer
  const domain = siteUrl
    ? siteUrl.replace(/https?:\/\//, "").replace(/\//g, "")
    : "plan";
  doc.save(`CAEVIK-${domain}-${fecha}.pdf`);
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
