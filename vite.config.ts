import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Senza questo l'app finisce in un unico bundle da ~2 MB: il browser
        // deve scaricarlo e parsarlo tutto prima del primo render, con effetti
        // diretti su LCP e FCP (e quindi sul ranking).
        //
        // xlsx (export Excel) e recharts (grafici) pesano quanto buona parte
        // del resto e servono solo in alcune schermate: isolarli evita che il
        // loro costo ricada su chi apre semplicemente il login.
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-charts": ["recharts"],
          "vendor-export": ["xlsx"],
        },
      },
    },
    // I chunk vendor restano sopra i 500 kB di default: alziamo la soglia per
    // non trasformare un avviso atteso in rumore a ogni build.
    chunkSizeWarningLimit: 800,
  },
}));
