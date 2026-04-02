'use client'
import { useState } from 'react'
import { getLogoSources } from '@/lib/logo'

interface Props {
  listing: { logo_url?: string | null; website?: string | null; name: string }
  size?: 'sm' | 'md' | 'lg'
}

const sizeClass = {
  sm: { outer: 'w-10 h-10', img: 'w-8 h-8', text: 'text-base' },
  md: { outer: 'w-16 h-16', img: 'w-12 h-12', text: 'text-2xl' },
  lg: { outer: 'w-20 h-20', img: 'w-16 h-16', text: 'text-3xl' },
}

export default function LogoAvatar({ listing, size = 'sm' }: Props) {
  const sources = getLogoSources(listing)
  const [index, setIndex] = useState(0)
  const s = sizeClass[size]

  const initial = listing.name.charAt(0).toUpperCase()
  const bgColors = ['bg-emerald-100', 'bg-blue-100', 'bg-orange-100', 'bg-purple-100', 'bg-pink-100']
  const colorIndex = initial.charCodeAt(0) % bgColors.length
  const bg = bgColors[colorIndex]

  return (
    <div className={`${s.outer} rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden`}>
      {index < sources.length ? (
        <img
          src={sources[index]}
          alt={listing.name}
          className={`${s.img} object-contain`}
          onError={() => setIndex(i => i + 1)}
        />
      ) : (
        <div className={`${s.outer} ${bg} flex items-center justify-center rounded-lg`}>
          <span className={`${s.text} font-bold text-gray-600`}>{initial}</span>
        </div>
      )}
    </div>
  )
}
