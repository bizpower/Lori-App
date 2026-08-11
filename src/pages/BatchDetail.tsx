import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLeads, useEtichette, useListe, LeadDB } from "@/hooks/useCrmData";
import { createLeadColumns, LeadWithOperatore } from "@/components/columns/leadColumns";
import { DataTable } from "@/components/DataTable";
import { LeadCard } from "@/components/MobileDataCards";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Trash2, Pencil, MoreVertical, Upload } from "lucide-react";
import ImportLeadsModal from "@/components/ImportLeadsModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Metriche from "@/components/Metriche";
import { toast } from "sonner";
import ResponsiveModal from "@/components/ResponsiveModal";
import HelpButton from "@/components/HelpButton";
import { helpContent } from "@/lib/help-content";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  nome: z.string().min(1, "Nome obbligatorio"),
  azienda: z.string().min(1, "Azienda obbligatoria"),
  link_profilo: z.string().optional(),
  link_azienda: z.string().optional(),
  etichetta: z.string().min(1, "Etichetta obbligatoria"),
});

const editSchema = z.object({
  nome: z.string().min(1, "Nome obbligatorio"),
  azienda: z.string().min(1, "Azienda obbligatoria"),
  link_profilo: z.string().optional(),
  link_azienda: z.string().optional(),
  etichetta: z.string().min(1, "Etichetta obbligatoria"),
  note_contatto: z.string().optional(),
  note_retargeting: z.string().optional(),
  messaggio_contatto: z.string().optional(),
  messaggio_retargeting: z.string().optional(),
});

const BatchDetail = () => {
  const { id } = useParams();
  const { leads, loading: leadsLoading, addLead, updateLead, deleteLeads, reload } = useLeads(id);
  const { etichette, tabelle, loading: etLoading, addFoglio, deleteFoglio, renameFoglio } = useEtichette();
  const [renamingFoglio, setRenamingFoglio] = useState<{ id: string; nome: string } | null>(null);
  const [deletingFoglio, setDeletingFoglio] = useState<{ id: string; nome: string } | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const { liste } = useListe();
  const lista = liste.find((l) => l.id === id);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editLead, setEditLead] = useState<LeadDB | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<LeadDB | null>(null);

  const isMobile = useIsMobile();
  const help = helpContent["dettaglio-lista"];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", azienda: "", link_profilo: "", link_azienda: "", etichetta: "" },
  });

  const editForm = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: { nome: "", azienda: "", link_profilo: "", link_azienda: "", etichetta: "", note_contatto: "", note_retargeting: "", messaggio_contatto: "", messaggio_retargeting: "" },
  });

  useEffect(() => {
    if (editLead) {
      editForm.reset({
        nome: editLead.nome,
        azienda: editLead.azienda,
        link_profilo: editLead.link_profilo || "",
        link_azienda: editLead.link_azienda || "",
        etichetta: editLead.etichetta_id || "",
        note_contatto: editLead.note_contatto || "",
        note_retargeting: editLead.note_retargeting || "",
        messaggio_contatto: editLead.messaggio_contatto || "",
        messaggio_retargeting: editLead.messaggio_retargeting || "",
      });
    }
  }, [editLead]);

  const handleDeleteSelected = (indices: number[]) => {
    const idsToRemove = indices.map((i) => leads[i]?.id).filter(Boolean);
    deleteLeads(idsToRemove);
  };

  const handleUpdateLead = (leadId: string, field: string, value: string) => {
    updateLead(leadId, field, value, etichette.map(e => ({ id: e.id, nome: e.nome, colore: e.colore })));
  };

  const handleAddLead = async (values: z.infer<typeof formSchema>) => {
    if (!id) return;
    const ok = await addLead({
      lista_id: id,
      nome: values.nome,
      azienda: values.azienda,
      link_profilo: values.link_profilo,
      link_azienda: values.link_azienda,
      etichetta_id: values.etichetta,
    });
    if (ok) {
      toast.success(`Lead "${values.nome}" aggiunto`);
      form.reset();
      setSheetOpen(false);
    }
  };

  const handleEditLead = async (values: z.infer<typeof editSchema>) => {
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

  const columns = useMemo(() => createLeadColumns(handleUpdateLead, false, {
    onEdit: (lead) => setEditLead(lead as any),
    onDelete: (lead) => setDeleteConfirm(lead as any),
    etichette: etichette.map(e => ({ id: e.id, nome: e.nome, colore: e.colore })),
  }), [etichette]);

  const metricheLeads = leads.map(l => ({ ...l, etichetta: l.etichetta_id || "", batch: l.lista_id }));
  const metricheEtichette = etichette.map(e => ({ id: e.id, nome: e.nome, colore: e.colore, default: e.is_default, tabelle: [] }));

  const leadFormFields = (f: any, etichetteLista: typeof etichette) => (
    <>
      <FormField control={f.control} name="nome" render={({ field }: any) => (
        <FormItem><FormLabel>Nome</FormLabel><FormControl><Input placeholder="Mario Rossi" {...field} className="min-h-[44px]" /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={f.control} name="azienda" render={({ field }: any) => (
        <FormItem><FormLabel>Azienda</FormLabel><FormControl><Input placeholder="TechCorp SRL" {...field} className="min-h-[44px]" /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={f.control} name="link_profilo" render={({ field }: any) => (
        <FormItem><FormLabel>Link LinkedIn</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/..." {...field} className="min-h-[44px]" /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={f.control} name="link_azienda" render={({ field }: any) => (
        <FormItem><FormLabel>Link azienda</FormLabel><FormControl><Input placeholder="https://example.com" {...field} className="min-h-[44px]" /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={f.control} name="etichetta" render={({ field }: any) => (
        <FormItem>
          <FormLabel>Etichetta</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Seleziona etichetta" /></SelectTrigger></FormControl>
            <SelectContent>
              {etichetteLista.map((e) => (
                <SelectItem key={e.id} value={e.id}><span style={{ color: e.colore }}>{e.nome}</span></SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )} />
    </>
  );

  return (
    <div className={isMobile ? "px-3 py-3" : "p-6"}>
      {!isMobile && (
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Dashboard</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/batch">Liste</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink>{lista?.nome || "Lista"}</BreadcrumbLink></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className={`flex items-center justify-between ${isMobile ? "mb-3" : "mb-6"}`}>
        <div className="flex items-center gap-1 min-w-0">
          <h1 className={`font-bold text-foreground ${isMobile ? "text-lg" : "text-2xl"}`}>{lista?.nome || "Lista"}</h1>
          <HelpButton pageTitle={help.title} blocks={help.blocks} />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="min-h-[44px] md:min-h-0" onClick={() => setImportOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            {isMobile ? "Importa" : "Importa CSV"}
          </Button>
          <ResponsiveModal
            trigger={<Button size="sm" className="min-h-[44px] md:min-h-0"><Plus className="mr-2 h-4 w-4" />{isMobile ? "Lead" : "Inserisci lead"}</Button>}
            title="Nuovo lead"
            open={sheetOpen}
            onOpenChange={setSheetOpen}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddLead)} className="space-y-4">
                {leadFormFields(form, etichette)}
                <Button type="submit" className="w-full min-h-[44px]">Registra lead</Button>
              </form>
            </Form>
          </ResponsiveModal>
        </div>
      </div>

      <Tabs value={activeTab || (tabelle.length > 0 ? tabelle[0].id : "")} onValueChange={setActiveTab}>
        <div className={`flex items-center justify-between mb-2 ${isMobile ? "flex-col gap-2 items-stretch" : ""}`}>
          <TabsList className={isMobile ? "w-full flex overflow-x-auto" : ""}>
            {tabelle.map((tab) => (
              <div key={tab.id} className="relative flex items-center group">
                <TabsTrigger value={tab.id} className={`${isMobile ? "text-xs px-2 shrink-0" : ""} pr-6`}>
                  {tab.nome}
                </TabsTrigger>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="absolute right-0.5 top-1/2 -translate-y-1/2 p-0.5 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-accent transition-all" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => { setRenamingFoglio(tab); setRenameValue(tab.nome); }}>
                      <Pencil className="mr-2 h-3.5 w-3.5" />Rinomina
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => setDeletingFoglio(tab)}>
                      <Trash2 className="mr-2 h-3.5 w-3.5" />Elimina
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
            <button
              type="button"
              className="inline-flex items-center justify-center px-2 text-muted-foreground hover:text-foreground transition-colors min-h-[32px]"
              onClick={async () => {
                const nome = `Foglio ${tabelle.length + 1}`;
                await addFoglio(nome);
                toast.success(`"${nome}" creato`);
              }}
              title="Aggiungi foglio"
            >
              <Plus className="h-4 w-4" />
            </button>
          </TabsList>
          <Metriche leads={metricheLeads as any} etichette={metricheEtichette as any} />
        </div>
        {tabelle.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <DataTable
              columns={columns}
              data={leads as LeadWithOperatore[]}
              pagination
              onDeleteSelected={(indices) => handleDeleteSelected(indices)}
              mobileCard={(item) => (
                <LeadCard
                  lead={item as any}
                  etichette={etichette.map(e => ({ id: e.id, nome: e.nome, colore: e.colore }))}
                  onEdit={(lead) => setEditLead(lead as any)}
                  onDelete={(lead) => setDeleteConfirm(lead as any)}
                  onUpdateField={(leadId, field, value) => handleUpdateLead(leadId, field, value)}
                />
              )}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Lead Modal */}
      <ResponsiveModal
        trigger={<span />}
        title="Modifica lead"
        open={!!editLead}
        onOpenChange={(open) => { if (!open) setEditLead(null); }}
      >
        {editLead && (
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditLead)} className="space-y-4">
              {leadFormFields(editForm, etichette)}
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
                  onClick={() => { setDeleteConfirm(editLead); }}
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

      {/* Rename foglio */}
      <AlertDialog open={!!renamingFoglio} onOpenChange={(open) => { if (!open) setRenamingFoglio(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rinomina foglio</AlertDialogTitle>
            <AlertDialogDescription>Inserisci il nuovo nome per "{renamingFoglio?.nome}".</AlertDialogDescription>
          </AlertDialogHeader>
          <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} className="min-h-[44px]" autoFocus />
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction disabled={!renameValue.trim()} onClick={async () => {
              if (renamingFoglio && renameValue.trim()) {
                await renameFoglio(renamingFoglio.id, renameValue.trim());
                toast.success("Foglio rinominato");
                setRenamingFoglio(null);
              }
            }}>Salva</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete foglio */}
      <AlertDialog open={!!deletingFoglio} onOpenChange={(open) => { if (!open) setDeletingFoglio(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare foglio?</AlertDialogTitle>
            <AlertDialogDescription>Il foglio "{deletingFoglio?.nome}" verrà eliminato. I lead associati non verranno rimossi.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={async () => {
              if (deletingFoglio) {
                await deleteFoglio(deletingFoglio.id);
                setDeletingFoglio(null);
                if (activeTab === deletingFoglio.id) setActiveTab("");
              }
            }}>Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ImportLeadsModal open={importOpen} onOpenChange={setImportOpen} presetListaId={id} onComplete={reload} />
    </div>
  );
};

export default BatchDetail;
