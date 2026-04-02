import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[äöüß]/g, c => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c] || c))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeUrl(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '').toLowerCase()
  } catch {
    return url.toLowerCase()
  }
}

export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password')
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { listings } = await req.json()

  if (!Array.isArray(listings) || listings.length === 0) {
    return NextResponse.json({ error: 'Keine Einträge übergeben' }, { status: 400 })
  }

  // Kategorie-Slugs zu UUIDs auflösen
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug')

  const categoryMap: Record<string, string> = {}
  if (categories) {
    categories.forEach(c => { categoryMap[c.slug] = c.id })
  }

  // Alle bestehenden Websites und Slugs laden für Duplikat-Prüfung
  const { data: existingListings } = await supabase
    .from('listings')
    .select('slug, website')

  const existingWebsites = new Set(
    (existingListings || [])
      .filter(e => e.website)
      .map(e => normalizeUrl(e.website))
  )
  const existingSlugsFull = new Set(
    (existingListings || []).map(e => e.slug)
  )

  const results: { name: string; status: 'ok' | 'skipped' | 'error'; reason?: string }[] = []

  for (const item of listings) {
    // Duplikat-Check via Website
    if (item.website) {
      const normalizedWebsite = normalizeUrl(item.website)
      if (existingWebsites.has(normalizedWebsite)) {
        results.push({ name: item.name, status: 'skipped', reason: 'Website bereits vorhanden' })
        continue
      }
    }

    try {
      const baseSlug = slugify(item.name)

      // Duplikat-Check via Slug
      if (existingSlugsFull.has(baseSlug)) {
        results.push({ name: item.name, status: 'skipped', reason: 'Name bereits vorhanden' })
        continue
      }

      // Eindeutigen Slug sicherstellen (falls ähnliche slugs existieren)
      let slug = baseSlug
      let counter = 2
      while (existingSlugsFull.has(slug)) {
        slug = `${baseSlug}-${counter++}`
      }

      const category_id = item.category_slug ? categoryMap[item.category_slug] || null : null

      const { error } = await supabase.from('listings').insert({
        name: item.name,
        slug,
        description: item.description || null,
        description_long: item.description_long || null,
        website: item.website || null,
        ampel: item.ampel || 'green',
        ampel_reason: item.ampel_reason || null,
        category_id,
        hq_country: item.hq_country || 'Österreich',
        founded_country: item.founded_country || 'Österreich',
        owner_country: item.owner_country || 'Österreich',
        keywords: item.keywords || null,
        type: item.type || 'Unternehmen',
        status: 'approved',
        is_premium: false,
        is_featured: false,
      })

      if (error) {
        results.push({ name: item.name, status: 'error', reason: error.message })
      } else {
        existingSlugsFull.add(slug)
        if (item.website) existingWebsites.add(normalizeUrl(item.website))
        results.push({ name: item.name, status: 'ok' })
      }
    } catch (e: any) {
      results.push({ name: item.name, status: 'error', reason: e.message })
    }
  }

  const ok = results.filter(r => r.status === 'ok').length
  const skipped = results.filter(r => r.status === 'skipped').length
  const failed = results.filter(r => r.status === 'error').length

  if (ok > 0) {
    revalidatePath('/verzeichnis')
    revalidatePath('/')
  }

  return NextResponse.json({ ok, skipped, failed, results })
}
