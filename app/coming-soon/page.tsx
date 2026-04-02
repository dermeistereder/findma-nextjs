'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ComingSoonPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const router = useRouter()

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/coming-soon/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/')
        router.refresh()
      } else {
        setError('Falsches Passwort.')
      }
    } catch {
      setError('Fehler — bitte erneut versuchen.')
    }
    setLoading(false)
  }

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault()
    // Hier könnte ein Newsletter-Service angebunden werden
    setSubscribed(true)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: '#F5F0EB' }}>
      <div className="text-center max-w-lg w-full">

        {/* Logo */}
        <div className="flex justify-center mb-3">
          <img src="/findma-logo.svg" alt="findma." className="h-16 w-auto" />
        </div>

        {/* Tagline */}
        <p className="text-gray-500 text-sm mb-12">Find ma. Aus Österreich.</p>

        {/* Headline */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Demnächst.</h1>

        {/* Description */}
        <p className="text-gray-500 text-base mb-10 leading-relaxed">
          Das österreichische Unternehmensverzeichnis mit<br />
          Herkunftskennzeichnung. Kuratiert. Transparent. Österreichisch.
        </p>

        {/* Email notify form */}
        {!showPassword && (
          <>
            {subscribed ? (
              <p className="text-[#1D7A4F] text-sm mb-6">Danke! Wir benachrichtigen dich beim Launch.</p>
            ) : (
              <>
                <p className="text-gray-500 text-sm mb-3">Benachrichtige mich beim Launch</p>
                <form onSubmit={handleNotify} className="flex gap-2 max-w-sm mx-auto mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="deine@email.at"
                    required
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 focus:border-[#1D7A4F]"
                  />
                  <button type="submit" className="bg-[#1D7A4F] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#166040] transition-colors whitespace-nowrap">
                    Benachrichtigen
                  </button>
                </form>
              </>
            )}

            <button
              onClick={() => setShowPassword(true)}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Vorschau ansehen →
            </button>
          </>
        )}

        {/* Password form */}
        {showPassword && (
          <form onSubmit={handleUnlock} className="max-w-sm mx-auto">
            <p className="text-gray-500 text-sm mb-3">Passwort für die Vorschau</p>
            <div className="flex gap-2 mb-2">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Passwort eingeben"
                autoFocus
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1D7A4F]/30 focus:border-[#1D7A4F]"
              />
              <button
                type="submit"
                disabled={loading || !password}
                className="bg-[#1D7A4F] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#166040] transition-colors disabled:opacity-50"
              >
                {loading ? '...' : 'Öffnen'}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <button
              type="button"
              onClick={() => setShowPassword(false)}
              className="text-xs text-gray-400 hover:text-gray-600 mt-2"
            >
              ← Zurück
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center">
        <p className="text-xs text-gray-400">
          © 2026 findma. · Ein Projekt aus Niederösterreich 🇦🇹
        </p>
      </div>
    </div>
  )
}
