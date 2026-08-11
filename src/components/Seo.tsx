import { useEffect } from "react";

/**
 * Gestione SEO per-pagina senza dipendenze esterne.
 *
 * L'app è una SPA: il markup in index.html è l'unico che i crawler leggono
 * senza eseguire JS. Googlebot esegue JS e vede anche questi tag, quindi qui
 * teniamo il per-pagina (title, description, canonical, robots, Open Graph)
 * mentre index.html porta i default e i dati strutturati del sito.
 *
 * Ogni tag creato viene marcato con data-seo e rimosso allo smontaggio, così
 * cambiando rotta non restano meta della pagina precedente.
 */

const SITE_URL = "https://app.lori-crm.it";
const SITE_NAME = "LORI CRM";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface SeoProps {
  /** Titolo della pagina. Viene composto come "<title> | LORI CRM". */
  title: string;
  description?: string;
  /** Percorso canonico, es. "/pricing". Default: percorso corrente. */
  path?: string;
  /** true per le aree riservate: esclude la pagina dagli indici. */
  noindex?: boolean;
  image?: string;
  /** JSON-LD aggiuntivo specifico della pagina. */
  jsonLd?: Record<string, unknown>;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute("data-seo", "");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    el.setAttribute("data-seo", "");
    document.head.appendChild(el);
  }
  el.href = href;
}

export function Seo({ title, description, path, noindex, image, jsonLd }: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path ?? window.location.pathname}`;
    const img = image ?? DEFAULT_OG_IMAGE;

    document.title = fullTitle;
    upsertCanonical(url);

    // Le aree riservate non devono finire negli indici né consumare crawl budget.
    upsertMeta(
      "name",
      "robots",
      noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large",
    );

    if (description) {
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:description", description);
      upsertMeta("name", "twitter:description", description);
    }

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:locale", "it_IT");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:image", img);
    upsertMeta("name", "twitter:card", "summary_large_image");

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      script?.remove();
    };
  }, [title, description, path, noindex, image, jsonLd]);

  return null;
}

export default Seo;
