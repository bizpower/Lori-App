import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const CONSENT_KEY = "lori_cookie_consent";

const getStoredConsent = (): CookieConsent | null => {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const storeConsent = (consent: CookieConsent) => {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
};

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookieConsent | null>(getStoredConsent);

  const updateConsent = useCallback((partial: Partial<CookieConsent>) => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      ...consent,
      ...partial,
      timestamp: new Date().toISOString(),
    };
    storeConsent(newConsent);
    setConsent(newConsent);
  }, [consent]);

  return { consent, updateConsent };
};

const CookieBanner = () => {
  const { consent, updateConsent } = useCookieConsent();
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!consent) {
      // Small delay to not block rendering
      const t = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(t);
    }
  }, [consent]);

  if (!visible || consent) return null;

  const acceptAll = () => {
    updateConsent({ necessary: true, analytics: true, marketing: true });
    setVisible(false);
  };

  const rejectAll = () => {
    updateConsent({ necessary: true, analytics: false, marketing: false });
    setVisible(false);
  };

  const saveCustom = () => {
    updateConsent({ necessary: true, analytics: analyticsChecked, marketing: marketingChecked });
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6" role="dialog" aria-label="Gestione cookie">
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card shadow-2xl">
        <div className="p-5">
          <h2 className="text-base font-semibold text-foreground mb-2">🍪 Questo sito utilizza cookie</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Utilizziamo cookie tecnici necessari per il funzionamento della piattaforma.
            Con il tuo consenso, potremmo utilizzare anche cookie analitici per migliorare il servizio.
            Per maggiori informazioni consulta la nostra{" "}
            <Link to="/privacy-policy" className="text-primary underline">Privacy Policy</Link> e la{" "}
            <Link to="/cookie-policy" className="text-primary underline">Cookie Policy</Link>.
          </p>

          {showCustomize && (
            <div className="mt-4 space-y-3 border-t border-border pt-4">
              <label className="flex items-center gap-3">
                <input type="checkbox" checked disabled className="h-4 w-4 rounded accent-primary" />
                <div>
                  <span className="text-sm font-medium text-foreground">Necessari</span>
                  <p className="text-[11px] text-muted-foreground">Indispensabili per il funzionamento. Non disattivabili.</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={analyticsChecked}
                  onChange={(e) => setAnalyticsChecked(e.target.checked)}
                  className="h-4 w-4 rounded accent-primary"
                />
                <div>
                  <span className="text-sm font-medium text-foreground">Analitici</span>
                  <p className="text-[11px] text-muted-foreground">Ci aiutano a capire come viene utilizzata la piattaforma.</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingChecked}
                  onChange={(e) => setMarketingChecked(e.target.checked)}
                  className="h-4 w-4 rounded accent-primary"
                />
                <div>
                  <span className="text-sm font-medium text-foreground">Marketing</span>
                  <p className="text-[11px] text-muted-foreground">Utilizzati per campagne pubblicitarie personalizzate.</p>
                </div>
              </label>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {showCustomize ? (
              <button
                onClick={saveCustom}
                className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Salva preferenze
              </button>
            ) : (
              <>
                <button
                  onClick={acceptAll}
                  className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Accetta tutti
                </button>
                <button
                  onClick={rejectAll}
                  className="rounded-md border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                >
                  Rifiuta
                </button>
                <button
                  onClick={() => setShowCustomize(true)}
                  className="rounded-md px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  Personalizza
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
