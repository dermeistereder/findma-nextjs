import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
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
          <p>Stephan Eder<br />Mitterau 38, 3388 Mitterau, Österreich<br />E-Mail: buero@findma.at</p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-3">2. Erhobene Daten</h2>
          <p className="mb-2">Bei der Nutzung von findma.at werden folgende Daten verarbeitet:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Beim Einreichen eines Eintrags: Name, E-Mail-Adresse, Unternehmensangaben</li>
            <li>Beim Buchen eines Premium-Listings: Zahlungsdaten (verarbeitet durch Stripe)</li>
            <li>Technische Daten: IP-Adresse, Browser-Informationen (durch Vercel-Infrastruktur)</li>
            <li>Analytikdaten: anonymisierte Nutzungsstatistiken</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-3">3. Zweck der Verarbeitung</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li>Betrieb und Verwaltung des Verzeichnisses</li>
            <li>Abwicklung von Premium-Abonnements</li>
            <li>Kommunikation mit Nutzern und Einreichenden</li>
            <li>Verbesserung des Dienstes</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-3">4. Drittanbieter</h2>
          <p className="mb-2"><strong>Supabase:</strong> Datenbankhosting in der EU (Frankfurt). Datenschutzerklärung: supabase.com/privacy</p>
          <p className="mb-2"><strong>Stripe:</strong> Zahlungsabwicklung. Stripe Technology Europe Ltd., Dublin, Irland. Datenschutzerklärung: stripe.com/de/privacy</p>
          <p className="mb-2"><strong>Vercel:</strong> Hosting und CDN. Vercel Inc., San Francisco. Datenschutzerklärung: vercel.com/legal/privacy-policy</p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-3">5. Ihre Rechte</h2>
          <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten. Anfragen richten Sie bitte an buero@findma.at.</p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-3">6. Beschwerderecht</h2>
          <p>Sie haben das Recht, bei der österreichischen Datenschutzbehörde (dsb.gv.at) Beschwerde einzureichen.</p>
        </div>
      </div>
    </div>
  )
}
