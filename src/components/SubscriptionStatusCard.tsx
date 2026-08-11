import { Crown, Clock, RefreshCw, ArrowRight, Sparkles, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import type { SubscriptionStatus } from "@/hooks/useSubscriptionStatus";

interface Props {
  status: SubscriptionStatus;
  onActivateExtension: () => void;
}

const colorMap = {
  green: {
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400",
    progress: "[&>div]:bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-800/40",
  },
  yellow: {
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400",
    progress: "[&>div]:bg-amber-500",
    border: "border-amber-200 dark:border-amber-800/40",
  },
  red: {
    badge: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400",
    progress: "[&>div]:bg-red-500",
    border: "border-red-200 dark:border-red-800/40",
  },
  blue: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400",
    progress: "[&>div]:bg-blue-500",
    border: "border-blue-200 dark:border-blue-800/40",
  },
};

export default function SubscriptionStatusCard({ status, onActivateExtension }: Props) {
  if (status.loading) {
    return (
      <Card className="p-5 space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-8 w-32" />
      </Card>
    );
  }

  const colors = colorMap[status.status_color];
  const expirationDate = status.subscription_end
    ? new Date(status.subscription_end)
    : status.extension_trial_end_date
    ? new Date(status.extension_trial_end_date)
    : null;

  // Progress: based on 30-day window
  const totalDays = 30;
  const progressValue =
    status.days_left !== null
      ? Math.max(0, Math.min(100, (status.days_left / totalDays) * 100))
      : 100;

  const formattedDate = expirationDate
    ? expirationDate.toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <Card className={`p-5 ${colors.border} border-2`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground text-sm">Stato abbonamento</h3>
        </div>
        <Badge className={`text-xs font-medium ${colors.badge}`}>
          {status.plan_label}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Giorni rimanenti
          </span>
          <span className="font-semibold text-foreground">
            {status.days_left !== null ? (status.days_left <= 0 ? "Scaduto" : status.days_left) : "—"}
          </span>
        </div>
        <Progress value={progressValue} className={`h-2.5 ${colors.progress}`} />
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Piano attuale</span>
          <span className="font-medium text-foreground">{status.plan_label}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Scadenza</span>
          <span className="font-medium text-foreground">{formattedDate}</span>
        </div>
        {status.days_left !== null && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Giorni rimanenti</span>
            <span className="font-medium text-foreground">
              {status.days_left <= 0 ? "0" : status.days_left}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Rinnovo automatico</span>
          <span className="font-medium text-foreground">
            {status.subscribed ? "Attivo" : "Non attivo"}
          </span>
        </div>
      </div>

      {/* Extension active */}
      {status.extension_active && (
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 p-3 mb-3">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-300">
                Estensione gratuita attiva
              </p>
              <p className="text-blue-700/80 dark:text-blue-400/70 text-xs mt-0.5">
                Hai attivato 15 giorni gratuiti. Al termine il tuo account passerà
                automaticamente al piano GO.
              </p>
              {status.extension_trial_end_date && (
                <p className="text-blue-700/80 dark:text-blue-400/70 text-xs mt-1">
                  Nuova scadenza:{" "}
                  <span className="font-semibold">
                    {new Date(status.extension_trial_end_date).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>{" "}
                  — Piano successivo: <span className="font-semibold">GO</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA: Can activate extension */}
      {status.can_activate_extension && (
        <Button size="sm" className="w-full min-h-[40px] gap-1.5" onClick={onActivateExtension}>
          <Sparkles className="h-4 w-4" />
          Attiva 15 giorni gratis
        </Button>
      )}

      {/* Already used extension, not subscribed */}
      {status.extension_trial_used && !status.subscribed && !status.extension_active && (
        <div className="space-y-2">
          <div className="rounded-lg bg-muted/50 border border-border p-3 flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Hai già utilizzato il periodo di estensione gratuita. Per continuare senza
              interruzioni passa al piano GO.
            </p>
          </div>
          <Button size="sm" className="w-full min-h-[40px] gap-1.5" asChild>
            <Link to="/pricing">
              Passa al piano GO
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {/* Expired without extension */}
      {!status.subscribed &&
        !status.extension_active &&
        !status.extension_trial_used &&
        status.days_left !== null &&
        status.days_left <= 0 && (
          <Button size="sm" className="w-full min-h-[40px] gap-1.5" asChild>
            <Link to="/pricing">
              Rinnova il piano
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
    </Card>
  );
}
