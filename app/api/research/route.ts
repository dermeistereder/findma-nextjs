import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { password, url, name } = await req.json()

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const query = url || name
  if (!query) return NextResponse.json({ error: 'URL or name required' }, { status: 400 })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    tools: [{
      type: 'web_search_20250305',
      name: 'web_search',
    } as any],
    messages: [{
      role: 'user',
      content: `Recherchiere das Unternehmen/Produkt: "${query}"

Finde heraus:
1. Vollständiger Name und kurze Beschreibung (max. 200 Zeichen)
2. Website-URL
3. Herkunft: Wo gegründet, Hauptsitz, Eigentümer (wichtig für Kennzeichnung)
4. Kategorie (eine von: kommunikation, cloud-hosting, buchhaltung-finanzen, lebensmittel-getraenke, mode-textil, sport-outdoor, events-entertainment, ki-automatisierung, kunst-handgemachtes)
5. Herkunftsbewertung: "green" (Österreich), "yellow" (Europa), "red" (International)
6. Begründung der Herkunftsbewertung (1-2 Sätze)
7. Keywords (5-8 relevante Begriffe, kommagetrennt)

Antworte NUR mit JSON:
{
  "name": "...",
  "website": "https://...",
  "description": "...",
  "description_long": "...",
  "category_slug": "...",
  "ampel": "green|yellow|red",
  "ampel_reason": "...",
  "hq_country": "AT|DE|...",
  "founded_country": "AT|DE|...",
  "owner_country": "AT|DE|...",
  "keywords": "keyword1, keyword2, ...",
  "type": "software|produkt|service",
  "slug": "url-freundlicher-name"
}`
    }],
  })

  // Extract JSON from response
  const text = message.content
    .filter(b => b.type === 'text')
    .map(b => (b as any).text)
    .join('')

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return NextResponse.json({ error: 'Could not parse response' }, { status: 500 })

  try {
    const data = JSON.parse(jsonMatch[0])
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON', raw: text }, { status: 500 })
  }
}
