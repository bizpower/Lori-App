import PageLayout from "@/components/layout/PageLayout";
import { useOperatori, Operatore, RUOLO_LABELS } from "@/hooks/useCrmData";
import { createClientiColumns } from "@/components/columns/clientiColumns";
import { DataTable } from "@/components/DataTable";
import { OperatoreCard } from "@/components/MobileDataCards";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Trash2 } from "lucide-react";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import ResponsiveModal from "@/components/ResponsiveModal";
import { helpContent } from "@/lib/help-content";
import { useState, useEffect } from "react";
import OperatoreAvatar from "@/components/OperatoreAvatar";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  nome: z.string().min(1, "Nome mancante"),
  email: z.string().email("Email non valida"),
  ruolo: z.string().min(1, "Ruolo mancante"),
});

const Clienti = () => {
  const help = helpContent.operatori;
  const { operatori, loading, addOperatore, updateOperatore, deleteOperatore, reload } = useOperatori();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOp, setEditOp] = useState<Operatore | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Operatore | null>(null);

  const createForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", email: "", ruolo: "" },
  });

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", email: "", ruolo: "" },
  });

  // Populate edit form when editOp changes
  useEffect(() => {
    if (editOp) {
      editForm.reset({ nome: editOp.nome, email: editOp.email, ruolo: editOp.ruolo });
    }
  }, [editOp]);

  async function onCreate(values: z.infer<typeof formSchema>) {
    const ok = await addOperatore(values.nome, values.email, values.ruolo);
    if (ok) {
      toast.success(`Operatore "${values.nome}" registrato`);
      createForm.reset();
      setCreateOpen(false);
    }
  }

  async function onEdit(values: z.infer<typeof formSchema>) {
    if (!editOp) return;
    const ok = await updateOperatore(editOp.id, values);
    if (ok) {
      toast.success(`Operatore "${values.nome}" aggiornato`);
      setEditOp(null);
    }
  }

  async function onDelete() {
    if (!deleteConfirm) return;
    const ok = await deleteOperatore(deleteConfirm.id);
    if (ok) toast.success("Operatore eliminato");
    setDeleteConfirm(null);
  }

  if (loading) {
    return (
      <PageLayout title="Operatori" breadcrumbLabel="Operatori">
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </PageLayout>
    );
  }

  const operatoreFormFields = (form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>) => (
    <>
      <FormField control={form.control} name="nome" render={({ field }) => (
        <FormItem><FormLabel>Nome</FormLabel><FormControl><Input placeholder="Mario Rossi" {...field} className="min-h-[44px]" /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="email" render={({ field }) => (
        <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="email@azienda.it" {...field} className="min-h-[44px]" /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="ruolo" render={({ field }) => (
        <FormItem>
          <FormLabel>Ruolo</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Seleziona ruolo" /></SelectTrigger></FormControl>
            <SelectContent>
              {Object.entries(RUOLO_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )} />
    </>
  );

  return (
    <PageLayout
      title="Operatori"
      breadcrumbLabel="Operatori"
      helpTitle={help.title}
      helpBlocks={help.blocks}
      actions={
        <ResponsiveModal
          trigger={<Button size="sm" className="min-h-[44px] md:min-h-0"><Plus className="mr-2 h-4 w-4" />Nuovo operatore</Button>}
          title="Nuovo operatore"
          open={createOpen}
          onOpenChange={setCreateOpen}
        >
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreate)} className="space-y-4">
              {operatoreFormFields(createForm)}
              <Button type="submit" className="w-full min-h-[44px]">Registra operatore</Button>
            </form>
          </Form>
        </ResponsiveModal>
      }
    >
      <DataTable
        columns={createClientiColumns(reload, (op) => { setEditOp(null); setDeleteConfirm(op); })}
        data={operatori}
        mobileCard={(item) => <OperatoreCard operatore={item} onDelete={(op) => { setEditOp(null); setDeleteConfirm(op); }} />}
        onRowClick={(item) => setEditOp(item)}
      />

      {/* Edit Modal */}
      <ResponsiveModal
        trigger={<span />}
        title="Modifica operatore"
        open={!!editOp}
        onOpenChange={(open) => { if (!open) setEditOp(null); }}
      >
        {editOp && (
          <div className="space-y-6">
            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-3">
              <OperatoreAvatar
                nome={editOp.nome}
                imageUrl={editOp.image_url}
                operatoreId={editOp.id}
                size="lg"
                editable
                onImageUpdated={(url) => {
                  setEditOp({ ...editOp, image_url: url });
                  reload();
                }}
              />
              <p className="text-xs text-muted-foreground">Clicca per caricare un'immagine</p>
            </div>

            {/* Form */}
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-4">
                {operatoreFormFields(editForm)}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 min-h-[44px]">Salva modifiche</Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-[44px] text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                    onClick={() => { setEditOp(null); setDeleteConfirm(editOp); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </ResponsiveModal>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare operatore?</AlertDialogTitle>
            <AlertDialogDescription>
              L'operatore "{deleteConfirm?.nome}" e tutte le sue liste e lead verranno eliminati permanentemente.
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
    </PageLayout>
  );
};

export default Clienti;
