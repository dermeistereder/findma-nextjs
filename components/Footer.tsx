import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-bold text-lg mb-3">
              findma<span className="text-[#1D7A4F]">.</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Das österreichische Unternehmensverzeichnis mit Herkunftskennzeichnung.
            </p>
          </div>
          <div>
            <div className="font-semibold text-sm mb-3 text-gray-900">Verzeichnis</div>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <Link href="/verzeichnis" className="hover:text-gray-900 transition-colors">Alle Einträge</Link>
              <Link href="/verzeichnis#kategorien" className="hover:text-gray-900 transition-colors">Kategorien</Link>
              <Link href="/einreichen" className="hover:text-gray-900 transition-colors">Eintrag einreichen</Link>
              <Link href="/premium" className="hover:text-gray-900 transition-colors">Premium-Listing</Link>
            </div>
          </div>
          <div>
            <div className="font-semibold text-sm mb-3 text-gray-900">Über findma.</div>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <Link href="/ueber-uns" className="hover:text-gray-900 transition-colors">Über uns</Link>
              <Link href="/kennzeichnung" className="hover:text-gray-900 transition-colors">Kennzeichnungs-Richtlinie</Link>
              <Link href="/redaktion" className="hover:text-gray-900 transition-colors">Redaktionelle Richtlinie</Link>
            </div>
          </div>
          <div>
            <div className="font-semibold text-sm mb-3 text-gray-900">Rechtliches</div>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <Link href="/agb" className="hover:text-gray-900 transition-colors">AGB</Link>
              <Link href="/datenschutz" className="hover:text-gray-900 transition-colors">Datenschutz</Link>
              <Link href="/impressum" className="hover:text-gray-900 transition-colors">Impressum</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} findma. · Ein Projekt aus Niederösterreich 🇦🇹</span>
          <a href="mailto:buero@findma.at" className="hover:text-gray-600 transition-colors">buero@findma.at</a>
        </div>
      </div>
    </footer>
  )
}
