import { NextRequest, NextResponse } from 'next/server'

// Groq API — kostenlos, kein Credit nötig
async function callGroq(prompt: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content || '{}'
}

const COMPLEX_PATTERNS = /\b(aus|von|in|österreichisch|europäisch|alternative|ohne|nicht|lokal|regional|wien|graz|linz|salzburg|innsbruck|vorarlberg|tirol|steiermark|kärnten|burgenland|niederösterreich|oberösterreich)\b/i

interface ParsedQuery {
  keywords: string[]
  ampel?: 'green' | 'yellow' | 'red'
  category_slug?: string
  original: string
}

async function parseWithGroq(query: string): Promise<ParsedQuery> {
  const prompt = `Du analysierst Suchanfragen für ein österreichisches Unternehmensverzeichnis.

Kategorien: kommunikation, cloud-hosting, buchhaltung-finanzen, lebensmittel-getraenke, mode-textil, sport-outdoor, events-entertainment, ki-automatisierung, kunst-handgemachtes

Herkunft: green=Österreich, yellow=Europa, red=International

Analysiere: "${query}"

Antworte NUR mit JSON (keine Erklärung, keine Markdown-Backticks):
{"keywords": ["keyword1", "keyword2"], "ampel": "green oder yellow oder red oder null", "category_slug": "slug oder null"}`

  const text = await callGroq(prompt)
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return {
      keywords: parsed.keywords || [query],
      ampel: parsed.ampel !== 'null' ? parsed.ampel : undefined,
      category_slug: parsed.category_slug !== 'null' ? parsed.category_slug : undefined,
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

    if (isComplex && process.env.GROQ_API_KEY) {
      parsed = await parseWithGroq(trimmed)
    } else {
      parsed = { keywords: [trimmed], original: trimmed }
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Search parse error:', error)
    return NextResponse.json({ keywords: [], original: '' }, { status: 500 })
  }
}
