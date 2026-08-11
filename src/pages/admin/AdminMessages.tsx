import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi } from "@/hooks/useAdminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Megaphone } from "lucide-react";

const AdminMessages = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const broadcast = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Inserisci titolo e messaggio");
      return;
    }
    setSending(true);
    try {
      const res = await adminApi("broadcast-notification", { title, message });
      toast.success(`Messaggio inviato a ${res.count} utenti!`);
      setTitle("");
      setMessage("");
    } catch (e: any) {
      toast.error(e.message);
    }
    setSending(false);
  };

  return (
    <AdminLayout title="Messaggi">
      <div className="max-w-xl space-y-6">
        <div className="rounded-xl border border-white/10 bg-[#111827] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="h-5 w-5 text-slate-300" />
            <h2 className="text-sm font-semibold text-white">Messaggio broadcast</h2>
          </div>
          <p className="text-xs text-white/40 mb-4">
            Invia un messaggio a tutti gli utenti registrati. Apparirà nella sezione "Messaggi da LORI".
          </p>

          <div className="space-y-3">
            <Input
              placeholder="Titolo del messaggio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#0a0e1a] border-white/10 text-white placeholder:text-white/30"
            />
            <Textarea
              placeholder="Corpo del messaggio..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="bg-[#0a0e1a] border-white/10 text-white placeholder:text-white/30 resize-none"
            />
            <Button
              onClick={broadcast}
              disabled={sending}
              className="bg-slate-600 hover:bg-slate-500 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              {sending ? "Invio in corso..." : "Invia a tutti"}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#111827] p-5">
          <p className="text-xs text-white/30">
            💡 Per inviare un messaggio a un singolo utente, vai nella sezione <strong className="text-white/60">Utenti</strong> e clicca "Messaggio".
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
