import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

// Types matching the DB schema
export interface Operatore {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  ruolo: string;
  image_url: string | null;
  created_at: string;
}

export interface Lista {
  id: string;
  user_id: string;
  nome: string;
  operatore_id: string;
  operatoreNome?: string;
  leadsCount?: number;
  created_at: string;
}

export interface LeadDB {
  id: string;
  user_id: string;
  lista_id: string;
  nome: string;
  azienda: string;
  link_profilo: string;
  link_azienda: string;
  etichetta_id: string | null;
  edit_timestamp: string;
  note_contatto: string;
  note_retargeting: string;
  messaggio_contatto: string;
  messaggio_retargeting: string;
  created_at: string;
  // joined fields
  etichettaNome?: string;
  etichettaColore?: string;
}

export interface EtichettaDB {
  id: string;
  user_id: string | null;
  nome: string;
  colore: string;
  is_default: boolean;
  created_at: string;
  tabelle: string[]; // populated from join
}

export interface TabellaDB {
  id: string;
  nome: string;
}

// Hook for operatori
export function useOperatori() {
  const { user } = useAuth();
  const [operatori, setOperatori] = useState<Operatore[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("operatori")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setOperatori(data as Operatore[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const addOperatore = async (nome: string, email: string, ruolo: string) => {
    if (!user) return false;
    const { error } = await supabase.from("operatori").insert({
      user_id: user.id, nome, email, ruolo,
    });
    if (error) { toast.error("Errore nel salvataggio"); return false; }
    await load();
    return true;
  };

  const updateOperatore = async (id: string, data: Partial<Pick<Operatore, "nome" | "email" | "ruolo" | "image_url">>) => {
    if (!user) return false;
    const { error } = await supabase.from("operatori").update(data).eq("id", id).eq("user_id", user.id);
    if (error) { toast.error("Errore nell'aggiornamento"); return false; }
    await load();
    return true;
  };

  const deleteOperatore = async (id: string) => {
    if (!user) return false;
    const { error } = await supabase.from("operatori").delete().eq("id", id).eq("user_id", user.id);
    if (error) { toast.error("Errore nell'eliminazione"); return false; }
    await load();
    return true;
  };

  return { operatori, loading, addOperatore, updateOperatore, deleteOperatore, reload: load };
}

// Hook for liste
export function useListe() {
  const { user } = useAuth();
  const [liste, setListe] = useState<Lista[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    // Get liste with operatore name
    const { data: listeData, error } = await supabase
      .from("liste")
      .select("*, operatori(nome)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error || !listeData) { setLoading(false); return; }

    // Get lead counts
    const { data: leads } = await supabase
      .from("leads")
      .select("lista_id")
      .eq("user_id", user.id);

    const countMap: Record<string, number> = {};
    leads?.forEach((l: any) => {
      countMap[l.lista_id] = (countMap[l.lista_id] || 0) + 1;
    });

    const enriched = listeData.map((l: any) => ({
      ...l,
      operatoreNome: l.operatori?.nome || "—",
      leadsCount: countMap[l.id] || 0,
    }));

    setListe(enriched);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const addLista = async (nome: string, operatore_id: string) => {
    if (!user) return false;
    const { error } = await supabase.from("liste").insert({
      user_id: user.id, nome, operatore_id,
    });
    if (error) { toast.error("Errore nel salvataggio"); return false; }
    await load();
    return true;
  };

  const updateLista = async (id: string, nome: string) => {
    if (!user) return false;
    const { error } = await supabase.from("liste").update({ nome }).eq("id", id).eq("user_id", user.id);
    if (error) { toast.error("Errore nell'aggiornamento"); return false; }
    setListe(prev => prev.map(l => l.id === id ? { ...l, nome } : l));
    toast.success("Salvato");
    return true;
  };

  const deleteLista = async (id: string) => {
    if (!user) return false;
    const { error } = await supabase.from("liste").delete().eq("id", id).eq("user_id", user.id);
    if (error) { toast.error("Errore nell'eliminazione"); return false; }
    setListe(prev => prev.filter(l => l.id !== id));
    toast.success("Lista eliminata");
    return true;
  };

  return { liste, loading, addLista, updateLista, deleteLista, reload: load };
}

// Hook for leads of a specific lista
export function useLeads(listaId?: string) {
  const { user } = useAuth();
  const [leads, setLeads] = useState<LeadDB[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    let query = supabase
      .from("leads")
      .select("*, etichette(nome, colore)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (listaId) query = query.eq("lista_id", listaId);

    const { data, error } = await query;
    if (!error && data) {
      setLeads(data.map((l: any) => ({
        ...l,
        etichettaNome: l.etichette?.nome || "—",
        etichettaColore: l.etichette?.colore || "#9ca3af",
      })));
    }
    setLoading(false);
  }, [user, listaId]);

  useEffect(() => { load(); }, [load]);

  const addLead = async (lead: {
    lista_id: string;
    nome: string;
    azienda: string;
    link_profilo?: string;
    link_azienda?: string;
    etichetta_id: string;
  }) => {
    if (!user) return false;
    const { error } = await supabase.from("leads").insert({
      user_id: user.id,
      ...lead,
      link_profilo: lead.link_profilo || "",
      link_azienda: lead.link_azienda || "",
    });
    if (error) { toast.error("Errore nel salvataggio"); return false; }
    await load();
    return true;
  };

  const updateLead = async (id: string, field: string, value: string, etichette?: { id: string; nome: string; colore: string }[]) => {
    if (!user) return;
    const { error } = await supabase
      .from("leads")
      // il nome della colonna è dinamico: il tipo generato non copre l'update per chiave variabile
      .update({ [field]: value, edit_timestamp: new Date().toISOString() } as never)
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) { toast.error("Errore nell'aggiornamento"); return; }

    setLeads(prev => prev.map(l => {
      if (l.id !== id) return l;
      const updated = { ...l, [field]: value };
      // When changing etichetta_id, also update display fields
      if (field === "etichetta_id" && etichette) {
        const et = etichette.find(e => e.id === value);
        if (et) {
          updated.etichettaNome = et.nome;
          updated.etichettaColore = et.colore;
        }
      }
      return updated;
    }));
    toast.success("Salvato");
  };

  const deleteLeads = async (ids: string[]) => {
    if (!user || ids.length === 0) return;
    const { error } = await supabase
      .from("leads")
      .delete()
      .in("id", ids)
      .eq("user_id", user.id);
    if (error) { toast.error("Errore nell'eliminazione"); return; }
    setLeads(prev => prev.filter(l => !ids.includes(l.id)));
    toast.success(`${ids.length} lead eliminati`);
  };

  return { leads, loading, addLead, updateLead, deleteLeads, reload: load };
}

// Hook for etichette + fogli (tabelle)
export function useEtichette() {
  const { user } = useAuth();
  const [etichette, setEtichette] = useState<EtichettaDB[]>([]);
  const [tabelle, setTabelle] = useState<TabellaDB[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;

    const [etRes, tabRes] = await Promise.all([
      supabase.from("etichette").select("*").order("created_at"),
      supabase.from("tabelle").select("*"),
    ]);

    if (etRes.data) {
      setEtichette(etRes.data.map((e: any) => ({ ...e, tabelle: [] })));
    }

    if (tabRes.data) {
      const fogli = (tabRes.data as any[]).filter(
        (t) => t.user_id === user.id || t.user_id === null
      );
      setTabelle(fogli as TabellaDB[]);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const addEtichetta = async (nome: string, colore: string) => {
    if (!user) return false;
    const { error } = await supabase
      .from("etichette")
      .insert({ user_id: user.id, nome, colore });
    if (error) { toast.error("Errore nel salvataggio"); return false; }
    await load();
    return true;
  };

  const updateEtichettaColor = async (id: string, colore: string) => {
    await supabase.from("etichette").update({ colore }).eq("id", id);
    setEtichette(prev => prev.map(e => e.id === id ? { ...e, colore } : e));
  };

  const deleteEtichetta = async (id: string) => {
    const { error } = await supabase.from("etichette").delete().eq("id", id);
    if (error) { toast.error("Errore nell'eliminazione"); return; }
    setEtichette(prev => prev.filter(e => e.id !== id));
    toast.success("Etichetta eliminata");
  };

  const addFoglio = async (nome: string) => {
    if (!user) return false;
    const id = crypto.randomUUID();
    const { error } = await supabase.from("tabelle").insert({ id, nome, user_id: user.id } as any);
    if (error) { toast.error("Errore nella creazione del foglio"); return false; }
    await load();
    return true;
  };

  const deleteFoglio = async (id: string) => {
    if (!user) return false;
    const { error } = await supabase.from("tabelle").delete().eq("id", id);
    if (error) { toast.error("Errore nell'eliminazione del foglio"); return false; }
    await load();
    toast.success("Foglio eliminato");
    return true;
  };

  const renameFoglio = async (id: string, nome: string) => {
    const { error } = await supabase.from("tabelle").update({ nome } as any).eq("id", id);
    if (error) { toast.error("Errore nel rinominare"); return false; }
    setTabelle(prev => prev.map(t => t.id === id ? { ...t, nome } : t));
    return true;
  };

  return { etichette, tabelle, loading, addEtichetta, updateEtichettaColor, deleteEtichetta, addFoglio, deleteFoglio, renameFoglio, reload: load };
}

// Score helpers
const SCORE_MAP: Record<string, number> = {};

export function computeScorePercent(operatoreId: string, liste: Lista[], leads: LeadDB[]): number {
  const listaIds = liste.filter(l => l.operatore_id === operatoreId).map(l => l.id);
  const opLeads = leads.filter(l => listaIds.includes(l.lista_id));
  if (opLeads.length === 0) return 0;
  // Simple scoring: each lead = 1 point, max 10 per lead
  return Math.min(100, Math.round((opLeads.length / Math.max(opLeads.length, 10)) * 100));
}

export const RUOLO_LABELS: Record<string, string> = {
  commerciale: "Commerciale",
  direttore: "Direttore",
  account: "Account Manager",
  consulente: "Consulente",
};
