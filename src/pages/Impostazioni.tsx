import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useEtichette } from "@/hooks/useCrmData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import ResponsiveModal from "@/components/ResponsiveModal";
import { helpContent } from "@/lib/help-content";

const PRESET_COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6",
  "#f97316", "#06b6d4", "#ec4899", "#10b981", "#0ea5e9",
  "#a855f7", "#16a34a", "#dc2626", "#64748b", "#84cc16",
];

const formSchema = z.object({
  nome: z.string().min(1, "Nome mancante"),
  colore: z.string().min(4, "Colore mancante"),
});

const Impostazioni = () => {
  const { etichette, loading, addEtichetta, updateEtichettaColor, deleteEtichetta } = useEtichette();
  const isMobile = useIsMobile();
  const help = helpContent.etichette;
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", colore: "#3b82f6" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const ok = await addEtichetta(values.nome, values.colore);
    if (ok) {
      toast.success(`Etichetta "${values.nome}" creata`);
      form.reset({ nome: "", colore: "#3b82f6" });
      setOpen(false);
    }
  }

  if (loading) {
    return (
      <PageLayout title="Etichette" breadcrumbLabel="Etichette">
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </PageLayout>
    );
  }

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="nome" render={({ field }) => (
          <FormItem><FormLabel>Nome</FormLabel><FormControl><Input placeholder="Nome etichetta" {...field} className="min-h-[44px]" /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="colore" render={({ field }) => (
          <FormItem>
            <FormLabel>Colore</FormLabel>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md border border-border shrink-0" style={{ backgroundColor: field.value }} />
              <FormControl><Input placeholder="#3b82f6" {...field} className="flex-1 min-h-[44px]" /></FormControl>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {PRESET_COLORS.map((c) => (
                <button key={c} type="button" onClick={() => field.onChange(c)}
                  className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 min-h-[28px] min-w-[28px]"
                  style={{ backgroundColor: c, borderColor: field.value === c ? "hsl(var(--foreground))" : "transparent" }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full min-h-[44px]">Registra etichetta</Button>
      </form>
    </Form>
  );

  return (
    <PageLayout
      title="Etichette" breadcrumbLabel="Etichette" helpTitle={help.title} helpBlocks={help.blocks}

      actions={
        <ResponsiveModal trigger={<Button size="sm" className="min-h-[44px] md:min-h-0"><Plus className="mr-2 h-4 w-4" />Registra nuova</Button>}
          title="Nuova etichetta" open={open} onOpenChange={setOpen}>
          {formContent}
        </ResponsiveModal>
      }
    >
      <div className="grid gap-2">
        {etichette.sort((a, b) => a.nome.localeCompare(b.nome)).map((etichetta) => (
          <div key={etichetta.id}
            className={`flex items-center justify-between rounded-lg border border-border bg-card ${isMobile ? "px-3 py-3" : "px-4 py-3"}`}>
            <div className="flex items-center gap-3 flex-wrap">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="cursor-pointer hover:opacity-80 transition-opacity min-h-[32px]" title="Cambia colore">
                    <Badge className="text-xs font-semibold border"
                      style={{ backgroundColor: `${etichetta.colore}20`, borderColor: etichetta.colore, color: etichetta.colore }}>
                      {etichetta.nome}
                    </Badge>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="start">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Scegli colore</p>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_COLORS.map((c) => (
                        <button key={c} onClick={() => updateEtichettaColor(etichetta.id, c)}
                          className="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 min-h-[32px] min-w-[32px]"
                          style={{ backgroundColor: c, borderColor: etichetta.colore === c ? "hsl(var(--foreground))" : "transparent" }}
                        />
                      ))}
                    </div>
                    <Input value={etichetta.colore} onChange={(e) => updateEtichettaColor(etichetta.id, e.target.value)} placeholder="#hex" className="h-8 text-xs mt-1" />
                  </div>
                </PopoverContent>
              </Popover>
              {etichetta.is_default && <Badge variant="secondary" className="text-xs">Default</Badge>}
            </div>
            {!etichetta.is_default && (
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive h-10 w-10 p-0 min-h-[44px] min-w-[44px]"
                onClick={() => deleteEtichetta(etichetta.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

    </PageLayout>
  );
};

export default Impostazioni;
