import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung — findma.',
  description: 'Datenschutzerklärung von findma.at gemäß DSGVO.',
}

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Datenschutzerklärung</h1>
      <p className="text-sm text-gray-400 mb-10">Stand: März 2026</p>

      <div className="space-y-8 text-sm text-gray-600 leading-relaxed">

        <div>
          <h2 className="font-semibold text-gray-900 mb-3">1. Verantwortlicher</h2>
          <p>
            Stephan Eder<br />
            Mitterau 38, 3388 Mitterau, Österreich<br />
            E-Mail: <a href="mailto:buero@findma.at" className="text-[#1D7A4F] hover:underline">buero@findma.at</a>
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-3">2. Erhobene Daten und Rechtsgrundlagen</h2>
          <p className="mb-3">Bei der Nutzung von findma.at werden folgende Daten verarbeitet:</p>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-700 mb-1">Einreichung eines Eintrags</p>
              <p>Name des Unternehmens, E-Mail-Adresse, Website, Beschreibung. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am Betrieb des Verzeichnisses). Speicherdauer: solange der Eintrag im Verzeichnis geführt wird, danach bis zu 3 Jahre für Nachweiszwecke.</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Premium-Listing (Zahlungsdaten)</p>
              <p>Name, E-Mail-Adresse und Zahlungsdaten werden für die Abonnementabwicklung verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Speicherdauer: 7 Jahre gemäß § 132 BAO (österreichische Aufbewahrungspflicht für Buchhaltungsunterlagen).</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Technische Daten (Serverprotokolle)</p>
              <p>IP-Adresse, Browser-Informationen, Seitenabrufe werden automatisch durch die Hosting-Infrastruktur (Vercel) erfasst. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Sicherheit und Stabilität). Speicherdauer: max. 30 Tage in Serverprotokollen.</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Cookies</p>
              <p>findma.at setzt ausschließlich technisch notwendige Cookies (Session-Cookie für Vorschau-Zugang). Es werden keine Tracking- oder Analyse-Cookies verwendet. Für technisch notwendige Cookies ist keine Einwilligung erforderlich (§ 165 Abs. 3 TKG 2021).</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-3">3. Zweck der Verarbeitung</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li>Betrieb und Verwaltung des Verzeichnisses</li>
            <li>Abwicklung von Premium-Abonnements</li>
            <li>Kommunikation mit Nutzern und Einreichenden</li>
            <li>Erfüllung gesetzlicher Aufbewahrungspflichten</li>
            <li>Sicherstellung der technischen Stabilität und Sicherheit</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-3">4. Drittanbieter und Datenübermittlung</h2>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-700 mb-1">Supabase (Datenbankhosting)</p>
              <p>Supabase Inc., San Francisco, USA — Datenbankserver in Frankfurt, EU. Verarbeitung auf Basis von Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO). Datenschutzerklärung: supabase.com/privacy</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Stripe (Zahlungsabwicklung)</p>
              <p>Stripe Technology Europe Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland. Verarbeitung innerhalb der EU/des EWR. Datenschutzerklärung: stripe.com/de/privacy</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Vercel (Hosting und CDN)</p>
              <p>Vercel Inc., 340 Pine Street Suite 701, San Francisco, CA 94104, USA. Daten können auf Servern in den USA verarbeitet werden. Verarbeitung auf Basis von Standardvertragsklauseln gemäß Art. 46 Abs. 2 lit. c DSGVO. Datenschutzerklärung: vercel.com/legal/privacy-policy</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-3">5. Ihre Rechte</h2>
          <p className="mb-3">Sie haben gemäß DSGVO folgende Rechte gegenüber dem Verantwortlichen:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>Auskunft</strong> (Art. 15 DSGVO): Sie können Auskunft über Ihre gespeicherten Daten verlangen.</li>
            <li><strong>Berichtigung</strong> (Art. 16 DSGVO): Sie können unrichtige Daten korrigieren lassen.</li>
            <li><strong>Löschung</strong> (Art. 17 DSGVO): Sie können unter bestimmten Voraussetzungen die Löschung Ihrer Daten verlangen.</li>
            <li><strong>Einschränkung</strong> (Art. 18 DSGVO): Sie können die Einschränkung der Verarbeitung Ihrer Daten verlangen.</li>
            <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO): Sie können Ihre Daten in einem strukturierten, maschinenlesbaren Format erhalten oder an einen anderen Verantwortlichen übertragen lassen, soweit die Verarbeitung auf einer Einwilligung oder einem Vertrag beruht.</li>
            <li><strong>Widerspruch</strong> (Art. 21 DSGVO): Sie können der Verarbeitung Ihrer Daten widersprechen, soweit diese auf Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) gestützt wird.</li>
            <li><strong>Widerruf der Einwilligung</strong> (Art. 7 Abs. 3 DSGVO): Soweit die Verarbeitung auf einer Einwilligung beruht, können Sie diese jederzeit mit Wirkung für die Zukunft widerrufen.</li>
          </ul>
          <p className="mt-3">Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: <a href="mailto:buero@findma.at" className="text-[#1D7A4F] hover:underline">buero@findma.at</a></p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-3">6. Automatisierte Entscheidungsfindung</h2>
          <p>findma.at trifft keine automatisierten Entscheidungen im Sinne des Art. 22 DSGVO.</p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-3">7. Beschwerderecht</h2>
          <p>Sie haben das Recht, bei der österreichischen Datenschutzbehörde Beschwerde einzureichen:</p>
          <p className="mt-2">
            Österreichische Datenschutzbehörde<br />
            Barichgasse 40–42, 1030 Wien<br />
            E-Mail: dsb@dsb.gv.at<br />
            Web: <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer" className="text-[#1D7A4F] hover:underline">www.dsb.gv.at</a>
          </p>
        </div>

      </div>
    </div>
  )
}
