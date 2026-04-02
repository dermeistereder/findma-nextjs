import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { plan, slug } = await req.json()
  const supabase = createServerClient()

  // Listing prüfen
  const { data: listing } = await supabase
    .from('listings')
    .select('id, name, slug')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single()

  if (!listing) {
    return NextResponse.json({ error: 'Eintrag nicht gefunden' }, { status: 404 })
  }

  const priceId = plan === 'yearly'
    ? process.env.STRIPE_PRICE_YEARLY!
    : process.env.STRIPE_PRICE_MONTHLY!

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card', 'sepa_debit'],
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { listing_id: listing.id, listing_slug: listing.slug },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/verzeichnis/${listing.slug}?premium=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium`,
    locale: 'de',
    custom_text: {
      submit: { message: `Premium-Listing für ${listing.name} aktivieren` },
    },
  })

  return NextResponse.json({ url: session.url })
}
