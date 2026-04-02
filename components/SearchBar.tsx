'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const examples = [
  'österreichische Buchhaltungssoftware',
  'Lebensmittel aus Wien',
  'europäische Alternative zu Slack',
  'Schuhe made in Austria',
]

export default function SearchBar({ initialValue = '' }: { initialValue?: string }) {
  const [query, setQuery] = useState(initialValue)
  const [hint, setHint] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/verzeichnis?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suche nach Unternehmen, Produkten oder Kategorien..."
          className="w-full pl-12 pr-32 py-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 focus:border-[#1D7A4F] text-sm shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary"
        >
          Suchen
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <span className="text-xs text-gray-400">z.B.:</span>
        {examples.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => {
              setQuery(ex)
              router.push(`/verzeichnis?q=${encodeURIComponent(ex)}`)
            }}
            className="text-xs text-[#1D7A4F] hover:underline"
          >
            {ex}
          </button>
        ))}
      </div>
    </form>
  )
}
