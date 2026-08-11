import { useAuth } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, Crown, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "€0",
    period: "/30 giorni",
    description: "Tutte le funzionalità del piano Go, gratis per 30 giorni",
    badge: null,
    icon: <Sparkles className="h-6 w-6" />,
    features: [
      "Lead illimitati",
      "Liste illimitate",
      "Tutte le etichette",
      "Metriche avanzate",
      "Valido 30 giorni dalla registrazione",
    ],
    cta: "Inizia gratis",
    ctaVariant: "outline" as const,
    available: true,
    priceId: null,
  },
  {
    id: "go",
    name: "Go",
    price: "€1,99",
    period: "/mese",
    originalPrice: "€3,99/mese",
    promoLabel: "PROMO 3 MESI",
    description: "Per professionisti che vogliono crescere",
    badge: "Più popolare",
    icon: <Sparkles className="h-6 w-6" />,
    features: [
      "Tutto del piano Starter",
      "Lead illimitati",
      "Liste illimitate",
      "Tutte le etichette",
      "Metriche avanzate",
      "Supporto prioritario",
    ],
    cta: "Attiva Go",
    ctaVariant: "default" as const,
    available: true,
    priceId: null,
    promo: "go_3mesi" as const,
  },
  {
    id: "custom",
    name: "Custom",
    price: "€8,99",
    period: "/mese",
    description: "Per team e aziende con esigenze specifiche",
    badge: "Prossimamente",
    icon: <Crown className="h-6 w-6" />,
    features: [
      "Tutto del piano Go",
      "Logo personalizzato",
      "Branding custom",
      "Account multi-utente",
      "API access",
      "Account manager dedicato",
    ],
    cta: "Non disponibile",
    ctaVariant: "outline" as const,
    available: false,
    priceId: null,
  },
];

const Pricing = () => {
  const { isLoggedIn } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handlePlanClick = async (plan: typeof plans[0]) => {
    if (!plan.available) return;

    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    // Free plan - user already registered
    if (!plan.priceId && !plan.promo) return;

    setLoadingPlan(plan.id);
    try {
      const body = plan.promo
        ? { promo: plan.promo }
        : { priceId: plan.priceId };

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body,
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error("Errore nell'avvio del pagamento. Riprova.");
      console.error("Checkout error:", err);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className={`min-h-[calc(100vh-57px)] ${isMobile ? "px-4 py-6" : "px-8 py-12"}`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className={`font-bold text-foreground ${isMobile ? "text-2xl" : "text-3xl"}`}>
            Scegli il piano giusto per te
          </h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-lg mx-auto">
            Inizia gratis e scala con LORI quando il tuo business cresce.
          </p>
        </div>

        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative p-6 flex flex-col ${
                plan.id === "go"
                  ? "border-primary shadow-lg ring-2 ring-primary/20"
                  : plan.available
                  ? "border-border"
                  : "border-border opacity-75"
              }`}
            >
              {plan.badge && (
                <Badge
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs ${
                    plan.id === "go"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {plan.badge}
                </Badge>
              )}

              <div className="flex items-center gap-2 mb-3 mt-1">
                <div className={`p-2 rounded-lg ${plan.id === "go" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {plan.icon}
                </div>
                <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
              </div>

              <div className="mb-2">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>

              {plan.promoLabel && (
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 border-amber-200">
                    {plan.promoLabel}
                  </Badge>
                  <span className="text-xs text-muted-foreground line-through">
                    {plan.originalPrice}
                  </span>
                </div>
              )}

              <p className="text-sm text-muted-foreground mb-5">
                {plan.description}
              </p>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.ctaVariant}
                className="w-full min-h-[44px]"
                disabled={!plan.available || loadingPlan === plan.id}
                onClick={() => handlePlanClick(plan)}
              >
                {loadingPlan === plan.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : !plan.available ? (
                  <Lock className="mr-2 h-4 w-4" />
                ) : null}
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
