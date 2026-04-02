import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Impressum' }

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Impressum</h1>
      <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
        <div>
          <h2 className="font-semibold text-gray-900 mb-2">Angaben gemäß § 5 ECG</h2>
          <p>Stephan Eder<br />Mitterau 38<br />3388 Mitterau<br />Österreich</p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 mb-2">Kontakt</h2>
          <p>E-Mail: <a href="mailto:buero@findma.at" className="text-[#1D7A4F] hover:underline">buero@findma.at</a></p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 mb-2">Unternehmensgegenstand</h2>
          <p>Betrieb eines österreichischen Unternehmensverzeichnisses mit Herkunftskennzeichnung.</p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 mb-2">Haftungsausschluss</h2>
          <p>Die Kennzeichnungen auf findma.at basieren auf öffentlich zugänglichen Informationen und stellen keine rechtlich verbindlichen Aussagen dar. Trotz sorgfältiger Prüfung übernehmen wir keine Haftung für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte.</p>
        </div>
      </div>
    </div>
  )
}
