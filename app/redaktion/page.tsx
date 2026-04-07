import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Redaktionelle Richtlinie — findma.',
  description: 'Wie findma. Einträge prüft, freischaltet und redaktionell verwaltet.',
}

export default function RedaktionPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Redaktionelle Richtlinie</h1>
      <p className="text-gray-500 mb-10">
        findma. ist ein kuratiertes Verzeichnis — kein öffentliches Register und keine automatische Datenbank. Jeder Eintrag wird manuell geprüft und redaktionell freigegeben.
      </p>

      <div className="space-y-6">

        <section className="card p-6">
          <h2 className="font-bold text-gray-900 mb-3">Kein Rechtsanspruch auf Aufnahme</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Die Aufnahme in das Verzeichnis liegt im alleinigen redaktionellen Ermessen von findma. Ein Rechtsanspruch auf Aufnahme besteht nicht. Einreichungen können ohne Angabe von Gründen abgelehnt werden.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            findma. ist vergleichbar mit einem redaktionell kuratierten Reiseführer oder Branchenmagazin — wir entscheiden selbst, worüber wir berichten und wen wir empfehlen.
          </p>
        </section>

        <section className="card p-6">
          <h2 className="font-bold text-gray-900 mb-3">Aufnahmekriterien</h2>
          <p className="text-sm text-gray-600 mb-4">Wir prüfen jede Einreichung nach folgenden Kriterien:</p>
          <ul className="space-y-2">
            {[
              'Nachweisbarer Bezug zu Österreich oder Europa',
              'Seriöser und überprüfbarer Unternehmensauftritt',
              'Vollständige und nachvollziehbare Angaben zur Herkunft',
              'Übereinstimmung mit den redaktionellen Werten von findma.',
              'Keine irreführenden oder falschen Angaben zur Unternehmensherkunft',
            ].map((item) => (
              <li key={item} className="flex gap-2 text-sm text-gray-600">
                <span className="text-[#1D7A4F] flex-shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6">
          <h2 className="font-bold text-gray-900 mb-3">Entfernung von Einträgen</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            findma. behält sich vor, bestehende Einträge jederzeit zu korrigieren, zu aktualisieren oder zu entfernen — insbesondere wenn:
          </p>
          <ul className="space-y-2 mb-4">
            {[
              'Sich Eigentumsverhältnisse oder Unternehmensstrukturen wesentlich ändern',
              'Angaben sich als unrichtig herausstellen',
              'Ein Unternehmen nicht mehr den Aufnahmekriterien entspricht',
            ].map((item) => (
              <li key={item} className="flex gap-2 text-sm text-gray-600">
                <span className="text-gray-400 flex-shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600">Betroffene Unternehmen werden nach Möglichkeit vorab informiert.</p>
        </section>

        <section className="card p-6">
          <h2 className="font-bold text-gray-900 mb-3">Prüfungsdauer</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Einreichungen werden innerhalb von 3 Werktagen geprüft. Bei Rückfragen melden wir uns per E-Mail. Nicht aufgenommene Einreichungen werden nicht gesondert begründet.
          </p>
        </section>

        <section className="card p-6">
          <h2 className="font-bold text-gray-900 mb-3">Kontakt</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Fragen zur redaktionellen Richtlinie oder zu bestehenden Einträgen:
          </p>
          <p className="text-sm text-gray-600">
            E-Mail: <a href="mailto:buero@findma.at" className="text-[#1D7A4F] hover:underline">buero@findma.at</a>
          </p>
        </section>

        <p className="text-xs text-gray-400">
          Stand: März 2026. findma. behält sich vor, diese Richtlinie jederzeit anzupassen.
        </p>

      </div>
    </div>
  )
}
