import { useAuth } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User2, Mail, Shield, Crown, CreditCard, ArrowRight, Building2, UserRound, Loader2, Clock, AlertTriangle } from "lucide-react";
import ProfileSection from "@/components/ProfileSection";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import SubscriptionStatusCard from "@/components/SubscriptionStatusCard";

type BillingType = "privato" | "societa";

interface BillingData {
  tipo: BillingType;
  nome: string;
  cognome: string;
  codice_fiscale: string;
  ragione_sociale: string;
  partita_iva: string;
  codice_sdi: string;
  pec: string;
  indirizzo: string;
  cap: string;
  citta: string;
  provincia: string;
}

const emptyBilling: BillingData = {
  tipo: "privato",
  nome: "",
  cognome: "",
  codice_fiscale: "",
  ragione_sociale: "",
  partita_iva: "",
  codice_sdi: "",
  pec: "",
  indirizzo: "",
  cap: "",
  citta: "",
  provincia: "",
};

const FREE_TRIAL_DAYS = 30;

const Account = () => {
  const { email, user } = useAuth();
  const isMobile = useIsMobile();
  const subStatusHook = useSubscriptionStatus();
  const [billing, setBilling] = useState<BillingData>(emptyBilling);
  const [billingLoading, setBillingLoading] = useState(true);
  const [billingSaving, setBillingSaving] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);
  const [subStatus, setSubStatus] = useState<{
    subscribed: boolean;
    subscription_end: string | null;
    loading: boolean;
  }>({ subscribed: false, subscription_end: null, loading: true });

  // Check subscription status
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("check-subscription");
        if (!error && data) {
          setSubStatus({
            subscribed: data.subscribed,
            subscription_end: data.subscription_end,
            loading: false,
          });
        } else {
          setSubStatus((s) => ({ ...s, loading: false }));
        }
      } catch {
        setSubStatus((s) => ({ ...s, loading: false }));
      }
    })();
  }, [user]);

  // Calculate free trial expiry
  const freeTrialExpiry = user?.created_at
    ? new Date(new Date(user.created_at).getTime() + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000)
    : null;
  const freeTrialDaysLeft = freeTrialExpiry
    ? Math.ceil((freeTrialExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  // Calculate subscription days remaining
  const subDaysLeft = subStatus.subscription_end
    ? Math.ceil((new Date(subStatus.subscription_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("billing_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setBilling({
          tipo: (data.tipo as BillingType) || "privato",
          nome: data.nome || "",
          cognome: data.cognome || "",
          codice_fiscale: data.codice_fiscale || "",
          ragione_sociale: data.ragione_sociale || "",
          partita_iva: data.partita_iva || "",
          codice_sdi: data.codice_sdi || "",
          pec: data.pec || "",
          indirizzo: data.indirizzo || "",
          cap: data.cap || "",
          citta: data.citta || "",
          provincia: data.provincia || "",
        });
        setHasExisting(true);
      }
      setBillingLoading(false);
    })();
  }, [user]);

  const saveBilling = async () => {
    if (!user) return;
    setBillingSaving(true);
    const payload = {
      user_id: user.id,
      ...billing,
    };

    let error;
    if (hasExisting) {
      ({ error } = await supabase
        .from("billing_profiles")
        .update(payload)
        .eq("user_id", user.id));
    } else {
      ({ error } = await supabase
        .from("billing_profiles")
        .insert(payload));
    }

    setBillingSaving(false);
    if (error) {
      toast.error("Errore nel salvataggio dei dati di fatturazione");
    } else {
      setHasExisting(true);
      toast.success("Dati di fatturazione salvati");
    }
  };

  const updateField = (field: keyof BillingData, value: string) => {
    setBilling((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <PageLayout title="Il mio account" breadcrumbLabel="Account">
      <div className={`space-y-6 ${isMobile ? "" : "max-w-2xl"}`}>
        {/* Subscription Status Card */}
        <SubscriptionStatusCard status={subStatusHook} onActivateExtension={() => {}} />

        {/* Profile */}
        <Card className="p-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <User2 className="h-5 w-5 text-primary" />
            Profilo
          </h3>
          <ProfileSection />
        </Card>

        {/* Subscription */}
        <Card className="p-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-primary" />
            Piano di abbonamento
          </h3>

          {subStatus.loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : subStatus.subscribed ? (
            /* Active subscription */
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div>
                  <p className="font-medium text-foreground">Piano Go</p>
                  <p className="text-xs text-muted-foreground">Abbonamento attivo</p>
                </div>
                <Badge className="bg-primary text-primary-foreground">Attivo</Badge>
              </div>
              {subDaysLeft !== null && (
                <div className={`flex items-center gap-2 p-3 rounded-lg border ${
                  subDaysLeft <= 5
                    ? "bg-destructive/5 border-destructive/20 text-destructive"
                    : "bg-muted/50 border-border text-muted-foreground"
                }`}>
                  <Clock className="h-4 w-4 shrink-0" />
                  <span className="text-sm">
                    {subDaysLeft <= 0
                      ? "Abbonamento scaduto — rinnova per continuare"
                      : `Rinnovo tra ${subDaysLeft} giorn${subDaysLeft === 1 ? "o" : "i"} (${new Date(subStatus.subscription_end!).toLocaleDateString("it-IT")})`}
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Free plan */
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                <div>
                  <p className="font-medium text-foreground">Piano Free</p>
                  <p className="text-xs text-muted-foreground">Funzionalità base</p>
                </div>
                <Button variant="outline" size="sm" asChild className="min-h-[44px]">
                  <Link to="/pricing">
                    Upgrade
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              {freeTrialDaysLeft !== null && (
                <div className={`flex items-center gap-2 p-3 rounded-lg border ${
                  freeTrialDaysLeft <= 5
                    ? "bg-destructive/5 border-destructive/20 text-destructive"
                    : freeTrialDaysLeft <= 10
                    ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-400"
                    : "bg-muted/50 border-border text-muted-foreground"
                }`}>
                  {freeTrialDaysLeft <= 5 ? (
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                  ) : (
                    <Clock className="h-4 w-4 shrink-0" />
                  )}
                  <span className="text-sm">
                    {freeTrialDaysLeft <= 0
                      ? "Periodo di prova scaduto — passa al piano Go per continuare"
                      : `${freeTrialDaysLeft} giorn${freeTrialDaysLeft === 1 ? "o" : "i"} rimanent${freeTrialDaysLeft === 1 ? "e" : "i"} del periodo di prova (scade il ${freeTrialExpiry!.toLocaleDateString("it-IT")})`}
                  </span>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Billing / Fatturazione */}
        <Card className="p-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-primary" />
            Dati di fatturazione
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Inserisci i tuoi dati per ricevere la fattura dopo ogni pagamento.
          </p>

          {billingLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Type toggle */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={billing.tipo === "privato" ? "default" : "outline"}
                  size="sm"
                  className="min-h-[40px] flex-1"
                  onClick={() => updateField("tipo", "privato")}
                >
                  <UserRound className="h-4 w-4 mr-1.5" />
                  Privato
                </Button>
                <Button
                  type="button"
                  variant={billing.tipo === "societa" ? "default" : "outline"}
                  size="sm"
                  className="min-h-[40px] flex-1"
                  onClick={() => updateField("tipo", "societa")}
                >
                  <Building2 className="h-4 w-4 mr-1.5" />
                  Società
                </Button>
              </div>

              {billing.tipo === "privato" ? (
                <>
                  <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                    <div>
                      <label className="text-xs text-muted-foreground">Nome *</label>
                      <Input
                        value={billing.nome}
                        onChange={(e) => updateField("nome", e.target.value)}
                        placeholder="Mario"
                        className="mt-1 min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Cognome *</label>
                      <Input
                        value={billing.cognome}
                        onChange={(e) => updateField("cognome", e.target.value)}
                        placeholder="Rossi"
                        className="mt-1 min-h-[44px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Codice Fiscale *</label>
                    <Input
                      value={billing.codice_fiscale}
                      onChange={(e) => updateField("codice_fiscale", e.target.value.toUpperCase())}
                      placeholder="RSSMRA90A01H501Z"
                      className="mt-1 min-h-[44px] uppercase"
                      maxLength={16}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs text-muted-foreground">Ragione Sociale *</label>
                    <Input
                      value={billing.ragione_sociale}
                      onChange={(e) => updateField("ragione_sociale", e.target.value)}
                      placeholder="Azienda S.r.l."
                      className="mt-1 min-h-[44px]"
                    />
                  </div>
                  <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                    <div>
                      <label className="text-xs text-muted-foreground">Partita IVA *</label>
                      <Input
                        value={billing.partita_iva}
                        onChange={(e) => updateField("partita_iva", e.target.value)}
                        placeholder="IT12345678901"
                        className="mt-1 min-h-[44px]"
                        maxLength={13}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Codice Fiscale</label>
                      <Input
                        value={billing.codice_fiscale}
                        onChange={(e) => updateField("codice_fiscale", e.target.value.toUpperCase())}
                        placeholder="12345678901"
                        className="mt-1 min-h-[44px] uppercase"
                        maxLength={16}
                      />
                    </div>
                  </div>
                  <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                    <div>
                      <label className="text-xs text-muted-foreground">Codice SDI</label>
                      <Input
                        value={billing.codice_sdi}
                        onChange={(e) => updateField("codice_sdi", e.target.value.toUpperCase())}
                        placeholder="0000000"
                        className="mt-1 min-h-[44px] uppercase"
                        maxLength={7}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">PEC</label>
                      <Input
                        value={billing.pec}
                        onChange={(e) => updateField("pec", e.target.value)}
                        placeholder="azienda@pec.it"
                        className="mt-1 min-h-[44px]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Shared address fields */}
              <div>
                <label className="text-xs text-muted-foreground">Indirizzo *</label>
                <Input
                  value={billing.indirizzo}
                  onChange={(e) => updateField("indirizzo", e.target.value)}
                  placeholder="Via Roma 1"
                  className="mt-1 min-h-[44px]"
                />
              </div>
              <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
                <div>
                  <label className="text-xs text-muted-foreground">CAP *</label>
                  <Input
                    value={billing.cap}
                    onChange={(e) => updateField("cap", e.target.value)}
                    placeholder="00100"
                    className="mt-1 min-h-[44px]"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Città *</label>
                  <Input
                    value={billing.citta}
                    onChange={(e) => updateField("citta", e.target.value)}
                    placeholder="Roma"
                    className="mt-1 min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Provincia *</label>
                  <Input
                    value={billing.provincia}
                    onChange={(e) => updateField("provincia", e.target.value.toUpperCase())}
                    placeholder="RM"
                    className="mt-1 min-h-[44px] uppercase"
                    maxLength={2}
                  />
                </div>
              </div>

              <Button
                className="min-h-[44px]"
                onClick={saveBilling}
                disabled={billingSaving}
              >
                {billingSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salva dati di fatturazione
              </Button>
            </div>
          )}
        </Card>

        {/* Security */}
        <Card className="p-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            Sicurezza
          </h3>
          <Button variant="outline" className="min-h-[44px]">
            Cambia password
          </Button>
        </Card>

      </div>
    </PageLayout>
  );
};

export default Account;
