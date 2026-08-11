import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send, Paperclip, HeadphonesIcon } from "lucide-react";
import ResponsiveModal from "@/components/ResponsiveModal";

const ticketSchema = z.object({
  oggetto: z
    .string()
    .trim()
    .min(1, "Inserisci l'oggetto del ticket")
    .max(200, "L'oggetto non può superare i 200 caratteri"),
  descrizione: z
    .string()
    .trim()
    .min(1, "Descrivi il problema")
    .max(2000, "La descrizione non può superare i 2000 caratteri"),
  categoria: z.string().min(1, "Seleziona una categoria"),
});

const CATEGORIES = [
  { value: "bug", label: "Bug / Errore" },
  { value: "domanda", label: "Domanda" },
  { value: "supporto", label: "Supporto tecnico" },
  { value: "altro", label: "Altro" },
];

interface TicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TicketModal = ({ open, onOpenChange }: TicketModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const { user, email } = useAuth();

  const form = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { oggetto: "", descrizione: "", categoria: "" },
  });

  async function onSubmit(values: z.infer<typeof ticketSchema>) {
    if (!user) {
      toast.error("Devi essere autenticato");
      return;
    }
    const { error } = await supabase.from("support_tickets").insert({
      user_id: user.id,
      user_email: email,
      oggetto: values.oggetto,
      categoria: values.categoria,
      descrizione: values.descrizione,
    } as any);
    if (error) {
      toast.error("Errore nell'invio del ticket");
      console.error(error);
      return;
    }
    toast.success("Ticket inviato con successo! Il team ti risponderà al più presto.");
    form.reset();
    setFiles([]);
    onOpenChange(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 3);
      setFiles(newFiles);
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      trigger={<span className="hidden" />}
      title=""
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="text-center pb-3 border-b border-border">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-3">
            <HeadphonesIcon className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Contatta l'assistenza
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Compila il form e il team ti risponderà al più presto.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="oggetto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Oggetto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descrivi brevemente il problema"
                      {...field}
                      className="min-h-[44px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="min-h-[44px]">
                        <SelectValue placeholder="Seleziona categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descrizione"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrivi nel dettaglio il problema o la tua domanda..."
                      rows={4}
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File upload */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Screenshot (opzionale)
              </label>
              <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-border p-3 hover:bg-muted/50 transition-colors min-h-[44px]">
                <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">
                  {files.length > 0
                    ? files.map((f) => f.name).join(", ")
                    : "Clicca per allegare (max 3 file)"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <Button type="submit" className="w-full min-h-[44px] gap-2">
              <Send className="h-4 w-4" />
              Invia ticket
            </Button>
          </form>
        </Form>
      </div>
    </ResponsiveModal>
  );
};

export default TicketModal;
