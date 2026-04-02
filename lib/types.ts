export type Ampel = 'green' | 'yellow' | 'red'
export type Status = 'pending' | 'approved' | 'rejected'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  sort_order: number
  type: string
  listing_count?: number
}

export interface Listing {
  id: string
  name: string
  slug: string
  description: string | null
  description_long: string | null
  category_id: string | null
  ampel: Ampel
  ampel_reason: string | null
  website: string | null
  logo_url: string | null
  images: string[]
  keywords: string | null
  type: string | null
  status: Status
  is_featured: boolean
  is_premium: boolean
  hq_country: string | null
  founded_country: string | null
  owner_country: string | null
  address: string | null
  phone: string | null
  instagram_url: string | null
  facebook_url: string | null
  linkedin_url: string | null
  stripe_subscription_id: string | null
  submitted_by_email: string | null
  views: number
  created_at: string
  categories?: { name: string; slug: string } | null
}

export interface SearchResult {
  category?: string
  ampel?: Ampel
  keywords: string[]
  region?: string
}
