import { Helmet } from "react-helmet-async";

const TerminiServizio = () => (
  <>
    <Helmet>
      <title>Termini di Servizio | LORI CRM</title>
      <meta name="description" content="Termini e condizioni d'uso della piattaforma SaaS LORI CRM. Responsabilità, diritti, proprietà intellettuale e cessazione del servizio." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://lori-crm.it/termini-servizio" />
    </Helmet>

    <div className="mx-auto max-w-3xl px-4 py-12 text-foreground">
      <h1 className="text-3xl font-bold mb-2">Termini di Servizio</h1>
      <p className="text-sm text-muted-foreground mb-8">Ultimo aggiornamento: 12 marzo 2026</p>

      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-3">1. Descrizione del Servizio</h2>
          <p>
            LORI CRM è una piattaforma SaaS (Software as a Service) sviluppata da <strong>BizPower S.r.l.</strong>
            che consente agli utenti di gestire lead, operatori, liste di contatti e attività di outreach commerciale.
          </p>
          <p className="mt-2">
            Il servizio include: gestione lead e contatti, organizzazione in liste, generazione di messaggi di outreach
            tramite intelligenza artificiale, assegnazione di etichette, gestione operatori e monitoraggio delle attività.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">2. Creazione dell'Account</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Per utilizzare LORI CRM è necessario creare un account fornendo un indirizzo email valido e una password</li>
            <li>L'utente è responsabile della riservatezza delle proprie credenziali di accesso</li>
            <li>L'utente deve fornire informazioni accurate e mantenerle aggiornate</li>
            <li>È vietato creare account con identità false o per conto di terzi senza autorizzazione</li>
            <li>L'utente deve avere almeno 18 anni di età</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">3. Utilizzo della Piattaforma</h2>
          <p>L'utente si impegna a:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Utilizzare la piattaforma esclusivamente per finalità lecite e conformi ai presenti Termini</li>
            <li>Non utilizzare il servizio per attività di spam, phishing o altre pratiche illecite</li>
            <li>Rispettare la normativa vigente in materia di protezione dei dati personali (GDPR) nella gestione dei lead</li>
            <li>Non tentare di accedere a dati o funzionalità non autorizzate</li>
            <li>Non effettuare reverse engineering, decompilare o disassemblare il software</li>
            <li>Non sovraccaricare intenzionalmente l'infrastruttura del servizio</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">4. Responsabilità dell'Utente</h2>
          <h3 className="text-base font-medium mt-3 mb-1">4.1 Dati inseriti</h3>
          <p>
            L'utente è l'unico responsabile dei dati inseriti nella piattaforma, inclusi i dati dei lead e dei contatti.
            L'utente garantisce di avere il diritto di trattare tali dati in conformità alla normativa GDPR.
          </p>
          <h3 className="text-base font-medium mt-3 mb-1">4.2 Conformità normativa</h3>
          <p>
            L'utente che utilizza LORI CRM per gestire dati personali di terzi agisce come Titolare del trattamento
            e deve assicurarsi di rispettare tutti gli obblighi previsti dal GDPR, inclusa l'acquisizione di una base giuridica valida.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">5. Limitazione di Responsabilità</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>LORI CRM è fornito "così com'è" (as is) senza garanzie di alcun tipo, esplicite o implicite</li>
            <li>BizPower S.r.l. non è responsabile per danni indiretti, incidentali o consequenziali derivanti dall'uso della piattaforma</li>
            <li>BizPower S.r.l. non è responsabile per interruzioni del servizio dovute a cause di forza maggiore, manutenzione programmata o problemi tecnici di terze parti</li>
            <li>La responsabilità complessiva di BizPower S.r.l. è limitata all'importo pagato dall'utente nei 12 mesi precedenti all'evento</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">6. Proprietà Intellettuale</h2>
          <p>
            Tutti i diritti di proprietà intellettuale relativi alla piattaforma LORI CRM, inclusi software,
            design, marchi, loghi e contenuti, sono di proprietà esclusiva di BizPower S.r.l.
          </p>
          <p className="mt-2">
            L'utente mantiene la proprietà dei dati inseriti nella piattaforma. BizPower S.r.l. non acquisisce
            alcun diritto sui dati dell'utente, salvo quanto strettamente necessario per l'erogazione del servizio.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">7. Abbonamenti e Pagamenti</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>L'accesso a determinate funzionalità richiede un abbonamento a pagamento</li>
            <li>I pagamenti sono gestiti tramite Stripe, un provider di pagamenti PCI-DSS compliant</li>
            <li>Gli abbonamenti si rinnovano automaticamente salvo disdetta</li>
            <li>La disdetta può essere effettuata in qualsiasi momento tramite il portale di gestione abbonamento</li>
            <li>Non sono previsti rimborsi per periodi parziali, salvo quanto previsto dalla legge</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">8. Sospensione e Cessazione dell'Account</h2>
          <h3 className="text-base font-medium mt-3 mb-1">8.1 Da parte dell'utente</h3>
          <p>
            L'utente può richiedere la cancellazione del proprio account in qualsiasi momento
            attraverso le impostazioni della piattaforma o contattando il supporto.
          </p>
          <h3 className="text-base font-medium mt-3 mb-1">8.2 Da parte di BizPower S.r.l.</h3>
          <p>
            BizPower S.r.l. si riserva il diritto di sospendere o terminare l'account dell'utente in caso di:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Violazione dei presenti Termini di Servizio</li>
            <li>Uso illecito o abusivo della piattaforma</li>
            <li>Mancato pagamento dell'abbonamento</li>
            <li>Richiesta dell'autorità giudiziaria</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">9. Cessazione del Servizio</h2>
          <p>
            In caso di cessazione definitiva del servizio LORI CRM, BizPower S.r.l. si impegna a:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Comunicare la cessazione con almeno 90 giorni di preavviso</li>
            <li>Consentire agli utenti di esportare i propri dati prima della chiusura</li>
            <li>Cancellare tutti i dati personali entro 30 giorni dalla cessazione, salvo obblighi di legge</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">10. Legge Applicabile e Foro Competente</h2>
          <p>
            I presenti Termini sono regolati dalla legge italiana. Per ogni controversia sarà competente
            il Foro di [Città sede legale], salvo inderogabili disposizioni di legge a tutela del consumatore.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">11. Modifiche ai Termini</h2>
          <p>
            BizPower S.r.l. si riserva il diritto di modificare i presenti Termini di Servizio.
            Le modifiche sostanziali saranno comunicate agli utenti via email o tramite notifica in piattaforma.
            L'uso continuato del servizio dopo la comunicazione costituisce accettazione delle modifiche.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">12. Contatti</h2>
          <p>
            Per qualsiasi domanda sui presenti Termini:<br />
            <strong>BizPower S.r.l.</strong><br />
            Email: <a href="mailto:info@lori-crm.it" className="text-primary underline">info@lori-crm.it</a>
          </p>
        </div>
      </section>
    </div>
  </>
);

export default TerminiServizio;
