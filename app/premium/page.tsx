'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function PremiumPage() {
  const [loading, setLoading] = useState<'monthly' | 'yearly' | null>(null)
  const [slug, setSlug] = useState('')
  const [step, setStep] = useState<'find' | 'choose'>('find')

  const handleCheckout = async (plan: 'monthly' | 'yearly') => {
    if (!slug.trim()) return
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, slug: slug.trim() }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#e8f5ee] text-[#1D7A4F] text-xs font-medium px-3 py-1.5 rounded-full mb-4">
          ⭐ Premium-Listing
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Mehr Sichtbarkeit für dein Unternehmen</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Premium-Listings erscheinen zuerst im Verzeichnis, auf der Startseite und in Kategorieseiten —
          mit Badge, erweiterten Informationen und direktem Link.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {[
          { icon: '⭐', title: 'Premium-Badge', desc: 'Sofort erkennbar als geprüfter Premium-Eintrag.' },
          { icon: '🔝', title: 'Priorisierte Darstellung', desc: 'Ganz oben in Kategorie- und Suchergebnissen.' },
          { icon: '🏠', title: 'Startseiten-Placement', desc: 'In der "Empfohlen von findma." Sektion.' },
          { icon: '📞', title: 'Erweiterte Informationen', desc: 'Telefon, Adresse, Social Media, Fotos.' },
          { icon: '✅', title: 'Verifiziert-Banner', desc: 'Zeigt: von findma. geprüft und bestätigt.' },
          { icon: '🔍', title: 'SEO-Boost', desc: 'Eigene, crawlbare Detailseite mit Schema.org.' },
        ].map(f => (
          <div key={f.title} className="card p-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">{f.icon}</span>
            <div>
              <div className="font-semibold text-sm text-gray-900">{f.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing */}
      {step === 'find' ? (
        <div className="max-w-md mx-auto card p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Welcher Eintrag soll Premium werden?</h2>
          <p className="text-sm text-gray-500 mb-4">Gib die Kurzadresse deines Eintrags ein (z.B. "vöslauer").</p>
          <div className="flex gap-2">
            <input
              type="text" value={slug} onChange={e => setSlug(e.target.value)}
              placeholder="eintrag-name"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 focus:border-[#1D7A4F]"
            />
            <button onClick={() => setStep('choose')} disabled={!slug.trim()} className="btn-primary disabled:opacity-50">
              Weiter
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Noch kein Eintrag? <Link href="/einreichen" className="text-[#1D7A4F] hover:underline">Zuerst einreichen →</Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="card p-6 border-2 border-gray-100">
            <div className="text-sm font-semibold text-gray-500 mb-1">Monatlich</div>
            <div className="text-4xl font-bold text-gray-900 mb-1">€ 49</div>
            <div className="text-sm text-gray-400 mb-6">pro Monat, jederzeit kündbar</div>
            <button
              onClick={() => handleCheckout('monthly')}
              disabled={loading !== null}
              className="btn-secondary w-full disabled:opacity-50"
            >
              {loading === 'monthly' ? 'Wird geladen...' : 'Monatlich buchen'}
            </button>
          </div>

          <div className="card p-6 border-2 border-[#1D7A4F] relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1D7A4F] text-white text-xs font-medium px-3 py-1 rounded-full">
              2 Monate gratis
            </div>
            <div className="text-sm font-semibold text-[#1D7A4F] mb-1">Jährlich</div>
            <div className="text-4xl font-bold text-gray-900 mb-1">€ 490</div>
            <div className="text-sm text-gray-400 mb-6">pro Jahr — statt € 588</div>
            <button
              onClick={() => handleCheckout('yearly')}
              disabled={loading !== null}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading === 'yearly' ? 'Wird geladen...' : 'Jährlich buchen'}
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center mt-6">
        Mit der Buchung stimmst du den <Link href="/agb" className="text-[#1D7A4F] hover:underline">AGB</Link> zu. Zahlung über Stripe — sicher und verschlüsselt.
      </p>
    </div>
  )
}
