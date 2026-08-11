import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { isAdminEmail } from "@/lib/admin";
import { UserCog, ListChecks, Contact, Tag, Shield, Loader2 } from "lucide-react";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import SubscriptionBanner from "@/components/SubscriptionBanner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const navItems = [
  { label: "Operatori", href: "/clienti", icon: UserCog, description: "Gestione operatori e score" },
  { label: "Liste", href: "/batch", icon: ListChecks, description: "Visualizzazione liste" },
  { label: "Lead", href: "/trattative", icon: Contact, description: "Tutti i lead" },
  { label: "Etichette", href: "/impostazioni", icon: Tag, description: "Gestione etichette" },
];

const GO_PRICE_ID = "price_1SsOQ1BTHplTkScItOLmlxu8";

const Dashboard = () => {
  const { userType, email } = useAuth();
  const isMobile = useIsMobile();
  const items = navItems;
  const subStatus = useSubscriptionStatus();
  const [activating, setActivating] = useState(false);
  const [searchParams] = useSearchParams();

  // Show success toast when returning from extension checkout
  useEffect(() => {
    if (searchParams.get("extension") === "activated") {
      toast.success("Estensione gratuita attivata con successo!");
      subStatus.refresh();
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [searchParams]);

  const handleActivateExtension = async () => {
    setActivating(true);
    try {
      const { data, error } = await supabase.functions.invoke("activate-extension", {
        body: { priceId: GO_PRICE_ID },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      const msg = err?.message || "Errore nell'attivazione. Riprova.";
      toast.error(msg);
      console.error("Activate extension error:", err);
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className={`flex min-h-[calc(100vh-57px)] flex-col items-center ${isMobile ? "px-3 pt-4" : "px-4 pt-6"} pb-8`}>
      {/* Subscription banner - appears ≤5 days before expiration */}
      <div className={`w-full ${isMobile ? "" : "max-w-3xl"} mb-6`}>
        <SubscriptionBanner status={subStatus} onActivateExtension={handleActivateExtension} />
      </div>

      <h1 className={`mb-6 font-bold uppercase tracking-wide text-primary ${isMobile ? "text-lg" : "text-2xl"}`}>
        Benvenuto in LORI
      </h1>

      <div className={`flex items-center justify-center gap-6 ${isMobile ? "gap-4 flex-wrap px-2" : "gap-8"}`}>
        {items.map((item, index) => {
          const isFilled = index % 2 === 1;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center rounded-full border-2 border-primary transition-all hover:scale-105 active:scale-95 ${
                isFilled
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-primary"
              } ${isMobile ? "h-28 w-28" : "h-36 w-36"}`}
            >
              <item.icon className={isMobile ? "h-7 w-7 mb-1.5" : "h-9 w-9 mb-2"} />
              <span className={`font-semibold uppercase tracking-wide ${isMobile ? "text-[10px]" : "text-xs"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {isAdminEmail(email) && (
        <Link
          to="/admin"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-muted bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Shield className="h-4 w-4" />
          Admin Panel
        </Link>
      )}

      {activating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
          <div className="flex items-center gap-3 rounded-lg bg-card p-6 shadow-lg border">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-medium text-foreground">Preparazione in corso…</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
