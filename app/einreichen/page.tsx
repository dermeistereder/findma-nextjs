'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Category } from '@/lib/types'

export default function EinreichenPage() {
  const [form, setForm] = useState({
    name: '',
    website: '',
    category_id: '',
    type: '',
    founded_country: 'Österreich',
    hq_country: 'Österreich',
    owner_info: '',
    ampel: '',
    description: '',
    description_long: '',
    logo_url: '',
    submitted_by_email: '',
  })
  const [confirmed, setConfirmed] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, name, slug, sort_order')
      .order('sort_order')
      .then(({ data }) => { if (data) setCategories(data as Category[]) })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirmed) return
    setStatus('sending')
    const { error } = await supabase.from('submissions').insert([{
      name: form.name,
      website: form.website,
      category_id: form.category_id || null,
      type: form.type || null,
      founded_country: form.founded_country || null,
      hq_country: form.hq_country || null,
      owner_info: form.owner_info || null,
      ampel: form.ampel || null,
      description: form.description,
      description_long: form.description_long || null,
      logo_url: form.logo_url || null,
      submitted_by_email: form.submitted_by_email,
      status: 'pending',
    }])
    if (error) { setStatus('error'); return }
    setStatus('success')
  }

  if (status === 'success') return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">🇦🇹</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Danke für deinen Eintrag!</h2>
      <p className="text-gray-500">Wir prüfen deinen Eintrag und schalten ihn innerhalb von 1–3 Werktagen frei. Du erhältst eine Bestätigung per E-Mail.</p>
    </div>
  )

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 focus:border-[#1D7A4F]"

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Eintrag einreichen</h1>
      <p className="text-gray-600 mb-4">
        Trag dein österreichisches Unternehmen, Produkt oder Tool in das findma-Verzeichnis ein.
        Kostenlose Basiseinträge werden innerhalb von 3 Werktagen geprüft.
      </p>
      <p className="text-sm text-gray-500 mb-8">
        findma. ist ein kuratiertes Verzeichnis. Jede Einreichung wird manuell geprüft — ein Rechtsanspruch auf Aufnahme besteht nicht.{' '}
        <a href="/redaktion" className="text-[#1D7A4F] hover:underline">Zur redaktionellen Richtlinie →</a>
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Unternehmen */}
        <section className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-base">Unternehmen</h2>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Firmenname *</label>
            <input
              type="text" required value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="z.B. MeinUnternehmen GmbH"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Website *</label>
            <input
              type="text" required value={form.website}
              onChange={e => setForm({ ...form, website: e.target.value })}
              className={inputClass}
              placeholder="z.B. manner.at oder www.manner.at"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Kategorie *</label>
            <select
              required value={form.category_id}
              onChange={e => setForm({ ...form, category_id: e.target.value })}
              className={inputClass}
            >
              <option value="">Kategorie wählen</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Unternehmenstyp *</label>
            <div className="flex flex-col gap-2">
              {[
                { value: 'software', label: 'Software/App' },
                { value: 'product', label: 'Physisches Produkt' },
                { value: 'service', label: 'Dienstleistung' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio" name="type" value={opt.value} required
                    checked={form.type === opt.value}
                    onChange={() => setForm({ ...form, type: opt.value })}
                    className="accent-[#1D7A4F]"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Herkunft */}
        <section className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-base">Herkunft</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Gründungsland *</label>
              <input
                type="text" required value={form.founded_country}
                onChange={e => setForm({ ...form, founded_country: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Hauptsitz *</label>
              <input
                type="text" required value={form.hq_country}
                onChange={e => setForm({ ...form, hq_country: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Eigentümer/Mutterkonzern</label>
            <input
              type="text" value={form.owner_info}
              onChange={e => setForm({ ...form, owner_info: e.target.value })}
              className={inputClass}
              placeholder="Falls von anderem Unternehmen übernommen oder Teil eines Konzerns"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Herkunft *</label>
            <div className="flex flex-col gap-3">
              {[
                { value: 'green', label: 'AT — Österreich', sub: 'Gegründet und ansässig in AT' },
                { value: 'yellow', label: 'EU — Europa', sub: 'EU/DACH, kein außereuropäischer Konzern' },
                { value: 'red', label: 'INT — International', sub: 'Europäische Marke, außereuropäischer Eigentümer' },
              ].map(opt => (
                <label key={opt.value} className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="radio" name="ampel" value={opt.value} required
                    checked={form.ampel === opt.value}
                    onChange={() => setForm({ ...form, ampel: opt.value })}
                    className="accent-[#1D7A4F] mt-0.5"
                  />
                  <span className="text-sm">
                    <span className="font-medium text-gray-800">{opt.label}</span>
                    <span className="text-gray-500"> — {opt.sub}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Beschreibung */}
        <section className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-base">Beschreibung</h2>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Kurzbeschreibung * <span className="text-gray-400 font-normal">({form.description.length}/200)</span>
            </label>
            <textarea
              required value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3} maxLength={200}
              className={`${inputClass} resize-none`}
              placeholder="Was macht dein Unternehmen? Für wen ist es?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Ausführliche Beschreibung <span className="text-gray-400 font-normal">(optional, max 1000)</span>
            </label>
            <textarea
              value={form.description_long}
              onChange={e => setForm({ ...form, description_long: e.target.value })}
              rows={5} maxLength={1000}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Logo-URL</label>
            <input
              type="url" value={form.logo_url}
              onChange={e => setForm({ ...form, logo_url: e.target.value })}
              className={inputClass}
              placeholder="https://example.com/logo.png"
            />
            <p className="text-xs text-gray-400 mt-1">Direktlink zu deinem Logo (PNG oder SVG, mind. 200×200px)</p>
          </div>
        </section>

        {/* Kontakt */}
        <section className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-base">Kontakt</h2>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Kontakt-Email *</label>
            <input
              type="email" required value={form.submitted_by_email}
              onChange={e => setForm({ ...form, submitted_by_email: e.target.value })}
              className={inputClass}
              placeholder="deine@email.at"
            />
            <p className="text-xs text-gray-400 mt-1">Nur für Rückfragen, wird nicht veröffentlicht.</p>
          </div>
        </section>

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            Es ist ein Fehler aufgetreten. Bitte versuche es erneut oder schreib uns direkt an buero@findma.at
          </div>
        )}

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox" required checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
              className="accent-[#1D7A4F] mt-0.5 w-4 h-4 shrink-0"
            />
            <span className="text-sm text-gray-700">
              Ich bestätige dass die Angaben korrekt sind und das Unternehmen einen Bezug zu Österreich hat. *
            </span>
          </label>

          <button
            type="submit"
            disabled={status === 'sending' || !confirmed}
            className="btn-primary disabled:opacity-50"
          >
            {status === 'sending' ? 'Wird eingereicht...' : 'Eintrag einreichen'}
          </button>
        </div>
      </form>
    </div>
  )
}
