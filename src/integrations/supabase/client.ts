import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Default del progetto Supabase di LORI CRM.
//
// La publishable key (anon) è pubblica per definizione: viene incorporata nel
// bundle e chiunque apra i DevTools la vede. La protezione dei dati sta nelle
// policy RLS lato database, non nella segretezza di questa stringa — per questo
// può stare nel sorgente. La service role key, che invece è un segreto vero,
// resta fuori dal frontend e vive solo nelle edge function.
//
// Tenerli qui rende il deploy autosufficiente: senza questi default l'app si
// limitava a una schermata di errore su qualsiasi ambiente in cui le variabili
// non fossero state configurate a mano.
const DEFAULT_SUPABASE_URL = 'https://miqesculjotuintesbiw.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcWVzY3Vsam90dWludGVzYml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNDcxNTAsImV4cCI6MjA4ODkyMzE1MH0.W-24IPZQWSh7iltVSaw4Sucmckllh1vW5Wb4d0_mamc';

// Le variabili d'ambiente, se presenti, hanno la precedenza: così si può
// puntare l'app a un progetto Supabase diverso (staging) senza toccare il codice.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;

/** Elenco delle configurazioni mancanti. Con i default attivi resta vuoto. */
export function missingSupabaseConfig(): string[] {
  return [
    ...(SUPABASE_URL ? [] : ['VITE_SUPABASE_URL']),
    ...(SUPABASE_PUBLISHABLE_KEY ? [] : ['VITE_SUPABASE_PUBLISHABLE_KEY']),
  ];
}

function createSupabaseClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _client: ReturnType<typeof createSupabaseClient> | undefined;

// Creazione differita al primo uso: un errore di configurazione non deve
// esplodere durante l'import, prima che React abbia montato qualcosa.
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_client) _client = createSupabaseClient();
    return Reflect.get(_client, prop, receiver);
  },
});
