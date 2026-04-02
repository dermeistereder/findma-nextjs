'use client'
import { useState } from 'react'
import Link from 'next/link'

const features = {
  base: [
    'Eintrag im Verzeichnis',
    'Herkunftskennzeichnung',
    'Eigene Detailseite',
    'Suchbar & filterbar',
  ],
  baseNo: [
    'Kein Featured-Badge',
    'Keine Kategorie-Priorisierung',
    'Kein "Empfohlen"-Placement',
  ],
  premium: [
    'Alles aus Basiseintrag',
    '⭐ Premium-Badge auf allen Seiten',
    'Grüner Rahmen — fällt sofort auf',
    'Ganz oben in der Kategorie',
    'Placement auf der Startseite',
    'Verifiziert-Banner auf Detailseite',
    'Telefon & Adresse sichtbar',
    'Social-Media-Links',
    'Bis zu 3 Fotos',
    'Prominenter Website-Button',
    'Monatlich kündbar',
    'Direkter Zugang über Herkunfts-Kennzeichnung auf der Startseite',
  ],
}

const faqs = [
  { q: 'Wie lange läuft ein Premium-Eintrag?', a: 'Monatlich oder jährlich, jederzeit kündbar.' },
  { q: 'Wann ist mein Eintrag sichtbar?', a: 'Sofort nach Zahlungseingang.' },
  { q: 'Kann ich später auf Premium upgraden?', a: 'Ja, jederzeit über die Detailseite deines Eintrags.' },
  { q: 'Welche Zahlungsmethoden gibt es?', a: 'Kreditkarte und SEPA-Lastschrift via Stripe.' },
]

export default function PremiumPage() {
  const [yearly, setYearly] = useState(false)
  const [loading, setLoading] = useState(false)
  const [slug, setSlug] = useState('')
  const [step, setStep] = useState<'find' | 'pay'>('find')

  const handleCheckout = async () => {
    if (!slug.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: yearly ? 'yearly' : 'monthly', slug: slug.trim() }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch { }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Mehr Sichtbarkeit für dein Unternehmen</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Ein Premium-Eintrag bei findma. bringt dir mehr Aufmerksamkeit von Menschen die bewusst österreichisch kaufen und buchen.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className={`text-sm font-medium ${!yearly ? 'text-gray-900' : 'text-gray-400'}`}>Monatlich</span>
        <button
          onClick={() => setYearly(!yearly)}
          className={`relative w-11 h-6 rounded-full transition-colors ${yearly ? 'bg-[#1D7A4F]' : 'bg-gray-200'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${yearly ? 'translate-x-5' : ''}`} />
        </button>
        <span className={`text-sm font-medium ${yearly ? 'text-gray-900' : 'text-gray-400'}`}>Jährlich</span>
        {yearly && <span className="text-xs bg-green-100 text-[#1D7A4F] font-medium px-2 py-0.5 rounded-full">2 Monate gratis</span>}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Base */}
        <div className="card p-8">
          <div className="text-sm font-medium text-gray-500 mb-2">Basiseintrag</div>
          <div className="text-4xl font-bold text-gray-900 mb-6">Kostenlos</div>
          <ul className="space-y-3 mb-6">
            {features.base.map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                <svg className="w-4 h-4 text-[#1D7A4F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
            {features.baseNo.map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <Link href="/einreichen" className="block w-full text-center border border-gray-300 rounded-lg py-3 text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors">
            Kostenlos einreichen
          </Link>
        </div>

        {/* Premium */}
        <div className="relative card p-8 border-2 border-[#1D7A4F]">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1D7A4F] text-white text-xs font-semibold px-4 py-1 rounded-full">
            Empfohlen
          </div>
          <div className="text-sm font-medium text-[#1D7A4F] mb-2">Premium</div>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-4xl font-bold text-gray-900">€ {yearly ? '490' : '49'}</span>
            <span className="text-gray-500 text-sm mb-1">/{yearly ? 'Jahr' : 'Monat'}</span>
          </div>
          {yearly && <p className="text-xs text-gray-400 mb-5">Jährlich € 490 — 2 Monate gratis</p>}
          {!yearly && <p className="text-xs text-gray-400 mb-5">Jährlich € 490 — 2 Monate gratis</p>}
          <ul className="space-y-3 mb-6">
            {features.premium.map(f => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                <svg className="w-4 h-4 text-[#1D7A4F] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          {step === 'find' ? (
            <div className="space-y-3">
              <input
                type="text" value={slug} onChange={e => setSlug(e.target.value)}
                placeholder="Slug deines Eintrags (z.B. red-bull)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 focus:border-[#1D7A4F]"
              />
              <button
                onClick={() => slug.trim() && setStep('pay')}
                disabled={!slug.trim()}
                className="w-full bg-[#1D7A4F] text-white rounded-lg py-3 text-sm font-semibold hover:bg-[#166040] transition-colors disabled:opacity-50"
              >
                Premium werden
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-[#1D7A4F] text-white rounded-lg py-3 text-sm font-semibold hover:bg-[#166040] transition-colors disabled:opacity-50"
              >
                {loading ? 'Weiterleitung...' : 'Jetzt bezahlen'}
              </button>
              <button onClick={() => setStep('find')} className="w-full text-xs text-gray-400 hover:text-gray-600">
                ← Anderen Eintrag wählen
              </button>
            </div>
          )}
          <p className="text-xs text-gray-400 text-center mt-3">
            Mit dem Kauf stimmst du unseren <Link href="/agb" className="text-[#1D7A4F] hover:underline">AGB</Link> zu.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Häufige Fragen</h2>
        <div className="space-y-6">
          {faqs.map(({ q, a }) => (
            <div key={q}>
              <h3 className="font-semibold text-gray-900 mb-1">{q}</h3>
              <p className="text-sm text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
