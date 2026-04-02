'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ResearchedListing {
  name: string
  website: string
  description: string
  description_long: string
  category_slug: string
  ampel: 'green' | 'yellow' | 'red'
  ampel_reason: string
  hq_country: string
  founded_country: string
  owner_country: string
  keywords: string
  type: string
  slug: string
}

const ampelLabels = { green: '🇦🇹 Österreich', yellow: '🇪🇺 Europa', red: '🌍 International' }
const categoryOptions = [
  { slug: 'kommunikation', name: 'Kommunikation & Kollaboration' },
  { slug: 'cloud-hosting', name: 'Cloud & Hosting' },
  { slug: 'buchhaltung-finanzen', name: 'Buchhaltung & Finanzen' },
  { slug: 'lebensmittel-getraenke', name: 'Lebensmittel & Getränke' },
  { slug: 'mode-textil', name: 'Mode & Textil' },
  { slug: 'sport-outdoor', name: 'Sport & Outdoor' },
  { slug: 'events-entertainment', name: 'Events & Entertainment' },
  { slug: 'ki-automatisierung', name: 'KI & Automatisierung' },
  { slug: 'kunst-handgemachtes', name: 'Kunst & Handgemachtes' },
]

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [query, setQuery] = useState('')
  const [researching, setResearching] = useState(false)
  const [result, setResult] = useState<ResearchedListing | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedSlug, setSavedSlug] = useState('')
  const [submissions, setSubmissions] = useState<any[]>([])
  const [tab, setTab] = useState<'research' | 'submissions'>('research')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, url: 'test', name: 'test' }),
    })
    if (res.status !== 401) {
      setAuthed(true)
      loadSubmissions()
    }
  }

  const loadSubmissions = async () => {
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setSubmissions(data || [])
  }

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setResearching(true)
    setResult(null)
    try {
      const isUrl = query.startsWith('http')
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          ...(isUrl ? { url: query } : { name: query }),
        }),
      })
      const data = await res.json()
      setResult(data)
    } catch { }
    setResearching(false)
  }

  const handleSave = async () => {
    if (!result) return
    setSaving(true)

    // Get category ID
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', result.category_slug)
      .single()

    const { error } = await supabase.from('listings').insert([{
      name: result.name,
      slug: result.slug,
      description: result.description,
      description_long: result.description_long,
      category_id: cat?.id || null,
      ampel: result.ampel,
      ampel_reason: result.ampel_reason,
      website: result.website,
      keywords: result.keywords,
      type: result.type,
      hq_country: result.hq_country,
      founded_country: result.founded_country,
      owner_country: result.owner_country,
      status: 'approved',
      is_featured: false,
      is_premium: false,
      views: 0,
    }])

    if (!error) {
      setSavedSlug(result.slug)
      setResult(null)
      setQuery('')
    }
    setSaving(false)
  }

  if (!authed) return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin</h1>
      <form onSubmit={handleAuth} className="card p-6 space-y-4">
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Passwort"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30"
        />
        <button type="submit" className="btn-primary w-full">Einloggen</button>
      </form>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
        <div className="flex gap-2">
          <button onClick={() => setTab('research')} className={tab === 'research' ? 'btn-primary' : 'btn-secondary'}>
            🔍 KI-Recherche
          </button>
          <button onClick={() => setTab('submissions')} className={tab === 'submissions' ? 'btn-primary' : 'btn-secondary'}>
            📬 Einreichungen ({submissions.length})
          </button>
        </div>
      </div>

      {savedSlug && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-sm text-green-800">
          ✓ Gespeichert! <a href={`/verzeichnis/${savedSlug}`} className="underline">Eintrag ansehen →</a>
        </div>
      )}

      {tab === 'research' && (
        <div>
          <form onSubmit={handleResearch} className="card p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Neuen Eintrag recherchieren</h2>
            <div className="flex gap-3">
              <input
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="URL oder Unternehmensname (z.B. https://meinunternehmen.at oder Red Bull)"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 focus:border-[#1D7A4F]"
              />
              <button type="submit" disabled={researching || !query} className="btn-primary disabled:opacity-50 whitespace-nowrap">
                {researching ? '🔍 Recherchiere...' : '🤖 KI-Recherche'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Claude durchsucht das Web und befüllt alle Felder automatisch — du prüfst und speicherst.
            </p>
          </form>

          {result && (
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-5">Recherche-Ergebnis — bitte prüfen</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Name', key: 'name' },
                  { label: 'Slug (URL)', key: 'slug' },
                  { label: 'Website', key: 'website' },
                  { label: 'Kategorie', key: 'category_slug' },
                  { label: 'Typ', key: 'type' },
                  { label: 'Hauptsitz', key: 'hq_country' },
                  { label: 'Gegründet in', key: 'founded_country' },
                  { label: 'Eigentümer-Land', key: 'owner_country' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-400 mb-1">{label}</label>
                    <input
                      type="text" value={(result as any)[key] || ''}
                      onChange={e => setResult({ ...result, [key]: e.target.value } as ResearchedListing)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-xs text-gray-400 mb-1">Herkunft</label>
                <select
                  value={result.ampel}
                  onChange={e => setResult({ ...result, ampel: e.target.value as any })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  {Object.entries(ampelLabels).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-xs text-gray-400 mb-1">Beschreibung (kurz)</label>
                <textarea rows={2} value={result.description || ''}
                  onChange={e => setResult({ ...result, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                />
              </div>

              <div className="mt-4">
                <label className="block text-xs text-gray-400 mb-1">Beschreibung (lang)</label>
                <textarea rows={4} value={result.description_long || ''}
                  onChange={e => setResult({ ...result, description_long: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                />
              </div>

              <div className="mt-4">
                <label className="block text-xs text-gray-400 mb-1">Herkunftsbegründung</label>
                <textarea rows={2} value={result.ampel_reason || ''}
                  onChange={e => setResult({ ...result, ampel_reason: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                />
              </div>

              <div className="mt-4">
                <label className="block text-xs text-gray-400 mb-1">Keywords</label>
                <input type="text" value={result.keywords || ''}
                  onChange={e => setResult({ ...result, keywords: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
                  {saving ? 'Speichern...' : '✓ Eintrag speichern'}
                </button>
                <button onClick={() => setResult(null)} className="btn-secondary">
                  Verwerfen
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'submissions' && (
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Keine offenen Einreichungen</div>
          ) : (
            submissions.map(sub => (
              <div key={sub.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{sub.name}</h3>
                    <a href={sub.website} target="_blank" className="text-sm text-[#1D7A4F] hover:underline">{sub.website}</a>
                    <p className="text-sm text-gray-500 mt-1">{sub.description}</p>
                    <p className="text-xs text-gray-400 mt-2">Von: {sub.submitted_by_email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setQuery(sub.website || sub.name)
                      setTab('research')
                    }}
                    className="btn-secondary whitespace-nowrap text-xs"
                  >
                    🤖 Recherchieren
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
