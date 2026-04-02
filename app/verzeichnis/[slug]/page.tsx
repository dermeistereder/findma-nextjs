import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Listing } from '@/lib/types'
import AmpelBadge from '@/components/AmpelBadge'
import LogoAvatar from '@/components/LogoAvatar'

export const revalidate = 3600

export async function generateStaticParams() {
  const { data } = await supabase
    .from('listings')
    .select('slug')
    .eq('status', 'approved')
  return (data || []).map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data } = await supabase
    .from('listings')
    .select('name, description, ampel')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Eintrag nicht gefunden' }

  const ampelLabel = data.ampel === 'green' ? '🇦🇹 Österreich' : data.ampel === 'yellow' ? '🇪🇺 Europa' : '🌍 International'

  return {
    title: `${data.name} — ${ampelLabel}`,
    description: data.description || `${data.name} im findma. Verzeichnis — österreichische Unternehmen mit Herkunftskennzeichnung.`,
  }
}

async function getListing(slug: string) {
  const { data } = await supabase
    .from('listings')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single()
  return data as Listing | null
}

const ampelConfig = {
  green: {
    label: 'Österreich',
    flag: '🇦🇹',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    desc: 'Gegründet in Österreich, Hauptsitz in Österreich, Kernleistung aus Österreich.',
  },
  yellow: {
    label: 'Europa',
    flag: '🇪🇺',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    desc: 'EU- oder DACH-Unternehmen, kein außereuropäischer Konzern.',
  },
  red: {
    label: 'International',
    flag: '🌍',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
    desc: 'Europäische Marke oder Produkt mit außereuropäischem Eigentümer oder Konzernmutter.',
  },
}

export default async function ListingDetailPage({ params }: { params: { slug: string } }) {
  const listing = await getListing(params.slug)
  if (!listing) notFound()

  const ampel = ampelConfig[listing.ampel]
  const logoSrc = listing.logo_url ||
    (listing.website
      ? `https://logo.clearbit.com/${listing.website.replace('https://', '').replace('http://', '').split('/')[0]}`
      : null)

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: listing.name,
    description: listing.description,
    url: listing.website,
    ...(logoSrc && { logo: logoSrc }),
    ...(listing.address && { address: listing.address }),
    ...(listing.phone && { telephone: listing.phone }),
    ...(listing.instagram_url && { sameAs: [listing.instagram_url, listing.facebook_url, listing.linkedin_url].filter(Boolean) }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-600">findma.</Link>
          <span>/</span>
          <Link href="/verzeichnis" className="hover:text-gray-600">Verzeichnis</Link>
          {listing.categories && (
            <>
              <span>/</span>
              <Link href={`/verzeichnis/kategorie/${listing.categories.slug}`} className="hover:text-gray-600">
                {listing.categories.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-600">{listing.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main */}
          <div className="md:col-span-2">
            {/* Header */}
            <div className="card p-6 mb-4">
              {listing.is_premium && (
                <div className="inline-flex items-center gap-1 text-xs text-[#1D7A4F] font-medium bg-[#e8f5ee] px-2 py-1 rounded-full mb-3">
                  ⭐ Verifizierter Premium-Eintrag — geprüft von findma.
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <LogoAvatar listing={listing} size="md" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-900">{listing.name}</h1>
                    <AmpelBadge ampel={listing.ampel} size="md" />
                  </div>
                  {listing.categories && (
                    <Link href={`/verzeichnis/kategorie/${listing.categories.slug}`}
                      className="text-sm text-[#1D7A4F] hover:underline mt-1 inline-block">
                      {listing.categories.name}
                    </Link>
                  )}
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">{listing.description}</p>
                </div>
              </div>

              {listing.website && (
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-4 inline-flex items-center gap-2"
                >
                  Website besuchen
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>

            {/* Long description */}
            {listing.description_long && (
              <div className="card p-6 mb-4">
                <h2 className="font-semibold text-gray-900 mb-3">Über {listing.name}</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{listing.description_long}</p>
              </div>
            )}

            {/* Kennzeichnung explanation */}
            <div className={`rounded-xl border p-5 mb-4 ${ampel.bg} ${ampel.border}`}>
              <div className={`text-xs font-bold tracking-widest mb-2 ${ampel.text}`}>
                {ampel.flag} HERKUNFT: {ampel.label.toUpperCase()}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">{ampel.desc}</p>
              {listing.ampel_reason && (
                <p className="text-xs text-gray-500 italic">{listing.ampel_reason}</p>
              )}
              <Link href="/kennzeichnung" className="text-xs text-[#1D7A4F] hover:underline mt-2 inline-block">
                Zur Kennzeichnungs-Richtlinie →
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card p-5 mb-4">
              <h3 className="font-semibold text-sm text-gray-900 mb-4">Informationen</h3>
              <div className="flex flex-col gap-3 text-sm">
                {listing.hq_country && (
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Hauptsitz</div>
                    <div className="text-gray-700">{listing.hq_country}</div>
                  </div>
                )}
                {listing.founded_country && (
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Gegründet in</div>
                    <div className="text-gray-700">{listing.founded_country}</div>
                  </div>
                )}
                {listing.type && (
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Typ</div>
                    <div className="text-gray-700 capitalize">{listing.type}</div>
                  </div>
                )}
                {listing.is_premium && listing.address && (
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Adresse</div>
                    <div className="text-gray-700">{listing.address}</div>
                  </div>
                )}
                {listing.is_premium && listing.phone && (
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Telefon</div>
                    <a href={`tel:${listing.phone}`} className="text-[#1D7A4F] hover:underline">{listing.phone}</a>
                  </div>
                )}
              </div>
            </div>

            {/* Social links (Premium only) */}
            {listing.is_premium && (listing.instagram_url || listing.facebook_url || listing.linkedin_url) && (
              <div className="card p-5 mb-4">
                <h3 className="font-semibold text-sm text-gray-900 mb-3">Social Media</h3>
                <div className="flex flex-col gap-2">
                  {listing.instagram_url && (
                    <a href={listing.instagram_url} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-[#1D7A4F] hover:underline flex items-center gap-2">
                      <span>📷</span> Instagram
                    </a>
                  )}
                  {listing.facebook_url && (
                    <a href={listing.facebook_url} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-[#1D7A4F] hover:underline flex items-center gap-2">
                      <span>👥</span> Facebook
                    </a>
                  )}
                  {listing.linkedin_url && (
                    <a href={listing.linkedin_url} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-[#1D7A4F] hover:underline flex items-center gap-2">
                      <span>💼</span> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="card p-5">
              <div className="text-xs text-gray-400 mb-3">Eintrag falsch oder veraltet?</div>
              <a href={`mailto:buero@findma.at?subject=Korrektur: ${listing.name}`}
                className="text-xs text-[#1D7A4F] hover:underline">
                Korrektur melden →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
