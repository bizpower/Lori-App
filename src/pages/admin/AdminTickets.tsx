import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi } from "@/hooks/useAdminApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CheckCircle, MessageSquare } from "lucide-react";

interface Ticket {
  id: string;
  user_id: string;
  user_email: string | null;
  oggetto: string;
  categoria: string;
  descrizione: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  aperto: "bg-orange-500/20 text-orange-400",
  "in_lavorazione": "bg-blue-500/20 text-blue-400",
  chiuso: "bg-slate-300/20 text-slate-200",
};

const AdminTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const load = () => {
    setLoading(true);
    adminApi("list-tickets")
      .then((d) => setTickets(d.tickets || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const reply = async (ticketId: string, status: string) => {
    try {
      await adminApi("reply-ticket", { ticket_id: ticketId, reply: replyText, status });
      toast.success(status === "chiuso" ? "Ticket chiuso" : "Risposta inviata");
      setReplyTo(null);
      setReplyText("");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <AdminLayout title="Ticket Assistenza">
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl border border-white/10 bg-[#111827] animate-pulse" />
            ))
          : tickets.length === 0 ? (
            <p className="text-white/40 text-sm">Nessun ticket presente</p>
          ) : tickets.map((t) => (
              <div key={t.id} className="rounded-xl border border-white/10 bg-[#111827] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusColors[t.status] || statusColors.aperto}`}>
                        {t.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-white/30 px-1.5 py-0.5 rounded bg-white/5">
                        {t.categoria}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white">{t.oggetto}</p>
                    <p className="text-xs text-white/40 mt-0.5">{t.user_email || "Utente sconosciuto"}</p>
                    <p className="text-xs text-white/50 mt-2">{t.descrizione}</p>
                    {t.admin_reply && (
                      <div className="mt-2 p-2 rounded bg-slate-300/10 border border-slate-400/20">
                        <p className="text-xs text-slate-300">Risposta: {t.admin_reply}</p>
                      </div>
                    )}
                    <p className="text-[10px] text-white/20 mt-2">
                      {format(new Date(t.created_at), "dd MMM yyyy, HH:mm", { locale: it })}
                    </p>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    {t.status !== "chiuso" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px] border-white/10 bg-transparent text-white/60 hover:bg-white/5"
                          onClick={() => setReplyTo(replyTo === t.id ? null : t.id)}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Rispondi
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px] border-slate-400/30 bg-transparent text-slate-300 hover:bg-slate-400/10"
                          onClick={() => reply(t.id, "chiuso")}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Chiudi
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {replyTo === t.id && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <Textarea
                      placeholder="Scrivi la risposta..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      className="bg-[#0a0e1a] border-white/10 text-white text-sm placeholder:text-white/30 resize-none"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" className="h-8 text-xs bg-slate-600 hover:bg-slate-500" onClick={() => reply(t.id, "in_lavorazione")}>
                        Invia risposta
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 text-xs text-white/50" onClick={() => setReplyTo(null)}>
                        Annulla
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
      </div>
    </AdminLayout>
  );
};

export default AdminTickets;
