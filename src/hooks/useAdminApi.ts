import { supabase, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";

export async function adminApi(action: string, body?: Record<string, unknown>) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Non autenticato");

  // Derivato dall'URL del progetto invece che da una variabile separata: una
  // sola fonte di verità, e nessun rischio di finire su "undefined.supabase.co"
  // quando l'ambiente non definisce VITE_SUPABASE_PROJECT_ID.
  const url = `${SUPABASE_URL}/functions/v1/admin-api?action=${action}`;

  const res = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
      apikey: SUPABASE_PUBLISHABLE_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore admin API");
  return data;
}
