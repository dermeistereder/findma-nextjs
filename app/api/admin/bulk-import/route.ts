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

  const { listings, mode } = await req.json()
  // mode: 'insert' (default) oder 'upsert'
  const isUpsert = mode === 'upsert'

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

  // Alle bestehenden Einträge laden für Duplikat-Prüfung und Upsert
  const { data: existingListings } = await supabase
    .from('listings')
    .select('id, slug, website')

  // Website -> id Map für Upsert
  const websiteToId: Record<string, string> = {}
  const slugToId: Record<string, string> = {}
  const existingWebsites = new Set<string>()
  const existingSlugs = new Set<string>()

  for (const e of existingListings || []) {
    existingSlugs.add(e.slug)
    slugToId[e.slug] = e.id
    if (e.website) {
      const norm = normalizeUrl(e.website)
      existingWebsites.add(norm)
      websiteToId[norm] = e.id
    }
  }

  const results: { name: string; status: 'inserted' | 'updated' | 'skipped' | 'error'; reason?: string }[] = []

  for (const item of listings) {
    try {
      const category_id = item.category_slug ? categoryMap[item.category_slug] || null : null
      const normalizedWebsite = item.website ? normalizeUrl(item.website) : null

      // Existierenden Eintrag finden
      const existingId = normalizedWebsite
        ? websiteToId[normalizedWebsite]
        : slugToId[slugify(item.name)]

      const payload = {
        name: item.name,
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
      }

      if (existingId && isUpsert) {
        // UPDATE
        const { error } = await supabase
          .from('listings')
          .update(payload)
          .eq('id', existingId)

        if (error) {
          results.push({ name: item.name, status: 'error', reason: error.message })
        } else {
          results.push({ name: item.name, status: 'updated' })
        }
      } else if (existingId && !isUpsert) {
        // Duplikat im Insert-Modus überspringen
        results.push({ name: item.name, status: 'skipped', reason: 'Bereits vorhanden' })
      } else {
        // INSERT (neu)
        const baseSlug = slugify(item.name)
        let slug = baseSlug
        let counter = 2
        while (existingSlugs.has(slug)) {
          slug = `${baseSlug}-${counter++}`
        }

        const { error } = await supabase.from('listings').insert({
          ...payload,
          slug,
          is_premium: false,
          is_featured: false,
        })

        if (error) {
          results.push({ name: item.name, status: 'error', reason: error.message })
        } else {
          existingSlugs.add(slug)
          slugToId[slug] = 'new'
          if (normalizedWebsite) {
            existingWebsites.add(normalizedWebsite)
            websiteToId[normalizedWebsite] = 'new'
          }
          results.push({ name: item.name, status: 'inserted' })
        }
      }
    } catch (e: any) {
      results.push({ name: item.name, status: 'error', reason: e.message })
    }
  }

  const inserted = results.filter(r => r.status === 'inserted').length
  const updated = results.filter(r => r.status === 'updated').length
  const skipped = results.filter(r => r.status === 'skipped').length
  const failed = results.filter(r => r.status === 'error').length

  if (inserted > 0 || updated > 0) {
    revalidatePath('/verzeichnis')
    revalidatePath('/')
  }

  return NextResponse.json({ inserted, updated, skipped, failed, results })
}
