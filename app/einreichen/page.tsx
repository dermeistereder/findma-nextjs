'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function EinreichenPage() {
  const [form, setForm] = useState({
    name: '', website: '', description: '', category_id: '', submitted_by_email: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    const { error } = await supabase.from('submissions').insert([{
      ...form,
      status: 'pending',
    }])
    if (error) { setStatus('error'); return }
    setStatus('success')
  }

  if (status === 'success') return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">🇦🇹</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Danke für deinen Eintrag!</h2>
      <p className="text-gray-500">Wir prüfen deinen Eintrag und schalten ihn innerhalb von 1-3 Werktagen frei. Du erhältst eine Bestätigung per E-Mail.</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Eintrag einreichen</h1>
      <p className="text-gray-500 mb-8">Kostenlos eintragen — wir prüfen und schalten innerhalb von 1-3 Werktagen frei.</p>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Was wird aufgenommen?</h2>
        <ul className="text-sm text-gray-600 space-y-1.5">
          <li className="flex gap-2"><span className="text-[#1D7A4F]">✓</span> Österreichische Unternehmen, Produkte und Software</li>
          <li className="flex gap-2"><span className="text-yellow-600">✓</span> Europäische Alternativen zu US-Produkten</li>
          <li className="flex gap-2"><span className="text-orange-600">✓</span> Internationale Marken mit Österreich-Bezug (transparent kennzeichnet)</li>
          <li className="flex gap-2"><span className="text-gray-400">✗</span> Keine reinen Dienstleister ohne Produktbezug (Einzelpersonen etc.)</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Unternehmens- oder Produktname *</label>
          <input
            type="text" required value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 focus:border-[#1D7A4F]"
            placeholder="z.B. MeinUnternehmen GmbH"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Website *</label>
          <input
            type="url" required value={form.website}
            onChange={e => setForm({ ...form, website: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 focus:border-[#1D7A4F]"
            placeholder="https://www.meinunternehmen.at"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Kurzbeschreibung *</label>
          <textarea
            required value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 focus:border-[#1D7A4F] resize-none"
            placeholder="Was macht dein Unternehmen / dein Produkt? (max. 200 Zeichen)"
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Deine E-Mail-Adresse *</label>
          <input
            type="email" required value={form.submitted_by_email}
            onChange={e => setForm({ ...form, submitted_by_email: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 focus:border-[#1D7A4F]"
            placeholder="deine@email.at"
          />
          <p className="text-xs text-gray-400 mt-1">Nur für Rückfragen — wird nicht veröffentlicht.</p>
        </div>

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            Es ist ein Fehler aufgetreten. Bitte versuche es erneut oder schreib uns direkt an buero@findma.at
          </div>
        )}

        <div className="flex items-start gap-3 pt-2">
          <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-50">
            {status === 'sending' ? 'Wird eingereicht...' : 'Eintrag einreichen'}
          </button>
          <p className="text-xs text-gray-400 leading-relaxed">
            Mit dem Einreichen stimmst du unseren <a href="/agb" className="text-[#1D7A4F] hover:underline">AGB</a> und der <a href="/datenschutz" className="text-[#1D7A4F] hover:underline">Datenschutzerklärung</a> zu.
          </p>
        </div>
      </form>
    </div>
  )
}
