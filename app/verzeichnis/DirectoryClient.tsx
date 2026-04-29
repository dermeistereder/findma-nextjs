'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Listing, Category, Ampel } from '@/lib/types'
import ListingCard from '@/components/ListingCard'
import AmpelBadge from '@/components/AmpelBadge'

interface Props {
  listings: Listing[]
  categories: Category[]
}

export default function DirectoryClient({ listings, categories }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [activeQuery, setActiveQuery] = useState(initialQuery)
  const [ampelFilter, setAmpelFilter] = useState<Ampel | ''>('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [filtered, setFiltered] = useState<Listing[]>(listings)
  const [isSearching, setIsSearching] = useState(false)
  const [smartResult, setSmartResult] = useState<{ keywords: string[], ampel?: string, category_slug?: string } | null>(null)

  const applyFilters = useCallback(async (q: string) => {
    if (!q.trim()) {
      setFiltered(listings.filter(l =>
        (!ampelFilter || l.ampel === ampelFilter) &&
        (!categoryFilter || l.categories?.slug === categoryFilter)
      ))
      setSmartResult(null)
      return
    }

    setIsSearching(true)
    let keywords = [q]
    let parsedAmpel = ampelFilter
    let parsedCategory = categoryFilter

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      if (res.ok) {
        const data = await res.json()
        setSmartResult(data)
        keywords = data.keywords || [q]
        if (data.ampel && !ampelFilter) parsedAmpel = data.ampel
        if (data.category_slug && !categoryFilter) parsedCategory = data.category_slug
      }
    } catch {}

    const scored = listings.flatMap(listing => {
      if (parsedAmpel && listing.ampel !== parsedAmpel) return []
      if (parsedCategory && listing.categories?.slug !== parsedCategory) return []

      const searchText = [
        listing.name,
        listing.description,
        listing.description_long,
        listing.keywords,
        listing.categories?.name,
        listing.address,
        listing.hq_country,
        listing.founded_country,
      ].join(' ').toLowerCase()

      const score = keywords.reduce((n, kw) => n + (searchText.includes(kw.toLowerCase()) ? 1 : 0), 0)
      if (score === 0) return []
      return [{ listing, score }]
    })

    scored.sort((a, b) => b.score - a.score || (b.listing.is_premium ? 1 : 0) - (a.listing.is_premium ? 1 : 0))
    const results = scored.map(s => s.listing)

    setFiltered(results)
    setIsSearching(false)
  }, [listings, ampelFilter, categoryFilter])

  useEffect(() => {
    if (initialQuery) {
      applyFilters(initialQuery)
    } else {
      applyFilters('')
    }
  }, [initialQuery, ampelFilter, categoryFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveQuery(query)
    router.push(query ? `/verzeichnis?q=${encodeURIComponent(query)}` : '/verzeichnis', { scroll: false })
    applyFilters(query)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-2xl">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='z.B. "österreichische Buchhaltungssoftware" oder "Lebensmittel aus Wien"'
            className="w-full pl-12 pr-28 py-3.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 focus:border-[#1D7A4F]"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary text-xs py-2">
            {isSearching ? '...' : 'Suchen'}
          </button>
        </div>
      </form>

      {/* Smart search hint */}
      {smartResult && activeQuery && (
        <div className="mb-4 text-sm text-gray-500 bg-[#e8f5ee] rounded-lg px-4 py-2.5 flex items-center gap-2">
          <span>🔍</span>
          <span>Smarte Suche nach: <strong>{smartResult.keywords.join(', ')}</strong>
            {smartResult.ampel && <> · Herkunft: <AmpelBadge ampel={smartResult.ampel as Ampel} size="sm" /></>}
          </span>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden md:block w-48 flex-shrink-0">
          <div className="sticky top-20">
            <div className="font-semibold text-sm text-gray-900 mb-3">Herkunft</div>
            <div className="flex flex-col gap-1 mb-6">
              {(['', 'green', 'yellow', 'red'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAmpelFilter(a)}
                  className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                    ampelFilter === a
                      ? 'bg-[#1D7A4F] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {a === '' ? 'Alle' : a === 'green' ? '🇦🇹 Österreich' : a === 'yellow' ? '🇪🇺 Europa' : '🌍 International'}
                </button>
              ))}
            </div>

            <div className="font-semibold text-sm text-gray-900 mb-3">Kategorie</div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setCategoryFilter('')}
                className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${!categoryFilter ? 'bg-[#1D7A4F] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Alle
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.slug)}
                  className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${categoryFilter === cat.slug ? 'bg-[#1D7A4F] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-500 mb-4">
            {filtered.length} {filtered.length === 1 ? 'Eintrag' : 'Einträge'}
            {activeQuery && <> für „{activeQuery}"</>}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">🔍</div>
              <div className="font-medium text-gray-600 mb-1">Keine Einträge gefunden</div>
              <div className="text-sm">Versuche einen anderen Suchbegriff oder entferne Filter.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
