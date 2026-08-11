# Lori CRM

CRM SaaS in abbonamento per la gestione di lead, operatori e liste, con area amministrativa e pagamenti Stripe.

Questo repository contiene il codice completo dell'applicazione, estratto dal progetto Lovable e reso
autonomo: si builda, si testa e si pubblica su qualsiasi hosting statico senza dipendere da Lovable.

---

## Stack

| Livello | Tecnologia |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI | Tailwind CSS + shadcn/ui (Radix) |
| Stato / dati | Zustand, TanStack Query, TanStack Table |
| Backend | Supabase (Postgres + Auth + Storage + Edge Functions) |
| Pagamenti | Stripe (Checkout + Subscriptions) |
| Test | Vitest + Testing Library |

## Funzionalità

**Area utente**
- Registrazione e login (email/password + Google OAuth)
- Dashboard con stato abbonamento e giorni residui
- **Operatori**: anagrafica, ruoli, avatar (upload su Supabase Storage), punteggio performance
- **Liste**: raggruppamento lead per operatore, rinomina, eliminazione
- **Lead**: tabella completa con modifica inline, note e messaggi, filtri per operatore/etichetta/lista
- **Import CSV/XLSX**: wizard in 4 step con mappatura colonne, rilevamento duplicati ed export degli errori
- **Etichette**: creazione, colori personalizzati, etichette di default
- **Fogli**: tab dinamici nel dettaglio lista
- **Metriche**: distribuzione lead per etichetta (torta, barre, lista)
- Generazione messaggi di outreach via AI
- Ticket di assistenza e notifiche dall'amministratore
- Pagina account con dati di fatturazione (privato / società)
- Pagine legali: Privacy Policy, Cookie Policy, Termini di Servizio, DPA + banner cookie GDPR

**Area amministrativa** (`/admin`, riservata all'email amministratore)
- Panoramica: utenti totali, registrazioni 7/30 giorni, ticket aperti, accessi regalati
- Elenco utenti con ricerca, invio messaggi, concessione/revoca accesso lifetime
- Dettaglio utente: account, abbonamento Stripe, fatture, ticket, messaggi, dati CRM
- Messaggi broadcast a tutti gli utenti
- Gestione ticket con risposta e cambio stato

## Struttura

```
src/
  components/        componenti applicativi (tabelle, modali, metriche…)
    admin/           layout area amministrativa
    columns/         definizioni colonne TanStack Table
    layout/          navbar, nav mobile, footer legale, layout pagina
    ui/              shadcn/ui
  hooks/             useCrmData, useSubscriptionStatus, useAdminApi
  integrations/
    supabase/        client e tipi generati dallo schema
  lib/               auth (Zustand), admin, help, utils
  pages/             pagine dell'app
    admin/           pagine area amministrativa
    legal/           pagine legali
supabase/
  functions/         5 edge function (Deno)
  migrations/        15 migrazioni SQL: schema, RLS, storage, seed
```

## Configurazione

Copia `.env.example` in `.env` e compila:

```bash
VITE_SUPABASE_URL="https://<project>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<anon key>"
VITE_SUPABASE_PROJECT_ID="<project ref>"
```

Questi tre valori sono pubblici per definizione: finiscono nel bundle del browser. La protezione dei dati
è garantita dalle policy RLS del database, non dal segreto della chiave.

### Segreti delle edge function

Da impostare su Supabase (`Project Settings → Edge Functions → Secrets`), **mai nel repository**:

| Variabile | Usata da | Note |
|---|---|---|
| `STRIPE_SECRET_KEY` | create-checkout, check-subscription, activate-extension, admin-api | chiave segreta Stripe |
| `SUPABASE_SERVICE_ROLE_KEY` | check-subscription, activate-extension, admin-api | fornita da Supabase |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY` | tutte | fornite da Supabase |
| `ADMIN_EMAIL` | admin-api | opzionale; default `r.difalco@lori-crm.it` |
| `AI_API_KEY` / `AI_GATEWAY_URL` / `AI_MODEL` | generate-outreach | vedi sotto |

## Sviluppo

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # build di produzione in dist/
npm test         # test unitari
npm run lint     # eslint
```

## Deploy

L'app è una SPA statica: si pubblica su qualsiasi hosting con fallback su `index.html`.
Le configurazioni per Vercel (`vercel.json`), Netlify (`netlify.toml` e `public/_redirects`) sono incluse.

1. Collega il repository al provider di hosting
2. Build command `npm run build`, output `dist`
3. Imposta le tre variabili `VITE_*` nelle env del progetto
4. Aggiungi il dominio di produzione in **Supabase → Authentication → URL Configuration**
   (Site URL e Redirect URLs), altrimenti login e OAuth non tornano indietro correttamente

### Database

Lo schema completo è nelle migrazioni. Su un progetto Supabase nuovo:

```bash
supabase link --project-ref <project-ref>
supabase db push
supabase functions deploy
```

Le migrazioni creano tabelle, policy RLS, trigger di creazione profilo, bucket storage
`operatori-avatars` ed etichette di default.

**Attenzione**: le migrazioni ricreano solo la *struttura*. Gli utenti registrati e i dati vivono nel
database e non sono in questo repository (per ragioni di riservatezza e GDPR). Restano dove sono:
puntando l'app al Supabase esistente, tutti gli account e i dati continuano a funzionare senza migrazione.

## Stripe

Il piano Go usa una promo: **€1,99 una tantum** + abbonamento **€3,99/mese** con trial di 90 giorni.
I price ID sono in `supabase/functions/create-checkout/index.ts`. Esiste inoltre un'estensione di prova
di 15 giorni (`activate-extension`) utilizzabile una sola volta per utente, che salva il metodo di pagamento
e prosegue automaticamente col piano Go.

Per il passaggio in produzione: sostituisci i price ID con quelli del tuo account Stripe e imposta la
`STRIPE_SECRET_KEY` corrispondente.

## Note sulla migrazione da Lovable

Il codice riproduce fedelmente il progetto Lovable. Sono state necessarie solo queste modifiche,
tutte per rimuovere dipendenze proprietarie:

1. **`vite.config.ts`** — rimosso il plugin `lovable-tagger` (strumento di sviluppo Lovable, solo dev)
2. **`src/integrations/lovable/index.ts`** — il login social usava `@lovable.dev/cloud-auth-js`;
   ora usa l'OAuth nativo di Supabase mantenendo la stessa API pubblica, quindi i chiamanti non cambiano.
   Richiede che il provider Google sia abilitato in Supabase → Authentication → Providers
3. **`supabase/functions/generate-outreach`** — l'endpoint AI era il gateway Lovable. Ora è configurabile
   via `AI_GATEWAY_URL` / `AI_API_KEY` / `AI_MODEL`: senza modifiche continua a usare il gateway Lovable
   (finché la relativa API key resta valida), ed è sufficiente cambiare le tre variabili per puntare a un
   altro provider compatibile con l'API chat/completions
4. **`playwright.config.ts` / `playwright-fixture.ts`** — non riportati: dipendevano dal pacchetto interno
   `lovable-agent-playwright-config` e servivano solo ai test automatici dell'agente Lovable
5. **`src/components/layout/LegalFooter.tsx`** — corretto un `<p>` annidato dentro un altro `<p>` (HTML non valido)
6. **`src/hooks/useCrmData.ts`** — aggiunto un cast sull'update con nome colonna dinamico, per far passare
   il controllo dei tipi senza cambiare il comportamento

Il resto — pagine, componenti, hook, edge function, migrazioni, stili e testi — è identico all'originale.
