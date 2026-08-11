import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { missingSupabaseConfig } from "./integrations/supabase/client";

const rootEl = document.getElementById("root")!;

// Se il deploy non ha le variabili Supabase l'app non può funzionare. Meglio
// dirlo a schermo che lasciare una pagina bianca: senza questo controllo il
// primo accesso al client fallisce e non resta traccia visibile del motivo.
const missing = missingSupabaseConfig();

if (missing.length) {
  rootEl.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#0f172a;color:#e2e8f0">
      <div style="max-width:560px">
        <h1 style="margin:0 0 12px;font-size:20px;font-weight:700">Configurazione incompleta</h1>
        <p style="margin:0 0 16px;line-height:1.6;color:#94a3b8">
          L'applicazione non riesce a connettersi al database perché mancano queste variabili d'ambiente:
        </p>
        <ul style="margin:0 0 16px;padding-left:20px;line-height:1.9;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px">
          ${missing.map((m) => `<li>${m}</li>`).join("")}
        </ul>
        <p style="margin:0;line-height:1.6;color:#94a3b8">
          Impostale nell'ambiente di deploy (su Vercel: <strong style="color:#e2e8f0">Settings → Environment Variables</strong>),
          poi rilancia il build. Le variabili <code style="font-family:ui-monospace,monospace;font-size:13px">VITE_*</code>
          vengono incorporate durante la compilazione: aggiungerle senza rifare il deploy non ha effetto.
        </p>
      </div>
    </div>
  `;
} else {
  createRoot(rootEl).render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );
}
