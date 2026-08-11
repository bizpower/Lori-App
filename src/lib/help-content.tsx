import {
  LayoutDashboard, UserCog, ListChecks, Contact, Tag,
  Filter, BarChart3, Settings, FileText, Search,
  Palette, ArrowUpDown, PieChart, Link2, MessageSquare,
  ExternalLink, Pencil, StickyNote, Sparkles, CheckSquare,
  Users, FolderOpen, Eye, MousePointerClick, Activity,
  Clock, ChevronRight, Table2, Columns3, Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { HelpBlock } from "@/components/HelpButton";
import ScoreBar from "@/components/ScoreBar";

/* ───── Mini preview components ───── */

const LeadRowPreview = () => (
  <div className="rounded-md border border-border overflow-hidden text-xs">
    {/* Header */}
    <div className="grid grid-cols-[28px_1fr_1fr_1.2fr_1fr_80px_90px] gap-2 px-3 py-2 bg-muted/50 font-medium text-muted-foreground">
      <span />
      <span>Nome</span>
      <span>Azienda</span>
      <span>Messaggio</span>
      <span>Note</span>
      <span>Data</span>
      <span>Etichetta</span>
    </div>
    {/* Row 1 */}
    <div className="grid grid-cols-[28px_1fr_1fr_1.2fr_1fr_80px_90px] gap-2 px-3 py-2 items-center border-t border-border">
      <Checkbox className="h-3.5 w-3.5" checked={true} />
      <span className="flex items-center gap-1 font-medium">
        Mario Rossi <ExternalLink className="h-3 w-3 text-primary" />
      </span>
      <span className="text-primary">TechCorp</span>
      <span className="text-muted-foreground truncate">Buongiorno, vorrei...</span>
      <span className="text-muted-foreground italic">Interessato</span>
      <span className="text-muted-foreground">12 Mar 2026</span>
      <Badge variant="outline" style={{ borderColor: "#3b82f6", color: "#3b82f6", fontSize: "10px" }}>Nuovo</Badge>
    </div>
    {/* Row 2 */}
    <div className="grid grid-cols-[28px_1fr_1fr_1.2fr_1fr_80px_90px] gap-2 px-3 py-2 items-center border-t border-border bg-muted/20">
      <Checkbox className="h-3.5 w-3.5" />
      <span className="flex items-center gap-1 font-medium">
        Laura Bianchi <ExternalLink className="h-3 w-3 text-primary" />
      </span>
      <span>DesignLab</span>
      <span className="flex items-center gap-1 text-muted-foreground">
        <span className="truncate">Ciao, ho visto il...</span>
        <Sparkles className="h-3 w-3 text-primary shrink-0" />
      </span>
      <span className="text-muted-foreground">—</span>
      <span className="text-muted-foreground">10 Mar 2026</span>
      <Badge variant="outline" style={{ borderColor: "#f59e0b", color: "#f59e0b", fontSize: "10px" }}>Follow Up</Badge>
    </div>
  </div>
);

const TabsPreview = () => (
  <Tabs defaultValue="foglio1" className="w-full">
    <TabsList className="w-full">
      <TabsTrigger value="foglio1" className="flex-1 text-xs">Foglio 1</TabsTrigger>
      <TabsTrigger value="foglio2" className="flex-1 text-xs">Foglio 2</TabsTrigger>
      <TabsTrigger value="foglio3" className="flex-1 text-xs">Foglio 3</TabsTrigger>
    </TabsList>
  </Tabs>
);

const EtichettaPreview = () => (
  <div className="flex flex-wrap gap-2">
    <Badge variant="outline" style={{ borderColor: "#3b82f6", color: "#3b82f6" }}>Nuovo</Badge>
    <Badge variant="outline" style={{ borderColor: "#ef4444", color: "#ef4444" }}>Follow Up</Badge>
    <Badge variant="outline" style={{ borderColor: "#10b981", color: "#10b981" }}>Trattativa</Badge>
    <Badge variant="outline" style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}>Preventivo Inviato</Badge>
    <Badge variant="outline" style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}>In trattativa</Badge>
    <Badge variant="outline" style={{ borderColor: "#06b6d4", color: "#06b6d4" }}>Follow up</Badge>
  </div>
);

const ScoreBarPreview = () => (
  <div className="space-y-2">
    <div className="flex items-center gap-3 text-xs">
      <span className="w-28 font-medium">Marco (ottimo)</span>
      <div className="flex-1"><ScoreBar score={92} /></div>
      <span className="text-muted-foreground w-8 text-right">92</span>
    </div>
    <div className="flex items-center gap-3 text-xs">
      <span className="w-28 font-medium">Sara (medio)</span>
      <div className="flex-1"><ScoreBar score={55} /></div>
      <span className="text-muted-foreground w-8 text-right">55</span>
    </div>
    <div className="flex items-center gap-3 text-xs">
      <span className="w-28 font-medium">Luca (basso)</span>
      <div className="flex-1"><ScoreBar score={20} /></div>
      <span className="text-muted-foreground w-8 text-right">20</span>
    </div>
  </div>
);

const SearchPreview = () => (
  <div className="flex items-center gap-2">
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <Input
        placeholder="Cerca per nome, azienda..."
        className="pl-8 h-8 text-xs"
        readOnly
        defaultValue="Tech"
      />
    </div>
    <Button size="sm" className="h-8 text-xs gap-1">
      <Plus className="h-3.5 w-3.5" />
      Nuovo
    </Button>
  </div>
);

const MetrichePreview = () => (
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-2 text-xs">
      <div className="h-3 w-3 rounded-full" style={{ background: "#22c55e" }} />
      <span>Collegamento <strong>45%</strong></span>
    </div>
    <div className="flex items-center gap-2 text-xs">
      <div className="h-3 w-3 rounded-full" style={{ background: "#f59e0b" }} />
      <span>Contattato <strong>30%</strong></span>
    </div>
    <div className="flex items-center gap-2 text-xs">
      <div className="h-3 w-3 rounded-full" style={{ background: "#ef4444" }} />
      <span>Nessun col. <strong>25%</strong></span>
    </div>
  </div>
);

/* ───── Help content ───── */

export const helpContent: Record<string, { title: string; blocks: HelpBlock[] }> = {
  operatori: {
    title: "Come funziona la sezione Operatori",
    blocks: [
      {
        icon: <UserCog className="h-5 w-5" />,
        title: "Lista operatori",
        description: "Visualizza tutti gli operatori in tabella con nome, email, ruolo e barra di performance.",
        preview: <SearchPreview />,
      },
      {
        icon: <Activity className="h-5 w-5" />,
        title: "Barra performance",
        description: "La barra colorata mostra il punteggio (0-100) calcolato sullo stato dei lead: da rosso (basso) ad arancione e verde (alto).",
        preview: <ScoreBarPreview />,
      },
      {
        icon: <Settings className="h-5 w-5" />,
        title: "Aggiungi operatore",
        description: "Clicca 'Nuovo operatore' per registrare un membro con nome, email e ruolo (Commerciale, Direttore, Account Manager, Consulente).",
      },
    ],
  },
  liste: {
    title: "Come funziona la sezione Liste",
    blocks: [
      {
        icon: <FolderOpen className="h-5 w-5" />,
        title: "Cosa sono le liste",
        description: "Le liste raggruppano i lead per operatore. Ogni lista mostra nome, operatore assegnato e conteggio lead.",
        preview: <SearchPreview />,
      },
      {
        icon: <Eye className="h-5 w-5" />,
        title: "Dettaglio lista",
        description: "Clicca su una lista per accedere al dettaglio con tab, metriche e grafico a torta.",
      },
      {
        icon: <PieChart className="h-5 w-5" />,
        title: "Metriche",
        description: "Il pannello Metriche mostra la distribuzione dei lead per etichetta nella lista.",
        preview: <MetrichePreview />,
      },
    ],
  },
  "dettaglio-lista": {
    title: "Come funziona il dettaglio lista",
    blocks: [
      {
        icon: <Columns3 className="h-5 w-5" />,
        title: "Tab sezioni",
        description: "I lead sono divisi in tab. Il tab attivo filtra i lead per le etichette associate a quella sezione.",
        preview: <TabsPreview />,
      },
      {
        icon: <Table2 className="h-5 w-5" />,
        title: "Struttura riga lead",
        description: "Ogni riga della tabella contiene: checkbox, nome con link LinkedIn, azienda, messaggio, note, data e etichetta colorata. Ecco un esempio interattivo:",
        preview: <LeadRowPreview />,
      },
      {
        icon: <CheckSquare className="h-5 w-5" />,
        title: "Checkbox selezione",
        description: "La checkbox a sinistra di ogni riga serve per selezionare lead. Quella in testa seleziona/deseleziona tutti.",
        preview: (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Checkbox className="h-3.5 w-3.5" checked={true} />
              <span>Lead selezionato</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox className="h-3.5 w-3.5" />
              <span>Lead non selezionato</span>
            </div>
          </div>
        ),
      },
      {
        icon: <ExternalLink className="h-5 w-5" />,
        title: "Link profilo e azienda",
        description: "L'icona accanto al nome apre il profilo LinkedIn. Se presente, il nome dell'azienda è un link cliccabile.",
        preview: (
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 font-medium">
              Mario Rossi <ExternalLink className="h-3 w-3 text-primary" />
            </span>
            <span className="text-primary underline cursor-pointer">TechCorp →</span>
          </div>
        ),
      },
      {
        icon: <Sparkles className="h-5 w-5" />,
        title: "Generazione AI ✨",
        description: "Nel campo messaggio, il pulsante ✨ genera un messaggio personalizzato basato su nome, azienda e profilo del lead.",
        preview: (
          <div className="flex items-center gap-2">
            <Input className="h-8 text-xs flex-1" readOnly defaultValue="Buongiorno Mario, ho visto che..." />
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-primary">
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
      {
        icon: <Tag className="h-5 w-5" />,
        title: "Etichette colorate",
        description: "Ogni lead ha un'etichetta che ne definisce lo stato. Le etichette determinano in quale tab appare il lead.",
        preview: <EtichettaPreview />,
      },
      {
        icon: <PieChart className="h-5 w-5" />,
        title: "Metriche",
        description: "Clicca 'Metriche' per il grafico a torta con la distribuzione dei lead per etichetta.",
        preview: <MetrichePreview />,
      },
    ],
  },
  lead: {
    title: "Come funziona la sezione Lead",
    blocks: [
      {
        icon: <Contact className="h-5 w-5" />,
        title: "Tutti i lead",
        description: "Visione globale di tutti i lead, indipendentemente da lista o operatore.",
        preview: <SearchPreview />,
      },
      {
        icon: <Table2 className="h-5 w-5" />,
        title: "Struttura riga lead",
        description: "Ogni riga ha la stessa struttura del dettaglio lista:",
        preview: <LeadRowPreview />,
      },
      {
        icon: <ArrowUpDown className="h-5 w-5" />,
        title: "Ordinamento colonne",
        description: "Clicca sull'intestazione per ordinare i lead. Funziona su nome, azienda, data ed etichetta.",
      },
      {
        icon: <Filter className="h-5 w-5" />,
        title: "Ricerca globale",
        description: "Filtra i lead per nome, azienda o qualsiasi campo visibile.",
        preview: <SearchPreview />,
      },
    ],
  },
  etichette: {
    title: "Come funziona la sezione Etichette",
    blocks: [
      {
        icon: <Tag className="h-5 w-5" />,
        title: "Sistema etichette",
        description: "Le etichette categorizzano i lead. Ogni etichetta ha nome, colore e sezioni associate.",
        preview: <EtichettaPreview />,
      },
      {
        icon: <Palette className="h-5 w-5" />,
        title: "Personalizzazione colori",
        description: "Clicca su un'etichetta per cambiarne il colore con preset o codice HEX personalizzato.",
        preview: (
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6", "#06b6d4"].map(c => (
                <div key={c} className="h-6 w-6 rounded-full border-2 border-border cursor-pointer hover:scale-110 transition-transform" style={{ background: c }} />
              ))}
            </div>
            <Input className="h-7 w-24 text-xs font-mono" readOnly defaultValue="#3b82f6" />
          </div>
        ),
      },
      {
        icon: <Columns3 className="h-5 w-5" />,
        title: "Sezioni associate",
        description: "Ogni etichetta è collegata a sezioni. Le sezioni determinano in quale tab il lead sarà visibile.",
        preview: <TabsPreview />,
      },
    ],
  },
};
