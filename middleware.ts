import { NextRequest, NextResponse } from 'next/server'

const COMING_SOON_ENABLED = true // auf false setzen wenn live

export function middleware(req: NextRequest) {
  if (!COMING_SOON_ENABLED) return NextResponse.next()

  const { pathname } = req.nextUrl

  // Immer durchlassen: API-Routes, statische Assets, Coming-Soon-Seite selbst
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/findma-logo.svg') ||
    pathname === '/coming-soon' ||
    pathname === '/coming-soon/unlock'
  ) {
    return NextResponse.next()
  }

  // Cookie prüfen
  const unlocked = req.cookies.get('findma_preview')?.value === 'unlocked'
  if (unlocked) return NextResponse.next()

  // Weiterleitung zur Coming-Soon-Seite
  const url = req.nextUrl.clone()
  url.pathname = '/coming-soon'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
