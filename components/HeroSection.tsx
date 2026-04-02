'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Listing } from '@/lib/types'
import ListingCard from './ListingCard'
import Link from 'next/link'

type Ampel = 'green' | 'yellow' | 'red'

// Inline SVG flags — no emoji, works everywhere
const FlagAT = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" className="rounded-sm flex-shrink-0">
    <rect width="20" height="4.67" y="0" fill="#ED2939"/>
    <rect width="20" height="4.67" y="4.67" fill="#fff"/>
    <rect width="20" height="4.67" y="9.33" fill="#ED2939"/>
  </svg>
)

const FlagEU = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" className="rounded-sm flex-shrink-0">
    <rect width="20" height="14" fill="#003399"/>
    <g fill="#FFCC00">
      {/* 12 stars in a circle */}
      {Array.from({length: 12}).map((_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180
        const cx = 10 + 4.5 * Math.cos(angle)
        const cy = 7 + 4.5 * Math.sin(angle)
        return <circle key={i} cx={cx} cy={cy} r="0.7"/>
      })}
    </g>
  </svg>
)

const FlagWorld = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" className="rounded-sm flex-shrink-0">
    <rect width="20" height="14" fill="#1a73e8"/>
    <ellipse cx="10" cy="7" rx="5" ry="5" fill="none" stroke="#fff" strokeWidth="0.6"/>
    <ellipse cx="10" cy="7" rx="2" ry="5" fill="none" stroke="#fff" strokeWidth="0.6"/>
    <line x1="5" y1="7" x2="15" y2="7" stroke="#fff" strokeWidth="0.6"/>
    <line x1="5.5" y1="4.5" x2="14.5" y2="4.5" stroke="#fff" strokeWidth="0.6"/>
    <line x1="5.5" y1="9.5" x2="14.5" y2="9.5" stroke="#fff" strokeWidth="0.6"/>
  </svg>
)

const ampelConfig = {
  green: { Flag: FlagAT, label: 'Österreich', active: 'bg-red-600 text-white border-red-600' },
  yellow: { Flag: FlagEU, label: 'Europa', active: 'bg-blue-800 text-white border-blue-800' },
  red: { Flag: FlagWorld, label: 'International', active: 'bg-blue-500 text-white border-blue-500' },
}

export default function HeroSection({ premium }: { premium: Listing[] }) {
  const [activeAmpel, setActiveAmpel] = useState<Ampel | null>(null)
  const [query, setQuery] = useState('')
  const router = useRouter()

  const filteredPremium = activeAmpel
    ? premium.filter(l => l.ampel === activeAmpel)
    : []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/verzeichnis?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/verzeichnis')
    }
  }

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-14 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/findma-logo.svg" alt="findma." width={160} height={40} className="h-10 w-auto" />
        </div>

        {/* H1 */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-3 leading-tight">
          Das österreichische<br />Verzeichnis.
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl font-semibold text-[#1D7A4F] mb-3">
          Kuratiert. Transparent. Österreichisch.
        </p>

        {/* Sub-subheadline */}
        <p className="text-gray-500 text-base mb-8 max-w-xl mx-auto">
          Österreichische Unternehmen, Produkte und Software — mit klarer Herkunftsbewertung.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Was suchst du? z.B. Buchhaltungssoftware, Karaoke, Tischler..."
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 focus:border-[#1D7A4F] bg-white"
              />
            </div>
            <button type="submit" className="bg-[#1D7A4F] text-white px-5 py-3.5 rounded-xl hover:bg-[#166040] transition-colors flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Ampel Filter mit echten Flaggen */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {(Object.entries(ampelConfig) as [Ampel, typeof ampelConfig.green][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setActiveAmpel(activeAmpel === key ? null : key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                activeAmpel === key ? cfg.active : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              <cfg.Flag />
              <span>{cfg.label}</span>
            </button>
          ))}
        </div>

        {/* Premium-Einträge Preview */}
        {activeAmpel && (
          <div className="max-w-2xl mx-auto">
            <div className="card p-5 text-left">
              <div className="text-xs font-semibold text-gray-500 mb-4 flex items-center gap-2">
                Premium-Einträge —
                <ampelConfig[activeAmpel].Flag />
                {ampelConfig[activeAmpel].label}
              </div>
              {filteredPremium.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400 mb-3">Noch keine Premium-Einträge in dieser Kategorie.</p>
                  <Link href="/premium" className="text-sm text-[#1D7A4F] hover:underline font-medium">
                    Jetzt Premium werden →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredPremium.slice(0, 4).map(l => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
