import { Helmet } from "react-helmet-async";

const DPA = () => (
  <>
    <Helmet>
      <title>Data Processing Agreement | LORI CRM</title>
      <meta name="description" content="Data Processing Agreement (DPA) di LORI CRM ai sensi dell'art. 28 GDPR. Ruoli, responsabilità e misure di sicurezza nel trattamento dati." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://lori-crm.it/dpa" />
    </Helmet>

    <div className="mx-auto max-w-3xl px-4 py-12 text-foreground">
      <h1 className="text-3xl font-bold mb-2">Data Processing Agreement (DPA)</h1>
      <p className="text-sm text-muted-foreground mb-8">Ultimo aggiornamento: 12 marzo 2026</p>

      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-3">1. Premessa</h2>
          <p>
            Il presente Data Processing Agreement ("DPA") è stipulato ai sensi dell'art. 28 del Regolamento (UE) 2016/679
            (GDPR) tra l'utente della piattaforma LORI CRM ("Titolare del trattamento" o "Data Controller")
            e BizPower S.r.l. ("Responsabile del trattamento" o "Data Processor").
          </p>
          <p className="mt-2">
            Il presente DPA si applica al trattamento dei dati personali che il Data Processor effettua
            per conto del Data Controller nell'ambito dell'utilizzo della piattaforma LORI CRM.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">2. Definizione dei Ruoli</h2>
          <h3 className="text-base font-medium mt-3 mb-1">2.1 Data Controller (Utente)</h3>
          <p>
            L'utente che utilizza LORI CRM per gestire dati personali di propri contatti, lead e clienti
            agisce come Titolare del trattamento per tali dati. Il Data Controller determina le finalità
            e i mezzi del trattamento dei dati personali inseriti nella piattaforma.
          </p>
          <h3 className="text-base font-medium mt-3 mb-1">2.2 Data Processor (BizPower S.r.l.)</h3>
          <p>
            BizPower S.r.l., in qualità di fornitore della piattaforma LORI CRM, agisce come Responsabile
            del trattamento e tratta i dati personali esclusivamente per conto e su istruzione del Data Controller,
            nei limiti di quanto necessario per l'erogazione del servizio.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">3. Oggetto e Durata del Trattamento</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Oggetto:</strong> trattamento dei dati personali inseriti dall'utente nella piattaforma LORI CRM (dati dei lead, contatti, note, messaggi di outreach)</li>
            <li><strong>Natura del trattamento:</strong> raccolta, conservazione, organizzazione, consultazione, utilizzo, cancellazione</li>
            <li><strong>Categorie di dati:</strong> dati identificativi (nome, cognome, email, azienda), dati professionali (profilo LinkedIn, ruolo), note e comunicazioni</li>
            <li><strong>Categorie di interessati:</strong> lead, contatti commerciali e clienti dell'utente</li>
            <li><strong>Durata:</strong> per tutta la durata del rapporto contrattuale e fino alla cancellazione dei dati</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">4. Obblighi del Data Processor</h2>
          <p>BizPower S.r.l. si impegna a:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Trattare i dati personali esclusivamente sulla base delle istruzioni documentate del Data Controller</li>
            <li>Garantire che le persone autorizzate al trattamento si siano impegnate alla riservatezza</li>
            <li>Adottare tutte le misure di sicurezza richieste dall'art. 32 del GDPR</li>
            <li>Non ricorrere a sub-responsabili senza previa autorizzazione generale o specifica del Data Controller</li>
            <li>Assistere il Data Controller nell'adempimento degli obblighi di cui agli artt. 32-36 del GDPR</li>
            <li>Assistere il Data Controller nel rispondere alle richieste di esercizio dei diritti degli interessati</li>
            <li>Cancellare o restituire tutti i dati personali alla cessazione del servizio, salvo obblighi di legge</li>
            <li>Mettere a disposizione del Data Controller tutte le informazioni necessarie per dimostrare il rispetto degli obblighi</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">5. Misure di Sicurezza</h2>
          <p>Il Data Processor adotta le seguenti misure tecniche e organizzative:</p>
          <h3 className="text-base font-medium mt-3 mb-1">5.1 Misure tecniche</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Crittografia dei dati in transito tramite protocollo TLS/HTTPS</li>
            <li>Crittografia dei dati a riposo nell'infrastruttura di database</li>
            <li>Hashing delle password con algoritmi crittografici sicuri (bcrypt/argon2)</li>
            <li>Row Level Security (RLS) per l'isolamento dei dati tra utenti</li>
            <li>Backup automatici giornalieri dei dati</li>
            <li>Monitoraggio continuo dell'infrastruttura</li>
          </ul>
          <h3 className="text-base font-medium mt-3 mb-1">5.2 Misure organizzative</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Accesso ai dati limitato al personale strettamente autorizzato</li>
            <li>Formazione del personale sulla protezione dei dati</li>
            <li>Procedure documentate per la gestione degli incidenti</li>
            <li>Revisione periodica delle misure di sicurezza</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">6. Sub-responsabili</h2>
          <p>
            Il Data Processor utilizza i seguenti sub-responsabili per l'erogazione del servizio:
          </p>
          <div className="overflow-x-auto mt-2">
            <table className="w-full border border-border text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-3 py-2 text-left">Sub-responsabile</th>
                  <th className="border border-border px-3 py-2 text-left">Servizio</th>
                  <th className="border border-border px-3 py-2 text-left">Localizzazione</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-2">Supabase Inc.</td>
                  <td className="border border-border px-3 py-2">Database, autenticazione, hosting backend</td>
                  <td className="border border-border px-3 py-2">UE (con SCC per trasferimenti extra-UE)</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">Stripe Inc.</td>
                  <td className="border border-border px-3 py-2">Elaborazione pagamenti</td>
                  <td className="border border-border px-3 py-2">UE / USA (con SCC)</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">Vercel Inc.</td>
                  <td className="border border-border px-3 py-2">Hosting frontend</td>
                  <td className="border border-border px-3 py-2">UE / USA (con SCC)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2">
            Il Data Controller autorizza in via generale l'utilizzo dei sub-responsabili sopra elencati.
            Il Data Processor informerà il Data Controller di eventuali modifiche, concedendo la possibilità di opporsi.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">7. Gestione Data Breach</h2>
          <p>In caso di violazione dei dati personali, il Data Processor si impegna a:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Notificare il Data Controller <strong>senza ingiustificato ritardo</strong> e comunque entro <strong>48 ore</strong> dalla scoperta della violazione</li>
            <li>Fornire tutte le informazioni necessarie affinché il Data Controller possa adempiere all'obbligo di notifica all'Autorità Garante entro 72 ore (art. 33 GDPR)</li>
            <li>Collaborare con il Data Controller nella gestione della violazione e nell'adozione di misure correttive</li>
            <li>Documentare ogni violazione, inclusi gli effetti e le misure adottate</li>
          </ul>
          <p className="mt-2">La notifica conterrà almeno:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Natura della violazione e categorie di dati coinvolti</li>
            <li>Numero approssimativo di interessati coinvolti</li>
            <li>Probabili conseguenze della violazione</li>
            <li>Misure adottate o proposte per porre rimedio alla violazione</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">8. Trasferimento Dati Extra-UE</h2>
          <p>
            Qualora i dati personali siano trasferiti al di fuori dello Spazio Economico Europeo,
            il Data Processor garantisce l'adozione di garanzie adeguate ai sensi degli artt. 46-47 del GDPR,
            incluse le Clausole Contrattuali Standard (SCC) approvate dalla Commissione Europea.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">9. Audit</h2>
          <p>
            Il Data Controller ha il diritto di verificare il rispetto degli obblighi del presente DPA,
            anche tramite audit condotti direttamente o da un revisore terzo indipendente,
            previo ragionevole preavviso e nel rispetto degli obblighi di riservatezza.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">10. Cessazione</h2>
          <p>
            Alla cessazione del rapporto contrattuale, il Data Processor, a scelta del Data Controller:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Restituirà tutti i dati personali in formato strutturato e leggibile</li>
            <li>Cancellerà tutti i dati personali, certificando l'avvenuta cancellazione</li>
          </ul>
          <p className="mt-2">
            La cancellazione avverrà entro 30 giorni dalla cessazione, salvo obblighi di conservazione previsti dalla legge.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">11. Contatti</h2>
          <p>
            Per questioni relative al presente DPA:<br />
            <strong>BizPower S.r.l.</strong><br />
            Email: <a href="mailto:privacy@lori-crm.it" className="text-primary underline">privacy@lori-crm.it</a>
          </p>
        </div>
      </section>
    </div>
  </>
);

export default DPA;
