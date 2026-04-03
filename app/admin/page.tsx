'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Listing {
  id: string; name: string; slug: string; website: string
  description: string; description_long: string; ampel: string
  ampel_reason: string; category_id: string; is_premium: boolean
  is_featured: boolean; stripe_subscription_id: string | null
  status: string; hq_country: string; founded_country: string
  owner_country: string; keywords: string; type: string
  categories?: { name: string; slug: string }
}
interface Submission {
  id: string; name: string; website: string; description: string
  submitted_by_email: string; status: string; created_at: string
}
interface Stats {
  total: number; approved: number; pending: number; premium: number; submissions: number
}

interface BulkItem {
  name: string
  website: string
  description: string
  description_long?: string
  ampel: 'green' | 'yellow' | 'red'
  ampel_reason?: string
  category_slug: string
  hq_country?: string
  founded_country?: string
  owner_country?: string
  keywords?: string
  type?: string
}

const CATEGORIES = [
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
const AMPEL_FLAGS: Record<string, string> = { green: '🇦🇹', yellow: '🇪🇺', red: '🌍' }

// ─── Helpers ─────────────────────────────────────────────────────────────────
function adminFetch(path: string, password: string, options: RequestInit = {}) {
  return fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': password,
      ...(options.headers || {}),
    },
  })
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await adminFetch('/api/admin/stats', pw)
    if (res.ok) { onLogin(pw) } else { setError('Falsches Passwort.') }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <img src="/findma-logo.svg" alt="findma." className="h-7 w-auto" />
          <span className="text-sm font-medium text-gray-500">Admin</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Passwort"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 focus:border-[#1D7A4F]" />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" className="w-full bg-[#1D7A4F] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#166040] transition-colors">
            Anmelden
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard({ stats }: { stats: Stats }) {
  const cards = [
    { label: 'Gesamt Einträge', value: stats.total },
    { label: 'Genehmigt', value: stats.approved },
    { label: 'Offene Einreichungen', value: stats.pending },
    { label: 'Premium', value: stats.premium },
  ]
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="text-sm text-gray-500 mb-1">{c.label}</div>
            <div className="text-3xl font-bold text-gray-900">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-[#1D7A4F]' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
    </button>
  )
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ listing, password, onClose, onSaved }: {
  listing: Listing; password: string; onClose: () => void; onSaved: () => void
}) {
  const [form, setForm] = useState({ ...listing, category_slug: listing.categories?.slug || '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true); setError('')
    const res = await adminFetch(`/api/admin/listings/${listing.id}`, password, {
      method: 'PATCH',
      body: JSON.stringify({
        name: form.name, slug: form.slug, website: form.website,
        description: form.description, description_long: form.description_long,
        ampel: form.ampel, ampel_reason: form.ampel_reason,
        category_slug: form.category_slug, hq_country: form.hq_country,
        founded_country: form.founded_country, owner_country: form.owner_country,
        keywords: form.keywords, type: form.type, status: form.status,
      }),
    })
    if (res.ok) { onSaved(); onClose() } else { const d = await res.json(); setError(d.error || 'Fehler') }
    setSaving(false)
  }

  const field = (label: string, key: keyof typeof form, type = 'text') => (
    <div key={key}>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input type={type} value={(form[key] as string) || ''}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30" />
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Eintrag bearbeiten</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {field('Name', 'name')}
          {field('Slug', 'slug')}
          {field('Website', 'website', 'url')}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Kategorie</label>
            <select value={form.category_slug} onChange={e => setForm(f => ({ ...f, category_slug: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Herkunft</label>
            <select value={form.ampel} onChange={e => setForm(f => ({ ...f, ampel: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="green">🇦🇹 Österreich</option>
              <option value="yellow">🇪🇺 Europa</option>
              <option value="red">🌍 International</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="approved">Genehmigt</option>
              <option value="pending">Ausstehend</option>
              <option value="rejected">Abgelehnt</option>
            </select>
          </div>
          {field('Gründungsland', 'founded_country')}
          {field('Hauptsitz', 'hq_country')}
          {field('Eigentümer-Land', 'owner_country')}
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Kurzbeschreibung</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Herkunftsbegründung</label>
            <textarea value={form.ampel_reason || ''} onChange={e => setForm(f => ({ ...f, ampel_reason: e.target.value }))}
              rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Keywords</label>
            <input value={form.keywords || ''} onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
        </div>
        {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
        <div className="flex gap-3 mt-5">
          <button onClick={handleSave} disabled={saving}
            className="bg-[#1D7A4F] text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-[#166040] disabled:opacity-50">
            {saving ? 'Speichern...' : 'Speichern'}
          </button>
          <button onClick={onClose} className="border border-gray-200 rounded-xl px-5 py-2.5 text-sm text-gray-600 hover:border-gray-300">
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Listings Tab ─────────────────────────────────────────────────────────────
function ListingsTab({ password }: { password: string }) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Listing | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Listing | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await adminFetch(`/api/admin/listings?search=${encodeURIComponent(search)}`, password)
    if (res.ok) setListings(await res.json())
    setLoading(false)
  }, [password, search])

  useEffect(() => { load() }, [load])

  const toggle = async (id: string, field: 'is_premium' | 'is_featured', value: boolean) => {
    setListings(l => l.map(x => x.id === id ? { ...x, [field]: value } : x))
    await adminFetch(`/api/admin/listings/${id}`, password, {
      method: 'PATCH', body: JSON.stringify({ [field]: value }),
    })
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    setDeleting(true)
    await adminFetch(`/api/admin/listings/${confirmDelete.id}`, password, { method: 'DELETE' })
    setConfirmDelete(null)
    setDeleting(false)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Alle Einträge ({listings.length})</h1>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Eintrag suchen..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 w-56" />
        </div>
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-400">Wird geladen...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                <th className="text-left px-4 py-3">Logo</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Kategorie</th>
                <th className="text-left px-4 py-3">Herkunft</th>
                <th className="text-center px-4 py-3">Premium</th>
                <th className="text-left px-4 py-3">Stripe ID</th>
                <th className="text-center px-4 py-3">Featured</th>
                <th className="text-center px-4 py-3">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l, i) => {
                const domain = l.website ? (() => { try { return new URL(l.website).hostname.replace('www.', '') } catch { return null } })() : null
                return (
                  <tr key={l.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                    <td className="px-4 py-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {domain ? (
                          <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt=""
                            className="w-6 h-6 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        ) : (
                          <span className="text-xs font-bold text-gray-400">{l.name.charAt(0)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{l.name}</div>
                      <div className="text-xs text-gray-400">{l.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{l.categories?.name || '—'}</td>
                    <td className="px-4 py-3"><span className="text-lg">{AMPEL_FLAGS[l.ampel] || '—'}</span></td>
                    <td className="px-4 py-3 text-center">
                      <Toggle value={l.is_premium} onChange={v => toggle(l.id, 'is_premium', v)} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-400 font-mono">
                        {l.stripe_subscription_id ? l.stripe_subscription_id.slice(0, 14) + '...' : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Toggle value={l.is_featured} onChange={v => toggle(l.id, 'is_featured', v)} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setEditing(l)} className="text-gray-400 hover:text-[#1D7A4F] transition-colors p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setConfirmDelete(l)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {editing && <EditModal listing={editing} password={password} onClose={() => setEditing(null)} onSaved={load} />}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Eintrag löschen?</h2>
            <p className="text-sm text-gray-500 mb-5">
              <span className="font-medium text-gray-800">{confirmDelete.name}</span> wird unwiderruflich gelöscht.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={deleting}
                className="bg-red-500 text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-red-600 disabled:opacity-50">
                {deleting ? 'Wird gelöscht...' : 'Ja, löschen'}
              </button>
              <button onClick={() => setConfirmDelete(null)}
                className="border border-gray-200 rounded-xl px-5 py-2.5 text-sm text-gray-600 hover:border-gray-300">
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Submissions Tab ──────────────────────────────────────────────────────────
function SubmissionsTab({ password }: { password: string }) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await adminFetch('/api/admin/submissions', password)
    if (res.ok) setSubmissions(await res.json())
    setLoading(false)
  }, [password])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: string) => {
    await adminFetch('/api/admin/submissions', password, { method: 'PATCH', body: JSON.stringify({ id, status }) })
    load()
  }

  const pending = submissions.filter(s => s.status === 'pending')
  const rest = submissions.filter(s => s.status !== 'pending')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Einreichungen</h1>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Offen ({pending.length})</h2>
      {loading ? (
        <div className="text-center py-8 text-gray-400">Wird geladen...</div>
      ) : pending.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 mb-6">
          Keine offenen Einreichungen.
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {pending.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{s.name}</div>
                <a href={s.website} target="_blank" className="text-sm text-[#1D7A4F] hover:underline">{s.website}</a>
                <p className="text-sm text-gray-500 mt-1">{s.description}</p>
                <p className="text-xs text-gray-400 mt-1">Von: {s.submitted_by_email} · {new Date(s.created_at).toLocaleDateString('de-AT')}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => updateStatus(s.id, 'approved')}
                  className="bg-[#1D7A4F] text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-[#166040]">
                  Genehmigen
                </button>
                <button onClick={() => updateStatus(s.id, 'rejected')}
                  className="border border-red-200 text-red-600 rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-red-50">
                  Ablehnen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {rest.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Bearbeitet ({rest.length})</h2>
          <div className="space-y-2">
            {rest.map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-700 text-sm">{s.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{s.submitted_by_email}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {s.status === 'approved' ? 'Genehmigt' : 'Abgelehnt'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Research Tab ─────────────────────────────────────────────────────────────
function ResearchTab({ password }: { password: string }) {
  const [query, setQuery] = useState('')
  const [researching, setResearching] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [savedSlug, setSavedSlug] = useState('')
  const [error, setError] = useState('')
  const [saveError, setSaveError] = useState('')

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setResearching(true); setResult(null); setError(''); setSavedSlug('')
    try {
      const isUrl = query.startsWith('http')
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, ...(isUrl ? { url: query } : { name: query }) }),
      })
      const data = await res.json()
      if (res.ok) setResult(data)
      else setError(data.error || 'Fehler bei der Recherche')
    } catch { setError('Verbindungsfehler') }
    setResearching(false)
  }

  const handleSave = async () => {
    if (!result) return
    setSaving(true); setSaveError('')
    const res = await adminFetch('/api/admin/listings', password, {
      method: 'POST', body: JSON.stringify(result),
    })
    const data = await res.json()
    if (res.ok) { setSavedSlug(result.slug); setResult(null); setQuery('') }
    else { setSaveError(data.error || 'Speichern fehlgeschlagen') }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">KI-Recherche</h1>
      {savedSlug && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 flex items-center justify-between">
          <span className="text-sm text-green-800">✓ Eintrag gespeichert!</span>
          <Link href={`/verzeichnis/${savedSlug}`} target="_blank" className="text-sm text-[#1D7A4F] hover:underline">
            Eintrag ansehen →
          </Link>
        </div>
      )}
      <form onSubmit={handleResearch} className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <p className="text-sm text-gray-500 mb-3">URL oder Unternehmensname eingeben — Claude recherchiert automatisch.</p>
        <div className="flex gap-3">
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="https://unternehmen.at oder Unternehmensname"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 focus:border-[#1D7A4F]" />
          <button type="submit" disabled={researching || !query}
            className="bg-[#1D7A4F] text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-[#166040] disabled:opacity-50 whitespace-nowrap">
            {researching ? '🔍 Recherchiere...' : '🤖 KI-Recherche'}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </form>
      {result && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Ergebnis prüfen & speichern</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Name', key: 'name' }, { label: 'Slug (URL)', key: 'slug' },
              { label: 'Website', key: 'website' }, { label: 'Typ', key: 'type' },
              { label: 'Gründungsland', key: 'founded_country' }, { label: 'Hauptsitz', key: 'hq_country' },
              { label: 'Eigentümer-Land', key: 'owner_country' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs text-gray-400 mb-1">{label}</label>
                <input value={result[key] || ''} onChange={e => setResult({ ...result, [key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30" />
              </div>
            ))}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Herkunft</label>
              <select value={result.ampel} onChange={e => setResult({ ...result, ampel: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option value="green">🇦🇹 Österreich</option>
                <option value="yellow">🇪🇺 Europa</option>
                <option value="red">🌍 International</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Kategorie</label>
              <select value={result.category_slug} onChange={e => setResult({ ...result, category_slug: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { label: 'Kurzbeschreibung', key: 'description', rows: 2 },
              { label: 'Herkunftsbegründung', key: 'ampel_reason', rows: 2 },
              { label: 'Ausführliche Beschreibung', key: 'description_long', rows: 3 },
              { label: 'Keywords', key: 'keywords', rows: 1 },
            ].map(({ label, key, rows }) => (
              <div key={key}>
                <label className="block text-xs text-gray-400 mb-1">{label}</label>
                <textarea value={result[key] || ''} rows={rows}
                  onChange={e => setResult({ ...result, [key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
              </div>
            ))}
          </div>
          {saveError && <p className="text-red-500 text-xs mt-3">{saveError}</p>}
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={saving}
              className="bg-[#1D7A4F] text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-[#166040] disabled:opacity-50">
              {saving ? 'Speichern...' : '✓ Eintrag speichern'}
            </button>
            <button onClick={() => setResult(null)}
              className="border border-gray-200 rounded-xl px-5 py-2.5 text-sm text-gray-600 hover:border-gray-300">
              Verwerfen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Bulk Import Tab ──────────────────────────────────────────────────────────
function BulkImportTab({ password }: { password: string }) {
  const [jsonInput, setJsonInput] = useState('')
  const [parsed, setParsed] = useState<BulkItem[] | null>(null)
  const [parseError, setParseError] = useState('')
  const [importing, setImporting] = useState(false)
  const [importMode, setImportMode] = useState<'insert' | 'upsert'>('insert')
  const [importResult, setImportResult] = useState<{ inserted: number; updated: number; skipped: number; failed: number; results: { name: string; status: string; reason?: string }[] } | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const handleParse = () => {
    setParseError(''); setParsed(null); setImportResult(null)
    try {
      const data = JSON.parse(jsonInput)
      const arr = Array.isArray(data) ? data : [data]
      setParsed(arr)
      setSelectedIds(new Set(arr.map((_: any, i: number) => i)))
    } catch (e) {
      setParseError('Ungültiges JSON. Bitte prüfen.')
    }
  }

  const toggleItem = (i: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const handleImport = async () => {
    if (!parsed) return
    setImporting(true); setImportResult(null)
    const toImport = parsed.filter((_, i) => selectedIds.has(i))
    const res = await adminFetch('/api/admin/bulk-import', password, {
      method: 'POST',
      body: JSON.stringify({ listings: toImport, mode: importMode }),
    })
    const data = await res.json()
    setImportResult(data)
    setImporting(false)
    if ((data.inserted > 0 || data.updated > 0)) {
      setParsed(null); setJsonInput(''); setSelectedIds(new Set())
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Bulk-Import</h1>
      <p className="text-sm text-gray-500 mb-6">
        JSON aus dem Chat hier einfügen, Einträge prüfen und mit einem Klick alle eintragen.
      </p>

      {importResult && (
        <div className={`rounded-xl p-4 mb-5 border ${importResult.failed === 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <p className="text-sm font-medium mb-2">
            {importResult.inserted > 0 && `${importResult.inserted} neu eingetragen`}
            {importResult.inserted > 0 && (importResult.updated > 0 || importResult.skipped > 0 || importResult.failed > 0) && ' · '}
            {importResult.updated > 0 && `${importResult.updated} aktualisiert`}
            {importResult.updated > 0 && (importResult.skipped > 0 || importResult.failed > 0) && ' · '}
            {importResult.skipped > 0 && `${importResult.skipped} übersprungen`}
            {importResult.skipped > 0 && importResult.failed > 0 && ' · '}
            {importResult.failed > 0 && `${importResult.failed} fehlgeschlagen`}
          </p>
          {importResult.results.filter(r => r.status === 'skipped').map((r, i) => (
            <p key={i} className="text-xs text-gray-500">⊘ {r.name}: {r.reason}</p>
          ))}
          {importResult.results.filter(r => r.status === 'error').map((r, i) => (
            <p key={i} className="text-xs text-red-600">✕ {r.name}: {r.reason}</p>
          ))}
        </div>
      )}

      {!parsed ? (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-gray-500 font-medium">Modus:</span>
            <button
              onClick={() => setImportMode('insert')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${importMode === 'insert' ? 'bg-[#1D7A4F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              Nur neue eintragen
            </button>
            <button
              onClick={() => setImportMode('upsert')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${importMode === 'upsert' ? 'bg-[#1D7A4F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              Bestehende überschreiben
            </button>
          </div>
          <label className="block text-xs text-gray-500 mb-2">JSON einfügen</label>
          <textarea
            value={jsonInput}
            onChange={e => setJsonInput(e.target.value)}
            placeholder={`[\n  {\n    "name": "Firma GmbH",\n    "website": "https://firma.at",\n    "description": "Kurzbeschreibung",\n    "ampel": "green",\n    "category_slug": "mode-textil"\n  }\n]`}
            rows={12}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 resize-none"
          />
          {parseError && <p className="text-red-500 text-xs mt-2">{parseError}</p>}
          <button
            onClick={handleParse}
            disabled={!jsonInput.trim()}
            className="mt-3 bg-[#1D7A4F] text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-[#166040] disabled:opacity-50"
          >
            JSON prüfen
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">{parsed.length} Einträge erkannt — wähle aus welche eingetragen werden sollen:</p>
            <button onClick={() => { setParsed(null); setJsonInput('') }} className="text-xs text-gray-400 hover:text-gray-600">
              Zurück
            </button>
          </div>
          <div className="space-y-3 mb-5">
            {parsed.map((item, i) => (
              <div key={i}
                onClick={() => toggleItem(i)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${selectedIds.has(i) ? 'border-[#1D7A4F] ring-1 ring-[#1D7A4F]/20' : 'border-gray-100 opacity-50'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedIds.has(i) ? 'bg-[#1D7A4F]' : 'bg-gray-200'}`}>
                    {selectedIds.has(i) && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-lg">{AMPEL_FLAGS[item.ampel] || '—'}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {CATEGORIES.find(c => c.slug === item.category_slug)?.name || item.category_slug}
                      </span>
                    </div>
                    {item.website && <p className="text-xs text-[#1D7A4F] mt-0.5">{item.website}</p>}
                    {item.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={handleImport}
              disabled={importing || selectedIds.size === 0}
              className="bg-[#1D7A4F] text-white rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-[#166040] disabled:opacity-50"
            >
              {importing ? 'Wird eingetragen...' : `✓ ${selectedIds.size} Einträge eintragen`}
            </button>
            <span className="text-xs text-gray-400">{selectedIds.size} von {parsed.length} ausgewählt</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Admin ───────────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'listings' | 'submissions' | 'research' | 'bulk'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [stats, setStats] = useState<Stats>({ total: 0, approved: 0, pending: 0, premium: 0, submissions: 0 })

  const loadStats = useCallback(async (pw: string) => {
    const res = await adminFetch('/api/admin/stats', pw)
    if (res.ok) setStats(await res.json())
  }, [])

  const handleLogin = (pw: string) => { setPassword(pw); setAuthed(true); loadStats(pw) }

  if (!authed) return <LoginScreen onLogin={handleLogin} />

  const navItems: { id: Tab; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '◻' },
    { id: 'listings', label: 'Einträge', icon: '☰', badge: stats.total },
    { id: 'submissions', label: 'Einreichungen', icon: '📬', badge: stats.pending || undefined },
    { id: 'research', label: 'KI-Recherche', icon: '🔍' },
    { id: 'bulk', label: 'Bulk-Import', icon: '📥' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img src="/findma-logo.svg" alt="findma." className="h-6 w-auto" />
            <span className="text-xs font-medium text-gray-400">Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.id ? 'bg-[#1D7A4F] text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}>
              <span className="flex items-center gap-2.5">
                <span>{item.icon}</span>
                {item.label}
              </span>
              {item.badge ? (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                  activeTab === item.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>{item.badge}</span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50">
            ← Zur Website
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === 'dashboard' && <><Dashboard stats={stats} /><ListingsTab password={password} /></>}
        {activeTab === 'listings' && <ListingsTab password={password} />}
        {activeTab === 'submissions' && <SubmissionsTab password={password} />}
        {activeTab === 'research' && <ResearchTab password={password} />}
        {activeTab === 'bulk' && <BulkImportTab password={password} />}
      </main>
    </div>
  )
}
