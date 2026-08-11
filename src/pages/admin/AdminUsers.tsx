import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi } from "@/hooks/useAdminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Gift, Ban, Search, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface UserItem {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  custom_access: { access_type: string; notes: string | null } | null;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [msgTitle, setMsgTitle] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    adminApi("list-users")
      .then((d) => setUsers(d.users || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  const grantAccess = async (userId: string) => {
    try {
      await adminApi("grant-access", { user_id: userId, access_type: "lifetime", notes: "Accesso regalato dall'admin" });
      toast.success("Accesso lifetime concesso!");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const revokeAccess = async (userId: string) => {
    try {
      await adminApi("revoke-access", { user_id: userId });
      toast.success("Accesso revocato");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const sendMessage = async (userId: string) => {
    if (!msgTitle.trim() || !msgBody.trim()) {
      toast.error("Inserisci titolo e messaggio");
      return;
    }
    try {
      await adminApi("send-notification", { user_id: userId, title: msgTitle, message: msgBody });
      toast.success("Messaggio inviato!");
      setSendingTo(null);
      setMsgTitle("");
      setMsgBody("");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const fmtDate = (d: string | null) => {
    if (!d) return "—";
    return format(new Date(d), "dd MMM yyyy, HH:mm", { locale: it });
  };

  return (
    <AdminLayout title="Gestione Utenti">
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            placeholder="Cerca per email o nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[#111827] border-white/10 text-white placeholder:text-white/30"
          />
        </div>

        <p className="text-sm text-white/40">{filtered.length} utenti trovati</p>

        <div className="space-y-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl border border-white/10 bg-[#111827] animate-pulse" />
              ))
            : filtered.map((u) => (
                <div
                  key={u.id}
                  className="rounded-xl border border-white/10 bg-[#111827] p-4 cursor-pointer hover:border-white/20 transition-all"
                  onClick={() => navigate(`/admin/users/${u.id}`)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate">
                          {u.display_name || "Senza nome"}
                        </p>
                        {u.custom_access && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-300/20 text-slate-200 font-medium">
                            {u.custom_access.access_type === "lifetime" ? "LIFETIME" : u.custom_access.access_type}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/40 truncate">{u.email}</p>
                      <div className="flex gap-4 mt-1.5 text-[11px] text-white/30">
                        <span>Registrato: {fmtDate(u.created_at)}</span>
                        <span>Ultimo accesso: {fmtDate(u.last_sign_in_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white"
                        onClick={() => setSendingTo(sendingTo === u.id ? null : u.id)}
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        Messaggio
                      </Button>
                      {u.custom_access ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs border-red-500/30 bg-transparent text-red-400 hover:bg-red-500/10"
                          onClick={() => revokeAccess(u.id)}
                        >
                          <Ban className="h-3.5 w-3.5 mr-1" />
                          Revoca
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs border-slate-400/30 bg-transparent text-slate-300 hover:bg-slate-400/10"
                          onClick={() => grantAccess(u.id)}
                        >
                          <Gift className="h-3.5 w-3.5 mr-1" />
                          Regala accesso
                        </Button>
                      )}
                    </div>
                  </div>

                  {sendingTo === u.id && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2" onClick={(e) => e.stopPropagation()}>
                      <Input
                        placeholder="Titolo del messaggio"
                        value={msgTitle}
                        onChange={(e) => setMsgTitle(e.target.value)}
                        className="bg-[#0a0e1a] border-white/10 text-white text-sm placeholder:text-white/30"
                      />
                      <Input
                        placeholder="Corpo del messaggio"
                        value={msgBody}
                        onChange={(e) => setMsgBody(e.target.value)}
                        className="bg-[#0a0e1a] border-white/10 text-white text-sm placeholder:text-white/30"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" className="h-8 text-xs bg-slate-600 hover:bg-slate-500" onClick={() => sendMessage(u.id)}>
                          Invia
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 text-xs text-white/50" onClick={() => setSendingTo(null)}>
                          Annulla
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
