import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { useListe, useOperatori, Lista } from "@/hooks/useCrmData";
import { batchColumns } from "@/components/columns/batchColumns";
import { DataTable } from "@/components/DataTable";
import { ListaCard } from "@/components/MobileDataCards";

import { Button } from "@/components/ui/button";
import { Plus, Loader2, Pencil, Trash2, MoreHorizontal, Upload } from "lucide-react";
import ImportLeadsModal from "@/components/ImportLeadsModal";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import ResponsiveModal from "@/components/ResponsiveModal";
import { helpContent } from "@/lib/help-content";
import { useState, useMemo } from "react";

const formSchema = z.object({
  nome: z.string().min(1, "Nome mancante"),
  operatore: z.string().min(1, "Seleziona un operatore"),
});

const renameSchema = z.object({
  nome: z.string().min(1, "Nome mancante"),
});

const BatchPage = () => {
  const navigate = useNavigate();
  const help = helpContent.liste;
  const { liste, loading: listeLoading, addLista, updateLista, deleteLista } = useListe();
  const { operatori } = useOperatori();
  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<Lista | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lista | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", operatore: "" },
  });

  const renameForm = useForm<z.infer<typeof renameSchema>>({
    resolver: zodResolver(renameSchema),
  });

  const columns = useMemo(
    () => batchColumns(
      (lista) => {
        setRenameTarget(lista);
        renameForm.reset({ nome: lista.nome });
      },
      (lista) => setDeleteTarget(lista),
    ),
    [renameForm],
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const ok = await addLista(values.nome, values.operatore);
    if (ok) {
      const op = operatori.find((o) => o.id === values.operatore);
      toast.success(`Lista "${values.nome}" creata per ${op?.nome}`);
      form.reset();
      setOpen(false);
    }
  }

  async function onRename(values: z.infer<typeof renameSchema>) {
    if (!renameTarget) return;
    const ok = await updateLista(renameTarget.id, values.nome);
    if (ok) setRenameTarget(null);
  }

  async function onDelete() {
    if (!deleteTarget) return;
    await deleteLista(deleteTarget.id);
    setDeleteTarget(null);
  }

  if (listeLoading) {
    return (
      <PageLayout title="Liste" breadcrumbLabel="Liste">
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Liste"
      breadcrumbLabel="Liste"
      helpTitle={help.title}
      helpBlocks={help.blocks}
      actions={
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="min-h-[44px] md:min-h-0" onClick={() => setImportOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Importa CSV
          </Button>
          <ResponsiveModal
            trigger={
              <Button size="sm" className="min-h-[44px] md:min-h-0">
                <Plus className="mr-2 h-4 w-4" />
                Nuova lista
              </Button>
            }
            title="Nuova lista"
            open={open}
            onOpenChange={setOpen}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="nome" render={({ field }) => (
                  <FormItem><FormLabel>Nome lista</FormLabel><FormControl><Input placeholder="Nome della lista" {...field} className="min-h-[44px]" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="operatore" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operatore</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Seleziona operatore" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {operatori.map((op) => (
                          <SelectItem key={op.id} value={op.id}>{op.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full min-h-[44px]">Registra lista</Button>
              </form>
            </Form>
          </ResponsiveModal>
        </div>
      }
    >
      <DataTable
        columns={columns}
        data={liste}
        mobileCard={(item) => (
          <ListaCard
            lista={item}
            onRename={(l) => { setRenameTarget(l); renameForm.reset({ nome: l.nome }); }}
            onDelete={(l) => setDeleteTarget(l)}
          />
        )}
        onRowClick={(item) => navigate(`/batch/${item.id}`)}
      />

      {/* Rename modal */}
      <ResponsiveModal
        title="Rinomina lista"
        open={!!renameTarget}
        onOpenChange={(o) => { if (!o) setRenameTarget(null); }}
      >
        <Form {...renameForm}>
          <form onSubmit={renameForm.handleSubmit(onRename)} className="space-y-4">
            <FormField control={renameForm.control} name="nome" render={({ field }) => (
              <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} className="min-h-[44px]" /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" className="w-full min-h-[44px]">Salva</Button>
          </form>
        </Form>
      </ResponsiveModal>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina lista</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare la lista "{deleteTarget?.nome}"? Tutti i lead associati verranno eliminati.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ImportLeadsModal open={importOpen} onOpenChange={setImportOpen} />
    </PageLayout>
  );
};

export default BatchPage;
