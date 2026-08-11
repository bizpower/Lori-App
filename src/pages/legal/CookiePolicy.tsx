import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const CookiePolicy = () => (
  <>
    <Helmet>
      <title>Cookie Policy | LORI CRM</title>
      <meta name="description" content="Cookie Policy di LORI CRM: informazioni dettagliate sui cookie utilizzati, finalità e gestione del consenso conforme alla normativa GDPR e ePrivacy." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://lori-crm.it/cookie-policy" />
    </Helmet>

    <div className="mx-auto max-w-3xl px-4 py-12 text-foreground">
      <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Ultimo aggiornamento: 12 marzo 2026</p>

      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-3">1. Cosa Sono i Cookie</h2>
          <p>
            I cookie sono piccoli file di testo che vengono memorizzati sul dispositivo dell'utente quando visita un sito web.
            Vengono utilizzati per garantire il corretto funzionamento del sito, migliorare l'esperienza di navigazione
            e, previo consenso, per finalità analitiche.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">2. Titolare del Trattamento</h2>
          <p>
            <strong>BizPower S.r.l.</strong><br />
            Email: <a href="mailto:privacy@lori-crm.it" className="text-primary underline">privacy@lori-crm.it</a>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">3. Tipologie di Cookie Utilizzati</h2>

          <h3 className="text-base font-medium mt-4 mb-2">3.1 Cookie Tecnici (Necessari)</h3>
          <p className="mb-2">Questi cookie sono indispensabili per il funzionamento della piattaforma e non richiedono consenso.</p>
          <div className="overflow-x-auto">
            <table className="w-full border border-border text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-3 py-2 text-left">Nome</th>
                  <th className="border border-border px-3 py-2 text-left">Finalità</th>
                  <th className="border border-border px-3 py-2 text-left">Durata</th>
                  <th className="border border-border px-3 py-2 text-left">Provider</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-2 font-mono">sb-*-auth-token</td>
                  <td className="border border-border px-3 py-2">Autenticazione utente e gestione sessione</td>
                  <td className="border border-border px-3 py-2">Sessione</td>
                  <td className="border border-border px-3 py-2">Supabase</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-mono">lori_cookie_consent</td>
                  <td className="border border-border px-3 py-2">Memorizzazione preferenze cookie dell'utente</td>
                  <td className="border border-border px-3 py-2">12 mesi</td>
                  <td className="border border-border px-3 py-2">LORI CRM (prima parte)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-medium mt-4 mb-2">3.2 Cookie Analitici</h3>
          <p className="mb-2">Utilizzati per raccogliere informazioni aggregate sull'utilizzo della piattaforma. Richiedono il consenso dell'utente.</p>
          <div className="overflow-x-auto">
            <table className="w-full border border-border text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-3 py-2 text-left">Nome</th>
                  <th className="border border-border px-3 py-2 text-left">Finalità</th>
                  <th className="border border-border px-3 py-2 text-left">Durata</th>
                  <th className="border border-border px-3 py-2 text-left">Provider</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-2 text-muted-foreground" colSpan={4}>
                    Attualmente LORI CRM non utilizza cookie analitici di terze parti. In caso di attivazione futura, questa sezione verrà aggiornata.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-medium mt-4 mb-2">3.3 Cookie di Marketing</h3>
          <p>
            Attualmente LORI CRM <strong>non utilizza</strong> cookie di marketing o profilazione.
            Qualora venissero introdotti in futuro, questa policy sarà aggiornata e il consenso sarà richiesto preventivamente.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">4. Gestione del Consenso</h2>
          <p>
            Al primo accesso alla piattaforma, viene mostrato un banner che permette di:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Accettare tutti i cookie</strong></li>
            <li><strong>Rifiutare i cookie non necessari</strong></li>
            <li><strong>Personalizzare le preferenze</strong> per categoria (necessari, analitici, marketing)</li>
          </ul>
          <p className="mt-2">
            Il consenso viene registrato con timestamp e può essere modificato in qualsiasi momento
            tramite il link "Gestione Cookie" presente nel footer della piattaforma.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">5. Disattivazione dei Cookie dal Browser</h2>
          <p>
            L'utente può disattivare i cookie anche attraverso le impostazioni del proprio browser.
            Si tenga presente che la disattivazione dei cookie tecnici potrebbe compromettere il funzionamento della piattaforma.
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-primary underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary underline">Safari</a></li>
            <li><a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary underline">Microsoft Edge</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">6. Riferimenti Normativi</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Regolamento (UE) 2016/679 (GDPR)</li>
            <li>Direttiva 2002/58/CE (ePrivacy Directive)</li>
            <li>Provvedimento del Garante Privacy italiano del 10 giugno 2021 n. 231 (Linee guida cookie)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">7. Ulteriori Informazioni</h2>
          <p>
            Per informazioni complete sul trattamento dei dati personali, consultare la nostra{" "}
            <Link to="/privacy-policy" className="text-primary underline">Privacy Policy</Link>.
          </p>
          <p className="mt-2">
            Per domande o richieste: <a href="mailto:privacy@lori-crm.it" className="text-primary underline">privacy@lori-crm.it</a>
          </p>
        </div>
      </section>
    </div>
  </>
);

export default CookiePolicy;
