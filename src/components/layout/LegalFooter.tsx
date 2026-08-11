import { Link } from "react-router-dom";

const CONSENT_KEY = "lori_cookie_consent";

const LegalFooter = () => {
  const openCookieSettings = () => {
    localStorage.removeItem(CONSENT_KEY);
    window.location.reload();
  };

  return (
    <footer className="border-t border-border bg-card py-4 px-3 sm:py-6 sm:px-4 mt-auto">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-3 text-xs text-muted-foreground">
        <div className="text-center">
          <p>LORI CRM — Tutti i diritti riservati.</p>
          <p>P.IVA 13807830966</p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:gap-x-4" aria-label="Link legali">
          <Link to="/privacy-policy" className="hover:text-foreground transition-colors whitespace-nowrap">Privacy Policy</Link>
          <Link to="/cookie-policy" className="hover:text-foreground transition-colors whitespace-nowrap">Cookie Policy</Link>
          <Link to="/termini-servizio" className="hover:text-foreground transition-colors whitespace-nowrap">Termini di Servizio</Link>
          <Link to="/dpa" className="hover:text-foreground transition-colors whitespace-nowrap">DPA</Link>
          <button onClick={openCookieSettings} className="hover:text-foreground transition-colors underline cursor-pointer whitespace-nowrap">
            Gestione Cookie
          </button>
        </nav>
      </div>
    </footer>
  );
};

export default LegalFooter;
