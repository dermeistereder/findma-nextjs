import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

function checkAuth(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createAdminClient()
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''

  let query = db
    .from('listings')
    .select('*, categories(name, slug)')
    .order('name')

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createAdminClient()
  const body = await req.json()

  // Category ID lookup
  let categoryId = null
  if (body.category_slug) {
    const { data: cat } = await db
      .from('categories')
      .select('id')
      .eq('slug', body.category_slug)
      .single()
    categoryId = cat?.id || null
  }

  const { data, error } = await db.from('listings').insert([{
    name: body.name,
    slug: body.slug,
    description: body.description,
    description_long: body.description_long,
    category_id: categoryId,
    ampel: body.ampel,
    ampel_reason: body.ampel_reason,
    website: body.website,
    keywords: body.keywords,
    type: body.type,
    hq_country: body.hq_country,
    founded_country: body.founded_country,
    owner_country: body.owner_country,
    status: 'approved',
    is_featured: false,
    is_premium: false,
    views: 0,
  }]).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
