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

  const results: { name: string; status: 'ok' | 'error'; slug?: string; error?: string }[] = []

  for (const item of listings) {
    try {
      const baseSlug = slugify(item.name)
      // Eindeutigen Slug sicherstellen
      const { data: existing } = await supabase
        .from('listings')
        .select('slug')
        .ilike('slug', `${baseSlug}%`)
      const usedSlugs = new Set((existing || []).map((e: any) => e.slug))
      let slug = baseSlug
      let counter = 2
      while (usedSlugs.has(slug)) {
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
        results.push({ name: item.name, status: 'error', error: error.message })
      } else {
        results.push({ name: item.name, status: 'ok', slug })
      }
    } catch (e: any) {
      results.push({ name: item.name, status: 'error', error: e.message })
    }
  }

  const ok = results.filter(r => r.status === 'ok').length
  const failed = results.filter(r => r.status === 'error').length

  // Cache sofort leeren wenn mindestens ein Eintrag erfolgreich war
  if (ok > 0) {
    revalidatePath('/verzeichnis')
    revalidatePath('/')
  }

  return NextResponse.json({ ok, failed, results })
}
