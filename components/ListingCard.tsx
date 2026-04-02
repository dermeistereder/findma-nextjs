import Link from 'next/link'
import Image from 'next/image'
import { Listing } from '@/lib/types'
import AmpelBadge from './AmpelBadge'

interface Props {
  listing: Listing
  showCategory?: boolean
}

export default function ListingCard({ listing, showCategory = true }: Props) {
  const logoSrc = listing.logo_url || `https://logo.clearbit.com/${listing.website?.replace('https://', '').replace('http://', '').split('/')[0]}`

  return (
    <Link href={`/verzeichnis/${listing.slug}`} className="block">
      <div className={`card p-4 h-full ${listing.is_premium ? 'border-[#1D7A4F]/40 shadow-sm' : ''}`}>
        {listing.is_premium && (
          <div className="flex items-center gap-1 text-xs text-[#1D7A4F] font-medium mb-2">
            <span>⭐</span>
            <span>Premium</span>
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {listing.logo_url || listing.website ? (
              <img
                src={logoSrc}
                alt={listing.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            ) : (
              <span className="text-lg font-bold text-gray-300">
                {listing.name.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                {listing.name}
              </h3>
              <AmpelBadge ampel={listing.ampel} />
            </div>

            {showCategory && listing.categories && (
              <div className="text-xs text-gray-400 mt-0.5">{listing.categories.name}</div>
            )}

            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
              {listing.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
