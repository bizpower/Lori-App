import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "r.difalco@lori-crm.it";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  const supabaseAnon = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Non autorizzato");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAnon.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Non autorizzato");
    if (userData.user.email !== ADMIN_EMAIL) throw new Error("Accesso negato");

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // LIST ALL USERS (from auth + profiles)
    if (action === "list-users") {
      const { data: authUsers, error: authErr } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      if (authErr) throw authErr;

      const { data: profiles } = await supabaseAdmin.from("profiles").select("*");
      const { data: customAccess } = await supabaseAdmin.from("custom_access").select("*");

      const users = authUsers.users.map((u) => {
        const profile = profiles?.find((p) => p.user_id === u.id);
        const access = customAccess?.find((a) => a.user_id === u.id);
        return {
          id: u.id,
          email: u.email,
          display_name: profile?.display_name || null,
          role: profile?.role || "user",
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          email_confirmed_at: u.email_confirmed_at,
          custom_access: access || null,
        };
      });

      return new Response(JSON.stringify({ users }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // LIST ALL TICKETS
    if (action === "list-tickets") {
      const { data: tickets, error } = await supabaseAdmin
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ tickets }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // REPLY TO TICKET
    if (action === "reply-ticket") {
      const { ticket_id, reply, status } = await req.json();
      const { error } = await supabaseAdmin
        .from("support_tickets")
        .update({ admin_reply: reply, status, updated_at: new Date().toISOString() })
        .eq("id", ticket_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // SEND NOTIFICATION
    if (action === "send-notification") {
      const { user_id, title, message } = await req.json();
      const { error } = await supabaseAdmin
        .from("notifications")
        .insert({ user_id, title, message });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // BROADCAST NOTIFICATION (to all users)
    if (action === "broadcast-notification") {
      const { title, message } = await req.json();
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      const inserts = authUsers.users.map((u) => ({
        user_id: u.id,
        title,
        message,
      }));
      const { error } = await supabaseAdmin.from("notifications").insert(inserts);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, count: inserts.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GRANT CUSTOM ACCESS
    if (action === "grant-access") {
      const { user_id, access_type, notes } = await req.json();
      const { error } = await supabaseAdmin
        .from("custom_access")
        .upsert({ user_id, granted_by: ADMIN_EMAIL, access_type: access_type || "lifetime", notes }, { onConflict: "user_id" });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // REVOKE CUSTOM ACCESS
    if (action === "revoke-access") {
      const { user_id } = await req.json();
      const { error } = await supabaseAdmin
        .from("custom_access")
        .delete()
        .eq("user_id", user_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // UPDATE DISPLAY NAME
    if (action === "update-display-name") {
      const { user_id, display_name } = await req.json();
      if (!user_id) throw new Error("user_id richiesto");
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ display_name })
        .eq("user_id", user_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // USER CRM DATA (operatori, liste, leads)
    if (action === "user-crm-data") {
      const userId = url.searchParams.get("user_id");
      if (!userId) throw new Error("user_id richiesto");

      const [opRes, listeRes, leadsRes] = await Promise.all([
        supabaseAdmin.from("operatori").select("id, nome, email, ruolo, created_at").eq("user_id", userId).order("created_at", { ascending: false }),
        supabaseAdmin.from("liste").select("id, nome, operatore_id, created_at").eq("user_id", userId).order("created_at", { ascending: false }),
        supabaseAdmin.from("leads").select("id, nome, azienda, lista_id, etichetta_id, created_at").eq("user_id", userId).order("created_at", { ascending: false }),
      ]);

      return new Response(JSON.stringify({
        operatori: opRes.data || [],
        liste: listeRes.data || [],
        leads: leadsRes.data || [],
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // USER DETAIL (with Stripe subscription info)
    if (action === "user-detail") {
      const userId = url.searchParams.get("user_id");
      if (!userId) throw new Error("user_id richiesto");

      // Get auth user
      const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (authErr || !authUser.user) throw new Error("Utente non trovato");
      const u = authUser.user;

      // Get profile, custom access, tickets, notifications
      const [profileRes, accessRes, ticketsRes, notifsRes, billingRes] = await Promise.all([
        supabaseAdmin.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
        supabaseAdmin.from("custom_access").select("*").eq("user_id", userId).maybeSingle(),
        supabaseAdmin.from("support_tickets").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabaseAdmin.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
        supabaseAdmin.from("billing_profiles").select("*").eq("user_id", userId).maybeSingle(),
      ]);

      // Stripe subscription info
      let subscription = null;
      let invoices: any[] = [];
      const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
      if (stripeKey && u.email) {
        try {
          const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
          const customers = await stripe.customers.list({ email: u.email, limit: 1 });
          if (customers.data.length > 0) {
            const customerId = customers.data[0].id;
            const subs = await stripe.subscriptions.list({ customer: customerId, limit: 1 });
            if (subs.data.length > 0) {
              const sub = subs.data[0];
              subscription = {
                id: sub.id,
                status: sub.status,
                current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
                current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
                plan: sub.items.data[0]?.price?.id || null,
                amount: sub.items.data[0]?.price?.unit_amount || 0,
                currency: sub.items.data[0]?.price?.currency || "eur",
                interval: sub.items.data[0]?.price?.recurring?.interval || null,
                days_remaining: Math.max(0, Math.ceil((sub.current_period_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24))),
              };
            }
            // Get invoices
            const inv = await stripe.invoices.list({ customer: customerId, limit: 10 });
            invoices = inv.data.map((i) => ({
              id: i.id,
              number: i.number,
              amount_paid: i.amount_paid,
              currency: i.currency,
              status: i.status,
              created: new Date(i.created * 1000).toISOString(),
              invoice_pdf: i.invoice_pdf,
              hosted_invoice_url: i.hosted_invoice_url,
            }));
          }
        } catch (e) {
          console.error("Stripe error:", e);
        }
      }

      return new Response(JSON.stringify({
        user: {
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          email_confirmed_at: u.email_confirmed_at,
          display_name: profileRes.data?.display_name || null,
          role: profileRes.data?.role || "user",
        },
        custom_access: accessRes.data || null,
        subscription,
        invoices,
        tickets: ticketsRes.data || [],
        notifications: notifsRes.data || [],
        billing_profile: billingRes.data || null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ADMIN STATS
    if (action === "stats") {
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      const { data: tickets } = await supabaseAdmin.from("support_tickets").select("id, status");
      const { data: customAccess } = await supabaseAdmin.from("custom_access").select("id");

      const now = new Date();
      const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const recentSignups = authUsers.users.filter((u) => new Date(u.created_at) > last7d).length;
      const monthlySignups = authUsers.users.filter((u) => new Date(u.created_at) > last30d).length;
      const openTickets = tickets?.filter((t) => t.status === "aperto").length || 0;

      return new Response(JSON.stringify({
        total_users: authUsers.users.length,
        recent_signups_7d: recentSignups,
        monthly_signups_30d: monthlySignups,
        open_tickets: openTickets,
        total_tickets: tickets?.length || 0,
        custom_access_grants: customAccess?.length || 0,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // BACKFILL DISPLAY NAMES for existing users
    if (action === "backfill-display-names") {
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      const { data: profiles } = await supabaseAdmin.from("profiles").select("user_id, display_name");

      let updated = 0;
      for (const u of authUsers.users) {
        const profile = profiles?.find((p) => p.user_id === u.id);
        if (profile && !profile.display_name) {
          const name =
            u.user_metadata?.display_name ||
            u.user_metadata?.full_name ||
            u.user_metadata?.name ||
            u.email?.split("@")[0] ||
            "Utente";
          await supabaseAdmin
            .from("profiles")
            .update({ display_name: name })
            .eq("user_id", u.id);
          updated++;
        }
      }
      return new Response(JSON.stringify({ success: true, updated }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Azione non riconosciuta");
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: error instanceof Error && (msg === "Non autorizzato" || msg === "Accesso negato") ? 403 : 500,
    });
  }
});
