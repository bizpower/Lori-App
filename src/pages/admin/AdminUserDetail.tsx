import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi } from "@/hooks/useAdminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import {
  ArrowLeft,
  CreditCard,
  Shield,
  Gift,
  Ban,
  FileText,
  MessageSquare,
  ExternalLink,
  Send,
  CheckCircle,
  User,
  Activity,
  Bell,
  HeadphonesIcon,
  Download,
  BarChart3,
  Zap,
  Users,
  List,
  Contact,
} from "lucide-react";

/* ── types ── */
interface UserDetail {
  user: {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    email_confirmed_at: string | null;
    display_name: string | null;
    role: string;
  };
  custom_access: { access_type: string; notes: string | null; created_at: string } | null;
  subscription: {
    id: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    plan: string | null;
    amount: number;
    currency: string;
    interval: string | null;
    days_remaining: number;
  } | null;
  invoices: {
    id: string;
    number: string | null;
    amount_paid: number;
    currency: string;
    status: string;
    created: string;
    invoice_pdf: string | null;
    hosted_invoice_url: string | null;
  }[];
  tickets: {
    id: string;
    oggetto: string;
    categoria: string;
    status: string;
    created_at: string;
    descrizione: string;
    admin_reply: string | null;
  }[];
  notifications: {
    id: string;
    title: string;
    message: string;
    read: boolean;
    created_at: string;
  }[];
  billing_profile: {
    tipo: string;
    ragione_sociale: string | null;
    nome: string | null;
    cognome: string | null;
    partita_iva: string | null;
    codice_fiscale: string | null;
    pec: string | null;
    codice_sdi: string | null;
    indirizzo: string | null;
    citta: string | null;
    provincia: string | null;
    cap: string | null;
  } | null;
}

type Tab = "overview" | "billing" | "tickets" | "messages" | "crm";

interface CrmData {
  operatori: { id: string; nome: string; email: string; ruolo: string; created_at: string }[];
  liste: { id: string; nome: string; operatore_id: string; created_at: string }[];
  leads: { id: string; nome: string; azienda: string; lista_id: string; etichetta_id: string | null; created_at: string }[];
}

/* ── helpers ── */
const fmtDate = (d: string | null) => {
  if (!d) return "—";
  return format(new Date(d), "dd MMM yyyy, HH:mm", { locale: it });
};
const fmtShort = (d: string | null) => {
  if (!d) return "—";
  return format(new Date(d), "dd/MM/yyyy", { locale: it });
};
const fmtMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: currency.toUpperCase() }).format(amount / 100);
const timeAgo = (d: string | null) => {
  if (!d) return "mai";
  return formatDistanceToNow(new Date(d), { addSuffix: true, locale: it });
};

/* ── small components ── */
const StatMini = ({ icon: Icon, label, value, color = "text-white" }: { icon: any; label: string; value: React.ReactNode; color?: string }) => (
  <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
    <Icon className="h-4 w-4 text-white/30 shrink-0" />
    <div className="min-w-0">
      <p className="text-[11px] text-white/35 uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-medium truncate ${color}`}>{value}</p>
    </div>
  </div>
);

const TabBtn = ({ active, label, icon: Icon, count, onClick }: { active: boolean; label: string; icon: any; count?: number; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
      active ? "border-slate-300 text-slate-200" : "border-transparent text-white/40 hover:text-white/70"
    }`}
  >
    <Icon className="h-4 w-4" />
    {label}
    {count !== undefined && count > 0 && (
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${active ? "bg-slate-300/20 text-slate-200" : "bg-white/10 text-white/40"}`}>
        {count}
      </span>
    )}
  </button>
);

const SectionCard = ({ title, icon: Icon, action, children }: { title: string; icon: any; action?: React.ReactNode; children: React.ReactNode }) => (
  <div className="rounded-xl border border-white/[0.08] bg-[#111827] overflow-hidden">
    <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.015]">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-300" />
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between py-1.5 border-b border-white/[0.04] last:border-0">
    <span className="text-xs text-white/35">{label}</span>
    <span className="text-sm text-white text-right max-w-[65%] break-words">{value || "—"}</span>
  </div>
);

const Badge = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${color}`}>
    {children}
  </span>
);

/* ── MAIN ── */
const AdminUserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [msgTitle, setMsgTitle] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [crmData, setCrmData] = useState<CrmData | null>(null);
  const [crmLoading, setCrmLoading] = useState(false);

  const reload = () => {
    if (!userId) return;
    adminApi(`user-detail&user_id=${userId}`).then(setData).catch(console.error);
  };

  const loadCrm = useCallback(() => {
    if (!userId || crmData) return;
    setCrmLoading(true);
    adminApi(`user-crm-data&user_id=${userId}`)
      .then(setCrmData)
      .catch(console.error)
      .finally(() => setCrmLoading(false));
  }, [userId, crmData]);

  useEffect(() => {
    setLoading(true);
    if (!userId) return;
    adminApi(`user-detail&user_id=${userId}`)
      .then(setData)
      .catch((e) => { console.error(e); toast.error("Errore nel caricamento utente"); })
      .finally(() => setLoading(false));
  }, [userId]);

  const grantAccess = async () => {
    if (!userId) return;
    try {
      await adminApi("grant-access", { user_id: userId, access_type: "lifetime", notes: "Accesso regalato dall'admin" });
      toast.success("Accesso lifetime concesso!");
      reload();
    } catch (e: any) { toast.error(e.message); }
  };

  const revokeAccess = async () => {
    if (!userId) return;
    try {
      await adminApi("revoke-access", { user_id: userId });
      toast.success("Accesso revocato");
      reload();
    } catch (e: any) { toast.error(e.message); }
  };
  const saveDisplayName = async () => {
    if (!userId) return;
    setSavingName(true);
    try {
      await adminApi("update-display-name", { user_id: userId, display_name: nameDraft.trim() || null });
      toast.success("Nome aggiornato!");
      setEditingName(false);
      reload();
    } catch (e: any) { toast.error(e.message); }
    setSavingName(false);
  };

  const sendMessage = async () => {
    if (!userId || !msgTitle.trim() || !msgBody.trim()) {
      toast.error("Inserisci titolo e messaggio");
      return;
    }
    setSendingMsg(true);
    try {
      await adminApi("send-notification", { user_id: userId, title: msgTitle, message: msgBody });
      toast.success("Messaggio inviato!");
      setMsgTitle("");
      setMsgBody("");
      reload();
    } catch (e: any) { toast.error(e.message); }
    setSendingMsg(false);
  };

  if (loading) {
    return (
      <AdminLayout title="Dettaglio Utente">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl border border-white/[0.08] bg-[#111827] animate-pulse" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout title="Dettaglio Utente">
        <p className="text-white/50">Utente non trovato</p>
      </AdminLayout>
    );
  }

  const { user, subscription, invoices, tickets, notifications, custom_access, billing_profile } = data;
  const FREE_TRIAL_DAYS = 30;
  const freeExpiry = new Date(new Date(user.created_at).getTime() + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000);
  const freeDaysRemaining = Math.max(0, Math.ceil((freeExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const freeExpired = freeDaysRemaining <= 0;

  const subLabel = subscription?.status === "active" ? "ABBONATO" : custom_access ? "LIFETIME" : freeExpired ? "FREE SCADUTO" : "FREE TRIAL";
  const subColor =
    subscription?.status === "active" ? "bg-blue-500/15 text-blue-400"
    : custom_access ? "bg-violet-500/15 text-violet-400"
    : freeExpired ? "bg-red-500/15 text-red-400"
    : "bg-emerald-500/15 text-emerald-400";

  const totalPaid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount_paid, 0);
  const openTickets = tickets.filter(t => t.status !== "chiuso").length;

  return (
    <AdminLayout title="Dettaglio Utente">
      <div className="space-y-5">
        <Button variant="ghost" size="sm" className="text-white/40 hover:text-white hover:bg-white/5 -ml-2" onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Tutti gli utenti
        </Button>

        {/* ──── User Header ──── */}
        <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-5">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shrink-0 border border-white/10">
                <User className="h-6 w-6 text-slate-300" />
              </div>
              <div>
                {editingName ? (
                  <div className="flex items-center gap-2 mb-1">
                    <Input
                      value={nameDraft}
                      onChange={(e) => setNameDraft(e.target.value)}
                      placeholder="Nome utente"
                      className="h-8 w-48 bg-[#0a0e1a] border-white/[0.08] text-white text-sm"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter") saveDisplayName(); if (e.key === "Escape") setEditingName(false); }}
                    />
                    <Button size="sm" className="h-8 text-xs bg-slate-600 hover:bg-slate-500" onClick={saveDisplayName} disabled={savingName}>
                      {savingName ? "..." : "Salva"}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 text-xs text-white/40 hover:text-white" onClick={() => setEditingName(false)}>
                      Annulla
                    </Button>
                  </div>
                ) : (
                  <h2
                    className="text-xl font-bold text-white cursor-pointer hover:text-slate-300 transition-colors"
                    title="Clicca per modificare il nome"
                    onClick={() => { setNameDraft(user.display_name || ""); setEditingName(true); }}
                  >
                    {user.display_name || "Senza nome"} <span className="text-white/20 text-sm">✎</span>
                  </h2>
                )}
                <p className="text-sm text-white/40">{user.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge color={subColor}>{subLabel}</Badge>
                  {user.email_confirmed_at && (
                    <Badge color="bg-emerald-500/15 text-emerald-400">
                      <CheckCircle className="h-3 w-3 inline mr-0.5 -mt-px" /> Verificato
                    </Badge>
                  )}
                  <Badge color="bg-white/5 text-white/30">{user.role}</Badge>
                </div>
                <p className="text-[11px] text-white/25 mt-2">
                  Registrato {timeAgo(user.created_at)} • Ultimo accesso {timeAgo(user.last_sign_in_at)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {custom_access ? (
                <Button size="sm" variant="outline" className="h-8 text-xs border-red-500/20 bg-transparent text-red-400 hover:bg-red-500/10" onClick={revokeAccess}>
                  <Ban className="h-3.5 w-3.5 mr-1" /> Revoca accesso
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="h-8 text-xs border-slate-400/20 bg-transparent text-slate-300 hover:bg-slate-400/10" onClick={grantAccess}>
                  <Gift className="h-3.5 w-3.5 mr-1" /> Regala lifetime
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ──── Quick Stats ──── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatMini
            icon={Zap}
            label="Scadenza piano"
            value={
              subscription
                ? `${fmtShort(subscription.current_period_end)} (${subscription.days_remaining}g)`
                : custom_access
                ? "Lifetime ∞"
                : `${fmtShort(freeExpiry.toISOString())} (${freeDaysRemaining}g)`
            }
            color={
              subscription
                ? subscription.days_remaining <= 5 ? "text-red-400" : "text-blue-400"
                : custom_access ? "text-violet-400"
                : freeDaysRemaining <= 5 ? "text-red-400" : "text-emerald-400"
            }
          />
          <StatMini icon={CreditCard} label="Totale pagato" value={fmtMoney(totalPaid, "eur")} color={totalPaid > 0 ? "text-slate-200" : "text-white/30"} />
          <StatMini icon={FileText} label="Fatture" value={invoices.length} />
          <StatMini icon={HeadphonesIcon} label="Ticket" value={`${openTickets} aperti / ${tickets.length}`} color={openTickets > 0 ? "text-orange-400" : "text-white"} />
          <StatMini icon={Bell} label="Messaggi" value={notifications.length} />
        </div>

        {/* ──── Tabs ──── */}
        <div className="flex overflow-x-auto border-b border-white/[0.06] -mx-1">
          <TabBtn active={tab === "overview"} label="Overview" icon={Activity} onClick={() => setTab("overview")} />
          <TabBtn active={tab === "billing"} label="Fatture & Pagamenti" icon={CreditCard} count={invoices.length} onClick={() => setTab("billing")} />
          <TabBtn active={tab === "tickets"} label="Ticket" icon={HeadphonesIcon} count={openTickets} onClick={() => setTab("tickets")} />
          <TabBtn active={tab === "messages"} label="Messaggi" icon={MessageSquare} count={notifications.length} onClick={() => setTab("messages")} />
          <TabBtn active={tab === "crm"} label="Dati CRM" icon={Contact} onClick={() => { setTab("crm"); loadCrm(); }} />
        </div>

        {/* ──── TAB: Overview ──── */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Account" icon={Shield}>
              <div className="space-y-0.5">
                <InfoRow label="ID" value={<span className="font-mono text-xs text-white/30">{user.id}</span>} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Registrato il" value={fmtDate(user.created_at)} />
                <InfoRow label="Ultimo accesso" value={fmtDate(user.last_sign_in_at)} />
                <InfoRow label="Email confermata" value={user.email_confirmed_at ? fmtDate(user.email_confirmed_at) : <span className="text-orange-400">Non confermata</span>} />
                <InfoRow label="Ruolo" value={user.role} />
              </div>
            </SectionCard>

            <SectionCard title="Abbonamento" icon={Zap}>
              {subscription ? (
                <div className="space-y-0.5">
                  <InfoRow label="Stato" value={
                    <Badge color={subscription.status === "active" ? "bg-blue-500/15 text-blue-400" : subscription.status === "trialing" ? "bg-cyan-500/15 text-cyan-400" : "bg-orange-500/15 text-orange-400"}>
                      {subscription.status}
                    </Badge>
                  } />
                  <InfoRow label="Importo" value={`${fmtMoney(subscription.amount, subscription.currency)}/${subscription.interval}`} />
                  <InfoRow label="Inizio periodo" value={fmtShort(subscription.current_period_start)} />
                  <InfoRow label="Fine periodo" value={fmtShort(subscription.current_period_end)} />
                  <InfoRow label="Giorni rimanenti" value={
                    <span className={`font-bold ${subscription.days_remaining <= 5 ? "text-red-400" : "text-slate-200"}`}>{subscription.days_remaining}</span>
                  } />
                  <InfoRow label="Plan ID" value={<span className="font-mono text-xs text-white/25">{subscription.plan}</span>} />
                </div>
              ) : custom_access ? (
                <div className="space-y-0.5">
                  <InfoRow label="Tipo" value={<span className="text-violet-400 font-semibold">Accesso Lifetime</span>} />
                  <InfoRow label="Concesso il" value={fmtDate(custom_access.created_at)} />
                  {custom_access.notes && <InfoRow label="Note" value={custom_access.notes} />}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Zap className="h-8 w-8 text-white/10 mx-auto mb-2" />
                  <p className="text-sm text-white/30">Nessun abbonamento attivo</p>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Dati di fatturazione" icon={FileText}>
              {billing_profile ? (
                <div className="space-y-0.5">
                  <InfoRow label="Tipo" value={<Badge color="bg-white/5 text-white/50">{billing_profile.tipo}</Badge>} />
                  {billing_profile.ragione_sociale && <InfoRow label="Ragione sociale" value={billing_profile.ragione_sociale} />}
                  {(billing_profile.nome || billing_profile.cognome) && <InfoRow label="Nominativo" value={`${billing_profile.nome || ""} ${billing_profile.cognome || ""}`.trim()} />}
                  {billing_profile.partita_iva && <InfoRow label="P.IVA" value={billing_profile.partita_iva} />}
                  {billing_profile.codice_fiscale && <InfoRow label="Codice fiscale" value={billing_profile.codice_fiscale} />}
                  {billing_profile.pec && <InfoRow label="PEC" value={billing_profile.pec} />}
                  {billing_profile.codice_sdi && <InfoRow label="Codice SDI" value={billing_profile.codice_sdi} />}
                  {billing_profile.indirizzo && <InfoRow label="Indirizzo" value={`${billing_profile.indirizzo}, ${billing_profile.cap || ""} ${billing_profile.citta || ""} (${billing_profile.provincia || ""})`} />}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-8 w-8 text-white/10 mx-auto mb-2" />
                  <p className="text-sm text-white/30">Nessun profilo di fatturazione</p>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Invia messaggio rapido" icon={Send}>
              <div className="space-y-3">
                <Input placeholder="Titolo" value={msgTitle} onChange={(e) => setMsgTitle(e.target.value)} className="bg-[#0a0e1a] border-white/[0.08] text-white text-sm placeholder:text-white/25" />
                <Textarea placeholder="Corpo del messaggio..." value={msgBody} onChange={(e) => setMsgBody(e.target.value)} rows={3} className="bg-[#0a0e1a] border-white/[0.08] text-white text-sm placeholder:text-white/25 resize-none" />
                <Button size="sm" className="bg-slate-600 hover:bg-slate-500" onClick={sendMessage} disabled={sendingMsg}>
                  <Send className="h-3.5 w-3.5 mr-1" /> {sendingMsg ? "Invio..." : "Invia messaggio"}
                </Button>
              </div>
            </SectionCard>
          </div>
        )}

        {/* ──── TAB: Billing ──── */}
        {tab === "billing" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatMini icon={BarChart3} label="Totale pagato" value={fmtMoney(totalPaid, "eur")} color="text-slate-200" />
              <StatMini icon={FileText} label="Fatture totali" value={invoices.length} />
              <StatMini icon={CheckCircle} label="Pagate" value={invoices.filter(i => i.status === "paid").length} color="text-blue-400" />
            </div>

            <SectionCard title="Storico fatture" icon={CreditCard} action={invoices.length > 0 ? <span className="text-[10px] text-white/25">{invoices.length} fatture</span> : undefined}>
              {invoices.length > 0 ? (
                <div className="divide-y divide-white/[0.04]">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white">{inv.number || inv.id.slice(0, 20)}</p>
                          <Badge color={inv.status === "paid" ? "bg-blue-500/15 text-blue-400" : inv.status === "open" ? "bg-orange-500/15 text-orange-400" : "bg-white/10 text-white/40"}>
                            {inv.status === "paid" ? "Pagata" : inv.status === "open" ? "Aperta" : inv.status}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-white/25 mt-0.5">{fmtDate(inv.created)}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-semibold text-white">{fmtMoney(inv.amount_paid, inv.currency)}</span>
                        <div className="flex gap-1">
                          {inv.invoice_pdf && (
                            <a href={inv.invoice_pdf} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-white/5 text-white/25 hover:text-white transition-colors" title="Scarica PDF">
                              <Download className="h-3.5 w-3.5" />
                            </a>
                          )}
                          {inv.hosted_invoice_url && (
                            <a href={inv.hosted_invoice_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-white/5 text-white/25 hover:text-white transition-colors" title="Apri su Stripe">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-10 w-10 text-white/[0.06] mx-auto mb-2" />
                  <p className="text-sm text-white/25">Nessuna fattura registrata</p>
                </div>
              )}
            </SectionCard>
          </div>
        )}

        {/* ──── TAB: Tickets ──── */}
        {tab === "tickets" && (
          <SectionCard title="Ticket assistenza" icon={HeadphonesIcon} action={<span className="text-[10px] text-white/25">{openTickets} aperti su {tickets.length}</span>}>
            {tickets.length > 0 ? (
              <div className="divide-y divide-white/[0.04]">
                {tickets.map((t) => (
                  <div key={t.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge color={t.status === "chiuso" ? "bg-slate-300/15 text-slate-300" : t.status === "in_lavorazione" ? "bg-blue-500/15 text-blue-400" : "bg-orange-500/15 text-orange-400"}>{t.status}</Badge>
                          <Badge color="bg-white/5 text-white/30">{t.categoria}</Badge>
                        </div>
                        <p className="text-sm font-medium text-white">{t.oggetto}</p>
                        <p className="text-xs text-white/40 mt-1 line-clamp-2">{t.descrizione}</p>
                        {t.admin_reply && (
                          <div className="mt-2 px-3 py-2 rounded-lg bg-slate-300/[0.06] border border-slate-400/10">
                            <p className="text-[11px] text-white/25 mb-0.5">Risposta admin:</p>
                            <p className="text-xs text-slate-300">{t.admin_reply}</p>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-white/20 shrink-0 mt-1">{fmtShort(t.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <HeadphonesIcon className="h-10 w-10 text-white/[0.06] mx-auto mb-2" />
                <p className="text-sm text-white/25">Nessun ticket</p>
              </div>
            )}
          </SectionCard>
        )}

        {/* ──── TAB: Messages ──── */}
        {tab === "messages" && (
          <div className="space-y-5">
            <SectionCard title="Nuovo messaggio" icon={Send}>
              <div className="space-y-3">
                <Input placeholder="Titolo del messaggio" value={msgTitle} onChange={(e) => setMsgTitle(e.target.value)} className="bg-[#0a0e1a] border-white/[0.08] text-white text-sm placeholder:text-white/25" />
                <Textarea placeholder="Corpo del messaggio..." value={msgBody} onChange={(e) => setMsgBody(e.target.value)} rows={3} className="bg-[#0a0e1a] border-white/[0.08] text-white text-sm placeholder:text-white/25 resize-none" />
                <Button size="sm" className="bg-slate-600 hover:bg-slate-500" onClick={sendMessage} disabled={sendingMsg}>
                  <Send className="h-3.5 w-3.5 mr-1" /> {sendingMsg ? "Invio..." : "Invia"}
                </Button>
              </div>
            </SectionCard>

            <SectionCard title="Messaggi inviati" icon={Bell} action={<span className="text-[10px] text-white/25">{notifications.length} messaggi</span>}>
              {notifications.length > 0 ? (
                <div className="divide-y divide-white/[0.04]">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-white">{n.title}</p>
                        <Badge color={n.read ? "bg-white/5 text-white/20" : "bg-blue-500/15 text-blue-400"}>
                          {n.read ? "Letto" : "Non letto"}
                        </Badge>
                      </div>
                      <p className="text-xs text-white/35">{n.message}</p>
                      <p className="text-[10px] text-white/15 mt-1">{fmtDate(n.created_at)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-10 w-10 text-white/[0.06] mx-auto mb-2" />
                  <p className="text-sm text-white/25">Nessun messaggio inviato</p>
                </div>
              )}
            </SectionCard>
          </div>
        )}

        {/* ──── TAB: CRM ──── */}
        {tab === "crm" && (
          <div className="space-y-5">
            {crmLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-xl border border-white/[0.08] bg-[#111827] animate-pulse" />
                ))}
              </div>
            ) : crmData ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <StatMini icon={Users} label="Operatori" value={crmData.operatori.length} />
                  <StatMini icon={List} label="Liste" value={crmData.liste.length} />
                  <StatMini icon={Contact} label="Lead" value={crmData.leads.length} />
                </div>

                <SectionCard title={`Operatori (${crmData.operatori.length})`} icon={Users}>
                  {crmData.operatori.length > 0 ? (
                    <div className="divide-y divide-white/[0.04]">
                      {crmData.operatori.map((op) => (
                        <div key={op.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">{op.nome}</p>
                            <p className="text-xs text-white/35">{op.email}</p>
                          </div>
                          <Badge color="bg-white/5 text-white/40">{op.ruolo}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/25 text-center py-4">Nessun operatore</p>
                  )}
                </SectionCard>

                <SectionCard title={`Liste (${crmData.liste.length})`} icon={List}>
                  {crmData.liste.length > 0 ? (
                    <div className="divide-y divide-white/[0.04]">
                      {crmData.liste.map((lista) => {
                        const leadsCount = crmData.leads.filter(l => l.lista_id === lista.id).length;
                        const opName = crmData.operatori.find(o => o.id === lista.operatore_id)?.nome || "—";
                        return (
                          <div key={lista.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white">{lista.nome}</p>
                              <p className="text-xs text-white/35">Operatore: {opName}</p>
                            </div>
                            <span className="text-xs text-white/40">{leadsCount} lead</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-white/25 text-center py-4">Nessuna lista</p>
                  )}
                </SectionCard>

                <SectionCard title={`Lead (${crmData.leads.length})`} icon={Contact}>
                  {crmData.leads.length > 0 ? (
                    <div className="divide-y divide-white/[0.04] max-h-[400px] overflow-y-auto">
                      {crmData.leads.map((lead) => {
                        const listaName = crmData.liste.find(l => l.id === lead.lista_id)?.nome || "—";
                        return (
                          <div key={lead.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white">{lead.nome}</p>
                              <p className="text-xs text-white/35">{lead.azienda} • Lista: {listaName}</p>
                            </div>
                            <span className="text-[10px] text-white/20">{fmtShort(lead.created_at)}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-white/25 text-center py-4">Nessun lead</p>
                  )}
                </SectionCard>
              </>
            ) : (
              <p className="text-sm text-white/30">Impossibile caricare i dati CRM.</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUserDetail;
