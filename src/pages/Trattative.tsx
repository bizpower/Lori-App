import PageLayout from "@/components/layout/PageLayout";
import { useLeads, useListe, useOperatori, useEtichette, LeadDB } from "@/hooks/useCrmData";
import { createLeadColumns, LeadWithOperatore } from "@/components/columns/leadColumns";
import { DataTable } from "@/components/DataTable";
import { LeadCard } from "@/components/MobileDataCards";
import { useMemo, useState } from "react";
import { helpContent } from "@/lib/help-content";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import ResponsiveModal from "@/components/ResponsiveModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

const editSchema = z.object({
  nome: z.string().min(1),
  azienda: z.string().min(1),
  link_profilo: z.string().optional(),
  link_azienda: z.string().optional(),
  etichetta: z.string().min(1),
  note_contatto: z.string().optional(),
  note_retargeting: z.string().optional(),
  messaggio_contatto: z.string().optional(),
  messaggio_retargeting: z.string().optional(),
});

const Trattative = () => {
  const help = helpContent.lead;
  const isMobile = useIsMobile();

  const { leads, loading: leadsLoading, updateLead, deleteLeads, reload } = useLeads();
  const { liste } = useListe();
  const { operatori } = useOperatori();
  const { etichette } = useEtichette();

  const [search, setSearch] = useState("");
  const [operatoreFilter, setOperatoreFilter] = useState("all");
  const [etichettaFilter, setEtichettaFilter] = useState("all");
  const [listaFilter, setListaFilter] = useState("all");
  const [editLead, setEditLead] = useState<LeadWithOperatore | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<LeadWithOperatore | null>(null);

  const editForm = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: { nome: "", azienda: "", link_profilo: "", link_azienda: "", etichetta: "", note_contatto: "", note_retargeting: "", messaggio_contatto: "", messaggio_retargeting: "" },
  });

  const handleUpdateLead = (leadId: string, field: string, value: string) => {
    updateLead(leadId, field, value, etichette.map(e => ({ id: e.id, nome: e.nome, colore: e.colore })));
  };

  const handleEditOpen = (lead: LeadWithOperatore) => {
    setEditLead(lead);
    editForm.reset({
      nome: lead.nome,
      azienda: lead.azienda,
      link_profilo: lead.link_profilo || "",
      link_azienda: lead.link_azienda || "",
      etichetta: lead.etichetta_id || "",
      note_contatto: lead.note_contatto || "",
      note_retargeting: lead.note_retargeting || "",
      messaggio_contatto: lead.messaggio_contatto || "",
      messaggio_retargeting: lead.messaggio_retargeting || "",
    });
  };

  const handleEditSubmit = async (values: z.infer<typeof editSchema>) => {
    if (!editLead) return;
    const updates: Record<string, string> = {};
    if (values.nome !== editLead.nome) updates.nome = values.nome;
    if (values.azienda !== editLead.azienda) updates.azienda = values.azienda;
    if ((values.link_profilo || "") !== (editLead.link_profilo || "")) updates.link_profilo = values.link_profilo || "";
    if ((values.link_azienda || "") !== (editLead.link_azienda || "")) updates.link_azienda = values.link_azienda || "";
    if (values.etichetta !== (editLead.etichetta_id || "")) updates.etichetta_id = values.etichetta;
    if ((values.note_contatto || "") !== (editLead.note_contatto || "")) updates.note_contatto = values.note_contatto || "";
    if ((values.note_retargeting || "") !== (editLead.note_retargeting || "")) updates.note_retargeting = values.note_retargeting || "";
    if ((values.messaggio_contatto || "") !== (editLead.messaggio_contatto || "")) updates.messaggio_contatto = values.messaggio_contatto || "";
    if ((values.messaggio_retargeting || "") !== (editLead.messaggio_retargeting || "")) updates.messaggio_retargeting = values.messaggio_retargeting || "";

    for (const [field, value] of Object.entries(updates)) {
      await updateLead(editLead.id, field, value, etichette.map(e => ({ id: e.id, nome: e.nome, colore: e.colore })));
    }
    setEditLead(null);
  };

  const handleDeleteLead = async () => {
    if (!deleteConfirm) return;
    await deleteLeads([deleteConfirm.id]);
    setDeleteConfirm(null);
    setEditLead(null);
  };

  const columns = useMemo(() => createLeadColumns(handleUpdateLead, true, {
    onEdit: handleEditOpen,
    onDelete: (lead) => setDeleteConfirm(lead),
    etichette: etichette.map(e => ({ id: e.id, nome: e.nome, colore: e.colore })),
  }), [etichette]);

  // Enrich leads with operatore and lista info
  const enrichedLeads: LeadWithOperatore[] = useMemo(() => {
    return leads.map((lead) => {
      const lista = liste.find((l) => l.id === lead.lista_id);
      const operatore = lista ? operatori.find((o) => o.id === lista.operatore_id) : null;
      return {
        ...lead,
        batch: lead.lista_id,
        etichetta: lead.etichetta_id || "",
        operatoreNome: operatore?.nome || "—",
        listaNome: lista?.nome || "—",
      };
    });
  }, [leads, liste, operatori]);

  // Apply filters
  const filtered = useMemo(() => {
    return enrichedLeads.filter((lead) => {
      if (search) {
        const s = search.toLowerCase();
        if (
          !lead.nome.toLowerCase().includes(s) &&
          !lead.azienda.toLowerCase().includes(s) &&
          !(lead.operatoreNome || "").toLowerCase().includes(s)
        ) return false;
      }
      if (operatoreFilter !== "all") {
        const lista = liste.find((l) => l.id === lead.lista_id);
        if (lista?.operatore_id !== operatoreFilter) return false;
      }
      if (etichettaFilter !== "all" && lead.etichetta_id !== etichettaFilter) return false;
      if (listaFilter !== "all" && lead.lista_id !== listaFilter) return false;
      return true;
    });
  }, [enrichedLeads, search, operatoreFilter, etichettaFilter, listaFilter, liste]);

  const hasFilters = search || operatoreFilter !== "all" || etichettaFilter !== "all" || listaFilter !== "all";
  const clearFilters = () => { setSearch(""); setOperatoreFilter("all"); setEtichettaFilter("all"); setListaFilter("all"); };

  if (leadsLoading) {
    return (
      <PageLayout title="Tutti i lead" breadcrumbLabel="Lead">
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Tutti i lead" breadcrumbLabel="Lead" helpTitle={help.title} helpBlocks={help.blocks}>
      <div className={`mb-4 space-y-3`}>
        <div className={`flex gap-2 ${isMobile ? "flex-col" : "flex-row flex-wrap items-center"}`}>
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cerca nome, azienda, operatore..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 min-h-[40px]" />
          </div>
          <Select value={operatoreFilter} onValueChange={setOperatoreFilter}>
            <SelectTrigger className={`min-h-[40px] ${isMobile ? "w-full" : "w-[180px]"}`}><SelectValue placeholder="Operatore" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli operatori</SelectItem>
              {operatori.map((op) => (<SelectItem key={op.id} value={op.id}>{op.nome}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={etichettaFilter} onValueChange={setEtichettaFilter}>
            <SelectTrigger className={`min-h-[40px] ${isMobile ? "w-full" : "w-[180px]"}`}><SelectValue placeholder="Etichetta" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte le etichette</SelectItem>
              {etichette.map((et) => (
                <SelectItem key={et.id} value={et.id}>
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: et.colore }} />
                    {et.nome}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={listaFilter} onValueChange={setListaFilter}>
            <SelectTrigger className={`min-h-[40px] ${isMobile ? "w-full" : "w-[180px]"}`}><SelectValue placeholder="Lista" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte le liste</SelectItem>
              {liste.map((b) => (<SelectItem key={b.id} value={b.id}>{b.nome}</SelectItem>))}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10 gap-1 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />Reset
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{filtered.length} lead trovati</p>
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        pagination
        mobileCard={(item) => (
          <LeadCard
            lead={item as any}
            etichette={etichette.map(e => ({ id: e.id, nome: e.nome, colore: e.colore }))}
            onEdit={(lead) => handleEditOpen(lead)}
            onDelete={(lead) => setDeleteConfirm(lead)}
            onUpdateField={(leadId, field, value) => handleUpdateLead(leadId, field, value)}
          />
        )}
      />

      {/* Edit Lead Modal */}
      <ResponsiveModal
        trigger={<span />}
        title="Modifica lead"
        open={!!editLead}
        onOpenChange={(open) => { if (!open) setEditLead(null); }}
      >
        {editLead && (
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField control={editForm.control} name="nome" render={({ field }: any) => (
                <FormItem><FormLabel>Nome</FormLabel><FormControl><Input placeholder="Mario Rossi" {...field} className="min-h-[44px]" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={editForm.control} name="azienda" render={({ field }: any) => (
                <FormItem><FormLabel>Azienda</FormLabel><FormControl><Input placeholder="TechCorp SRL" {...field} className="min-h-[44px]" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={editForm.control} name="link_profilo" render={({ field }: any) => (
                <FormItem><FormLabel>Link LinkedIn</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/..." {...field} className="min-h-[44px]" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={editForm.control} name="link_azienda" render={({ field }: any) => (
                <FormItem><FormLabel>Link azienda</FormLabel><FormControl><Input placeholder="https://example.com" {...field} className="min-h-[44px]" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={editForm.control} name="etichetta" render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Etichetta</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Seleziona etichetta" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {etichette.map((e) => (
                        <SelectItem key={e.id} value={e.id}><span style={{ color: e.colore }}>{e.nome}</span></SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="note_contatto" render={({ field }: any) => (
                <FormItem><FormLabel>Note contatto</FormLabel><FormControl><Textarea placeholder="Note..." {...field} className="min-h-[80px]" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={editForm.control} name="messaggio_contatto" render={({ field }: any) => (
                <FormItem><FormLabel>Messaggio contatto</FormLabel><FormControl><Textarea placeholder="Messaggio..." {...field} className="min-h-[80px]" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={editForm.control} name="note_retargeting" render={({ field }: any) => (
                <FormItem><FormLabel>Note retargeting</FormLabel><FormControl><Textarea placeholder="Note retargeting..." {...field} className="min-h-[80px]" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={editForm.control} name="messaggio_retargeting" render={({ field }: any) => (
                <FormItem><FormLabel>Messaggio retargeting</FormLabel><FormControl><Textarea placeholder="Messaggio retargeting..." {...field} className="min-h-[80px]" /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 min-h-[44px]">Salva modifiche</Button>
                <Button type="button" variant="outline"
                  className="min-h-[44px] text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                  onClick={() => setDeleteConfirm(editLead)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        )}
      </ResponsiveModal>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare lead?</AlertDialogTitle>
            <AlertDialogDescription>Il lead "{deleteConfirm?.nome}" verrà eliminato permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLead} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default Trattative;
