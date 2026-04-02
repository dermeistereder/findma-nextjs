import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

function checkAuth(req: NextRequest) {
  const auth = req.headers.get('x-admin-password')
  return auth === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createAdminClient()
  const [total, approved, pending, premium, submissions] = await Promise.all([
    db.from('listings').select('id', { count: 'exact', head: true }),
    db.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    db.from('submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('listings').select('id', { count: 'exact', head: true }).eq('is_premium', true),
    db.from('submissions').select('id', { count: 'exact', head: true }),
  ])

  return NextResponse.json({
    total: total.count || 0,
    approved: approved.count || 0,
    pending: pending.count || 0,
    premium: premium.count || 0,
    submissions: submissions.count || 0,
  })
}
