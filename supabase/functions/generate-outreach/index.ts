import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Endpoint AI configurabile.
// Di default punta al gateway Lovable (comportamento identico all'originale).
// Per uscire da Lovable basta impostare AI_GATEWAY_URL / AI_API_KEY / AI_MODEL
// su un qualsiasi endpoint compatibile con l'API chat/completions.
const AI_GATEWAY_URL =
  Deno.env.get("AI_GATEWAY_URL") ?? "https://ai.gateway.lovable.dev/v1/chat/completions";
const AI_MODEL = Deno.env.get("AI_MODEL") ?? "google/gemini-3-flash-preview";
const AI_API_KEY = Deno.env.get("AI_API_KEY") ?? Deno.env.get("LOVABLE_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    // Require authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorizzato" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Non autorizzato" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { nome, azienda, link_profilo } = await req.json();
    if (!AI_API_KEY) throw new Error("AI_API_KEY (o LOVABLE_API_KEY) non configurata");

    const systemPrompt = `Sei un esperto di outreach LinkedIn B2B in italiano.
Genera esattamente 3 messaggi di outreach brevi (max 300 caratteri ciascuno), personalizzati e professionali.
Ogni messaggio deve essere diverso nello stile: uno formale, uno amichevole, uno diretto.
Rispondi SOLO con un JSON array di 3 stringhe, senza altro testo.`;

    const userPrompt = `Lead: ${nome || "N/D"}
Azienda: ${azienda || "N/D"}
Profilo LinkedIn: ${link_profilo || "non disponibile"}

Genera 3 messaggi di outreach personalizzati per questo lead.`;

    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Troppi richieste, riprova tra poco." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "Crediti AI esauriti." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI error: ${status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    let suggestions: string[];
    try {
      // Try to parse JSON from content (may have markdown backticks)
      const cleaned = content.replace(/```json\n?/g, "").replace(/```/g, "").trim();
      suggestions = JSON.parse(cleaned);
    } catch {
      suggestions = [content];
    }

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-outreach error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Errore" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
