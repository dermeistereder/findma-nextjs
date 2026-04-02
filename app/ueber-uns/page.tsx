import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Über findma.',
  description: 'findma. ist ein unabhängiges Projekt aus Niederösterreich — das österreichische Unternehmensverzeichnis mit Herkunftskennzeichnung.',
}

export default function UeberUnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Über findma<span className="text-[#1D7A4F]">.</span>
        </h1>
        <p className="text-xl text-gray-500">find ma. Aus Österreich.</p>
      </div>

      <div className="prose prose-gray max-w-none">
        <div className="card p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Warum findma.?</h2>
          <p className="text-gray-600 leading-relaxed">
            Österreich hat großartige Unternehmen, Produkte und Software. Aber es ist oft schwer zu wissen,
            welche davon wirklich aus Österreich kommen — und welche nur so klingen.
            findma. macht Herkunft transparent.
          </p>
        </div>

        <div className="card p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Unser Ansatz</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Unsere Herkunftskennzeichnung macht transparent, woher ein Unternehmen kommt — ohne zu werten.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                flag: '🇦🇹', label: 'ÖSTERREICH', color: 'border-green-200 bg-green-50 text-green-800',
                points: ['Gegründet in Österreich', 'Hauptsitz in Österreich', 'Kernleistung aus Österreich'],
              },
              {
                flag: '🇪🇺', label: 'EUROPA', color: 'border-yellow-200 bg-yellow-50 text-yellow-800',
                points: ['EU- oder DACH-Unternehmen', 'Kein außereuropäischer Konzern', 'Daten bleiben in Europa'],
              },
              {
                flag: '🌍', label: 'INTERNATIONAL', color: 'border-orange-200 bg-orange-50 text-orange-800',
                points: ['Europäische Marke', 'Außereuropäischer Eigentümer', 'Transparenz, nicht Wertung'],
              },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl border p-4 ${item.color}`}>
                <div className="text-xs font-bold tracking-widest mb-3">{item.flag} {item.label}</div>
                <ul className="text-sm space-y-1">
                  {item.points.map(p => <li key={p} className="text-gray-600">✓ {p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Das Projekt</h2>
          <p className="text-gray-600 leading-relaxed">
            findma. ist ein unabhängiges Projekt aus Niederösterreich. Kein Konzern, keine Investoren —
            nur die Überzeugung, dass es einfacher sein sollte, bewusst österreichisch zu kaufen und zu buchen.
          </p>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Kontakt</h2>
          <p className="text-gray-600 mb-3">Fragen, Anregungen oder Feedback? Wir freuen uns über eine Nachricht.</p>
          <a href="mailto:buero@findma.at" className="text-[#1D7A4F] hover:underline font-medium">
            buero@findma.at
          </a>
        </div>
      </div>
    </div>
  )
}
