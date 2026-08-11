import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => (
  <>
    <Helmet>
      <title>Privacy Policy | LORI CRM</title>
      <meta name="description" content="Informativa sulla privacy e gestione dei dati personali della piattaforma LORI CRM conforme al GDPR (Regolamento UE 2016/679)." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://lori-crm.it/privacy-policy" />
    </Helmet>

    <div className="mx-auto max-w-3xl px-4 py-12 text-foreground">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Ultimo aggiornamento: 12 marzo 2026</p>

      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-3">1. Titolare del Trattamento</h2>
          <p>
            Il Titolare del trattamento dei dati personali è:<br />
            <strong>BizPower S.r.l.</strong><br />
            Sede legale: [Indirizzo sede legale]<br />
            Email: <a href="mailto:privacy@lori-crm.it" className="text-primary underline">privacy@lori-crm.it</a><br />
            P.IVA: [Partita IVA]
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">2. Tipologia di Dati Raccolti</h2>
          <p>La piattaforma LORI CRM raccoglie le seguenti categorie di dati personali:</p>
          <h3 className="text-base font-medium mt-3 mb-1">2.1 Dati forniti direttamente dall'utente</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Nome, cognome, indirizzo email</li>
            <li>Dati di fatturazione (ragione sociale, P.IVA, codice fiscale, PEC, codice SDI, indirizzo)</li>
            <li>Credenziali di accesso (email e password hashata)</li>
          </ul>
          <h3 className="text-base font-medium mt-3 mb-1">2.2 Dati inseriti nella piattaforma</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Dati dei lead gestiti (nome, azienda, profilo LinkedIn, note)</li>
            <li>Messaggi di outreach generati</li>
            <li>Etichette e categorizzazioni</li>
          </ul>
          <h3 className="text-base font-medium mt-3 mb-1">2.3 Dati raccolti automaticamente</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Dati di navigazione e utilizzo della piattaforma</li>
            <li>Indirizzo IP, tipo di browser, sistema operativo</li>
            <li>Dati relativi agli accessi (data e ora login)</li>
            <li>Cookie tecnici e, previo consenso, cookie analitici</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">3. Finalità del Trattamento</h2>
          <p>I dati personali sono trattati per le seguenti finalità:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Erogazione del servizio:</strong> gestione dell'account, accesso alla piattaforma, utilizzo delle funzionalità CRM</li>
            <li><strong>Gestione contrattuale:</strong> fatturazione, pagamenti, gestione dell'abbonamento</li>
            <li><strong>Assistenza utenti:</strong> gestione ticket di supporto e comunicazioni</li>
            <li><strong>Sicurezza:</strong> prevenzione frodi, protezione della piattaforma, monitoraggio accessi</li>
            <li><strong>Miglioramento del servizio:</strong> analisi aggregate sull'utilizzo della piattaforma</li>
            <li><strong>Obblighi di legge:</strong> adempimenti fiscali, contabili e normativi</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">4. Base Giuridica del Trattamento</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Esecuzione del contratto</strong> (art. 6.1.b GDPR): per l'erogazione del servizio SaaS e la gestione dell'account</li>
            <li><strong>Obbligo legale</strong> (art. 6.1.c GDPR): per adempimenti fiscali e contabili</li>
            <li><strong>Legittimo interesse</strong> (art. 6.1.f GDPR): per la sicurezza della piattaforma e il miglioramento del servizio</li>
            <li><strong>Consenso</strong> (art. 6.1.a GDPR): per l'utilizzo di cookie analitici e di marketing</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">5. Periodo di Conservazione dei Dati</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Dati dell'account:</strong> conservati per tutta la durata del rapporto contrattuale e per 12 mesi dopo la cancellazione dell'account</li>
            <li><strong>Dati di fatturazione:</strong> conservati per 10 anni come previsto dalla normativa fiscale italiana</li>
            <li><strong>Dati dei lead e CRM:</strong> conservati fino alla cancellazione da parte dell'utente o alla cessazione del servizio</li>
            <li><strong>Log di accesso:</strong> conservati per 6 mesi per finalità di sicurezza</li>
            <li><strong>Dati di consenso cookie:</strong> conservati per 12 mesi dalla prestazione del consenso</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">6. Destinatari dei Dati</h2>
          <p>I dati personali possono essere comunicati a:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Fornitori di servizi tecnici:</strong> hosting, database, elaborazione pagamenti (Stripe)</li>
            <li><strong>Fornitori di servizi AI:</strong> per la generazione di messaggi di outreach (dati anonimizzati ove possibile)</li>
            <li><strong>Autorità competenti:</strong> quando richiesto dalla legge</li>
          </ul>
          <p className="mt-2">I dati non sono trasferiti al di fuori dello Spazio Economico Europeo senza adeguate garanzie (art. 46 GDPR).</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">7. Diritti dell'Interessato</h2>
          <p>In conformità agli articoli 15-22 del GDPR, l'utente ha diritto a:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Accesso:</strong> ottenere conferma del trattamento e copia dei propri dati</li>
            <li><strong>Rettifica:</strong> correggere dati inesatti o incompleti</li>
            <li><strong>Cancellazione:</strong> richiedere la cancellazione dei propri dati ("diritto all'oblio")</li>
            <li><strong>Limitazione:</strong> limitare il trattamento in determinate circostanze</li>
            <li><strong>Portabilità:</strong> ricevere i propri dati in formato strutturato e leggibile</li>
            <li><strong>Opposizione:</strong> opporsi al trattamento basato su legittimo interesse</li>
            <li><strong>Revoca del consenso:</strong> revocare il consenso prestato in qualsiasi momento</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">8. Modalità di Esercizio dei Diritti</h2>
          <p>
            Per esercitare i propri diritti, l'utente può inviare una richiesta a:<br />
            <a href="mailto:privacy@lori-crm.it" className="text-primary underline">privacy@lori-crm.it</a>
          </p>
          <p className="mt-2">
            La richiesta sarà evasa entro 30 giorni. L'utente ha inoltre il diritto di proporre reclamo
            all'Autorità Garante per la Protezione dei Dati Personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.garanteprivacy.it</a>).
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">9. Sicurezza dei Dati</h2>
          <p>
            LORI CRM adotta misure tecniche e organizzative appropriate per proteggere i dati personali, tra cui:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Crittografia dei dati in transito (HTTPS/TLS)</li>
            <li>Hashing delle password con algoritmi sicuri</li>
            <li>Controllo degli accessi basato su ruoli (RLS)</li>
            <li>Backup regolari dei dati</li>
            <li>Monitoraggio e logging degli accessi</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">10. Gestione Data Breach</h2>
          <p>
            In caso di violazione dei dati personali, LORI CRM si impegna a:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Notificare l'Autorità Garante entro 72 ore dalla scoperta della violazione (art. 33 GDPR)</li>
            <li>Comunicare agli utenti interessati senza ingiustificato ritardo quando la violazione presenta un rischio elevato (art. 34 GDPR)</li>
            <li>Documentare ogni violazione nel registro interno</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">11. Cookie</h2>
          <p>
            Per informazioni dettagliate sull'uso dei cookie, si prega di consultare la nostra{" "}
            <Link to="/cookie-policy" className="text-primary underline">Cookie Policy</Link>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">12. Modifiche alla Privacy Policy</h2>
          <p>
            Il Titolare si riserva il diritto di apportare modifiche alla presente informativa.
            Le modifiche saranno pubblicate su questa pagina con indicazione della data di aggiornamento.
            Si consiglia di consultare periodicamente questa pagina.
          </p>
        </div>
      </section>

      <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground">
        <p>Per qualsiasi domanda: <a href="mailto:privacy@lori-crm.it" className="text-primary underline">privacy@lori-crm.it</a></p>
      </div>
    </div>
  </>
);

export default PrivacyPolicy;
