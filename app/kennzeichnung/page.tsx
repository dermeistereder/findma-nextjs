import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kennzeichnungs-Richtlinie',
  description: 'Wie findma. die Herkunft von Unternehmen, Produkten und Software kennzeichnet — transparent und nachvollziehbar.',
}

export default function KennzeichnungPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Kennzeichnungs-Richtlinie</h1>
      <p className="text-gray-500 mb-10">Wie findma. Herkunft bewertet — transparent und nachvollziehbar.</p>

      <div className="space-y-6">
        {[
          {
            flag: '🇦🇹', label: 'ÖSTERREICH', color: 'border-green-200 bg-green-50', text: 'text-green-800',
            criteria: [
              'Das Unternehmen wurde in Österreich gegründet.',
              'Der Hauptsitz (registered office) befindet sich in Österreich.',
              'Die Kernleistung wird in Österreich erbracht oder entwickelt.',
              'Das Unternehmen ist mehrheitlich österreichisch eigenverantwortlich (kein außereuropäischer Mehrheitseigentümer).',
            ],
            examples: 'Wolftank, Blum, Red Bull (trotz teilweiser internationaler Beteiligung als österreichisches Ursprungsunternehmen), Swarovski, AVL List.',
          },
          {
            flag: '🇪🇺', label: 'EUROPA', color: 'border-yellow-200 bg-yellow-50', text: 'text-yellow-800',
            criteria: [
              'Das Unternehmen hat seinen Hauptsitz in einem EU- oder DACH-Land.',
              'Es besteht kein außereuropäischer Mehrheitseigentümer.',
              'Nutzerdaten werden in Europa gespeichert und verarbeitet (soweit bekannt).',
              'Das Unternehmen ist nicht Teil eines US- oder asiatischen Konzerns.',
            ],
            examples: 'Basecamp (US — daher nicht Europa), SAP (DE ✓), Jimdo (DE ✓), Mistral (FR ✓).',
          },
          {
            flag: '🌍', label: 'INTERNATIONAL', color: 'border-orange-200 bg-orange-50', text: 'text-orange-800',
            criteria: [
              'Europäische oder österreichisch klingende Marke mit außereuropäischem Eigentümer.',
              'Der Mutterkonzern hat seinen Hauptsitz außerhalb Europas (USA, China, etc.).',
              'Beispiel: eine österreichische Marke, die an einen US-Konzern verkauft wurde.',
            ],
            examples: 'Runtastic (→ Adidas, DE, als europäisches Unternehmen Europa-Kennzeichnung), Shpock (→ Schibsted, NO ✓ Europa), easyname (→ dogado, DE — je nach Bewertung).',
          },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl border p-6 ${item.color}`}>
            <div className={`text-xs font-bold tracking-widest mb-4 ${item.text}`}>{item.flag} {item.label}</div>
            <h3 className="font-semibold text-gray-900 mb-3">Kriterien</h3>
            <ul className="space-y-2 mb-4">
              {item.criteria.map((c, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-gray-400 flex-shrink-0">→</span>
                  {c}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500"><strong>Beispiele:</strong> {item.examples}</p>
          </div>
        ))}

        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-3">Wichtige Hinweise</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-gray-400">·</span> Die Kennzeichnung basiert auf öffentlich zugänglichen Informationen (Firmenbuch, Unternehmenswebsites, Wikipedia, Pressemitteilungen).</li>
            <li className="flex gap-2"><span className="text-gray-400">·</span> Sie stellt keine rechtlich verbindliche Aussage oder Garantie dar.</li>
            <li className="flex gap-2"><span className="text-gray-400">·</span> Eigentumsverhältnisse können sich ändern — wir aktualisieren die Kennzeichnung so schnell wie möglich.</li>
            <li className="flex gap-2"><span className="text-gray-400">·</span> Die Kennzeichnung ist keine politische Aussage, sondern reine Transparenzinformation.</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Kennzeichnung falsch? <a href="mailto:buero@findma.at?subject=Kennzeichnungskorrektur" className="text-[#1D7A4F] hover:underline">Korrektur melden →</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
