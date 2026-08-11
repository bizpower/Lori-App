import { useLocation } from "react-router-dom";
import { Seo, type SeoProps } from "./Seo";

/**
 * SEO centralizzata per rotta.
 *
 * Montato una volta dentro il Router: evita di ripetere i meta in ogni pagina
 * e tiene la mappa title/description in un punto solo, dove è facile rivederla.
 *
 * Regola: tutto ciò che sta dietro autenticazione è noindex. Indicizzare pagine
 * che al crawler rispondono con la schermata di login genera solo contenuto
 * duplicato e diluisce l'autorevolezza del dominio.
 */

const PUBLIC: Record<string, SeoProps> = {
  "/": {
    title: "LORI CRM — Il CRM operativo per la lead generation",
    description:
      "Il CRM semplice per gestire lead, trattative e clienti senza fogli Excel. Liste, etichette, import e follow-up in un unico posto. Prova gratis 90 giorni.",
    path: "/",
  },
  "/pricing": {
    title: "Prezzi e abbonamento",
    description:
      "Prova LORI CRM gratis per 90 giorni, poi 3,99 €/mese. Nessun vincolo, disdetta in qualsiasi momento. Tutte le funzioni incluse, senza limiti di contatti.",
    path: "/pricing",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "LORI CRM",
      description: "CRM operativo per la lead generation.",
      offers: {
        "@type": "Offer",
        price: "3.99",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: "https://app.lori-crm.it/pricing",
      },
    },
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "Come LORI CRM raccoglie, usa e protegge i dati personali: finalità, base giuridica, tempi di conservazione e diritti dell'interessato ai sensi del GDPR.",
    path: "/privacy-policy",
  },
  "/cookie-policy": {
    title: "Cookie Policy",
    description:
      "Quali cookie usa LORI CRM, a cosa servono e come gestire il consenso in qualsiasi momento.",
    path: "/cookie-policy",
  },
  "/termini-servizio": {
    title: "Termini di servizio",
    description:
      "Condizioni d'uso di LORI CRM: abbonamento, rinnovo, recesso, obblighi delle parti e limitazioni di responsabilità.",
    path: "/termini-servizio",
  },
  "/dpa": {
    title: "Data Processing Agreement",
    description:
      "Accordo sul trattamento dei dati tra il titolare e LORI CRM come responsabile, ai sensi dell'art. 28 GDPR.",
    path: "/dpa",
  },
};

/** Titoli leggibili per le aree riservate: non indicizzate, ma la tab ha senso. */
const PRIVATE_TITLES: [prefix: string, title: string][] = [
  ["/clienti", "Clienti"],
  ["/batch", "Liste"],
  ["/trattative", "Trattative"],
  ["/impostazioni", "Impostazioni"],
  ["/account", "Il mio account"],
  ["/tutorial", "Tutorial"],
  ["/admin", "Amministrazione"],
];

export function RouteSeo() {
  const { pathname } = useLocation();

  const publicMatch = PUBLIC[pathname];
  if (publicMatch) return <Seo {...publicMatch} />;

  const privateMatch = PRIVATE_TITLES.find(([prefix]) => pathname.startsWith(prefix));
  if (privateMatch) {
    return <Seo title={privateMatch[1]} path={pathname} noindex />;
  }

  // Rotta sconosciuta (404): mai indicizzare, mai far seguire i link.
  return <Seo title="Pagina non trovata" path={pathname} noindex />;
}

export default RouteSeo;
