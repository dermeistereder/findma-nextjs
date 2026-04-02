'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src="/findma-logo.svg" alt="findma." width={120} height={30} className="h-7 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/verzeichnis" className="text-gray-600 hover:text-gray-900 transition-colors">Verzeichnis</Link>
          <Link href="/verzeichnis#kategorien" className="text-gray-600 hover:text-gray-900 transition-colors">Kategorien</Link>
          <Link href="/kennzeichnung" className="text-gray-600 hover:text-gray-900 transition-colors">Kennzeichnung</Link>
          <Link href="/ueber-uns" className="text-gray-600 hover:text-gray-900 transition-colors">Über uns</Link>
          <Link href="/einreichen" className="btn-primary">Eintrag einreichen</Link>
        </nav>

        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 text-sm">
          <Link href="/verzeichnis" onClick={() => setMenuOpen(false)} className="text-gray-700">Verzeichnis</Link>
          <Link href="/verzeichnis#kategorien" onClick={() => setMenuOpen(false)} className="text-gray-700">Kategorien</Link>
          <Link href="/kennzeichnung" onClick={() => setMenuOpen(false)} className="text-gray-700">Kennzeichnung</Link>
          <Link href="/ueber-uns" onClick={() => setMenuOpen(false)} className="text-gray-700">Über uns</Link>
          <Link href="/einreichen" onClick={() => setMenuOpen(false)} className="btn-primary text-center">Eintrag einreichen</Link>
        </div>
      )}
    </header>
  )
}
