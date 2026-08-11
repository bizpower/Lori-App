import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export class SupabaseConfigError extends Error {
  constructor(missing: string[]) {
    super(
      `Configurazione Supabase mancante: ${missing.join(', ')}. ` +
        `Imposta queste variabili nell'ambiente di deploy (su Vercel: Settings → Environment Variables) e rilancia il build.`,
    );
    this.name = 'SupabaseConfigError';
  }
}

export function missingSupabaseConfig(): string[] {
  return [
    ...(SUPABASE_URL ? [] : ['VITE_SUPABASE_URL']),
    ...(SUPABASE_PUBLISHABLE_KEY ? [] : ['VITE_SUPABASE_PUBLISHABLE_KEY']),
  ];
}

function createSupabaseClient() {
  const missing = missingSupabaseConfig();
  if (missing.length) throw new SupabaseConfigError(missing);

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _client: ReturnType<typeof createSupabaseClient> | undefined;

// Creazione differita al primo uso.
//
// Prima il client veniva creato durante l'import: senza le variabili
// d'ambiente createClient lanciava subito, l'errore risaliva prima che React
// montasse e la pagina restava bianca, senza alcun messaggio. Rimandare la
// creazione lascia all'app il tempo di partire e di mostrare un errore leggibile.
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_client) _client = createSupabaseClient();
    return Reflect.get(_client, prop, receiver);
  },
});
