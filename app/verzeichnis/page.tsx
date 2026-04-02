import { Metadata } from 'next'
import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { Listing, Category } from '@/lib/types'
import DirectoryClient from './DirectoryClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Verzeichnis',
  description: 'Alle österreichischen Unternehmen, Produkte und Software im Überblick — mit Herkunftskennzeichnung.',
}

async function getData() {
  const [listingsRes, categoriesRes] = await Promise.all([
    supabase
      .from('listings')
      .select('*, categories(name, slug)')
      .eq('status', 'approved')
      .order('is_premium', { ascending: false })
      .order('is_featured', { ascending: false })
      .order('name'),
    supabase
      .from('categories')
      .select('*')
      .order('sort_order'),
  ])

  return {
    listings: listingsRes.data as Listing[] || [],
    categories: categoriesRes.data as Category[] || [],
  }
}

export default async function VerzeichnisPage() {
  const { listings, categories } = await getData()
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8 text-gray-400">Wird geladen...</div>}>
      <DirectoryClient listings={listings} categories={categories} />
    </Suspense>
  )
}
