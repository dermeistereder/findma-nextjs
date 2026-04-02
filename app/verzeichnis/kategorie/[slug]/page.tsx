import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Listing, Category } from '@/lib/types'
import ListingCard from '@/components/ListingCard'

export const revalidate = 3600

export async function generateStaticParams() {
  const { data } = await supabase.from('categories').select('slug')
  return (data || []).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Kategorie nicht gefunden' }
  return {
    title: data.name,
    description: `Alle österreichischen ${data.name} im findma. Verzeichnis — mit Herkunftskennzeichnung.`,
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [catRes, listingsRes] = await Promise.all([
    supabase.from('categories').select('*').eq('slug', params.slug).single(),
    supabase
      .from('listings')
      .select('*, categories(name, slug)')
      .eq('status', 'approved')
      .order('is_premium', { ascending: false })
      .order('is_featured', { ascending: false })
      .order('name'),
  ])

  if (!catRes.data) notFound()

  const category = catRes.data as Category
  const allListings = (listingsRes.data || []) as Listing[]
  const listings = allListings.filter(l => l.categories?.slug === params.slug)

  const green = listings.filter(l => l.ampel === 'green')
  const yellow = listings.filter(l => l.ampel === 'yellow')
  const red = listings.filter(l => l.ampel === 'red')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-600">findma.</Link>
        <span>/</span>
        <Link href="/verzeichnis" className="hover:text-gray-600">Verzeichnis</Link>
        <span>/</span>
        <span className="text-gray-600">{category.name}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
      <p className="text-gray-500 mb-8">
        {listings.length} {listings.length === 1 ? 'Eintrag' : 'Einträge'} ·
        {green.length} 🇦🇹 Österreich · {yellow.length} 🇪🇺 Europa · {red.length} 🌍 International
      </p>

      {/* Austrian first */}
      {green.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-2 inline-flex items-center gap-2 mb-4">
            🇦🇹 Österreich <span className="font-normal text-green-600">({green.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {green.map(l => <ListingCard key={l.id} listing={l} showCategory={false} />)}
          </div>
        </div>
      )}

      {yellow.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 inline-flex items-center gap-2 mb-4">
            🇪🇺 Europa <span className="font-normal text-yellow-600">({yellow.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {yellow.map(l => <ListingCard key={l.id} listing={l} showCategory={false} />)}
          </div>
        </div>
      )}

      {red.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-orange-800 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 inline-flex items-center gap-2 mb-4">
            🌍 International <span className="font-normal text-orange-600">({red.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {red.map(l => <ListingCard key={l.id} listing={l} showCategory={false} />)}
          </div>
        </div>
      )}
    </div>
  )
}
