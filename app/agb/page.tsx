import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AGB',
  description: 'Allgemeine Geschäftsbedingungen für Premium-Listings auf findma.at',
}

const paragraphs = [
  {
    title: '§ 1 Anbieter und Geltungsbereich',
    text: `(1) Diese Allgemeinen Geschäftsbedingungen gelten für alle entgeltlichen Leistungen des Verzeichnisses findma.at, betrieben von:
Stephan Eder, Mitterau 38, 3388 Mitterau, Österreich, E-Mail: buero@findma.at (nachfolgend „Anbieter" oder „findma.")

(2) Diese AGB gelten ausschließlich für Vertragspartner, die ein Premium-Listing auf findma.at buchen. Abweichende Bedingungen des Kunden werden nicht anerkannt, sofern der Anbieter diesen nicht ausdrücklich schriftlich zugestimmt hat.

(3) findma.at richtet sich ausschließlich an Unternehmer im Sinne des § 1 KSchG (Österreich).`,
  },
  {
    title: '§ 2 Leistungen — Premium-Listing',
    text: `(1) findma. bietet zwei Arten von Einträgen an:
a) Basiseintrag (kostenlos): Eintrag im Verzeichnis, Herkunftskennzeichnung, eigene Detailseite, Suchbarkeit.
b) Premium-Listing (kostenpflichtig): Alle Leistungen des Basiseintrags sowie Premium-Badge, priorisierte Darstellung, Verifiziert-Banner, Anzeige von Telefon, Adresse und Social-Media-Links sowie bis zu drei Fotos.

(2) Der Anbieter behält sich vor, den Funktionsumfang von Premium-Listings zu erweitern oder anzupassen, sofern dies dem Kunden mindestens 14 Tage vor Inkrafttreten schriftlich per E-Mail mitgeteilt wird.

(3) Die Aufnahme eines Eintrags begründet keinen Rechtsanspruch. findma. behält sich das Recht vor, Einträge ohne Angabe von Gründen abzulehnen oder zu entfernen.`,
  },
  {
    title: '§ 3 Vertragsschluss',
    text: `(1) Die Buchung eines Premium-Listings erfolgt über den Checkout-Prozess auf findma.at. Mit Abschluss des Bestellvorgangs gibt der Kunde ein verbindliches Angebot zum Abschluss eines Abonnementvertrags ab.

(2) Der Vertrag kommt mit der Bestätigung der Zahlung durch den Zahlungsdienstleister (Stripe) und der daraus folgenden Freischaltung des Premium-Listings zustande.

(3) Der Kunde erhält nach erfolgter Zahlung eine Bestätigungs-E-Mail an die bei der Buchung angegebene Adresse.`,
  },
  {
    title: '§ 4 Preise und Zahlung',
    text: `(1) Die jeweils aktuellen Preise für Premium-Listings sind auf der Seite findma.at/premium ausgewiesen. Alle Preise verstehen sich in Euro (€) inklusive der gesetzlichen Umsatzsteuer.

(2) Derzeit werden folgende Tarife angeboten:
– Monatliches Abonnement: € 49,00 / Monat
– Jährliches Abonnement: € 490,00 / Jahr (entspricht 2 Monaten gratis)

(3) Die Zahlung erfolgt im Voraus über Stripe (Stripe Technology Europe Ltd., Dublin 2, Irland). Akzeptierte Zahlungsmethoden sind Kreditkarte und SEPA-Lastschrift.

(4) Der Anbieter behält sich das Recht vor, Preise mit einer Ankündigungsfrist von 30 Tagen zu ändern.`,
  },
  {
    title: '§ 5 Laufzeit und Kündigung',
    text: `(1) Das monatliche Abonnement läuft auf unbestimmte Zeit und verlängert sich automatisch um jeweils einen Monat.

(2) Das jährliche Abonnement läuft für ein Jahr und verlängert sich automatisch um ein weiteres Jahr.

(3) Kündigungsfrist: Das Abonnement kann jederzeit zum Ende des laufenden Abrechnungszeitraums per E-Mail an buero@findma.at gekündigt werden.

(4) Nach wirksamer Kündigung wird der Premium-Status zum Ende des bezahlten Zeitraums deaktiviert. Der Basiseintrag bleibt davon unberührt.`,
  },
  {
    title: '§ 6 Pflichten des Kunden',
    text: `(1) Der Kunde verpflichtet sich, ausschließlich wahrheitsgemäße und aktuelle Angaben über sein Unternehmen bereitzustellen.

(2) Der Kunde hat Änderungen relevanter Unternehmensdaten unverzüglich per E-Mail an buero@findma.at mitzuteilen.

(3) Hochgeladene Inhalte dürfen keine Rechte Dritter verletzen. Der Kunde räumt findma. das nicht-exklusive Recht ein, diese Inhalte im Rahmen des Verzeichnisses zu nutzen.`,
  },
  {
    title: '§ 7 Herkunftskennzeichnung',
    text: `(1) Die Herkunftskennzeichnung (🇦🇹 Österreich / 🇪🇺 Europa / 🌍 International) erfolgt redaktionell durch findma. auf Basis öffentlich zugänglicher Informationen. Sie stellt keine rechtlich verbindliche Aussage dar.

(2) Kunden können eine Überprüfung oder Korrektur der Kennzeichnung jederzeit per E-Mail an buero@findma.at beantragen.`,
  },
  {
    title: '§ 8 Haftung',
    text: `(1) Der Anbieter haftet für Schäden aus vorsätzlichem oder grob fahrlässigem Verhalten nach den gesetzlichen Bestimmungen.

(2) Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten, begrenzt auf den vorhersehbaren Schaden.

(3) Der Anbieter übernimmt keine Haftung für die inhaltliche Richtigkeit der von Kunden bereitgestellten Informationen.`,
  },
  {
    title: '§ 9 Datenschutz',
    text: `(1) Die Verarbeitung personenbezogener Daten erfolgt gemäß der Datenschutzerklärung des Anbieters, abrufbar unter findma.at/datenschutz.

(2) Zur Zahlungsabwicklung werden Daten des Kunden an Stripe Technology Europe Ltd. übermittelt.`,
  },
  {
    title: '§ 10 Anwendbares Recht und Gerichtsstand',
    text: `(1) Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts (CISG).

(2) Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz des Anbieters in Niederösterreich.`,
  },
  {
    title: '§ 11 Schlussbestimmungen',
    text: `(1) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.

(2) Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/. Da sich findma. ausschließlich an Unternehmer richtet, ist findma. weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

(3) Diese AGB wurden zuletzt im März 2026 aktualisiert.`,
  },
]

export default function AGBPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">AGB</h1>
      <p className="text-gray-500 mb-2">Allgemeine Geschäftsbedingungen</p>
      <p className="text-sm text-gray-400 mb-10">Premium-Listings — Stand: März 2026</p>

      <div className="space-y-8">
        {paragraphs.map((p) => (
          <div key={p.title}>
            <h2 className="font-semibold text-gray-900 mb-3">{p.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
