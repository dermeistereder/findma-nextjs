import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const COMPLEX_PATTERNS = /\b(aus|von|in|österreichisch|europäisch|alternative|ohne|nicht|lokal|regional|wien|graz|linz|salzburg|innsbruck|vorarlberg|tirol|steiermark|kärnten|burgenland|niederösterreich|oberösterreich)\b/i

interface ParsedQuery {
  keywords: string[]
  ampel?: 'green' | 'yellow' | 'red'
  category_slug?: string
  original: string
}

async function parseWithClaude(query: string): Promise<ParsedQuery> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: `Du analysierst Suchanfragen für ein österreichisches Unternehmensverzeichnis.
      
Kategorien: kommunikation, cloud-hosting, buchhaltung-finanzen, lebensmittel-getraenke, mode-textil, sport-outdoor, events-entertainment, ki-automatisierung, kunst-handgemachtes

Herkunft: green=Österreich, yellow=Europa, red=International

Analysiere: "${query}"

Antworte NUR mit JSON (keine Erklärung):
{
  "keywords": ["keyword1", "keyword2"],
  "ampel": "green" | "yellow" | "red" | null,
  "category_slug": "slug" | null
}`
    }]
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  try {
    const parsed = JSON.parse(text.trim())
    return {
      keywords: parsed.keywords || [query],
      ampel: parsed.ampel || undefined,
      category_slug: parsed.category_slug || undefined,
      original: query,
    }
  } catch {
    return { keywords: [query], original: query }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query required' }, { status: 400 })
    }

    const trimmed = query.trim()
    const isComplex = COMPLEX_PATTERNS.test(trimmed)

    let parsed: ParsedQuery

    if (isComplex && process.env.ANTHROPIC_API_KEY) {
      parsed = await parseWithClaude(trimmed)
    } else {
      parsed = { keywords: [trimmed], original: trimmed }
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Search parse error:', error)
    return NextResponse.json({ keywords: [], original: '' }, { status: 500 })
  }
}
