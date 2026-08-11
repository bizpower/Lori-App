import { AlertTriangle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { SubscriptionStatus } from "@/hooks/useSubscriptionStatus";

interface Props {
  status: SubscriptionStatus;
  onActivateExtension: () => void;
}

export default function SubscriptionBanner({ status, onActivateExtension }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || status.loading) return null;

  // Show banner only when ≤5 days left and can activate extension
  if (!status.can_activate_extension) return null;

  return (
    <div className="relative mx-auto w-full rounded-xl border-2 border-amber-400/60 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 dark:border-amber-600/40 p-5 shadow-md">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Chiudi"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 p-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-foreground text-base">
            Il tuo piano sta per scadere
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Mancano <span className="font-semibold text-foreground">{status.days_left} giorn{status.days_left === 1 ? "o" : "i"}</span> alla
            scadenza del tuo abbonamento. Puoi attivare ora{" "}
            <span className="font-semibold text-foreground">15 giorni gratuiti</span>{" "}
            inserendo il metodo di pagamento. Al termine del periodo gratuito il piano si
            rinnoverà automaticamente con la versione GO.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              size="sm"
              className="min-h-[40px] gap-1.5"
              onClick={onActivateExtension}
            >
              <Sparkles className="h-4 w-4" />
              Attiva 15 giorni gratis
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="min-h-[40px] text-muted-foreground"
              onClick={() => setDismissed(true)}
            >
              Continua senza attivare
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
