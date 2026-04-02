import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password, url, name } = await req.json()

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const query = url || name
  if (!query) return NextResponse.json({ error: 'URL or name required' }, { status: 400 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY nicht konfiguriert' }, { status: 500 })
  }

  const prompt = `Recherchiere das Unternehmen, Produkt oder die Website: "${query}"

Suche nach aktuellen Informationen und bestimme:
1. Offizieller Name
2. Kurze Beschreibung auf Deutsch (max. 200 Zeichen)
3. Ausführliche Beschreibung auf Deutsch (2-4 Sätze)
4. Offizielle Website-URL
5. Herkunft: Gründungsland, Hauptsitz, Eigentümer/Konzernmutter
6. Passende Kategorie (NUR eine):
   kommunikation | cloud-hosting | buchhaltung-finanzen | lebensmittel-getraenke | mode-textil | sport-outdoor | events-entertainment | ki-automatisierung | kunst-handgemachtes
7. Herkunftsbewertung:
   "green" = Österreich (gegründet AT, Hauptsitz AT, österreichischer Eigentümer)
   "yellow" = Europa (EU/DACH, kein außereuropäischer Konzern)
   "red" = International (außereuropäischer Eigentümer oder Konzernmutter)
8. Begründung der Herkunftsbewertung (1-2 Sätze)

Antworte NUR mit JSON, ohne Markdown-Backticks oder Erklärungen:
{
  "name": "Offizieller Name",
  "website": "https://example.com",
  "description": "Kurzbeschreibung max 200 Zeichen",
  "description_long": "Ausführliche Beschreibung 2-4 Sätze.",
  "category_slug": "eine-der-kategorien",
  "ampel": "green",
  "ampel_reason": "Begründung der Herkunft.",
  "hq_country": "AT",
  "founded_country": "AT",
  "owner_country": "AT",
  "keywords": "keyword1, keyword2, keyword3",
  "type": "software",
  "slug": "url-freundlicher-slug"
}`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        tools: [{
          type: 'web_search_20250305',
          name: 'web_search',
          max_uses: 3,
        }],
        messages: [{
          role: 'user',
          content: prompt,
        }],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `Anthropic Fehler: ${err}` }, { status: 500 })
    }

    const data = await res.json()

    // Text aus allen Content-Blöcken zusammensetzen
    const text = (data.content || [])
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('')

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Kein JSON in Antwort', raw: text }, { status: 500 })
    }

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unbekannter Fehler' }, { status: 500 })
  }
}
