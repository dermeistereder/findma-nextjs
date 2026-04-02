export function getDomain(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

export function getLogoSources(listing: { logo_url?: string | null; website?: string | null; name: string }): string[] {
  const domain = getDomain(listing.website)
  return [
    listing.logo_url,
    domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null,
    domain ? `https://icons.duckduckgo.com/ip3/${domain}.ico` : null,
  ].filter(Boolean) as string[]
}
