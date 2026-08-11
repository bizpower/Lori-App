// Mock data for LORI CRM replica

export type Ruolo = "commerciale" | "direttore" | "account" | "consulente";

export interface Operatore {
  id: string;
  nome: string;
  email: string;
  ruolo: Ruolo;
  image?: string;
  image_title?: string;
}

export interface Lista {
  id: string;
  nome: string;
  operatore: string;
  operatoreNome: string;
  leadsCount: number;
}

export interface Lead {
  id: string;
  batch: string;
  nome: string;
  azienda: string;
  link_profilo: string;
  link_azienda?: string;
  etichetta: string;
  etichettaNome: string;
  etichettaColore: string;
  edit_timestamp: string;
  note_contatto: string;
  note_retargeting: string;
  messaggio_contatto: string;
  messaggio_retargeting: string;
}

export interface Etichetta {
  id: string;
  nome: string;
  colore: string;
  default: boolean;
  tabelle: string[]; // many-to-many: which tabs this label appears in
}

export interface Tabella {
  id: string;
  nome: string;
}

export const mockTabelle: Tabella[] = [
  { id: "t1", nome: "Foglio 1" },
  { id: "t2", nome: "Foglio 2" },
  { id: "t3", nome: "Foglio 3" },
];

export const mockEtichette: Etichetta[] = [
  { id: "e1", nome: "Nuovo", colore: "#3b82f6", default: true, tabelle: ["t1"] },
  { id: "e2", nome: "Follow Up", colore: "#ef4444", default: true, tabelle: ["t1"] },
  { id: "e3", nome: "Trattativa", colore: "#10b981", default: true, tabelle: ["t3"] },
  { id: "e4", nome: "Preventivo Inviato", colore: "#8b5cf6", default: true, tabelle: ["t4"] },
];

export const mockOperatori: Operatore[] = [
  { id: "1", nome: "Operatore di Esempio", email: "esempio@sample.it", ruolo: "commerciale" },
];

export const mockBatch: Lista[] = [
  { id: "b1", nome: "Lista di Esempio", operatore: "1", operatoreNome: "Operatore di Esempio", leadsCount: 1 },
];

export const mockLeads: Lead[] = [
  {
    id: "l1", batch: "b1", nome: "Lead di Esempio", azienda: "Azienda Sample",
    link_profilo: "https://linkedin.com/in/sample",
    etichetta: "e1", etichettaNome: "Nuovo", etichettaColore: "#3b82f6",
    edit_timestamp: "2025-03-01T10:00:00Z",
    note_contatto: "Questo è un lead di esempio per mostrarti come funziona LORI CRM.",
    note_retargeting: "",
    messaggio_contatto: "", messaggio_retargeting: "",
  },
];

export const mockTrattative = mockBatch.map((b) => ({
  ...b,
  leadsCount: mockLeads.filter((l) => l.batch === b.id).length,
}));

// Alias for backward compat
export type Batch = Lista;
export type Cliente = Operatore;
export const mockClienti = mockOperatori;

// Score system: points based on lead labels
const SCORE_MAP: Record<string, number> = {
  e1: 1,   // Nuovo
  e2: 2,   // Follow Up
  e3: 3,   // Trattativa
  e4: 4,   // Preventivo Inviato
  e5: 2,   // Da ricontattare
  e6: 2,   // Retargeting inviato
  e7: 3,   // In follow-up
  e8: 2,   // Attesa risposta
  e9: 5,   // In trattativa
  e10: 4,  // Proposta inviata
  e11: 10, // Chiuso vinto
  e12: 0,  // Chiuso perso
};

export function getOperatoreScore(operatoreId: string): number {
  const operatoreListe = mockBatch.filter((b) => b.operatore === operatoreId);
  const listeIds = operatoreListe.map((b) => b.id);
  const operatoreLeads = mockLeads.filter((l) => listeIds.includes(l.batch));
  return operatoreLeads.reduce((sum, lead) => sum + (SCORE_MAP[lead.etichetta] || 0), 0);
}

export function getOperatoreLeadCount(operatoreId: string): number {
  const listeIds = mockBatch.filter((b) => b.operatore === operatoreId).map((b) => b.id);
  return mockLeads.filter((l) => listeIds.includes(l.batch)).length;
}

// Max score per lead = 10 (Chiuso vinto). Score % = actual / max possible, capped at 100.
export function getOperatoreScorePercent(operatoreId: string): number {
  const listeIds = mockBatch.filter((b) => b.operatore === operatoreId).map((b) => b.id);
  const leads = mockLeads.filter((l) => listeIds.includes(l.batch));
  if (leads.length === 0) return 0;
  const maxPossible = leads.length * 10; // 10 = max score per lead (Chiuso vinto)
  const actual = leads.reduce((sum, lead) => sum + (SCORE_MAP[lead.etichetta] || 0), 0);
  return Math.min(100, Math.round((actual / maxPossible) * 100));
}

export const RUOLO_LABELS: Record<Ruolo, string> = {
  commerciale: "Commerciale",
  direttore: "Direttore",
  account: "Account Manager",
  consulente: "Consulente",
};
