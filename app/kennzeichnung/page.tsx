import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kennzeichnungs-Richtlinie — findma.',
  description: 'Wie findma. die Herkunft von Unternehmen, Produkten und Software kennzeichnet — transparent und nachvollziehbar.',
}

export default function KennzeichnungPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Zur Herkunftskennzeichnung</h1>
      <p className="text-gray-500 mb-10">
        Jeder Eintrag bei findma. trägt eine Herkunftskennzeichnung. Diese Seite erklärt wie diese Kennzeichnung zustande kommt, was sie bedeutet und was sie nicht bedeutet.
      </p>

      <div className="space-y-8">

        {/* Was bedeuten die Kennzeichnungen */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Was bedeuten die Kennzeichnungen?</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="text-xs font-bold tracking-widest text-green-800 mb-2">🇦🇹 ÖSTERREICH</div>
              <p className="text-sm text-gray-700">Das Unternehmen wurde in Österreich gegründet, hat seinen Hauptsitz in Österreich und erbringt seine Kernleistung aus Österreich.</p>
            </div>
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
              <div className="text-xs font-bold tracking-widest text-yellow-800 mb-2">🇪🇺 EUROPA</div>
              <p className="text-sm text-gray-700">Das Unternehmen ist ein EU- oder DACH-Unternehmen ohne außereuropäische Konzernmutter. Daten und Entscheidungen bleiben in Europa.</p>
            </div>
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
              <div className="text-xs font-bold tracking-widest text-orange-800 mb-2">🌍 INTERNATIONAL</div>
              <p className="text-sm text-gray-700">Die Marke oder das Produkt hat einen außereuropäischen Eigentümer oder eine außereuropäische Konzernmutter. Dies stellt keine negative Bewertung dar, sondern gibt Auskunft über die Eigentümerstruktur.</p>
            </div>
          </div>
        </section>

        {/* Grundlage */}
        <section className="card p-6">
          <h2 className="font-bold text-gray-900 mb-3">Grundlage der Kennzeichnung</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Die Herkunftskennzeichnung auf findma. basiert auf öffentlich zugänglichen Informationen wie Firmenregistern, Unternehmenswebsites und Presseberichten. Sie stellt eine redaktionelle Einschätzung dar — keine rechtlich verbindliche Bewertung.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            findma. übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit oder Aktualität der Herkunftsangaben. Eigentumsverhältnisse, Unternehmenssitze und Konzernstrukturen können sich jederzeit ändern. Die Kennzeichnung spiegelt den zum Zeitpunkt der Erfassung bekannten Stand wider.
          </p>
        </section>

        {/* Was die Kennzeichnung nicht ist */}
        <section className="card p-6">
          <h2 className="font-bold text-gray-900 mb-3">Was die Kennzeichnung nicht ist</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Die Herkunftskennzeichnung bewertet weder die Qualität eines Unternehmens noch seiner Produkte oder Dienstleistungen. Eine Kennzeichnung als 🌍 International stellt keine negative Beurteilung dar.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            findma. haftet nicht für Schäden, die aus der Nutzung oder dem Vertrauen auf die Herkunftskennzeichnung entstehen. Die Inhalte dienen ausschließlich der allgemeinen Information.
          </p>
        </section>

        {/* Korrekturanfragen */}
        <section className="card p-6">
          <h2 className="font-bold text-gray-900 mb-3">Korrekturanfragen</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Unternehmen, die eine fehlerhafte Kennzeichnung ihres Eintrags feststellen, können eine Korrektur beantragen. findma. wird entsprechende Hinweise sorgfältig prüfen und bei berechtigten Anfragen zeitnah korrigieren.
          </p>
          <p className="text-sm text-gray-600">
            E-Mail: <a href="mailto:buero@findma.at" className="text-[#1D7A4F] hover:underline">buero@findma.at</a>
          </p>
        </section>

        {/* Redaktionelle Unabhängigkeit */}
        <section className="card p-6">
          <h2 className="font-bold text-gray-900 mb-3">Redaktionelle Unabhängigkeit</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            findma. entscheidet redaktionell und unabhängig über die Aufnahme von Einträgen. Ein Rechtsanspruch auf Aufnahme besteht nicht.
          </p>
          <Link href="/redaktion" className="text-sm text-[#1D7A4F] hover:underline">
            Zur redaktionellen Richtlinie →
          </Link>
        </section>

        <p className="text-xs text-gray-400">
          Stand: März 2026. findma. behält sich vor, diese Richtlinie jederzeit anzupassen.
        </p>

      </div>
    </div>
  )
}
