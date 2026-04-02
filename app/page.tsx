import { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Category, Listing } from '@/lib/types'
import ListingCard from '@/components/ListingCard'
import SearchBar from '@/components/SearchBar'

export const revalidate = 3600 // Stündlich neu bauen

export const metadata: Metadata = {
  title: 'findma. — Find ma. Aus Österreich.',
  description: 'Das österreichische Unternehmensverzeichnis mit Herkunftskennzeichnung. Kuratiert. Transparent. Österreichisch.',
}

async function getHomeData() {
  const [categoriesRes, featuredRes] = await Promise.all([
    supabase
      .from('categories')
      .select('*, listings(count)')
      .order('sort_order'),
    supabase
      .from('listings')
      .select('*, categories(name, slug)')
      .eq('status', 'approved')
      .eq('is_featured', true)
      .order('is_premium', { ascending: false })
      .limit(6),
  ])
  return {
    categories: categoriesRes.data as Category[] || [],
    featured: featuredRes.data as Listing[] || [],
  }
}

const categoryIcons: Record<string, string> = {
  'MessageSquare': '💬',
  'Cloud': '☁️',
  'Calculator': '🧮',
  'UtensilsCrossed': '🍽️',
  'Shirt': '👕',
  'Mountain': '🏔️',
  'Music': '🎵',
  'Bot': '🤖',
  'Palette': '🎨',
}

export default async function HomePage() {
  const { categories, featured } = await getHomeData()

  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-[#e8f5ee] text-[#1D7A4F] text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span>🇦🇹</span>
            <span>Das österreichische Unternehmensverzeichnis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            find ma.<br />
            <span className="text-[#1D7A4F]">Aus Österreich.</span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
            Österreichische Unternehmen, Produkte und Software — mit klarer Herkunftsbewertung.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Kennzeichnung */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { flag: '🇦🇹', label: 'ÖSTERREICH', color: 'border-green-200 bg-green-50', text: 'text-green-800', desc: 'Gegründet in Österreich, Hauptsitz in Österreich, Kernleistung aus Österreich.' },
            { flag: '🇪🇺', label: 'EUROPA', color: 'border-yellow-200 bg-yellow-50', text: 'text-yellow-800', desc: 'EU- oder DACH-Unternehmen, kein außereuropäischer Konzern, Daten bleiben in Europa.' },
            { flag: '🌍', label: 'INTERNATIONAL', color: 'border-orange-200 bg-orange-50', text: 'text-orange-800', desc: 'Europäische Marke oder Produkt mit außereuropäischem Eigentümer oder Konzernmutter.' },
          ].map((item) => (
            <div key={item.label} className={`rounded-xl border p-5 ${item.color}`}>
              <div className={`text-xs font-bold tracking-widest mb-2 ${item.text}`}>
                {item.flag} {item.label}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">
          Die Kennzeichnung basiert auf öffentlich zugänglichen Informationen und stellt keine rechtlich verbindliche Bewertung dar. {' '}
          <Link href="/kennzeichnung" className="text-[#1D7A4F] hover:underline">Zur Kennzeichnungs-Richtlinie →</Link>
        </p>
      </section>

      {/* Kategorien */}
      <section id="kategorien" className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Alle Kategorien</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/verzeichnis/kategorie/${cat.slug}`}>
              <div className="card p-4 flex items-center gap-3 hover:border-[#1D7A4F]/30">
                <span className="text-2xl">{categoryIcons[cat.icon || ''] || '📁'}</span>
                <div>
                  <div className="font-medium text-sm text-gray-900">{cat.name}</div>
                  <div className="text-xs text-gray-400">
                    {(cat as any).listings?.[0]?.count || 0} Einträge
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Empfohlen von findma.</h2>
            <Link href="/verzeichnis" className="text-sm text-[#1D7A4F] hover:underline">Alle anzeigen →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* Wie funktioniert findma */}
      <section className="bg-white border-t border-gray-100 mt-8">
        <div className="max-w-4xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">So funktioniert findma.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Suchen', desc: 'Finde österreichische Unternehmen, Produkte und Dienstleister — einfach in natürlicher Sprache.' },
              { step: '02', title: 'Vergleichen', desc: 'Unsere Herkunftskennzeichnung zeigt dir auf einen Blick, woher ein Unternehmen wirklich kommt.' },
              { step: '03', title: 'Entscheiden', desc: 'Mit mehr Informationen zur Herkunft triffst du deine eigene informierte Wahl.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-3xl font-bold text-[#1D7A4F]/20 mb-3">{item.step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-14 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Dein Unternehmen fehlt?</h2>
        <p className="text-gray-500 mb-6">Kostenlos eintragen, kurz warten — wir prüfen und schalten frei.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/einreichen" className="btn-primary">Jetzt eintragen</Link>
          <Link href="/premium" className="btn-secondary">Premium-Listing</Link>
        </div>
      </section>
    </>
  )
}
